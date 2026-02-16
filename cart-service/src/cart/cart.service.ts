import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto, CartItemDto } from './dto/cart-response.dto';
import { CacheService } from '../cache/cache.service';
import axios from 'axios';

// Cart Service //
@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);
    private readonly CACHE_KEY = 'cart:items';
    private readonly CACHE_TTL = 300; // 5 minutes //

    constructor(
        @InjectRepository(CartItem)
        private readonly cartRepository: Repository<CartItem>,
        private readonly cacheService: CacheService,
    ) { }

    // Get cart with product details //
    async getCart(): Promise<CartResponseDto> {
        this.logger.log('Fetching cart');

        // Try cache first //
        const cached = await this.cacheService.get(this.CACHE_KEY);
        if (cached) {
            this.logger.log('Cache HIT for cart');
            return JSON.parse(cached);
        }

        // Cache MISS //
        this.logger.log('Cache MISS for cart - fetching from DB');
        const cartItems = await this.cartRepository.find();

        // Fetch product details from Product Service //
        const items: CartItemDto[] = await Promise.all(
            cartItems.map(async (item) => {
                const product = await this.getProductById(item.productId);
                return {
                    id: item.id,
                    product,
                    quantity: item.quantity,
                };
            }),
        );

        // Calculate totals //
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        );

        const response: CartResponseDto = { items, totalItems, totalPrice };

        // Cache the result //
        await this.cacheService.set(
            this.CACHE_KEY,
            JSON.stringify(response),
            this.CACHE_TTL,
        );

        return response;
    }

    // Add item to cart //
    async addToCart(dto: AddToCartDto): Promise<CartItem> {
        this.logger.log(`Adding product ${dto.productId} to cart`);

        // Check if product exists //
        await this.getProductById(dto.productId);

        // Check if item already in cart //
        const existing = await this.cartRepository.findOne({
            where: { productId: dto.productId },
        });

        let cartItem: CartItem;

        if (existing) {
            // Update quantity //
            existing.quantity += dto.quantity;
            cartItem = await this.cartRepository.save(existing);
        } else {
            // Create new cart item //
            cartItem = this.cartRepository.create({
                productId: dto.productId,
                quantity: dto.quantity,
            });
            cartItem = await this.cartRepository.save(cartItem);
        }

        // Invalidate cache //
        await this.cacheService.del(this.CACHE_KEY);

        return cartItem;
    }

    // Remove item from cart //
    async removeFromCart(id: string): Promise<void> {
        this.logger.log(`Removing cart item ${id}`);

        const result = await this.cartRepository.delete(id);

        if (result.affected === 0) {
            throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
        }

        // Invalidate cache //
        await this.cacheService.del(this.CACHE_KEY);
    }

    // Clear entire cart //
    async clearCart(): Promise<void> {
        this.logger.log('Clearing all cart items');
        await this.cartRepository.clear();
        // Invalidate cache //
        await this.cacheService.del(this.CACHE_KEY);
    }

    // Fetch product details from Product Service //
    private async getProductById(productId: string): Promise<any> {
        try {
            const productServiceUrl =
                process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
            const response = await axios.get(`${productServiceUrl}/products`);
            const product = response.data.find((p: any) => p.id === productId);

            if (!product) {
                throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
            }

            return product;
        } catch (error) {
            this.logger.error('Error fetching product:', error);
            throw new HttpException(
                'Failed to fetch product details',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
