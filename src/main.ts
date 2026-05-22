import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(5555);
  console.log('ORION Backend running on http://localhost:5555');
  console.log('API Key chargée:', process.env.ANTHROPIC_API_KEY ? 'OUI' : 'NON');
}
bootstrap();
