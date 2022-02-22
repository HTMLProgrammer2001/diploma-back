import {TeacherDbModel} from '../../../../data-layer/db-models/teacher.db-model';
import {RebukeDbModel} from '../../../../data-layer/db-models/rebuke.db-model';
import {HonorDbModel} from '../../../../data-layer/db-models/honor.db-model';
import {AttestationDbModel} from '../../../../data-layer/db-models/attestation.db-model';
import {InternshipDbModel} from '../../../../data-layer/db-models/internship.db-model';
import {PublicationDbModel} from '../../../../data-layer/db-models/publication.db-model';
import {CommissionDbModel} from '../../../../data-layer/db-models/commission.db-model';
import {DepartmentDbModel} from '../../../../data-layer/db-models/department.db-model';

export interface ExportDataInterface {
  teacherData: Array<TeacherDbModel>;
  rebukeData: Array<RebukeDbModel>;
  honorData: Array<HonorDbModel>;
  internshipData: Array<InternshipDbModel>;
  publicationData: Array<PublicationDbModel>;
  attestationData: Array<AttestationDbModel>;
  commissionData: CommissionDbModel;
  departmentData: DepartmentDbModel;
}
