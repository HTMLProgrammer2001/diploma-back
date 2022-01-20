export interface IPaginator<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  skip: number;
  responseList: Array<T>;
}
