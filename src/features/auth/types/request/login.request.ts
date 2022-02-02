import {Field, InputType} from '@nestjs/graphql';
import {IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

@InputType()
export class LoginRequest {
  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(8)
  password: string;
}
