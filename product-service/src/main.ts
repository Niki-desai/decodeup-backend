import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import dataSource from './database/data-source';
import { seedProducts } from './database/seeds/product.seed';

// Bootstrap Product Service //
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // Enable CORS //
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Health check endpoint //
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'product-service' });
  });

  await app.listen(port);
  logger.log(`Product Service running on port ${port}`);

  // Run database seed //
  try {
    await dataSource.initialize();
    await seedProducts(dataSource);
    logger.log('Database seeded successfully');
  } catch (error) {
    logger.error('Database seed error:', error);
  }
}

bootstrap();
