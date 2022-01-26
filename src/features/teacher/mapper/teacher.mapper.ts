import {Injectable} from '@nestjs/common';
import {TeacherGetListRequest} from '../types/request/teacher-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeacherResponse} from '../types/response/teacher.response';
import {TeacherGetByIdRequest} from '../types/request/teacher-get-by-id.request';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {TeachingRankDbModel} from '../../../data-layer/db-models/teaching-rank.db-model';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherDbModel} from '../../../data-layer/db-models/teacher.db-model';
import {TeacherCreateRequest} from '../types/request/teacher-create.request';
import {TeacherCreateRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-create.repo-request';

@Injectable()
export class TeacherMapper {
  getTeacherListRequestToRepoRequest(source: TeacherGetListRequest): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.commissionId = source.commissionId;
    destination.departmentId = source.departmentId;
    destination.teacherRankId = source.teachingRankId;
    destination.academicTitleId = source.academicTitleId;
    destination.academicDegreeId = source.academicDegreeId;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  teacherPaginatorDbModelToResponse(source: IPaginator<TeacherDbModel>): IPaginator<TeacherResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.teacherDbModelToResponse(el))
    };
  }

  teacherDbModelToResponse(source: TeacherDbModel): TeacherResponse {
    const destination = new TeacherResponse();

    destination.id = source.id;
    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.birthday = source.birthday;
    destination.phone = source.phone;
    destination.address = source.address;
    destination.avatarUrl = source.avatarUrl;
    destination.workStartDate = source.workStartDate;
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    destination.commission = {
      id: source.commission?.id,
      name: source.commission?.name
    };

    destination.department = {
      id: source.department?.id,
      name: source.department?.name
    };

    destination.teacherRank = {
      id: source.teacherRank?.id,
      name: source.teacherRank?.name
    };

    destination.academicDegree = {
      id: source.academicDegree?.id,
      name: source.academicDegree?.name
    };
    destination.academicTitle = {
      id: source.academicTitle?.id,
      name: source.academicTitle?.name
    };

    return destination;
  }

  getTeacherByIdRequestToRepoRequest(source: TeacherGetByIdRequest): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createTeacherRequestToRepoRequest(source: TeacherCreateRequest, avatarUrl: string): TeacherCreateRepoRequest {
    const destination = new TeacherCreateRepoRequest();

    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.phone = source.phone;
    destination.address = source.address;
    destination.avatarUrl = avatarUrl;
    destination.birthday = source.birthday;
    destination.teacherRankId = source.teacherRankId;
    destination.academicTitleId = source.academicTitleId;
    destination.academicDegreeId = source.academicDegreeId;
    destination.commissionId = source.commissionId;
    destination.departmentId = source.departmentId;
    destination.workStartDate = source.workStartDate;

    return destination;
  }
}
