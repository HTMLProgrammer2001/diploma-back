import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNumber, IsOptional} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class InternshipGetHoursFromLastAttestationRequest {
  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  userId: number;
}
