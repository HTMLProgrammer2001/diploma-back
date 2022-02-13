import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class EducationResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  institution: string;

  @Field({nullable: false})
  specialty: string;

  @Field({nullable: true})
  yearOfIssue: number;

  @Field({nullable: true})
  description: string;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;

  @Field(type => IdNameResponse, {nullable: false})
  user: IdNameResponse;

  @Field(type => IdNameResponse, {nullable: false})
  educationQualification: IdNameResponse;
}
