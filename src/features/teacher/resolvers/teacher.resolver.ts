import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
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
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';

@Resolver(of => TeacherResponse)
export class TeacherResolver {
  constructor(private teacherService: TeacherService) {
  }

  @Query(returns => TeacherListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getTeacherList(@Args('query') request: TeacherGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<TeacherResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.teacherService.getTeacherList(request);
  }

  @Query(returns => TeacherResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getTeacherById(@Args('query') request: TeacherGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeacherResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teacherService.getTeacherById(request);
  }

  @Mutation(returns => TeacherResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createTeacher(@Args('body') request: TeacherCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeacherResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teacherService.createTeacher(request);
  }

  @Mutation(returns => TeacherResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateTeacher(@Args('body') request: TeacherUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeacherResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teacherService.updateTeacher(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteTeacher(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.teacherService.deleteTeacher(id, guid);
  }
}
