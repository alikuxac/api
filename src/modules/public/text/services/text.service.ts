import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import mores from '@assets/morse.json';
import type { ApiJsonString } from '@root/interfaces/json';
import { base64TextDto } from '../dto/text.dto';

const morseJson: ApiJsonString = Object.assign({}, mores);

@Injectable()
export class TextService {
  morse(text: string) {
    return text
      .toLowerCase()
      .split('')
      .map((char) => {
        const morseChar = morseJson[char];
        if (morseChar) {
          return morseChar;
        }
        return ' ';
      })
      .join(' ');
  }

  reverse(text: string) {
    return text.split('').reverse().join('');
  }

  ascii(text: string) {
    return text
      .split('')
      .map((char) => char.charCodeAt(0))
      .join(' ');
  }

  base64(dto: base64TextDto) {
    switch (dto.action) {
      case 'encode':
        return Buffer.from(dto.text).toString('base64');
      case 'decode':
        return Buffer.from(dto.text, 'base64').toString('ascii');
      default:
        throw new HttpException(
          'Invalid action. Must be encode or decode',
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
