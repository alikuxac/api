import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';

@Injectable()
export class R2Service {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      endpoint: this.configService.get('R2_ENDPOINT'),
      accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
    });
  }

  async uploadfile(
    dataBuffer: Buffer,
    filename: string,
    contentType: string,
    bucketName: string,
  ) {
    const result = await this.s3
      .upload({
        Bucket: bucketName,
        Key: filename,
        Body: dataBuffer,
        ContentType: contentType,
      })
      .promise();
    return result;
  }
}
