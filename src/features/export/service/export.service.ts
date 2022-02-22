import {Injectable, Logger} from '@nestjs/common';
import {Workbook} from 'exceljs';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {ExportRequest} from '../types/request/export.request';
import {ExportResponse} from '../types/response/export.response';
import {ExportMapper} from '../mapper/export.mapper';
import {TeacherDbModel} from '../../../data-layer/db-models/teacher.db-model';
import {ExportSelectEnum} from '../types/common/export-select.enum';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {HonorDbModel} from '../../../data-layer/db-models/honor.db-model';
import {HonorRepository} from '../../../data-layer/repositories/honor/honor.repository';
import {RebukeDbModel} from '../../../data-layer/db-models/rebuke.db-model';
import {RebukeRepository} from '../../../data-layer/repositories/rebuke/rebuke.repository';
import {InternshipDbModel} from '../../../data-layer/db-models/internship.db-model';
import {InternshipRepository} from '../../../data-layer/repositories/internship/internship.repository';
import {PublicationDbModel} from '../../../data-layer/db-models/publication.db-model';
import {AttestationDbModel} from '../../../data-layer/db-models/attestation.db-model';
import {PublicationRepository} from '../../../data-layer/repositories/publication/publication.repository';
import {AttestationRepository} from '../../../data-layer/repositories/attestation/attestation.repository';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {DepartmentRepository} from '../../../data-layer/repositories/department/department.repository';
import {CommissionRepository} from '../../../data-layer/repositories/commission/commission.repository';
import {ExportTypeEnum} from '../types/common/export-type.enum';
import {CommissionDbModel} from '../../../data-layer/db-models/commission.db-model';
import {DepartmentDbModel} from '../../../data-layer/db-models/department.db-model';

@Injectable()
export class ExportService {
  private logger: Logger;

  constructor(
    private exportMapper: ExportMapper,
    private teacherRepository: TeacherRepository,
    private honorRepository: HonorRepository,
    private rebukeRepository: RebukeRepository,
    private internshipRepository: InternshipRepository,
    private publicationRepository: PublicationRepository,
    private attestationRepository: AttestationRepository,
    private departmentRepository: DepartmentRepository,
    private commissionRepository: CommissionRepository,
  ) {
    this.logger = new Logger(ExportService.name);
  }

  async generateReport(request: ExportRequest): Promise<ExportResponse> {
    try {
      if((request.departmentId && request.commissionId)
        || (request.departmentId && request.teacherIds)
        || (request.commissionId && request.teacherIds)) {
        const error = new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: 'You must provide only one of this: departmentId, commissionId, teacherIds'
        });

        this.logger.error(error);
        throw error;
      }

      //validate request
      let commissionData: CommissionDbModel;
      let departmentData: DepartmentDbModel;

      if(request.departmentId) {
        const getDepartmentRepoRequest = this.exportMapper.initializeGetDepartment(request.departmentId);
        const departmentGetRepoResponse = await this.departmentRepository.getDepartments(getDepartmentRepoRequest);

        if(departmentGetRepoResponse.data.responseList.length) {
          departmentData = departmentGetRepoResponse.data.responseList[0];
        }
        else {
          const error = new CustomError({
            code: ErrorCodesEnum.NOT_FOUND,
            message: `Department with id ${request.departmentId} not exist`
          });

          this.logger.error(error);
          throw error;
        }
      }

      if(request.commissionId) {
        const getCommissionRepoRequest = this.exportMapper.initializeGetCommission(request.commissionId);
        const commissionGetRepoResponse = await this.commissionRepository.getCommissions(getCommissionRepoRequest);

        if(commissionGetRepoResponse.data.responseList.length) {
          commissionData = commissionGetRepoResponse.data.responseList[0];
        }
        else {
          const error = new CustomError({
            code: ErrorCodesEnum.NOT_FOUND,
            message: `Commission with id ${request.commissionId} not exist`
          });

          this.logger.error(error);
          throw error;
        }
      }

      //get teacher list
      const teachersList = await this.getTeacherList(request);
      const teacherIds = teachersList.map(teacher => teacher.id);

