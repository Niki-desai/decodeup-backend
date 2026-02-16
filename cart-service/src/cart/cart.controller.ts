import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Logger,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';

// Cart Controller //
@Controller('cart')
export class CartController {
    private readonly logger = new Logger(CartController.name);

    constructor(private readonly cartService: CartService) { }

    // Get cart endpoint //
    @Get()
    async getCart(): Promise<CartResponseDto> {
        this.logger.log('GET /cart');
        return this.cartService.getCart();
    }

    // Add to cart endpoint //
    @Post()
    async addToCart(@Body() dto: AddToCartDto) {
        this.logger.log('POST /cart');
        return this.cartService.addToCart(dto);
    }

    // Remove from cart endpoint //
    @Delete(':id')
    async removeFromCart(@Param('id') id: string) {
        this.logger.log(`DELETE /cart/${id}`);
        await this.cartService.removeFromCart(id);
        return { message: 'Item removed from cart' };
    }

    // Clear cart endpoint //
    @Delete()
    async clearCart() {
        this.logger.log('DELETE /cart');
        await this.cartService.clearCart();
        return { message: 'Cart cleared successfully' };
    }
}
