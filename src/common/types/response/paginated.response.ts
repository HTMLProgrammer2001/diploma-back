import {Type} from '@nestjs/common';
import {Field, Int, ObjectType} from '@nestjs/graphql';
import {IPaginator} from '../interface/IPaginator.interface';

export function Paginated<T>(classRef: Type<T>): Type<IPaginator<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginator<T> {
    @Field((type) => [classRef])
    responseList: Array<T>;

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

  return PaginatedType as Type<IPaginator<T>>;
}