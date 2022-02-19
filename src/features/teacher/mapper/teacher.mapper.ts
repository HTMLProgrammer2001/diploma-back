import {Injectable} from '@nestjs/common';
import {TeacherGetListRequest} from '../types/request/teacher-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {TeacherResponse} from '../types/response/teacher.response';
import {TeacherGetByIdRequest} from '../types/request/teacher-get-by-id.request';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherDbModel} from '../../../data-layer/db-models/teacher.db-model';
import {TeacherCreateRequest} from '../types/request/teacher-create.request';
import {TeacherCreateRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-create.repo-request';
import {CommissionGetRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-get.repo-request';
import {CommissionSelectFieldsEnum} from '../../../data-layer/repositories/commission/enums/commission-select-fields.enum';
import {DepartmentGetRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-get.repo-request';
import {DepartmentSelectFieldsEnum} from '../../../data-layer/repositories/department/enums/department-select-fields.enum';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {TeachingRankSelectFieldsEnum} from '../../../data-layer/repositories/teaching-rank/enums/teaching-rank-select-fields.enum';
import {AcademicDegreeGetRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-get.repo-request';
import {AcademicDegreeSelectFieldsEnum} from '../../../data-layer/repositories/academic-degree/enums/academic-degree-select-fields.enum';
import {AcademicTitleGetRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-get.repo-request';
import {AcademicTitleSelectFieldsEnum} from '../../../data-layer/repositories/academic-title/enums/academic-title-select-fields.enum';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {TeacherDeleteRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-delete.repo-request';
import {TeacherUpdateRequest} from '../types/request/teacher-update.request';
import {TeacherUpdateRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-update.repo-request';

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
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeleted = source.showCascadeDeleted;
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
    destination.birthday = source.birthday?.toISOString().split('T')[0];
    destination.phone = source.phone;
    destination.address = source.address;
    destination.avatarUrl = source.avatarUrl;
    destination.workStartDate = source.workStartDate?.toISOString().split('T')[0];
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if (source.commission) {
      destination.commission = {
        id: source.commission.id,
        name: source.commission.name
      };
    }

    if (source.department) {
      destination.department = {
        id: source.department.id,
        name: source.department.name
      };
    }

    if (source.teacherRank) {
      destination.teacherRank = {
        id: source.teacherRank.id,
        name: source.teacherRank.name
      };
    }

    if (source.academicDegree) {
      destination.academicDegree = {
        id: source.academicDegree.id,
        name: source.academicDegree.name
      };
    }

    if (source.academicTitle) {
      destination.academicTitle = {
        id: source.academicTitle.id,
        name: source.academicTitle.name
      };
    }

    return destination;
  }

  getTeacherByIdRequestToRepoRequest(source: TeacherGetByIdRequest): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeleted = source.showCascadeDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetTeacherByIdRepoRequest(id: number, select: Array<string>): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
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

  initializeGetTeacherByEmailRepoRequest(email: string): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.emailEqual = email;
    destination.select = [TeacherSelectFieldsEnum.ID];
    destination.showDeleted = false;

    return destination;
  }

  initializeGetTeacherByPhoneRepoRequest(phone: string): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.phoneEqual = phone;
    destination.select = [TeacherSelectFieldsEnum.ID];
    destination.showDeleted = false;

    return destination;
  }

  initializeGetCommissionRepoRequest(commissionId: number): CommissionGetRepoRequest {
    const destination = new CommissionGetRepoRequest();

    destination.id = commissionId;
    destination.select = [CommissionSelectFieldsEnum.ID, CommissionSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  initializeGetDepartmentRepoRequest(departmentId: number): DepartmentGetRepoRequest {
    const destination = new DepartmentGetRepoRequest();

    destination.id = departmentId;
    destination.select = [DepartmentSelectFieldsEnum.ID, DepartmentSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  initializeGetTeacherRankRepoRequest(teacherRankId: number): TeachingRankGetRepoRequest {
    const destination = new TeachingRankGetRepoRequest();

    destination.id = teacherRankId;
    destination.select = [TeachingRankSelectFieldsEnum.ID, TeachingRankSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  initializeGetAcademicDegreeRepoRequest(academicDegreeId: number): AcademicDegreeGetRepoRequest {
    const destination = new AcademicDegreeGetRepoRequest();

    destination.id = academicDegreeId;
    destination.select = [AcademicDegreeSelectFieldsEnum.ID, AcademicDegreeSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  initializeGetAcademicTitleRepoRequest(academicTitleId: number): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.id = academicTitleId;
    destination.select = [AcademicTitleSelectFieldsEnum.ID, AcademicTitleSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  updateTeacherRequestToRepoRequest(source: TeacherUpdateRequest, avatarUrl: string): TeacherUpdateRepoRequest {
    const destination = new TeacherUpdateRepoRequest();

    destination.id = source.id;
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

  deleteTeacherRequestToRepoRequest(id: number): TeacherDeleteRepoRequest {
    const destination = new TeacherDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
