import {ArgsType, Field, Int} from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxDate,
  MaxLength,
  MinDate
} from 'class-validator';
import {UploadedFile} from '@nestjs/common';
import {GraphQLUpload} from 'graphql-upload';

@ArgsType()
export class TeacherCreateRequest {
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

  @Field({nullable: true})
  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @MinDate(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000))
  birthday: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  @IsPhoneNumber('UA')
  phone: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  address: string;

  @Field(type => GraphQLUpload, {nullable: true})
  avatar: string;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  departmentId: string;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  commissionId: string;

  @Field(type => Int, {nullable: false})
  @IsOptional()
  @IsNumber()
  teacherRankId: string;

  @Field(type => Int, {nullable: false})
  @IsOptional()
  @IsNumber()
  academicDegreeId: string;

  @Field(type => Int, {nullable: false})
  @IsOptional()
  @IsNumber()
  academicTitleId: string;

  @Field( {nullable: false})
  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  workStartDate: string;
}
