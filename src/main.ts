import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', methods: 'GET,POST,PUT,DELETE,OPTIONS', allowedHeaders: 'Content-Type,Authorization' });
  const port = process.env.PORT || 5555;
  await app.listen(port);
  console.log(`ORION Backend running on port ${port}`);
  console.log('API Key chargée:', process.env.GROQ_API_KEY ? 'OUI' : 'NON');
}
bootstrap();
