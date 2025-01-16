import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { ProductModule } from './product.module';
import { ProductTypes } from '../core/utils';

describe('ProductsController', () => {
  let controller: ProductController;
  let service: ProductService;
  const mockProducts = [
    {
      id: 1,
      name: 'health-Optimal-care-mini-10000',
      type: ProductTypes.HEALTH,
      category: {
        name: 'Optimal care mini',
        price: 10000,
        type: ProductTypes.HEALTH,
      },
    },
  ];

  const mockProductsResponse = {
    success: true,
    message: 'Action successful',
    statusCode: 200,
    data: [
      {
        id: 1,
        name: 'health-Optimal-care-mini-10000',
        type: ProductTypes.HEALTH,
        category: {
          name: 'Optimal care mini',
          price: 10000,
          type: ProductTypes.HEALTH,
        },
      },
    ],
  };

  const mockProductsService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should fetch all products with categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockProductsResponse);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('Products API (e2e)', () => {
  // let controller: ProductController;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // afterAll(async () => {
  //   await app.close();
  // });

  it('should be able fetch products with associated category and price from database', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    const products = response.body?.data;
    expect(Array.isArray(products)).toBe(true);
    products.forEach((product: any) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('type');
      expect(product.category).toHaveProperty('name');
      expect(product.category).toHaveProperty('price');
    });
  });
});