      if(!teachersList.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: 'No teachers found for this filter'});
        this.logger.error(error);
        throw error;
      }

      //Variables with data for export
      let teacherData: Array<TeacherDbModel> = [];
      let honorData: Array<HonorDbModel> = [];
      let rebukeData: Array<RebukeDbModel> = [];
      let internshipData: Array<InternshipDbModel> = [];
      let publicationData: Array<PublicationDbModel> = [];
      let attestationData: Array<AttestationDbModel> = [];

      //Get data for export
      const isSelectTeacherPersonalInfo = request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO);
      const isSelectTeacherProfessionalInfo = request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO);
      if(isSelectTeacherPersonalInfo || isSelectTeacherProfessionalInfo) {
        const getTeacherInfo = this.exportMapper.initializeGetTeacherDataRepoRequest(
          teacherIds,
          isSelectTeacherPersonalInfo,
          isSelectTeacherProfessionalInfo
        );

        const {data} = await this.teacherRepository.getTeachers(getTeacherInfo);
        teacherData = data.responseList;
      }

      if(request.select.includes(ExportSelectEnum.HONORS)) {
        const getHonorInfo = this.exportMapper.initializeGetHonorDataRepoRequest(teacherIds, request.from, request.to);
        const {data} = await this.honorRepository.getHonors(getHonorInfo);
        honorData = data.responseList;
      }

      if(request.select.includes(ExportSelectEnum.REBUKES)) {
        const getRebukeInfo = this.exportMapper.initializeGetRebukeDataRepoRequest(teacherIds, request.from, request.to);
        const {data} = await this.rebukeRepository.getRebukes(getRebukeInfo);
        rebukeData = data.responseList;
      }

      if(request.select.includes(ExportSelectEnum.INTERNSHIPS)) {
        const getInternshipInfo = this.exportMapper.initializeGetInternshipDataRepoRequest(teacherIds, request.from, request.to);
        const {data} = await this.internshipRepository.getInternships(getInternshipInfo);
        internshipData = data.responseList;
      }

      if(request.select.includes(ExportSelectEnum.PUBLICATIONS)) {
        const getPublicationInfo = this.exportMapper.initializeGetPublicationDataRepoRequest(teacherIds, request.from, request.to);
        const {data} = await this.publicationRepository.getPublications(getPublicationInfo);
        publicationData = data.responseList;
      }

      if(request.select.includes(ExportSelectEnum.ATTESTATIONS)) {
        const getAttestationInfo = this.exportMapper.initializeGetAttestationDataRepoRequest(teacherIds, request.from, request.to);
        const {data} = await this.attestationRepository.getAttestations(getAttestationInfo);
        attestationData = data.responseList;
      }

      //create export excel file
      const url = await this.createFile(teachersList, {
        attestationData, honorData, internshipData,
        publicationData, rebukeData, teacherData,
        departmentData, commissionData
      }, request);

      return {url};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  private async getTeacherList(request: ExportRequest): Promise<Array<TeacherDbModel>> {
    //get list of teacher according to filter
    let teacherList: Array<TeacherDbModel> = [];

    if(request.commissionId) {
      const teacherByCommissionListRepoRequest = this.exportMapper.initializeGetTeacherListByCommission(request.commissionId);
      const {data: teacherByCommissionData} = await this.teacherRepository.getTeachers(teacherByCommissionListRepoRequest);
      teacherList = teacherByCommissionData.responseList;
    }
    else if(request.departmentId) {
      const teacherByDepartmentListRepoRequest = this.exportMapper.initializeGetTeacherListByDepartment(request.departmentId);
      const {data: teacherByDepartmentData} = await this.teacherRepository.getTeachers(teacherByDepartmentListRepoRequest);
      teacherList = teacherByDepartmentData.responseList;
    }
    else if(request.teacherIds) {
      const teacherByIdsListRepoRequest = this.exportMapper.initializeGetTeacherListByIds(request.teacherIds);
      const {data: teacherByIdsData} = await this.teacherRepository.getTeachers(teacherByIdsListRepoRequest);
      teacherList = teacherByIdsData.responseList;
    }

    return teacherList;
  }

  private async createFile(teacherList: Array<TeacherDbModel>, data: ExportDataInterface, request: ExportRequest):
    Promise<string> {
    const workbook = new Workbook();

    let headerText = 'Report for teachers ';

    if(request.departmentId) {
      headerText += `from department ${data.departmentData.name}`;
    }
    else if(request.commissionId) {
      headerText += `from commission ${data.commissionData.name}`;
    }
    else {
      headerText += 'from teacher list';
    }

    if(request.from || request.to){
      headerText += `for period from ${request.from.toLocaleDateString() || new Date(0).toLocaleDateString()} `;
      headerText += `to ${request.to.toLocaleDateString() || new Date().toLocaleDateString()}`;
    }

    const template = await workbook.xlsx.readFile('./templates/report-template.xlsx');

    if(request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO)
      && request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO)) {
      template.getWorksheet(1).getRow(1).getCell(1).value = headerText;
      template.removeWorksheet(2);
      template.removeWorksheet(3);
    }
    else if (request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO)) {
      template.getWorksheet(2).getRow(1).getCell(1).value = headerText;
      template.removeWorksheet(1);
      template.removeWorksheet(3);
    }
    else if (request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO)) {
      template.getWorksheet(3).getRow(1).getCell(1).value = headerText;
      template.removeWorksheet(1);
      template.removeWorksheet(2);
    }

    if(request.select.includes(ExportSelectEnum.INTERNSHIPS)) {
      template.getWorksheet(4).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(4);
    }

    if(request.select.includes(ExportSelectEnum.ATTESTATIONS)) {
      template.getWorksheet(5).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(5);
    }

    if(request.select.includes(ExportSelectEnum.PUBLICATIONS)) {
      template.getWorksheet(6).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(6);
    }

    if(request.select.includes(ExportSelectEnum.HONORS)) {
      template.getWorksheet(7).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(7);
    }

    if(request.select.includes(ExportSelectEnum.REBUKES)) {
      template.getWorksheet(8).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(8);
    }

    const date = new Date();
    const hash = `${date.toLocaleDateString()}_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
    if(request.type === ExportTypeEnum.EXCEL) {
      await workbook.xlsx.writeFile(`./static/reports/Report-teacher-${hash}.xlsx`);
    }
    else {
      await workbook.csv.writeFile(`./static/reports/Report-teacher-${hash}.csv`);
    }

    return '';
  }
}
