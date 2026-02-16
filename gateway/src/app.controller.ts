import { Controller, Get, Post, Delete, Param, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// API Gateway Controller //
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly productServiceUrl: string;
  private readonly cartServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL', 'http://localhost:3001');
    this.cartServiceUrl = this.configService.get('CART_SERVICE_URL', 'http://localhost:3002');
  }

  // Proxy to Product Service - GET /products //
  @Get('products')
  async getProducts() {
    try {
      this.logger.log('Proxying GET /products');
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Product service error:', error.message);
      throw new HttpException('Failed to fetch products', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Proxy to Cart Service - GET /cart //
  @Get('cart')
  async getCart() {
    try {
      this.logger.log('Proxying GET /cart');
      const response = await firstValueFrom(
        this.httpService.get(`${this.cartServiceUrl}/cart`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Cart service error:', error.message);
      throw new HttpException('Failed to fetch cart', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Proxy to Cart Service - POST /cart //
  @Post('cart')
  async addToCart(@Body() body: any) {
    try {
      this.logger.log('Proxying POST /cart');
      const response = await firstValueFrom(
        this.httpService.post(`${this.cartServiceUrl}/cart`, body)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Cart service error:', error.message);
      throw new HttpException(error.response?.data?.message || 'Failed to add to cart', error.response?.status || HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Proxy to Cart Service - DELETE /cart/:id //
  @Delete('cart/:id')
  async removeFromCart(@Param('id') id: string) {
    try {
      this.logger.log(`Proxying DELETE /cart/${id}`);
      const response = await firstValueFrom(
        this.httpService.delete(`${this.cartServiceUrl}/cart/${id}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Cart service error:', error.message);
      throw new HttpException('Failed to remove from cart', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Proxy to Cart Service - DELETE /cart //
  @Delete('cart')
  async clearCart() {
    try {
      this.logger.log('Proxying DELETE /cart');
      const response = await firstValueFrom(
        this.httpService.delete(`${this.cartServiceUrl}/cart`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Cart service error:', error.message);
      throw new HttpException('Failed to clear cart', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Proxy to Product Service - POST /auth/signup //
  @Post('auth/signup')
  async signup(@Body() body: any) {
    try {
      this.logger.log('Proxying POST /auth/signup');
      const response = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/auth/signup`, body)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Auth service error:', error.message);
      throw new HttpException(error.response?.data?.message || 'Signup failed', error.response?.status || HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // Proxy to Product Service - POST /auth/login //
  @Post('auth/login')
  async login(@Body() body: any) {
    try {
      this.logger.log('Proxying POST /auth/login');
      const response = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/auth/login`, body)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Auth service error:', error.message);
      throw new HttpException(error.response?.data?.message || 'Login failed', error.response?.status || HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
