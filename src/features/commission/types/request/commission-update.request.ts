import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class CommissionUpdateRequest {
  select: Array<string>;

  @Field({nullable: false})
  id: number;

  @Field({nullable: true})
  name: string;

  @Field({nullable: false})
  guid: string;
}
