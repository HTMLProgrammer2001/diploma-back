import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsEnum, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {RebukeCascadeDeletedByEnum} from '../../../../data-layer/db-models/rebuke.db-model';

@InputType()
export class RebukeGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;

  @Field(type => RebukeCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(RebukeCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;
}
