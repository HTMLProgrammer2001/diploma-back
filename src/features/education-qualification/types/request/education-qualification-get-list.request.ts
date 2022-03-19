import {Field, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {EducationQualificationOrderFieldsEnum} from '../../../../data-layer/repositories/education-qualification/enums/education-qualification-order-fields.enum';

@InputType()
export class EducationQualificationGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted: boolean;

  @Field(type => EducationQualificationOrderFieldsEnum, {nullable: true, defaultValue: EducationQualificationOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(EducationQualificationOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
