import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const logger = new Logger();

  const docTitle: string = configService.get<string>('doc.title');
  const docDescription: string = configService.get<string>('doc.description');
  const docPrefix: string = configService.get<string>('doc.prefix');
  const docVersion: string = configService.get<string>('doc.version');

  const options = new DocumentBuilder()
    .setTitle(docTitle)
    .setDescription(docDescription)
    .setVersion(docVersion)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docPrefix, app, document);

  logger.log(`==========================================================`);

  logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');

  logger.log(`==========================================================`);
};
