import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {TeacherMapper} from '../mapper/teacher.mapper';
import {TeacherGetListRequest} from '../types/request/teacher-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {TeacherResponse} from '../types/response/teacher.response';
import {TeacherGetByIdRequest} from '../types/request/teacher-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {TeacherCreateRequest} from '../types/request/teacher-create.request';
import {CommissionRepository} from '../../../data-layer/repositories/commission/commission.repository';
import {DepartmentRepository} from '../../../data-layer/repositories/department/department.repository';
import {TeachingRankRepository} from '../../../data-layer/repositories/teaching-rank/teaching-rank.repository';
import {AcademicDegreeRepository} from '../../../data-layer/repositories/academic-degree/academic-degree.repository';
import {AcademicTitleRepository} from '../../../data-layer/repositories/academic-title/academic-title.repository';
import {FileServiceInterface} from '../../../global/services/file-service/file-service.interface';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {TeacherUpdateRequest} from '../types/request/teacher-update.request';

@Injectable()
export class TeacherService {
  private logger: Logger;

  constructor(
    private fileService: FileServiceInterface,
    private teacherRepository: TeacherRepository,
    private commissionRepository: CommissionRepository,
    private departmentRepository: DepartmentRepository,
    private teacherRankRepository: TeachingRankRepository,
    private academicDegreeRepository: AcademicDegreeRepository,
    private academicTitleRepository: AcademicTitleRepository,
    private teacherMapper: TeacherMapper,
  ) {
    this.logger = new Logger(TeacherService.name);
  }

