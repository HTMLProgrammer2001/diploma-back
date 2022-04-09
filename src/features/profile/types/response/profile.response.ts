import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class ProfileResponse {
  @Field(type => ID, {nullable: true})
  id: number;

  @Field({nullable: true})
  fullName: string;

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  avatarUrl: string;

  @Field({nullable: true})
  phone: string;

  @Field(type => IdNameResponse, {nullable: true})
  role: IdNameResponse;

  @Field({nullable: true})
  guid: string;
}
