import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {TeacherOrderFieldsEnum} from '../../../../data-layer/repositories/teacher/enums/teacher-order-fields.enum';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {TeacherCascadeDeletedByEnum} from '../../../../data-layer/db-models/teacher.db-model';

@InputType()
export class TeacherGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  fullName: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  email: string;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  departmentId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  commissionId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  teachingRankId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  academicDegreeId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  academicTitleId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => TeacherCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(TeacherCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;

  @Field(type => TeacherOrderFieldsEnum, {nullable: true, defaultValue: TeacherOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(TeacherOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
