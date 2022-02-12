import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {RebukeOrderFieldsEnum} from '../../../../data-layer/repositories/rebuke/enums/rebuke-order-fields.enum';

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
  userId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field({nullable: true, defaultValue: RebukeOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(RebukeOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
