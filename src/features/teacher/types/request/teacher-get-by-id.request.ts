import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class TeacherGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showCascadeDeleted?: boolean;
}
