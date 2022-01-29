import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';

@ArgsType()
export class AcademicDegreeUpdateRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;
}
