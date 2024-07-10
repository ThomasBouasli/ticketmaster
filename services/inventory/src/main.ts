import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await new Promise((resolve) => setTimeout(resolve, 10_000));
  await app.listen(3000);
}
bootstrap();
