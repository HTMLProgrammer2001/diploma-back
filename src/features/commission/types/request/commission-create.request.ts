import {ArgsType, Field} from '@nestjs/graphql';
import {IsNotEmpty, IsString} from 'class-validator';

@ArgsType()
export class CommissionCreateRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsNotEmpty()
  @IsString()
  name: string;
}
