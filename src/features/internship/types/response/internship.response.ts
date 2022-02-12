import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class InternshipResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  title: string;

  @Field({nullable: false})
  code: string;

  @Field({nullable: true})
  from: string;

  @Field({nullable: true})
  to: string;

  @Field({nullable: true})
  place: string;

  @Field({nullable: true})
  hours: number;

  @Field({nullable: true})
  credits: number;

  @Field({nullable: true})
  description: string;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;

  @Field(type => IdNameResponse, {nullable: false})
  user: IdNameResponse;
}