  async getTeacherList(request: TeacherGetListRequest): Promise<IPaginator<TeacherResponse>> {
    try {
      const repoRequest = this.teacherMapper.getTeacherListRequestToRepoRequest(request);
      const {data} = await this.teacherRepository.getTeachers(repoRequest);
      return this.teacherMapper.teacherPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getTeacherById(request: TeacherGetByIdRequest): Promise<TeacherResponse> {
    try {
      const repoRequest = this.teacherMapper.getTeacherByIdRequestToRepoRequest(request);
      const {data} = await this.teacherRepository.getTeachers(repoRequest);

      if (data.responseList?.length) {
        return this.teacherMapper.teacherDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teacher with id ${request.id} not exist`});
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createTeacher(request: TeacherCreateRequest): Promise<TeacherResponse> {
    try {
      await this.validateRequest(request);

      let avatarUrl: string = null;
      if (request.avatar) {
        const avatar = await request.avatar;
        avatarUrl = await this.fileService.uploadAvatar(avatar);
      }

      const createRepoRequest = this.teacherMapper.createTeacherRequestToRepoRequest(request, avatarUrl);
      const {createdID} = await this.teacherRepository.createTeacher(createRepoRequest);

      const repoRequest = this.teacherMapper.initializeGetTeacherByIdRepoRequest(createdID, request.select);
      const {data} = await this.teacherRepository.getTeachers(repoRequest);
      return this.teacherMapper.teacherDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateTeacher(request: TeacherUpdateRequest): Promise<TeacherResponse> {
    try {
      const getCurrentTeacherRepoRequest = this.teacherMapper.initializeGetTeacherByIdRepoRequest(
        request.id,
        [TeacherSelectFieldsEnum.GUID, TeacherSelectFieldsEnum.IS_DELETED]
      );
      const currentTeacher = await this.teacherRepository.getTeachers(getCurrentTeacherRepoRequest);

      if (!currentTeacher.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teacher with id ${request.id} not exist`});
      } else if (currentTeacher.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teacher with id ${request.id} is deleted`
        });
      } else if (currentTeacher.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Teacher guid was changed'});
      }

      await this.validateRequest(request);

      let avatarUrl: string = undefined;
      if (request.avatar) {
        const avatar = await request.avatar;
        avatarUrl = await this.fileService.uploadAvatar(avatar);
      }

      const updateRepoRequest = this.teacherMapper.updateTeacherRequestToRepoRequest(request, avatarUrl);
      const {updatedID} = await this.teacherRepository.updateTeacher(updateRepoRequest);

      const repoRequest = this.teacherMapper.initializeGetTeacherByIdRepoRequest(updatedID, request.select);
      const {data} = await this.teacherRepository.getTeachers(repoRequest);
      return this.teacherMapper.teacherDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteTeacher(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentTeacherRepoRequest = this.teacherMapper.initializeGetTeacherByIdRepoRequest(
        id,
        [TeacherSelectFieldsEnum.GUID, TeacherSelectFieldsEnum.IS_DELETED]
      );
      const currentTeacher = await this.teacherRepository.getTeachers(getCurrentTeacherRepoRequest);

      if (!currentTeacher.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teacher with id ${id} not exist`});
      } else if (currentTeacher.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teacher with id ${id} already deleted`
        });
      } else if (currentTeacher.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Teacher guid was changed`});
      }

      const deleteRepoRequest = this.teacherMapper.deleteTeacherRequestToRepoRequest(id);
      const {deletedID} = await this.teacherRepository.deleteTeacher(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: TeacherCreateRequest) {
    //validate avatar
    if (!isNil(request.avatar)) {
      const {mimetype} = await request.avatar;

      if (!mimetype.includes('image')) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: 'Avatar must be image'
        });
      }
    }

    //validate unique email
    if (!isNil(request.email)) {
      const getTeacherByEmailRepoRequest = this.teacherMapper.initializeGetTeacherByEmailRepoRequest(request.email);
      const {data: teacherByEmailData} = await this.teacherRepository.getTeachers(getTeacherByEmailRepoRequest);

      if (teacherByEmailData.responseList.length && teacherByEmailData.responseList[0].id !== (request as any).id) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `Teacher with email ${request.email} already exist`
        });
      }
    }

    //validate unique phone
    if (!isNil(request.phone)) {
      const getTeacherByPhoneRepoRequest = this.teacherMapper.initializeGetTeacherByPhoneRepoRequest(request.phone);
      const {data: teacherByPhoneData} = await this.teacherRepository.getTeachers(getTeacherByPhoneRepoRequest);

      if (teacherByPhoneData.responseList.length && teacherByPhoneData.responseList[0].id !== (request as any).id) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `Teacher with phone ${request.phone} already exist`
        });
      }
    }

    //validate commission
    if (!isNil(request.commissionId)) {
      const getCommissionRepoRequest = this.teacherMapper.initializeGetCommissionRepoRequest(request.commissionId);
      const {data: commissionData} = await this.commissionRepository.getCommissions(getCommissionRepoRequest);

      if (!commissionData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Commission with id ${request.commissionId} not found`
        });
      }

      if (commissionData.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Commission with id ${request.commissionId} is deleted`
        });
      }
    }

    //validate department
    if (!isNil(request.departmentId)) {
      const getDepartmentRepoRequest = this.teacherMapper.initializeGetDepartmentRepoRequest(request.departmentId);
      const {data: departmentData} = await this.departmentRepository.getDepartments(getDepartmentRepoRequest);

      if (!departmentData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Department with id ${request.departmentId} not found`
        });
      }

      if (departmentData.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Department with id ${request.departmentId} is deleted`
        });
      }
    }

    //validate teacher rank
    if (!isNil(request.teacherRankId)) {
      const getTeacherRankRepoRequest = this.teacherMapper.initializeGetTeacherRankRepoRequest(request.teacherRankId);
      const {data: teacherRankData} = await this.teacherRankRepository.getTeachingRanks(getTeacherRankRepoRequest);

      if (!teacherRankData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teacher rank with id ${request.teacherRankId} not found`
        });
      }

      if (teacherRankData.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teacher rank with id ${request.teacherRankId} is deleted`
        });
      }
    }

    //validate academic degree
    if (!isNil(request.academicDegreeId)) {
      const getAcademicDegreeRepoRequest = this.teacherMapper.initializeGetAcademicDegreeRepoRequest(request.academicDegreeId);
      const {data: academicDegreeData} = await this.academicDegreeRepository.getAcademicDegree(getAcademicDegreeRepoRequest);

      if (!academicDegreeData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Academic degree with id ${request.academicDegreeId} not found`
        });
      }

      if (academicDegreeData.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Academic degree with id ${request.academicDegreeId} is deleted`
        });
      }
    }

    //validate academic title
    if (!isNil(request.academicTitleId)) {
      const getAcademicTitleRepoRequest = this.teacherMapper.initializeGetAcademicTitleRepoRequest(request.academicTitleId);
      const {data: academicTitleData} = await this.academicTitleRepository.getAcademicTitle(getAcademicTitleRepoRequest);

      if (!academicTitleData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Academic title with id ${request.academicDegreeId} not found`
        });
      }

      if (academicTitleData.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Academic title with id ${request.academicDegreeId} is deleted`
        });
      }
    }
  }
}
