import { Injectable, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';

@Injectable()
export class B2Service {
  private s3: S3;
  private isEnabled = false;

  constructor(private readonly configService: ConfigService) {}

  connect() {
    const boolean = this.configService.get<boolean>('B2_ENABLED');
    if (boolean) {
      this.isEnabled = true;
      this.s3 = new S3({
        endpoint: this.configService.get('B2_ENDPOINT'),
        accessKeyId: this.configService.get('B2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('B2_SECRET_ACCESS_KEY'),
      });
    }
  }

  private isActive() {
    if (!this.isEnabled) {
      throw new BadGatewayException('B2 is not enabled');
    }
  }

  async uploadfile(
    dataBuffer: Buffer,
    filename: string,
    contentType: string,
    bucketName: string,
  ) {
    this.isActive();

    const result = await this.s3
      .upload({
        Bucket: bucketName,
        Key: filename,
        Body: dataBuffer,
        ContentType: contentType,
        ACL: 'public-read',
      })
      .promise();
    return result;
  }
}
