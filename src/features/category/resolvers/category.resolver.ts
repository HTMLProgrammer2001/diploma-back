import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CategoryService} from '../service/category.service';
import {CategoryGetListRequest} from '../types/request/category-get-list.request';
import {CategoryResponse} from '../types/response/category.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CategoryListResponse} from '../types/response/category-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {CategoryGetByIdRequest} from '../types/request/category-get-by-id.request';
import {CommissionResponse} from '../../commission/types/response/commission.response';
import {CategoryCreateRequest} from '../types/request/category-create.request';
import {CategoryUpdateRequest} from '../types/request/category-update.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';

@Resolver(of => CategoryResponse)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {
  }

  @Query(returns => CategoryListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getCategoryList(@Args('query') request: CategoryGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<CategoryResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.categoryService.getCategoryList(request);
  }

  @Query(returns => CategoryResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getCategoryById(@Args('query') request: CategoryGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<CategoryResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.categoryService.getCategoryById(request);
  }

  @Mutation(returns => CategoryResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createCategory(@Args('body') request: CategoryCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.categoryService.createCategory(request);
  }

  @Mutation(returns => CategoryResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateCategory(@Args('body') request: CategoryUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CategoryResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.categoryService.updateCategory(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteCategory(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.categoryService.deleteCategory(id, guid);
  }
}
