import {Field, ID, InputType, registerEnumType} from '@nestjs/graphql';
import {ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, Min, MIN} from 'class-validator';
import {Transform} from 'class-transformer';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';
import {ExportSelectEnum} from '../common/export-select.enum';
import {ExportTypeEnum} from '../common/export-type.enum';
import {ParseNumber} from '../../../../global/pipes/parse-number';

registerEnumType(ExportSelectEnum, {name: 'ExportSelectEnum'});
registerEnumType(ExportTypeEnum, {name: 'ExportTypeEnum'});

@InputType()
export class ExportRequest {
  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  @Min(0)
  commissionId?: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  @Min(0)
  departmentId?: number;

  @Field(type => [ID], {nullable: true})
  @IsOptional()
  @Transform(({value}) => Array.isArray(value) ? value.map(el => Number(el)) : [])
  @IsArray()
  @IsNumber({}, {each: true})
  @ArrayUnique()
  @ArrayMinSize(1)
  teacherIds?: Array<number>;

  @Field({nullable: true})
  @IsOptional()
  @ValidateDateRange()
  from?: Date;

  @Field({nullable: true})
  @IsOptional()
  @ValidateDateRange()
  to?: Date;

  @Field(type => [ExportSelectEnum], {nullable: false})
  @IsArray()
  @ArrayUnique()
  @IsEnum(ExportSelectEnum, {each: true})
  @ArrayMinSize(1)
  select: Array<ExportSelectEnum>;

  @Field(type => ExportTypeEnum, {nullable: false})
  @IsEnum(ExportTypeEnum)
  type: ExportTypeEnum;
}
