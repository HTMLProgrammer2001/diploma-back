import {Field, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {ExportTypeOrderFieldsEnum} from '../../../../data-layer/repositories/export-type/enums/export-type-order-fields.enum';

@InputType()
export class ExportTypeGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true, defaultValue: ExportTypeOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(ExportTypeOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
