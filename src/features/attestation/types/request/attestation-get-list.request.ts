import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {AttestationOrderFieldsEnum} from '../../../../data-layer/repositories/attestation/enums/attestation-order-fields.enum';

@InputType()
export class AttestationGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDate()
  dateMore: Date;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDate()
  dateLess: Date;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  categoryId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showCascadeDeleted: boolean;

  @Field({nullable: true, defaultValue: AttestationOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(AttestationOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
