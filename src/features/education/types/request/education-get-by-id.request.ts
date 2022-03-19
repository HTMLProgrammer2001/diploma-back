import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsEnum, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {EducationCascadeDeletedByEnum} from '../../../../data-layer/db-models/education.db-model';

@InputType()
export class EducationGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  showDeleted?: boolean;

  @Field(type => EducationCascadeDeletedByEnum, {nullable: true})
  @IsOptional()
  @IsEnum(EducationCascadeDeletedByEnum)
  showCascadeDeletedBy?: string;
}
