import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsEnum, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {TeacherCascadeDeletedByEnum} from '../../../../data-layer/db-models/teacher.db-model';

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

  @Field(type => TeacherCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(TeacherCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;
}
