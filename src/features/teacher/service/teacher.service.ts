import {Injectable} from '@nestjs/common';
import {TeacherMapper} from '../mapper/teacher.mapper';
import {TeacherGetListRequest} from '../types/request/teacher-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeacherResponse} from '../types/response/teacher.response';
import {TeacherGetByIdRequest} from '../types/request/teacher-get-by-id.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {TeacherCreateRequest} from '../types/request/teacher-create.request';
import {createWriteStream} from 'fs';
import {randomUUID} from 'crypto';

@Injectable()
export class TeacherService {
  constructor(
    private teacherRepository: TeacherRepository,
    private teacherMapper: TeacherMapper,
  ) {}

  async getTeacherList(request: TeacherGetListRequest): Promise<IPaginator<TeacherResponse>> {
    const repoRequest = this.teacherMapper.getTeacherListRequestToRepoRequest(request);
    const {data} = await this.teacherRepository.getTeachers(repoRequest);
    return this.teacherMapper.teacherPaginatorDbModelToResponse(data);
  }

  async getTeacherById(request: TeacherGetByIdRequest): Promise<TeacherResponse> {
    const repoRequest = this.teacherMapper.getTeacherByIdRequestToRepoRequest(request);
    const {data} = await this.teacherRepository.getTeachers(repoRequest);

    if (data.responseList?.length) {
      return this.teacherMapper.teacherDbModelToResponse(data.responseList[0]);
    } else {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teacher with id ${request.id} not exist`});
    }
  }

  async createTeacher(request: TeacherCreateRequest): Promise<TeacherResponse> {
    const {createReadStream, filename, mimetype} = await request.avatar;

    if(!mimetype.includes('image')) {
      throw new CustomError({
        code: ErrorCodesEnum.VALIDATION,
        message: 'Avatar must be image'
      });
    }
    else {
      const newFileName = `${randomUUID()}.${filename.split('.').pop()}`;
      await createReadStream().pipe(createWriteStream(`./static/avatars/${newFileName}`));
      const createRepoRequest = this.teacherMapper.createTeacherRequestToRepoRequest(request, newFileName);
      const {createdID} = await this.teacherRepository.createTeacher(createRepoRequest);

      const repoRequest = this.teacherMapper.getTeacherByIdRequestToRepoRequest({
        select: request.select,
        id: createdID
      });
      const {data} = await this.teacherRepository.getTeachers(repoRequest);
      return this.teacherMapper.teacherDbModelToResponse(data.responseList[0]);
    }
  }
}
