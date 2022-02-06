import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxDate, MinDate} from 'class-validator';
import {TeacherOrderFieldsEnum} from '../../../../data-layer/repositories/teacher/enums/teacher-order-fields.enum';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';

@InputType()
export class HonorGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  title: string;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDate()
  dateMore: Date;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDate()
  dateLess: Date;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  orderNumber: string;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  userId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showInActive: boolean;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field({nullable: true, defaultValue: TeacherOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(TeacherOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
