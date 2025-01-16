import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductTypes, REPOSITORIES } from '../core/utils';
import { Category } from '../category/entities/category.entity';
import { Product } from './entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  const mockedProduct = {
    id: 1,
    name: 'health-Optimal-care-mini-10000',
    type: ProductTypes.HEALTH,
    category: {
      name: 'Optimal care mini',
      price: 10000,
      type: ProductTypes.HEALTH,
    },
  };
  const mockProductsRepository = {
    findAll: jest.fn().mockResolvedValue([
      mockedProduct
    ]),
    findByPk: jest.fn().mockResolvedValue(mockedProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: REPOSITORIES.PRODUCT_REPOSITORY,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should retrieve a product by product ID and include the category', async () => {
    const product: Product | null = await service.findOne(1);
    expect(product).toEqual(product);
    expect(mockProductsRepository.findByPk).toHaveBeenCalledWith(1, {
      include: { model: Category, attributes: ['name', 'type', 'price'] },
    });
  });
  it('should throw a NotFoundException if product does not exist', async () => {
    mockProductsRepository.findByPk.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow('Product with id 999 not found');
  });
  it('should fetch all products with categories', async () => {
    const products = await service.findAll();
    expect(products).toEqual([
      mockedProduct
    ]);

    expect(mockProductsRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockProductsRepository.findAll).toHaveBeenCalledWith({
      include: { model: Category, attributes: ['name', 'type', 'price'] },
    });
  });
});
