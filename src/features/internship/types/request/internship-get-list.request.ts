import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {RebukeOrderFieldsEnum} from '../../../../data-layer/repositories/rebuke/enums/rebuke-order-fields.enum';
import {InternshipCascadeDeletedByEnum} from '../../../../data-layer/db-models/internship.db-model';
import {InternshipOrderFieldsEnum} from '../../../../data-layer/repositories/internship/enums/internship-order-fields.enum';

@InputType()
export class InternshipGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  title: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  code: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  place: string;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDate()
  dateFromMore: Date;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDate()
  dateToLess: Date;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => InternshipCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(InternshipCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;

  @Field(type => InternshipOrderFieldsEnum, {nullable: true, defaultValue: InternshipOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(InternshipOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
