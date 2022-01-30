import {Field, ID, InputType} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {ParseNumber} from '../../../../global/validators/parse-number';

@InputType()
export class RoleGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;
}
