import {applyDecorators} from '@nestjs/common';
import {Transform} from 'class-transformer';
import {isString} from 'class-validator';

export const ParseDate = () => applyDecorators(Transform(({value}) => {
  const pattern = /^\d{4}-\d{2}-\d{2}(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9])?$/;
  return isString(value) && isNaN(Number(value)) && pattern.test(value) ? new Date(Date.parse(value)) : value;
}));
