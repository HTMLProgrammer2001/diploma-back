import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TeacherService} from '../service/teacher.service';
import {TeacherGetListRequest} from '../types/request/teacher-get-list.request';
import {TeacherResponse} from '../types/response/teacher.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {TeacherListResponse} from '../types/response/teacher-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {TeacherGetByIdRequest} from '../types/request/teacher-get-by-id.request';
import {TeacherCreateRequest} from '../types/request/teacher-create.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {TeacherUpdateRequest} from '../types/request/teacher-update.request';

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
    request.select = Object.keys(fieldsProjection(info));
    return this.teacherService.createTeacher(request);
  }

  @Mutation(returns => TeacherResponse)
  async updateTeacher(@Args() request: TeacherUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeacherResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teacherService.updateTeacher(request);
  }

  @Mutation(returns => IdResponse)
  async deleteTeacher(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.teacherService.deleteTeacher(id, guid);
  }
}
