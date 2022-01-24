import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsBoolean, IsNumber, IsOptional} from 'class-validator';

@ArgsType()
export class DepartmentGetByIdRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;
}
