import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {UserMapper} from '../mapper/user.mapper';
import {UserGetListRequest} from '../types/request/user-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {UserResponse} from '../types/response/user.response';
import {UserGetByIdRequest} from '../types/request/user-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {UserCreateRequest} from '../types/request/user-create.request';
import {FileServiceInterface} from '../../../global/services/file-service/file-service.interface';
import {IdResponse} from '../../../global/types/response/id.response';
import {UserUpdateRequest} from '../types/request/user-update.request';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';

@Injectable()
export class UserService {
  private logger: Logger;

  constructor(
    private fileService: FileServiceInterface,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private userMapper: UserMapper,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async getUserList(request: UserGetListRequest): Promise<IPaginator<UserResponse>> {
    try {
      const repoRequest = this.userMapper.getUserListRequestToRepoRequest(request);
      const {data} = await this.userRepository.getUsers(repoRequest);
      return this.userMapper.userPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getUserById(request: UserGetByIdRequest): Promise<UserResponse> {
    try {
      const repoRequest = this.userMapper.getUserByIdRequestToRepoRequest(request);
      const {data} = await this.userRepository.getUsers(repoRequest);

      if (data.responseList?.length) {
        return this.userMapper.userDbModelToResponse(data.responseList[0]);
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

  async createUser(request: UserCreateRequest): Promise<UserResponse> {
    try {
      await this.validateRequest(request);

      let avatarUrl: string = null;
      if (request.avatar) {
        const avatar = await request.avatar;
        avatarUrl = await this.fileService.uploadAvatar(avatar);
      }

      const createRepoRequest = this.userMapper.createUserRequestToRepoRequest(request, avatarUrl);
      const {createdID} = await this.userRepository.createUser(createRepoRequest);

      const repoRequest = this.userMapper.initializeGetUserByIdRepoRequest(createdID, request.select);
      const {data} = await this.userRepository.getUsers(repoRequest);
      return this.userMapper.userDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateUser(request: UserUpdateRequest): Promise<UserResponse> {
    try {
      const getCurrentUserRepoRequest = this.userMapper.initializeGetUserByIdRepoRequest(
        request.id,
        [UserSelectFieldsEnum.GUID, UserSelectFieldsEnum.IS_DELETED]
      );
      const currentUser = await this.userRepository.getUsers(getCurrentUserRepoRequest);

      if (!currentUser.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `User with id ${request.id} not exist`});
      } else if (currentUser.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `User with id ${request.id} is deleted`
        });
      } else if (currentUser.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'User guid was changed'});
      }

      await this.validateRequest(request);

      let avatarUrl: string = undefined;
      if (request.avatar) {
        const avatar = await request.avatar;
        avatarUrl = await this.fileService.uploadAvatar(avatar);
      }

      const updateRepoRequest = this.userMapper.updateUserRequestToRepoRequest(request, avatarUrl);
      const {updatedID} = await this.userRepository.updateUser(updateRepoRequest);

      const repoRequest = this.userMapper.initializeGetUserByIdRepoRequest(updatedID, request.select);
      const {data} = await this.userRepository.getUsers(repoRequest);
      return this.userMapper.userDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteUser(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentUserRepoRequest = this.userMapper.initializeGetUserByIdRepoRequest(
        id,
        [UserSelectFieldsEnum.GUID, UserSelectFieldsEnum.IS_DELETED]
      );
      const currentUser = await this.userRepository.getUsers(getCurrentUserRepoRequest);

      if (!currentUser.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `User with id ${id} not exist`});
      } else if (currentUser.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `User with id ${id} already deleted`
        });
      } else if (currentUser.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `User guid was changed`});
      }

      const deleteRepoRequest = this.userMapper.deleteUserRequestToRepoRequest(id);
      const {deletedID} = await this.userRepository.deleteUser(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: UserCreateRequest) {
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
      const getTeacherByEmailRepoRequest = this.userMapper.initializeGetUserByEmailRepoRequest(request.email);
      const {data: teacherByEmailData} = await this.userRepository.getUsers(getTeacherByEmailRepoRequest);

      if (teacherByEmailData.responseList.length && teacherByEmailData.responseList[0].id !== (request as any).id) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `User with email ${request.email} already exist`
        });
      }
    }

    //validate unique phone
    if (!isNil(request.phone)) {
      const getTeacherByPhoneRepoRequest = this.userMapper.initializeGetUserByPhoneRepoRequest(request.phone);
      const {data: teacherByPhoneData} = await this.userRepository.getUsers(getTeacherByPhoneRepoRequest);

      if (teacherByPhoneData.responseList.length && teacherByPhoneData.responseList[0].id !== (request as any).id) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `User with phone ${request.phone} already exist`
        });
      }
    }

    //validate role
    if (!isNil(request.roleId)) {
      const getRoleRepoRequest = this.userMapper.initializeGetRoleRepoRequest(request.roleId);
      const {data: roleData} = await this.roleRepository.getRoles(getRoleRepoRequest);

      if (!roleData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Role with id ${request.roleId} not found`
        });
      }
    }
  }
}
