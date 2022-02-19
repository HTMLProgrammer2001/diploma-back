import {Field, ID, InputType} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class InternshipGetHoursFromLastAttestationRequest {
  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  teacherId: number;
}
