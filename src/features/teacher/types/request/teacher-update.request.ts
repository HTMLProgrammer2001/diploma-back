import {ArgsType, Field, Int} from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxDate,
  MaxLength,
  MinDate
} from 'class-validator';
import {FileUpload, GraphQLUpload} from 'graphql-upload';
import {Transform} from 'class-transformer';

@ArgsType()
export class TeacherUpdateRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;

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
  @Transform(({value}) => value ? new Date(Date.parse(value)) : value)
  @IsDate()
  @MaxDate(new Date())
  @MinDate(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000))
  birthday: Date;

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
  avatar: Promise<FileUpload>;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  commissionId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  teacherRankId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  academicDegreeId: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  academicTitleId: number;

  @Field( {nullable: true})
  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @MinDate(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000))
  workStartDate: string;
}
