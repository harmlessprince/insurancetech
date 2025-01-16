import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { ActivatePolicyDto } from './dto/activate-policy.dto';
import { Policy } from './entities/policy.entity';

const mockPolicyService = {
  activatePendingPolicy: jest.fn(),
  findAll: jest.fn(),
};

describe('PolicyController (e22)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PolicyController],
      providers: [{ provide: PolicyService, useValue: mockPolicyService }],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /', () => {
    it('should activate a pending policy', async () => {
      const activatePolicyDto: ActivatePolicyDto = {
        pending_policy_id: 1,
        user_id: 1,
      };

      jest
        .spyOn(mockPolicyService, 'activatePendingPolicy')
        .mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/policy')
        .send(activatePolicyDto)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Policy activated successfully',
        data: null,
        statusCode: 201,
      });
      expect(mockPolicyService.activatePendingPolicy).toHaveBeenCalledWith(
        activatePolicyDto,
      );
    });

    it('should return a 400 error for invalid input', async () => {
      const activatePolicyDto = {};

      const response = await request(app.getHttpServer())
        .post('/policy')
        .send(activatePolicyDto)
        .expect(400);

      expect(response.body.message).toEqual([
        'user_id should not be empty',
        'user_id must be an integer number',
        'pending_policy_id should not be empty',
        'pending_policy_id must be an integer number',
      ]);
    });
  });
  describe('GET /', () => {
    it('should return all policies with their associated plans and products', async () => {
      const mockPolicies: Policy[] = [
        {
          id: 1,
          user_id: 1,
          product_id: 1,
          plan_id: 1,
          policy_number: 'PLO-2025-JAN-15-PL-1-PR-1-USR-1',
          Plan: {
            id: 1,
            price: 100,
            quantity: 2,
            total_price: 200,
          },
          Product: {
            id: 1,
            type: 'typeA',
            name: 'ProductA',
            Category: { id: 1, name: 'CategoryA' },
          },
        } as any,
      ];

      jest.spyOn(mockPolicyService, 'findAll').mockResolvedValue(mockPolicies);

      const response = await request(app.getHttpServer())
        .get('/policy')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Activated policies',
        data: mockPolicies,
        statusCode: 200,
      });
      expect(mockPolicyService.findAll).toHaveBeenCalledWith(NaN);
    });

    it('should filter policies by planId and include associated data', async () => {
      const planId = 1;
      const mockPolicies: Policy[] = [
        {
          id: 1,
          user_id: 1,
          product_id: 1,
          plan_id: 1,
          policy_number: 'PLO-2025-JAN-15-PL-1-PR-1-USR-1',
          Plan: {
            id: 1,
            price: 100,
            quantity: 2,
            total_price: 200,
          },
          Product: {
            id: 1,
            type: 'typeA',
            name: 'ProductA',
            Category: { id: 1, name: 'CategoryA' },
          },
        } as any,
      ];

      jest.spyOn(mockPolicyService, 'findAll').mockResolvedValue(mockPolicies);

      const response = await request(app.getHttpServer())
        .get(`/policy?planId=${planId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Activated policies',
        data: mockPolicies,
        statusCode: 200,
      });
      expect(mockPolicyService.findAll).toHaveBeenCalledWith(planId);
    });
  });
});
