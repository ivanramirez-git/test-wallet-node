import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ConfigService } from '@nestjs/config';
import { registerSoapEndpoint } from './modules/soap/soap.controller';
import { SoapService } from './modules/soap/soap.service';
import { MailService } from './modules/mail/mail.service'; // nuevo import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const host = configService.get('HOST') || 'localhost';

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new ErrorInterceptor());
  
  // Validar conexión con el servidor de correo al iniciar la aplicación
  const mailService = app.get(MailService);
  mailService.testConnection().catch(error => {
    console.error('Fallo la conexión al servidor de correo en el arranque:', error);
  });

  // Iniciar la aplicación en el puerto configurado
  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  // Registrar el endpoint SOAP en el servidor principal
  const httpServer = app.getHttpServer();
  const soapService = app.get(SoapService);
  registerSoapEndpoint(httpServer, soapService, configService);

  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`SOAP WSDL is available at: http://${host}:${port}/soap?wsdl`);
}
bootstrap();