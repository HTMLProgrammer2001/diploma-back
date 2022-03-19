import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsEnum, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {AttestationCascadeDeleteByEnum} from '../../../../data-layer/db-models/attestation.db-model';

@InputType()
export class AttestationGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;

  @Field(type => AttestationCascadeDeleteByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(AttestationCascadeDeleteByEnum)
  showCascadeDeletedBy: string;
}
