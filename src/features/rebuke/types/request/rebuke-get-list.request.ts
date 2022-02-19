import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {RebukeOrderFieldsEnum} from '../../../../data-layer/repositories/rebuke/enums/rebuke-order-fields.enum';
import {RebukeCascadeDeletedByEnum} from '../../../../data-layer/db-models/rebuke.db-model';

@InputType()
export class RebukeGetListRequest extends BasePaginatorRequest {
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

  @Field({nullable: true})
  @IsOptional()
  @IsEnum(RebukeCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;

  @Field({nullable: true, defaultValue: RebukeOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(RebukeOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
