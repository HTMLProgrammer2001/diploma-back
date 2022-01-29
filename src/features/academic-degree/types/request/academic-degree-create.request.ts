import {ArgsType, Field} from '@nestjs/graphql';
import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

@ArgsType()
export class AcademicDegreeCreateRequest {
  select: Array<string>;

  @Field({nullable: true})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  name: string;
}
