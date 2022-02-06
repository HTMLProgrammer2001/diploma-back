import {applyDecorators} from '@nestjs/common';
import {Transform} from 'class-transformer';
import {isString} from 'class-validator';

export const ParseDate = () => applyDecorators(Transform(({value}) =>
  isString(value) && isNaN(Number(value)) && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(Date.parse(value)) : ''));
