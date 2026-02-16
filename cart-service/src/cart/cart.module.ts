import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';
import { CacheModule } from '../cache/cache.module';

// Cart Module //
@Module({
    imports: [TypeOrmModule.forFeature([CartItem]), CacheModule],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule { }
