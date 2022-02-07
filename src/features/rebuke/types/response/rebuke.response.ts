import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IdNameResponse} from '../../../../global/types/response/id-name.response';

@ObjectType()
export class RebukeResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  title: string;

  @Field({nullable: false})
  date: string;

  @Field({nullable: true})
  orderNumber: string;

  @Field({nullable: true})
  description: string;

  @Field({nullable: false})
  isActive: boolean;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;

  @Field(type => IdNameResponse, {nullable: false})
  user: IdNameResponse;
}
