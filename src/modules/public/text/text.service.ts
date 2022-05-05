import { Injectable } from '@nestjs/common';

import mores from '../../../assets/morse.json';
import type { ApiJsonString } from '../../../interfaces/json';

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

  base64(text: string, action: 'encode' | 'decode') {
    switch (action) {
      case 'encode':
        return Buffer.from(text).toString('base64');
      case 'decode':
        return Buffer.from(text, 'base64').toString('ascii');
    }
  }
}
