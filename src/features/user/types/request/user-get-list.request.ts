import {Field, ID, InputType} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../global/types/request/base-paginator.request';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {UserOrderFieldsEnum} from '../../../../data-layer/repositories/user/enums/user-order-fields.enum';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class UserGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  fullName: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  email: string;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  roleId: number;

  @Field({nullable: true, defaultValue: UserOrderFieldsEnum.ID})
  @IsOptional()
  @IsEnum(UserOrderFieldsEnum)
  orderField: string;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isDesc: boolean;
}
