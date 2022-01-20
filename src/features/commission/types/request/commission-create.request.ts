import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class CommissionCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  name: string;
}
