import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsEnum, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {HonorCascadeDeletedByEnum} from '../../../../data-layer/db-models/honor.db-model';

@InputType()
export class HonorGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;

  @Field(type => HonorCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(HonorCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;
}
