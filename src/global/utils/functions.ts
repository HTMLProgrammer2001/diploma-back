import {IPaginator} from '../types/interface/IPaginator.interface';

export function convertFindAndCountToPaginator<T>(data: { rows: Array<T>, count: number }, page: number, size: number):
  IPaginator<T> {
  return {
    page,
    size,
    skip: (page - 1) * size,
    totalElements: data.count,
    totalPages: Math.ceil(data.count / size),
    responseList: data.rows
  }
}
