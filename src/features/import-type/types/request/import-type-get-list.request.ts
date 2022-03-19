import {Field, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {RoleOrderFieldsEnum} from '../../../../data-layer/repositories/role/enums/role-order-fields.enum';
import {ImportTypeOrderFieldsEnum} from '../../../../data-layer/repositories/import-type/enums/import-type-order-fields.enum';

@InputType()
export class ImportTypeGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true, defaultValue: ImportTypeOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(ImportTypeOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
