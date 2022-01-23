import {ArgsType, Field} from '@nestjs/graphql';
import {IsNotEmpty, IsString, MinLength} from 'class-validator';

@ArgsType()
export class DepartmentCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  name: string;
}
