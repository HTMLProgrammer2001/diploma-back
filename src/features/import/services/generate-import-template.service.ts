import {Injectable, Logger} from '@nestjs/common';
import {GenerateImportTemplateRequest} from '../types/request/generate-import-template.request';
import {GenerateImportTemplateResponse} from '../types/response/generate-import-template.response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {ImportDataTypeEnum} from '../types/common/import-data-type.enum';
import {Workbook} from 'exceljs';
import {ImportMapper} from '../mapper/import.mapper';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';
import {FileServiceInterface} from '../../../global/services/file-service/file-service.interface';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {EducationQualificationRepository} from '../../../data-layer/repositories/education-qualification/education-qualification.repository';
import {CategoryRepository} from '../../../data-layer/repositories/category/category.repository';
import {DepartmentRepository} from '../../../data-layer/repositories/department/department.repository';
import {CommissionRepository} from '../../../data-layer/repositories/commission/commission.repository';
import {TeachingRankRepository} from '../../../data-layer/repositories/teaching-rank/teaching-rank.repository';
import {AcademicTitleRepository} from '../../../data-layer/repositories/academic-title/academic-title.repository';
import {AcademicDegreeRepository} from '../../../data-layer/repositories/academic-degree/academic-degree.repository';

@Injectable()
export class GenerateImportTemplateService {
  static DATA_LIST_PAGE = 2;

  private logger: Logger;

  constructor(
    private fileService: FileServiceInterface,
    private importMapper: ImportMapper,
    private roleRepository: RoleRepository,
    private teacherRepository: TeacherRepository,
    private educationQualificationRepository: EducationQualificationRepository,
    private categoryRepository: CategoryRepository,
    private departmentRepository: DepartmentRepository,
    private commissionRepository: CommissionRepository,
    private teachingRankRepository: TeachingRankRepository,
    private academicTitleRepository: AcademicTitleRepository,
    private academicDegreeRepository: AcademicDegreeRepository,
  ) {
    this.logger = new Logger(GenerateImportTemplateService.name);
  }

