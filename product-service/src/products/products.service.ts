import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CacheService } from '../cache/cache.service';
import { ProductResponseDto } from './dto/product-response.dto';

// Products Service //
@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);
    private readonly CACHE_KEY = 'products:all';
    private readonly CACHE_TTL = 300; // 5 minutes //

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly cacheService: CacheService,
    ) { }

    // Get all products with cache-aside pattern //
    async findAll(): Promise<ProductResponseDto[]> {
        this.logger.log('Fetching all products');

        // Try cache first //
        const cached = await this.cacheService.get(this.CACHE_KEY);
        if (cached) {
            this.logger.log('Cache HIT for products');
            return JSON.parse(cached);
        }

        // Cache MISS - fetch from database //
        this.logger.log('Cache MISS for products - fetching from DB');
        const products = await this.productRepository.find({
            order: { createdAt: 'DESC' },
        });

        // Map to response DTO //
        const response: ProductResponseDto[] = products.map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            image: p.image,
        }));

        // Store in cache //
        await this.cacheService.set(
            this.CACHE_KEY,
            JSON.stringify(response),
            this.CACHE_TTL,
        );

        return response;
    }

    // Get product by ID //
    async findOne(id: string): Promise<Product | null> {
        return this.productRepository.findOne({ where: { id } });
    }

    // Invalidate cache //
    async invalidateCache(): Promise<void> {
        await this.cacheService.del(this.CACHE_KEY);
        this.logger.log('Product cache invalidated');
    }
}
