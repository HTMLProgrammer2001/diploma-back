import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class AttestationResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  date: string;

  @Field({nullable: true})
  description: string;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;

  @Field(type => IdNameResponse, {nullable: false})
  user: IdNameResponse;

  @Field(type => IdNameResponse, {nullable: false})
  category: IdNameResponse;
}