  async generateImportTemplate(request: GenerateImportTemplateRequest): Promise<GenerateImportTemplateResponse> {
    try {
      let workbook: Workbook;

      switch (request.type) {
        case ImportDataTypeEnum.USER:
          workbook = await this.generateImportUserTemplate();
          break;
        case ImportDataTypeEnum.HONOR:
          workbook = await this.generateImportHonorTemplate();
          break;
        case ImportDataTypeEnum.REBUKE:
          workbook = await this.generateImportRebukeTemplate();
          break;
        case ImportDataTypeEnum.EDUCATION:
          workbook = await this.generateImportEducationTemplate();
          break;
        case ImportDataTypeEnum.INTERNSHIP:
          workbook = await this.generateImportInternshipTemplate();
          break;
        case ImportDataTypeEnum.ATTESTATION:
          workbook = await this.generateImportAttestationTemplate();
          break;
        case ImportDataTypeEnum.TEACHER:
          workbook = await this.generateImportTeacherTemplate();
          break;
        case ImportDataTypeEnum.PUBLICATION:
          workbook = await this.generateImportPublicationTemplate();
          break;
        default:
          throw new CustomError({code: ErrorCodesEnum.VALIDATION, message: 'Invalid type'});
      }

      const url = await this.fileService.saveImportTemplate(workbook, request.type);
      return {url};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportUserTemplate(): Promise<Workbook> {
    try {
    const workbook = new Workbook();
    const template = await workbook.xlsx.readFile('./templates/import-user-template.xlsx');
    const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

    const getAllRolesRepoRequest = this.importMapper.initializeGetAllRolesRepoRequest();
    const rolesRepoResponse = await this.roleRepository.getRoles(getAllRolesRepoRequest);

    for(let i = 0; i < rolesRepoResponse.data.responseList.length; i++) {
      const role = rolesRepoResponse.data.responseList[i];
      worksheet.getRow(i + 1).getCell(1).value = `${role.id} - ${role.name}`;
    }

    return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportHonorTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-honor-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllTeachersRepoRequest = this.importMapper.initializeGetAllTeachersRepoRequest();
      const teachersRepoResponse = await this.teacherRepository.getTeachers(getAllTeachersRepoRequest);

      for(let i = 0; i < teachersRepoResponse.data.responseList.length; i++) {
        const teacher = teachersRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${teacher.id} - ${teacher.fullName}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportRebukeTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-rebuke-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllTeachersRepoRequest = this.importMapper.initializeGetAllTeachersRepoRequest();
      const teachersRepoResponse = await this.teacherRepository.getTeachers(getAllTeachersRepoRequest);

      for(let i = 0; i < teachersRepoResponse.data.responseList.length; i++) {
        const teacher = teachersRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${teacher.id} - ${teacher.fullName}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportEducationTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-education-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllTeachersRepoRequest = this.importMapper.initializeGetAllTeachersRepoRequest();
      const teachersRepoResponse = await this.teacherRepository.getTeachers(getAllTeachersRepoRequest);

      for(let i = 0; i < teachersRepoResponse.data.responseList.length; i++) {
        const teacher = teachersRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${teacher.id} - ${teacher.fullName}`;
      }

      const getAllEducationQualificationsRepoRequest = this.importMapper.initializeGetAllEducationQualificationsRepoRequest();
      const educationQualificationsRepoResponse = await this.educationQualificationRepository
        .getEducationQualification(getAllEducationQualificationsRepoRequest);

      for(let i = 0; i < educationQualificationsRepoResponse.data.responseList.length; i++) {
        const educationQualification = educationQualificationsRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(2).value = `${educationQualification.id} - ${educationQualification.name}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportInternshipTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-internship-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllTeachersRepoRequest = this.importMapper.initializeGetAllTeachersRepoRequest();
      const teachersRepoResponse = await this.teacherRepository.getTeachers(getAllTeachersRepoRequest);

      for(let i = 0; i < teachersRepoResponse.data.responseList.length; i++) {
        const teacher = teachersRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${teacher.id} - ${teacher.fullName}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportAttestationTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-attestation-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllTeachersRepoRequest = this.importMapper.initializeGetAllTeachersRepoRequest();
      const teachersRepoResponse = await this.teacherRepository.getTeachers(getAllTeachersRepoRequest);

      for(let i = 0; i < teachersRepoResponse.data.responseList.length; i++) {
        const teacher = teachersRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${teacher.id} - ${teacher.fullName}`;
      }

      const getAllCategoriesRepoRequest = this.importMapper.initializeGetAllCategoriesRepoRequest();
      const categoriesRepoResponse = await this.categoryRepository.getCategories(getAllCategoriesRepoRequest);

      for(let i = 0; i < categoriesRepoResponse.data.responseList.length; i++) {
        const category = categoriesRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(2).value = `${category.id} - ${category.name}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportTeacherTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-teacher-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllDepartmentsRepoRequest = this.importMapper.initializeGetAllDepartmentsRepoRequest();
      const departmentsRepoResponse = await this.departmentRepository.getDepartments(getAllDepartmentsRepoRequest);

      for(let i = 0; i < departmentsRepoResponse.data.responseList.length; i++) {
        const department = departmentsRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${department.id} - ${department.name}`;
      }

      const getAllCommissionsRepoRequest = this.importMapper.initializeGetAllCommissionsRepoRequest();
      const commissionsRepoResponse = await this.commissionRepository.getCommissions(getAllCommissionsRepoRequest);

      for(let i = 0; i < commissionsRepoResponse.data.responseList.length; i++) {
        const commission = commissionsRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(2).value = `${commission.id} - ${commission.name}`;
      }

      const getAllTeachingRanksRepoRequest = this.importMapper.initializeGetAllTeachingRanksRepoRequest();
      const teachingRanksRepoResponse = await this.teachingRankRepository.getTeachingRanks(getAllTeachingRanksRepoRequest);

      for(let i = 0; i < teachingRanksRepoResponse.data.responseList.length; i++) {
        const teachingRank = teachingRanksRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(3).value = `${teachingRank.id} - ${teachingRank.name}`;
      }

      const getAllAcademicTitlesRepoRequest = this.importMapper.initializeGetAllAcademicTitlesRepoRequest();
      const academicTitlesRepoResponse = await this.academicTitleRepository.getAcademicTitle(getAllAcademicTitlesRepoRequest);

      for(let i = 0; i < academicTitlesRepoResponse.data.responseList.length; i++) {
        const academicTitle = academicTitlesRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(5).value = `${academicTitle.id} - ${academicTitle.name}`;
      }

      const getAllAcademicDegreesRepoRequest = this.importMapper.initializeGetAllAcademicDegreesRepoRequest();
      const academicDegreesRepoResponse = await this.academicDegreeRepository.getAcademicDegree(getAllAcademicDegreesRepoRequest);

      for(let i = 0; i < academicDegreesRepoResponse.data.responseList.length; i++) {
        const academicDegree = academicDegreesRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(4).value = `${academicDegree.id} - ${academicDegree.name}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportPublicationTemplate(): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const template = await workbook.xlsx.readFile('./templates/import-publication-template.xlsx');
      const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

      const getAllTeachersRepoRequest = this.importMapper.initializeGetAllTeachersRepoRequest();
      const teachersRepoResponse = await this.teacherRepository.getTeachers(getAllTeachersRepoRequest);

      for(let i = 0; i < teachersRepoResponse.data.responseList.length; i++) {
        const teacher = teachersRepoResponse.data.responseList[i];
        worksheet.getRow(i + 1).getCell(1).value = `${teacher.id} - ${teacher.fullName}`;
      }

      return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
