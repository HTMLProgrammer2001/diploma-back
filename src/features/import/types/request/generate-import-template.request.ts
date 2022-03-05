import {Field, InputType} from '@nestjs/graphql';
import {ImportDataTypeEnum} from '../common/import-data-type.enum';

@InputType()
export class GenerateImportTemplateRequest {
  @Field(type => ImportDataTypeEnum)
  type: ImportDataTypeEnum;
}
