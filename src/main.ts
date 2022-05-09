import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  //react restful api 연동시
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:true,
    credentials: true
  });
  app.use(cookieParser());
	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);
  const port = process.env.NODE_SERVER_PORT;
  console.log(`setup Port: ${port}`);
  await app.listen(port);
  console.log(`Nlp Demo API is running on: ${await app.getUrl()}`);
  console.log(`nest & mongo connected =${process.env.MONGODB_URI}`);
}
bootstrap();
