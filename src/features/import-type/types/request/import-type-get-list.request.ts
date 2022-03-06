import {Field, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {RoleOrderFieldsEnum} from '../../../../data-layer/repositories/role/enums/role-order-fields.enum';

@InputType()
export class ImportTypeGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true, defaultValue: RoleOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(RoleOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
