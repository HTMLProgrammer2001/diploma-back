import {ArgsType, Field} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../common/types/request/base-paginator.request';
import {CommissionOrderFieldsEnum} from '../../../../data/repositories/commission/enums/commission-order-fields.enum';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {DepartmentOrderFieldsEnum} from '../../../../data/repositories/department/enums/department-order-fields.enum';

@ArgsType()
export class DepartmentGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field({nullable: true, defaultValue: DepartmentOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(DepartmentOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
