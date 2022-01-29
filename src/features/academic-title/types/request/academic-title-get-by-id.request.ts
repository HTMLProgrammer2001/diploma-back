import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsBoolean, IsNumber} from 'class-validator';

@ArgsType()
export class AcademicTitleGetByIdRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;

  @Field(type => Boolean, {nullable: true})
  @IsBoolean()
  showDeleted = false;
}
