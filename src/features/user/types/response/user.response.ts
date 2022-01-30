import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class UserResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  fullName: string;

  @Field({nullable: false})
  email: string;

  @Field({nullable: true})
  phone: string;

  @Field({nullable: true})
  avatarUrl: string;

  @Field(type => IdNameResponse, {nullable: true})
  role: IdNameResponse;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;
}
