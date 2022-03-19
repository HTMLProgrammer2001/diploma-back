import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {EducationOrderFieldsEnum} from '../../../../data-layer/repositories/education/enums/education-order-fields.enum';
import {EducationCascadeDeletedByEnum} from '../../../../data-layer/db-models/education.db-model';

@InputType()
export class EducationGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  institution: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  specialty: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  yearOfIssueMore: number;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  yearOfIssueLess: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  educationQualificationId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => EducationCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(EducationCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;

  @Field(type => EducationOrderFieldsEnum, {nullable: true, defaultValue: EducationOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(EducationOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
