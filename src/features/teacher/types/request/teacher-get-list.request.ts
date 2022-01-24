import {ArgsType, Field, Int} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../common/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {TeacherOrderFieldsEnum} from '../../../../data-layer/repositories/teacher/enums/teacher-order-fields.enum';

@ArgsType()
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

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  commissionId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  teachingRankId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  academicDegreeId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  academicTitleId: number;

  @Field({nullable: true, defaultValue: TeacherOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(TeacherOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
