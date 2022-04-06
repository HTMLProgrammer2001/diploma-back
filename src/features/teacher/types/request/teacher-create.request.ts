import {Field, ID, InputType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength,} from 'class-validator';
import {FileUpload, GraphQLUpload} from 'graphql-upload';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
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

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDateRange()
  birthday: Date;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  @IsPhoneNumber('UA')
  phone: string;

  @Field({nullable: true})
  @MaxLength(255)
  @IsOptional()
  @IsString()
  address: string;

  @Field(type => GraphQLUpload, {nullable: true})
  avatar: Promise<FileUpload>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  departmentId: number;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  commissionId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  teacherRankId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  academicDegreeId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  academicTitleId: number;

  @Field({nullable: true})
  @IsOptional()
  @ValidateDateRange()
  workStartDate: Date;
}
