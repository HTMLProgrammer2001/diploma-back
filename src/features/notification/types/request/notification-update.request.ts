import {Field, InputType} from '@nestjs/graphql';
import {NotificationTypesEnum} from '../common/notification-types.enum';
import {IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min} from 'class-validator';

@InputType()
export class NotificationUpdateRequest {
  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isNotifyTeachers: boolean;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isNotifyAdmins: boolean;

  @Field(type => [String], {nullable: true})
  @IsOptional()
  @IsArray()
  adminEmails: Array<string>;

  @Field(type => NotificationTypesEnum, {nullable: true})
  @IsOptional()
  notifyType: NotificationTypesEnum;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(0)
  notifyDay: number;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  notifyTime: string;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(0)
  notifyBeforeDays: number;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(0)
  attestationYearsPeriod: number;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(0)
  requiredInternshipHours: number;
}
