import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {HonorOrderFieldsEnum} from '../../../../data-layer/repositories/honor/enums/honor-order-fields.enum';
import {HonorCascadeDeletedByEnum} from '../../../../data-layer/db-models/honor.db-model';

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
  teacherId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showInActive: boolean;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => HonorCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(HonorCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;

  @Field(type => HonorOrderFieldsEnum, {nullable: true, defaultValue: HonorOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(HonorOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
