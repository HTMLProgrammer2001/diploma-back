import {Injectable, Logger} from '@nestjs/common';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {ProfileMapper} from '../mapper/profile.mapper';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {RequestContext} from '../../../global/services/request-context';
import {GetProfileRequest} from '../types/request/get-profile.request';
import {ProfileResponse} from '../types/response/profile.response';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';
import {EditProfileRequest} from '../types/request/edit-profile.request';
import {FileServiceInterface} from '../../../global/services/file-service/file-service.interface';

@Injectable()
export class ProfileService {
  private logger: Logger;

  constructor(
    private fileService: FileServiceInterface,
    private userRepository: UserRepository,
    private profileMapper: ProfileMapper,
    private requestContext: RequestContext,
  ) {
    this.logger = new Logger(ProfileService.name);
  }

  async getProfile(request: GetProfileRequest): Promise<ProfileResponse> {
    try {
      const repoRequest = this.profileMapper.getProfileRepoRequest(this.requestContext.getUserId(), request.select);
      const {data} = await this.userRepository.getUsers(repoRequest);

      if (data.responseList?.length) {
        return this.profileMapper.profileDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `User with id ${this.requestContext.getUserId()} not exist`
        });

        this.logger.error(error);
        throw error;
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateProfile(request: EditProfileRequest): Promise<ProfileResponse> {
    try {
      const getCurrentUserRepoRequest = this.profileMapper.initializeGetProfileRepoRequest(
        this.requestContext.getUserId(),
        [UserSelectFieldsEnum.GUID, UserSelectFieldsEnum.IS_DELETED]
      );

      const currentUser = await this.userRepository.getUsers(getCurrentUserRepoRequest);

      if (!currentUser.data.responseList?.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `User with id ${this.requestContext.getUserId()} not exist`
        });

        this.logger.error(error);
        throw error;
      } else if (currentUser.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `User with id ${this.requestContext.getUserId()} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentUser.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'User guid was changed'});
        this.logger.error(error);
        throw error;
      }

      let avatarUrl: string = null;
      if (request.avatar) {
        const avatar = await request.avatar;
        avatarUrl = await this.fileService.uploadAvatar(avatar);
      }

      const updateRepoRequest = this.profileMapper.updateProfileRequestToRepoRequest(
        this.requestContext.getUserId(),
        request,
        avatarUrl
      );

      const {updatedID} = await this.userRepository.updateUser(updateRepoRequest);

      const repoRequest = this.profileMapper.initializeGetProfileRepoRequest(updatedID, request.select);
      const {data} = await this.userRepository.getUsers(repoRequest);
      return this.profileMapper.profileDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteProfile(guid: string): Promise<IdResponse> {
    try {
      const getCurrentProfileRepoRequest = this.profileMapper.initializeGetProfileRepoRequest(
        this.requestContext.getUserId(),
        [UserSelectFieldsEnum.GUID, UserSelectFieldsEnum.IS_DELETED]
      );

      const currentProfile = await this.userRepository.getUsers(getCurrentProfileRepoRequest);

      if (!currentProfile.data.responseList?.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `User with id ${this.requestContext.getUserId()} not exist`
        });

        this.logger.error(error);
        throw error;
      } else if (currentProfile.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `User with id ${this.requestContext.getUserId()} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentProfile.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `User guid was changed`});
        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.profileMapper.deleteProfileRequestToRepoRequest(this.requestContext.getUserId());
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
}
