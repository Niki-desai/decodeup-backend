import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductsService', () => {
    let service: ProductsService;
    let repo: Repository<Product>;

    const mockProduct = { id: '1', name: 'Test Product', price: 10, image: 'test.jpg' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        find: jest.fn().mockResolvedValue([mockProduct]),
                        findOne: jest.fn().mockResolvedValue(mockProduct),
                    },
                },
                {
                    provide: 'CACHE_MANAGER',
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repo = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all products', async () => {
        const products = await service.findAll();
        expect(products).toEqual([mockProduct]);
    });
});
