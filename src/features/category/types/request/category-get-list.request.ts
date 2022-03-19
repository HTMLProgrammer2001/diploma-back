import {Field, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {CategoryOrderFieldsEnum} from '../../../../data-layer/repositories/category/enums/category-order-fields.enum';

@InputType()
export class CategoryGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => CategoryOrderFieldsEnum, {nullable: true, defaultValue: CategoryOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(CategoryOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
