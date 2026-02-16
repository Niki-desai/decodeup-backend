import { Controller, Get, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductResponseDto } from './dto/product-response.dto';

// Products Controller //
@Controller('products')
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);

    constructor(private readonly productsService: ProductsService) { }

    // Get all products endpoint //
    @Get()
    async findAll(): Promise<ProductResponseDto[]> {
        this.logger.log('GET /products');
        return this.productsService.findAll();
    }
}
