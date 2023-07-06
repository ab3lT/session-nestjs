import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); 
  // new Validation pipe
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: true}));

  //cooki parser
  app.use(cookieParser());

  app.enableCors({
    origin:['http://localhost:3000','http://localhost:3001','http://localhost:8080','http://localhost:4280'],
    credentials: true
  })

  //swagger
  const config = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription("### This API description Abel Tadesse se.abel.tadesse@gmail.com")
    .setVersion('1.0')
    .addTag("Backend API's")
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customJs: '/swagger-custom.js', // 👈👈
      customCssUrl: '/swagger-theme.css',
    });  

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();
