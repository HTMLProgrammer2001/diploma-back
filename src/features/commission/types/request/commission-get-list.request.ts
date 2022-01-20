import {ArgsType, Field} from '@nestjs/graphql';
import {BasePaginatorRequest} from '../../../../common/types/request/base-paginator.request';
import {CommissionOrderFieldsEnum} from '../../../../data/repositories/commission/enums/commission-order-fields.enum';

@ArgsType()
export class CommissionGetListRequest extends BasePaginatorRequest {
  select: Array<string>;

  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  showDeleted: boolean;

  @Field({nullable: true, defaultValue: CommissionOrderFieldsEnum.ID})
  orderField: string;

  @Field({nullable: true})
  isDesc: boolean;
}
