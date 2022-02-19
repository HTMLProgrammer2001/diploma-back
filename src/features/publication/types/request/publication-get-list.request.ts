import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {PublicationOrderFieldsEnum} from '../../../../data-layer/repositories/publication/enums/publication-order-fields.enum';

@InputType()
export class PublicationGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  title: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  publisher: string;

  @Field(type => [ID], {nullable: true})
  @IsOptional()
  @Transform(({value}) => Array.isArray(value) ? value.map(el => Number(el)) : [])
  @IsArray()
  @IsNumber({}, {each: true})
  @ArrayUnique()
  @ArrayMinSize(1)
  teacherIds: Array<number>;

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
  @IsBoolean()
  showDeleted: boolean;

  @Field({nullable: true, defaultValue: PublicationOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(PublicationOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
