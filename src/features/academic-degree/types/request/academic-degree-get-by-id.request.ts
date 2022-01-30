import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNumber} from 'class-validator';
import {ParseNumber} from '../../../../global/validators/parse-number';

@InputType()
export class AcademicDegreeGetByIdRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field(type => Boolean, {nullable: true})
  @IsBoolean()
  showDeleted = false;
}
