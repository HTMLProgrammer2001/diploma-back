import {Field, InputType, Int} from '@nestjs/graphql';
import {ImportDataTypeEnum} from '../common/import-data-type.enum';
import {IsEnum} from 'class-validator';

@InputType()
export class GenerateImportTemplateRequest {
  @Field(type => Int)
  @IsEnum(ImportDataTypeEnum)
  type: ImportDataTypeEnum;
}
