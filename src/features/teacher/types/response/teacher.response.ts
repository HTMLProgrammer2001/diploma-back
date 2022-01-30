import {Field, Int, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class TeacherResponse {
  @Field(type => Int)
  id: number;

  @Field({nullable: false})
  fullName: string;

  @Field({nullable: false})
  email: string;

  @Field({nullable: true})
  birthday: string;

  @Field({nullable: true})
  phone: string;

  @Field({nullable: true})
  address: string;

  @Field({nullable: true})
  avatarUrl: string;

  @Field({nullable: true})
  workStartDate: string;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;

  @Field(type => IdNameResponse, {nullable: false})
  department: IdNameResponse;

  @Field(type => IdNameResponse, {nullable: false})
  commission: IdNameResponse;

  @Field(type => IdNameResponse, {nullable: true})
  teacherRank: IdNameResponse;

  @Field(type => IdNameResponse, {nullable: true})
  academicDegree: IdNameResponse;

  @Field(type => IdNameResponse, {nullable: true})
  academicTitle: IdNameResponse;
}
