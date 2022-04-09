import {Injectable} from '@nestjs/common';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {TeacherOrderFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-order-fields.enum';
import {HonorGetRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-get.repo-request';
import {RebukeGetRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-get.repo-request';
import {HonorSelectFieldsEnum} from '../../../data-layer/repositories/honor/enums/honor-select-fields.enum';
import {HonorOrderFieldsEnum} from '../../../data-layer/repositories/honor/enums/honor-order-fields.enum';
import {RebukeSelectFieldsEnum} from '../../../data-layer/repositories/rebuke/enums/rebuke-select-fields.enum';
import {RebukeOrderFieldsEnum} from '../../../data-layer/repositories/rebuke/enums/rebuke-order-fields.enum';
import {InternshipGetRepoRequest} from '../../../data-layer/repositories/internship/repo-request/internship-get.repo-request';
import {InternshipSelectFieldsEnum} from '../../../data-layer/repositories/internship/enums/internship-select-fields.enum';
import {PublicationGetRepoRequest} from '../../../data-layer/repositories/publication/repo-request/publication-get.repo-request';
import {PublicationSelectFieldsEnum} from '../../../data-layer/repositories/publication/enums/publication-select-fields.enum';
import {PublicationOrderFieldsEnum} from '../../../data-layer/repositories/publication/enums/publication-order-fields.enum';
import {AttestationGetRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-get.repo-request';
import {AttestationSelectFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-select-fields.enum';
import {AttestationOrderFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-order-fields.enum';
import {DepartmentGetRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-get.repo-request';
import {DepartmentSelectFieldsEnum} from '../../../data-layer/repositories/department/enums/department-select-fields.enum';
import {CommissionGetRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-get.repo-request';
import {CommissionSelectFieldsEnum} from '../../../data-layer/repositories/commission/enums/commission-select-fields.enum';

@Injectable()
export class ExportMapper {
  initializeGetTeacherDataRepoRequest(teacherIds: Array<number>, isSelectPersonal: boolean, isSelectProfessional: boolean):
    TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    const personalSelect = [
      TeacherSelectFieldsEnum.ADDRESS, TeacherSelectFieldsEnum.PHONE,
      TeacherSelectFieldsEnum.EMAIL, TeacherSelectFieldsEnum.BIRTHDAY
    ];

    const professionalSelect = [
      TeacherSelectFieldsEnum.TEACHER_RANK_NAME, TeacherSelectFieldsEnum.ACADEMIC_TITLE_NAME,
      TeacherSelectFieldsEnum.ACADEMIC_DEGREE_NAME, TeacherSelectFieldsEnum.DEPARTMENT_NAME,
      TeacherSelectFieldsEnum.COMMISSION_NAME, TeacherSelectFieldsEnum.WORK_START_DATE
    ];

    destination.ids = teacherIds;
    destination.select = [
      TeacherSelectFieldsEnum.ID, TeacherSelectFieldsEnum.FULL_NAME,
      ...(isSelectPersonal ? personalSelect: []),
      ...(isSelectProfessional ? professionalSelect : [])
    ];
    destination.orderField = TeacherOrderFieldsEnum.FULL_NAME;
    destination.isDesc = false;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetHonorDataRepoRequest(teacherIds: Array<number>, from: Date, to: Date): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.teacherIds = teacherIds;
    destination.select = [
      HonorSelectFieldsEnum.ORDER_NUMBER, HonorSelectFieldsEnum.DATE,
      HonorSelectFieldsEnum.TITLE, HonorSelectFieldsEnum.DESCRIPTION,
      HonorSelectFieldsEnum.TEACHER_NAME
    ];
    destination.orderField = HonorOrderFieldsEnum.DATE;
    destination.dateMore = from;
    destination.dateLess = to;
    destination.isDesc = false;
    destination.showInActive = false;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetRebukeDataRepoRequest(teacherIds: Array<number>, from: Date, to: Date): RebukeGetRepoRequest {
    const destination = new RebukeGetRepoRequest();

    destination.teacherIds = teacherIds;
    destination.select = [
      RebukeSelectFieldsEnum.ORDER_NUMBER, RebukeSelectFieldsEnum.DATE,
      RebukeSelectFieldsEnum.TITLE, RebukeSelectFieldsEnum.DESCRIPTION,
      RebukeSelectFieldsEnum.TEACHER_NAME
    ];
    destination.orderField = RebukeOrderFieldsEnum.DATE;
    destination.isDesc = false;
    destination.dateMore = from;
    destination.dateLess = to;
    destination.showInActive = false;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetInternshipDataRepoRequest(teacherIds: Array<number>, from: Date, to: Date): InternshipGetRepoRequest {
    const destination = new InternshipGetRepoRequest();

    destination.teacherIds = teacherIds;
    destination.select = [
      InternshipSelectFieldsEnum.TITLE, InternshipSelectFieldsEnum.FROM, InternshipSelectFieldsEnum.TO,
      InternshipSelectFieldsEnum.HOURS, InternshipSelectFieldsEnum.PLACE, InternshipSelectFieldsEnum.CREDITS,
      InternshipSelectFieldsEnum.DESCRIPTION, InternshipSelectFieldsEnum.TEACHER_NAME
    ];
    destination.orderField = RebukeOrderFieldsEnum.DATE;
    destination.isDesc = false;
    destination.dateFromMore = from;
    destination.dateToLess = to;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetPublicationDataRepoRequest(teacherIds: Array<number>, from: Date, to: Date): PublicationGetRepoRequest {
    const destination = new PublicationGetRepoRequest();

    destination.teacherOneOf = teacherIds;
    destination.select = [
      PublicationSelectFieldsEnum.TITLE, PublicationSelectFieldsEnum.DATE, PublicationSelectFieldsEnum.PUBLISHER,
      PublicationSelectFieldsEnum.ANOTHER_AUTHORS, PublicationSelectFieldsEnum.TEACHER_NAME,
      PublicationSelectFieldsEnum.URL, PublicationSelectFieldsEnum.DESCRIPTION
    ];
    destination.orderField = PublicationOrderFieldsEnum.DATE;
    destination.isDesc = false;
    destination.dateMore = from;
    destination.dateLess = to;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAttestationDataRepoRequest(teacherIds: Array<number>, from: Date, to: Date): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.teacherIds = teacherIds;
    destination.select = [
      AttestationSelectFieldsEnum.DATE, AttestationSelectFieldsEnum.CATEGORY_NAME,
      AttestationSelectFieldsEnum.DESCRIPTION, AttestationSelectFieldsEnum.TEACHER_NAME
    ];
    destination.orderField = AttestationOrderFieldsEnum.DATE;
    destination.isDesc = false;
    destination.dateMore = from;
    destination.dateLess = to;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetTeacherListByCommission(commissionId: number): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.commissionId = commissionId;
    destination.select = [TeacherSelectFieldsEnum.ID];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetTeacherListByDepartment(departmentId: number): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.departmentId = departmentId;
    destination.select = [TeacherSelectFieldsEnum.ID];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetTeacherListByIds(teacherIds: Array<number>): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.ids = teacherIds;
    destination.select = [TeacherSelectFieldsEnum.ID];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetAllTeacherIds(): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.select = [TeacherSelectFieldsEnum.ID];
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 5000;

    return destination;
  }

  initializeGetDepartment(departmentId: number): DepartmentGetRepoRequest {
    const destination = new DepartmentGetRepoRequest();

    destination.id = departmentId;
    destination.select = [DepartmentSelectFieldsEnum.ID, DepartmentSelectFieldsEnum.NAME];
    destination.isDesc = false;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetCommission(commissionId: number): CommissionGetRepoRequest {
    const destination = new CommissionGetRepoRequest();

    destination.id = commissionId;
    destination.select = [CommissionSelectFieldsEnum.ID, CommissionSelectFieldsEnum.NAME];
    destination.isDesc = false;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }
}
