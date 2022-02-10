import {Field, InputType} from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import {FileUpload, GraphQLUpload} from 'graphql-upload';

@InputType()
export class EditProfileRequest {
  select: Array<string>;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Field({nullable: true})
  @IsOptional()
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

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;
}
