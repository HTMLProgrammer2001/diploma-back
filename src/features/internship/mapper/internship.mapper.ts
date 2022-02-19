import {Injectable} from '@nestjs/common';
import {InternshipGetListRequest} from '../types/request/internship-get-list.request';
import {InternshipGetRepoRequest} from '../../../data-layer/repositories/internship/repo-request/internship-get.repo-request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {InternshipDbModel} from '../../../data-layer/db-models/internship.db-model';
import {InternshipResponse} from '../types/response/internship.response';
import {InternshipGetByIdRequest} from '../types/request/internship-get-by-id.request';
import {InternshipCreateRequest} from '../types/request/internship-create.request';
import {InternshipCreateRepoRequest} from '../../../data-layer/repositories/internship/repo-request/internship-create.repo-request';
import {InternshipDeleteRepoRequest} from '../../../data-layer/repositories/internship/repo-request/internship-delete.repo-request';
import {InternshipUpdateRequest} from '../types/request/internship-update.request';
import {InternshipUpdateRepoRequest} from '../../../data-layer/repositories/internship/repo-request/internship-update.repo-request';
import {InternshipSelectFieldsEnum} from '../../../data-layer/repositories/internship/enums/internship-select-fields.enum';
import {AttestationGetRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-get.repo-request';
import {AttestationOrderFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-order-fields.enum';
import {AttestationSelectFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-select-fields.enum';
import {InternshipGetHoursRepoRequest} from '../../../data-layer/repositories/internship/repo-request/internship-get-hours.repo-request';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';

@Injectable()
export class InternshipMapper {
  getInternshipListRequestToRepoRequest(source: InternshipGetListRequest): InternshipGetRepoRequest {
    const destination = new InternshipGetRepoRequest();

    destination.title = source.title;
    destination.code = source.code;
    destination.place = source.place;
    destination.dateFromMore = source.dateFromMore;
    destination.dateToLess = source.dateToLess;
    destination.teacherId = source.teacherId;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeletedBy = source.showCascadeDeletedBy;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  internshipPaginatorDbModelToResponse(source: IPaginator<InternshipDbModel>): IPaginator<InternshipResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.internshipDbModelToResponse(el))
    };
  }

  internshipDbModelToResponse(source: InternshipDbModel): InternshipResponse {
    const destination = new InternshipResponse();

    destination.id = source.id;
    destination.title = source.title;
    destination.code = source.code;
    destination.description = source.description;
    destination.place = source.place;
    destination.hours = source.hours;
    destination.credits = source.credits;
    destination.from = source.from?.toISOString().split('T')[0];
    destination.to = source.to?.toISOString().split('T')[0];
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if (source.teacher) {
      destination.teacher = {
        id: source.teacher.id,
        name: source.teacher.fullName
      };
    }

    return destination;
  }

  getInternshipByIdRequestToRepoRequest(source: InternshipGetByIdRequest): InternshipGetRepoRequest {
    const destination = new InternshipGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeletedBy = source.showCascadeDeletedBy;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetLastAttestationRepoRequest(userId: number): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.teacherId = userId;
    destination.orderField = AttestationOrderFieldsEnum.DATE;
    destination.isDesc = true;
    destination.showDeleted = false;
    destination.select = [AttestationSelectFieldsEnum.DATE];
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetInternshipHoursRepoRequest(userId: number, date: Date): InternshipGetHoursRepoRequest {
    const destination = new InternshipGetHoursRepoRequest();

    destination.teacherId = userId;
    destination.from = date;

    return destination;
  }

  initializeGetInternshipByIdRepoRequest(id: number, select: Array<string>): InternshipGetRepoRequest {
    const destination = new InternshipGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetInternshipByCodeRepoRequest(code: string): InternshipGetRepoRequest {
    const destination = new InternshipGetRepoRequest();

    destination.codeEqual = code;
    destination.select = [InternshipSelectFieldsEnum.ID];
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createInternshipRequestToRepoRequest(source: InternshipCreateRequest): InternshipCreateRepoRequest {
    const destination = new InternshipCreateRepoRequest();

    destination.teacherId = source.teacherId;
    destination.description = source.description;
    destination.title = source.title;
    destination.code = source.code;
    destination.place = source.place;
    destination.hours = source.hours;
    destination.credits = source.credits;
    destination.from = source.from;
    destination.to = source.to;

    return destination;
  }

  initializeGetTeacherRepoRequest(teacherId: number): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.id = teacherId;
    destination.select = [TeacherSelectFieldsEnum.ID, TeacherSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  updateInternshipRequestToRepoRequest(source: InternshipUpdateRequest): InternshipUpdateRepoRequest {
    const destination = new InternshipUpdateRepoRequest();

    destination.id = source.id;
    destination.teacherId = source.teacherId;
    destination.description = source.description;
    destination.title = source.title;
    destination.code = source.code;
    destination.place = source.place;
    destination.hours = source.hours;
    destination.credits = source.credits;
    destination.from = source.from;
    destination.to = source.to;

    return destination;
  }

  deleteInternshipRequestToRepoRequest(id: number): InternshipDeleteRepoRequest {
    const destination = new InternshipDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
