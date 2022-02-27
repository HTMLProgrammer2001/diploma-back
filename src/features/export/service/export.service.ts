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
import {CommissionDbModel} from '../../../data-layer/db-models/commission.db-model';
import {DepartmentDbModel} from '../../../data-layer/db-models/department.db-model';
import {FileServiceInterface} from '../../../global/services/file-service/file-service.interface';
import {FillerFactory} from '../fillers/filler-factory';
import {WorksheetEnum} from '../types/common/worksheet.enum';

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
    private fileService: FileServiceInterface,
    private fillerFactory: FillerFactory,
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

      if(!teacherIds.length) {
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
      const url = await this.createFile({
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

  private async createFile(data: ExportDataInterface, request: ExportRequest):
    Promise<string> {
    let workbook = new Workbook();
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

    let template = await workbook.xlsx.readFile('./templates/report-template.xlsx');
    template = await this.fillWorkbookData(template, data, request);
    template = await this.formatWorkbookTemplate(template, data, request, headerText);

    return await this.fileService.saveReport(template, request.type);
  }

  async formatWorkbookTemplate(template: Workbook, data: ExportDataInterface, request: ExportRequest, headerText: string):
    Promise<Workbook> {
    if(request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO)
      && request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO)) {
      template.getWorksheet(WorksheetEnum.TEACHER_PERSONAL_AND_PROFESSIONAL).getRow(1).getCell(1).value = headerText;
      template.removeWorksheet(WorksheetEnum.TEACHER_PERSONAL);
      template.removeWorksheet(WorksheetEnum.TEACHER_PROFESSIONAL);
    }
    else if (request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO)) {
      template.getWorksheet(WorksheetEnum.TEACHER_PROFESSIONAL).getRow(1).getCell(1).value = headerText;
      template.removeWorksheet(WorksheetEnum.TEACHER_PERSONAL_AND_PROFESSIONAL);
      template.removeWorksheet(WorksheetEnum.TEACHER_PERSONAL);
    }
    else if (request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO)) {
      template.getWorksheet(WorksheetEnum.TEACHER_PERSONAL).getRow(1).getCell(1).value = headerText;
      template.removeWorksheet(WorksheetEnum.TEACHER_PERSONAL_AND_PROFESSIONAL);
      template.removeWorksheet(WorksheetEnum.TEACHER_PROFESSIONAL);
    }
    else {
      template.removeWorksheet(WorksheetEnum.TEACHER_PERSONAL_AND_PROFESSIONAL);
      template.removeWorksheet(WorksheetEnum.TEACHER_PROFESSIONAL);
      template.removeWorksheet(WorksheetEnum.TEACHER_PERSONAL);
    }

    if(request.select.includes(ExportSelectEnum.INTERNSHIPS)) {
      template.getWorksheet(WorksheetEnum.INTERNSHIP).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(WorksheetEnum.INTERNSHIP);
    }

    if(request.select.includes(ExportSelectEnum.ATTESTATIONS)) {
      template.getWorksheet(WorksheetEnum.ATTESTATION).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(WorksheetEnum.ATTESTATION);
    }

    if(request.select.includes(ExportSelectEnum.PUBLICATIONS)) {
      template.getWorksheet(WorksheetEnum.PUBLICATION).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(WorksheetEnum.PUBLICATION);
    }

    if(request.select.includes(ExportSelectEnum.HONORS)) {
      template.getWorksheet(WorksheetEnum.HONOR).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(WorksheetEnum.HONOR);
    }

    if(request.select.includes(ExportSelectEnum.REBUKES)) {
      template.getWorksheet(WorksheetEnum.REBUKE).getRow(1).getCell(1).value = headerText;
    }
    else {
      template.removeWorksheet(WorksheetEnum.REBUKE);
    }

    return template;
  }

  async fillWorkbookData(workbook: Workbook, data: ExportDataInterface, request: ExportRequest):
    Promise<Workbook> {
    if(request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO)
        || request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO)) {
      await this.fillerFactory.getTeacherInfoFiller(
        request.select.includes(ExportSelectEnum.TEACHER_PERSONAL_INFO),
        request.select.includes(ExportSelectEnum.TEACHER_PROFESSIONAL_INFO)
      ).fill(workbook, data);
    }

    if(request.select.includes(ExportSelectEnum.INTERNSHIPS)) {
      await this.fillerFactory.getInternshipFiller().fill(workbook, data);
    }

    if(request.select.includes(ExportSelectEnum.ATTESTATIONS)) {
      await this.fillerFactory.getAttestationFiller().fill(workbook, data);
    }

    if(request.select.includes(ExportSelectEnum.REBUKES)) {
      await this.fillerFactory.getRebukeFiller().fill(workbook, data);
    }

    if(request.select.includes(ExportSelectEnum.HONORS)) {
      await this.fillerFactory.getHonorFiller().fill(workbook, data);
    }

    if(request.select.includes(ExportSelectEnum.PUBLICATIONS)) {
      await this.fillerFactory.getPublicationFiller().fill(workbook, data);
    }

    return workbook;
  }
}
