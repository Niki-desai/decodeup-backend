import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CacheModule } from './cache/cache.module';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

// Product Service Main Module //

@Module({
  imports: [
    // Environment Configuration //
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM PostgreSQL Configuration //
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres123'),
        database: configService.get('DATABASE_NAME', 'shopping_cart'),
        entities: [Product, User],
        synchronize: true, // Disable in production //
        logging: false,
      }),
    }),

    // Feature Modules //
    CacheModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
