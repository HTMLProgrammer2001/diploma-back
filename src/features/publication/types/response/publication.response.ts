import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class PublicationResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  title: string;

  @Field({nullable: false})
  date: string;

  @Field({nullable: true})
  publisher: string;

  @Field({nullable: true})
  url: string;

  @Field({nullable: true})
  anotherAuthors: string;

  @Field({nullable: true})
  description: string;

  @Field(type => [IdNameResponse],{nullable: true})
  users: Array<IdNameResponse>;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;
}
