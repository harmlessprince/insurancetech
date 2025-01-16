import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { TestAppModule } from '../test.module';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PlanModule } from './plan.module';
import { REPOSITORIES } from '../core/utils';
import { ProductModule } from '../product/product.module';
import { WalletModule } from '../wallet/wallet.module';
import { PendingPolicyModule } from '../pending-policy/pending-policy.module';
const seeder: any = require('../core/seeders');

describe('PlansController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  const mockPlanRepository = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule, PlanModule, ProductModule, WalletModule, PendingPolicyModule],
      providers: [PlanService, { provide: REPOSITORIES.PLAN_REPOSITORY, useValue: mockPlanRepository }],
      controllers: [PlanController],

    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sequelize = moduleFixture.get<Sequelize>(Sequelize);

    const queryInterface = sequelize.getQueryInterface();
    await seeder.refreshDatabase(queryInterface, sequelize); // Use the seeder to populate data
  });

  afterAll(async () => {
    await app.close();
    // await sequelize.close();
  });

  it('should create a plan and return it', async () => {
    const mockPlan = { id: 1, price: 10000, productId: 1, quantity: 1, totalPrice:  10000, userId: 1  };
    mockPlanRepository.create.mockResolvedValue(mockPlan);
    const response = await request(app.getHttpServer())
      .post('/plans/buy')
      .send({ user_id: 1, product_id: 1, quantity: 1 }).expect(201);


    expect(response.body).toMatchObject({
      success: true,
      message: 'Plan purchased successfully',
      data: mockPlan
    });

    // Verify wallet balance
    const [wallet]: any = await sequelize.query(`
        SELECT balance
        FROM wallets
        WHERE user_id = 1
        LIMIT 1;
    `);

    expect(wallet[0].balance).toBe(19000000); // Balance after deduction
  });

  it('should return 400 if quantity is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/plans/buy')
      .send({ user_id: 1, product_id: 1, quantity: 0 })
      .expect(400);

    expect(response.body.message).toBe('Quantity must be greater than zero');
  });

  it('should return 400 if wallet balance is insufficient', async () => {
    await sequelize.query(`
        UPDATE wallets
        SET balance = 5000
        WHERE user_id = 1;
    `);

    const response = await request(app.getHttpServer())
      .post('/plans/buy')
      .send({ user_id: 1, product_id: 1, quantity: 2 })
      .expect(400);

    expect(response.body.message).toBe('Insufficient wallet balance');
  });
});
