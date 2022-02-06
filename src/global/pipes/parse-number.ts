import {Transform} from 'class-transformer';
import {applyDecorators} from '@nestjs/common';

export const ParseNumber = () => applyDecorators(Transform(({value}) => value ? Number(value) : null));
