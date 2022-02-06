import {applyDecorators} from '@nestjs/common';
import {ParseDate} from './parse-date';
import {IsDate} from 'class-validator';

export const ValidateDate = () => applyDecorators(
  ParseDate(),
  IsDate({message: '$property must be valid date string of format YYYY-mm-dd'})
);
