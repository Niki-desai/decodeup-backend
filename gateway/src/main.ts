import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

// Bootstrap API Gateway //
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:5173');

  // Security Headers //
  app.use(helmet());

  // CORS //
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:5173'],
    credentials: true,
  });

  // Global validation //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Health check //
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'gateway' });
  });

  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`);
}

bootstrap();
