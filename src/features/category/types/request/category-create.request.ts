import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

@InputType()
export class CategoryCreateRequest {
  select: Array<string>;

  @Field({nullable: true})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  name: string;
}
