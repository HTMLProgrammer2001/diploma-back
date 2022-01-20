import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class CommissionGetByIdRequest {
  select: Array<string>;

  @Field({nullable: false})
  id: number;

  @Field({nullable: true})
  showDeleted?: boolean;
}
