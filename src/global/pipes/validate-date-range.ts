import {applyDecorators} from '@nestjs/common';
import {ValidateDate} from './validate-date';
import {MaxDate, MinDate} from 'class-validator';

export const ValidateDateRange = () => applyDecorators(
  MaxDate(new Date()),
  MinDate(new Date(0)),
  ValidateDate()
);
