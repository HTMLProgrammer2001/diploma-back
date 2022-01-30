import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/validators/parse-number';

@InputType()
export class DepartmentGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;
}
