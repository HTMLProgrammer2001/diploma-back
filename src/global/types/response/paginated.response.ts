import {Type} from '@nestjs/common';
import {Field, Int, InterfaceType, ObjectType} from '@nestjs/graphql';
import {IPaginator} from '../interface/IPaginator.interface';

@InterfaceType()
export abstract class PaginatedData {
  @Field((type) => Int)
  page: number;

  @Field((type) => Int)
  size: number;

  @Field((type) => Int)
  totalElements: number;

  @Field((type) => Int)
  totalPages: number;

  @Field((type) => Int)
  skip: number;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginator<T>> {
  @ObjectType({ isAbstract: true, implements: [PaginatedData] })
  abstract class PaginatedType extends PaginatedData implements IPaginator<T> {
    @Field((type) => [classRef])
    responseList: Array<T>;
  }

  return PaginatedType as Type<IPaginator<T>>;
}
