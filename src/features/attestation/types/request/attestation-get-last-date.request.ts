import {Field, ID, InputType} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class AttestationGetLastDateRequest {
  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  teacherId: number;
}
