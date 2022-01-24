import {ArgsType, Field} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../common/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {TeachingRankOrderFieldsEnum} from '../../../../data-layer/repositories/teaching-rank/enums/teaching-rank-order-fields.enum';

@ArgsType()
export class TeachingRankGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: true, defaultValue: TeachingRankOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(TeachingRankOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
