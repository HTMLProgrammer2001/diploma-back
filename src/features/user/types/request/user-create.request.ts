import {Field, ID, InputType} from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import {FileUpload, GraphQLUpload} from 'graphql-upload';
import {ParseNumber} from '../../../../global/validators/parse-number';

@InputType()
export class UserCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Field({nullable: false})
  @MinLength(8)
  @IsAlphanumeric()
  @IsString()
  password: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  @IsPhoneNumber('UA')
  phone: string;

  @Field(type => GraphQLUpload, {nullable: true})
  avatar: Promise<FileUpload>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  roleId: number;
}
