import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up CORS options
  const corsOptions: CorsOptions = {
    origin: true, // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  };

  // Enable CORS for all routes
  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
