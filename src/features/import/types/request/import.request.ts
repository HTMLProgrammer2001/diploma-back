import {Field, InputType, Int} from '@nestjs/graphql';
import {ImportDataTypeEnum} from '../common/import-data-type.enum';
import {FileUpload, GraphQLUpload} from 'graphql-upload';
import {IsBoolean, IsEnum, IsNumber, IsOptional, Min} from 'class-validator';

@InputType()
export class ImportRequest {
  @Field(type => GraphQLUpload)
  file: Promise<FileUpload>;

  @Field(type => ImportDataTypeEnum)
  @IsEnum(ImportDataTypeEnum)
  type: ImportDataTypeEnum;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(1)
  from: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(1)
  to: number;

  @Field(type => Boolean, {defaultValue: false})
  @IsOptional()
  @IsBoolean()
  ignoreErrors: boolean;
}
