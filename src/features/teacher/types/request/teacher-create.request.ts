import {Field, ID, InputType} from '@nestjs/graphql';
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
import {ParseNumber} from '../../../../global/validators/parse-number';

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

  @Field({nullable: true})
  @IsOptional()
  @Transform(({value}) => value ? Date.parse(value) : value)
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

  @Field( {nullable: true})
  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @MinDate(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000))
  workStartDate: string;
}
