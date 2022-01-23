import {ArgsType, Field} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';

@ArgsType()
export class RoleGetByIdRequest {
  select: Array<string>;

  @Field({nullable: false})
  @IsNumber()
  id: number;
}
