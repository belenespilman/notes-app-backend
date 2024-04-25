import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/exceptionFilter';
import { AppModule } from './modules/app.module';
import { CorsOptions  } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: `*`, 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.enableCors(corsOptions);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
