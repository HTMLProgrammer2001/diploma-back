import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {DepartmentService} from '../service/department.service';
import {DepartmentGetListRequest} from '../types/request/department-get-list.request';
import {DepartmentResponse} from '../types/response/department.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {DepartmentListResponse} from '../types/response/department-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {DepartmentGetByIdRequest} from '../types/request/department-get-by-id.request';
import {DepartmentCreateRequest} from '../types/request/department-create.request';
import {DepartmentUpdateRequest} from '../types/request/department-update.request';
import {IdResponse} from '../../../global/types/response/id.response';

@Resolver(of => DepartmentResponse)
export class DepartmentResolver {
  constructor(private departmentService: DepartmentService) {}

  @Query(returns => DepartmentListResponse)
  async getDepartmentsList(@Args() request: DepartmentGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<DepartmentResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.departmentService.getDepartmentList(request);
  }

  @Query(returns => DepartmentResponse)
  async getDepartmentById(@Args() request: DepartmentGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<DepartmentResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.departmentService.getDepartmentById(request);
  }

  @Mutation(returns => DepartmentResponse)
  async createDepartment(@Args() request: DepartmentCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<DepartmentResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.departmentService.createDepartment(request);
  }

  @Mutation(returns => DepartmentResponse)
  async updateDepartment(@Args() request: DepartmentUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<DepartmentResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.departmentService.updateDepartment(request);
  }

  @Mutation(returns => IdResponse)
  async deleteDepartment(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.departmentService.deleteDepartment(id, guid);
  }
}
