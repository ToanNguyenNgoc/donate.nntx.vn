/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ResponseInterceptor } from './interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({ origin: '*' });

  app.useStaticAssets(join(process.cwd(), 'public')); // For CSS/JS/Images
  app.setBaseViewsDir(join(process.cwd(), 'views')); // Templates directory
  app.setViewEngine('hbs'); // Set your engine here

  const PORT = process.env.APP_PORT ?? 3000;
  await app.listen(PORT);
  console.log(`Server run http://localhost:${PORT}`);
}
bootstrap();
