import {Injectable} from '@nestjs/common';
import {RoleGetRepoRequest} from '../../../data-layer/repositories/role/repo-request/role-get.repo-request';
import {RoleSelectFieldsEnum} from '../../../data-layer/repositories/role/enums/role-select-fields.enum';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {EducationQualificationSelectFieldsEnum} from '../../../data-layer/repositories/education-qualification/enums/education-qualification-select-fields.enum';
import {EducationQualificationGetRepoRequest} from '../../../data-layer/repositories/education-qualification/repo-request/education-qualification-get.repo-request';
import {CategoryGetRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-get.repo-request';
import {CategorySelectFieldsEnum} from '../../../data-layer/repositories/category/enums/category-select-fields.enum';
import {DepartmentGetRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-get.repo-request';
import {DepartmentSelectFieldsEnum} from '../../../data-layer/repositories/department/enums/department-select-fields.enum';
import {CommissionGetRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-get.repo-request';
import {CommissionSelectFieldsEnum} from '../../../data-layer/repositories/commission/enums/commission-select-fields.enum';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {TeachingRankSelectFieldsEnum} from '../../../data-layer/repositories/teaching-rank/enums/teaching-rank-select-fields.enum';
import {AcademicTitleGetRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-get.repo-request';
import {AcademicTitleSelectFieldsEnum} from '../../../data-layer/repositories/academic-title/enums/academic-title-select-fields.enum';
import {AcademicDegreeGetRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-get.repo-request';
import {AcademicDegreeSelectFieldsEnum} from '../../../data-layer/repositories/academic-degree/enums/academic-degree-select-fields.enum';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';

@Injectable()
export class ImportMapper {
  initializeGetAllRolesRepoRequest(): RoleGetRepoRequest {
    const destination = new RoleGetRepoRequest();

    destination.select = [RoleSelectFieldsEnum.ID, RoleSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllTeachersRepoRequest(): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.select = [TeacherSelectFieldsEnum.ID, TeacherSelectFieldsEnum.FULL_NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllEducationQualificationsRepoRequest(): EducationQualificationGetRepoRequest {
    const destination = new EducationQualificationGetRepoRequest();

    destination.select = [EducationQualificationSelectFieldsEnum.ID, EducationQualificationSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllCategoriesRepoRequest(): CategoryGetRepoRequest {
    const destination = new CategoryGetRepoRequest();

    destination.select = [CategorySelectFieldsEnum.ID, CategorySelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllDepartmentsRepoRequest(): DepartmentGetRepoRequest {
    const destination = new DepartmentGetRepoRequest();

    destination.select = [DepartmentSelectFieldsEnum.ID, DepartmentSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllCommissionsRepoRequest(): CommissionGetRepoRequest {
    const destination = new CommissionGetRepoRequest();

    destination.select = [CommissionSelectFieldsEnum.ID, CommissionSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllTeachingRanksRepoRequest(): TeachingRankGetRepoRequest {
    const destination = new TeachingRankGetRepoRequest();

    destination.select = [TeachingRankSelectFieldsEnum.ID, TeachingRankSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllAcademicTitlesRepoRequest(): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.select = [AcademicTitleSelectFieldsEnum.ID, AcademicTitleSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllAcademicDegreesRepoRequest(): AcademicDegreeGetRepoRequest {
    const destination = new AcademicDegreeGetRepoRequest();

    destination.select = [AcademicDegreeSelectFieldsEnum.ID, AcademicDegreeSelectFieldsEnum.NAME];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetRolesByIds(roleIds: Array<number>): RoleGetRepoRequest {
    const destination = new RoleGetRepoRequest();

    destination.select = [RoleSelectFieldsEnum.ID];
    destination.size = roleIds.length;
    destination.showDeleted = false;

    return destination;
  }

  initializeGetUsersByEmails(emails: Array<string>): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.select = [UserSelectFieldsEnum.EMAIL];
    destination.emailIn = emails;
    destination.size = emails.length;
    destination.showDeleted = false;

    return destination;
  }

  initializeGetUsersByPhones(phones: Array<string>): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.select = [UserSelectFieldsEnum.PHONE];
    destination.phoneIn = phones;
    destination.size = phones.length;
    destination.showDeleted = false;

    return destination;
  }
}
