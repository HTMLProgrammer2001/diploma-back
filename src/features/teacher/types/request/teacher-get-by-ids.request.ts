import {Field, ID, InputType} from '@nestjs/graphql';
import {ArrayUnique, IsArray, IsNumber, IsOptional} from 'class-validator';
import {Transform} from 'class-transformer';

@InputType()
export class TeacherGetByIdsRequest {
  select: Array<string>;

  @Field(type => [ID], {nullable: true})
  @IsOptional()
  @Transform(({value}) => Array.isArray(value) ? value.map(el => Number(el)) : [])
  @IsArray()
  @IsNumber({}, {each: true})
  @ArrayUnique()
  ids: Array<number>;
}
