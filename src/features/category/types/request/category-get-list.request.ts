import {Field, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {AcademicDegreeOrderFieldsEnum} from '../../../../data-layer/repositories/academic-degree/enums/academic-degree-order-fields.enum';

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

  @Field({nullable: true, defaultValue: AcademicDegreeOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(AcademicDegreeOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}