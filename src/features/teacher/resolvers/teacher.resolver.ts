import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TeacherService} from '../service/teacher.service';
import {TeacherGetListRequest} from '../types/request/teacher-get-list.request';
import {TeacherResponse} from '../types/response/teacher.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeacherListResponse} from '../types/response/teacher-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsList, fieldsProjection} from 'graphql-fields-list';
import {TeacherGetByIdRequest} from '../types/request/teacher-get-by-id.request';
import {CommissionResponse} from '../../commission/types/response/commission.response';
import {CommissionCreateRequest} from '../../commission/types/request/commission-create.request';
import {TeacherCreateRequest} from '../types/request/teacher-create.request';

@Resolver(of => TeacherResponse)
export class TeacherResolver {
  constructor(private teacherService: TeacherService) {}

  @Query(returns => TeacherListResponse)
  async getTeacherList(@Args() request: TeacherGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<TeacherResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.teacherService.getTeacherList(request);
  }

  @Query(returns => TeacherResponse)
  async getTeacherById(@Args() request: TeacherGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeacherResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teacherService.getTeacherById(request);
  }

  @Mutation(returns => TeacherResponse)
  async createTeacher(@Args() request: TeacherCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeacherResponse> {
    request.select = fieldsList(info);
    return this.teacherService.createTeacher(request);
  }
}
