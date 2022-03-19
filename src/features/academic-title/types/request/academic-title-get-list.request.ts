import {Field, InputType, registerEnumType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {AcademicTitleOrderFieldsEnum} from '../../../../data-layer/repositories/academic-title/enums/academic-title-order-fields.enum';

@InputType()
export class AcademicTitleGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => AcademicTitleOrderFieldsEnum, {nullable: true, defaultValue: AcademicTitleOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(AcademicTitleOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
