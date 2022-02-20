import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {RefreshTokenGetRepoResponse} from './repo-response/refresh-token-get.repo-response';
import {RefreshTokenCreateRepoRequest} from './repo-request/refresh-token-create.repo-request';
import {RefreshTokenDeleteRepoRequest} from './repo-request/refresh-token-delete.repo-request';
import {RefreshTokenUpdateRepoRequest} from './repo-request/refresh-token-update.repo-request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {RefreshTokenDbModel} from '../../db-models/refresh-token-db.model';
import {RefreshTokenGetRepoRequest} from './repo-request/refresh-token-get-repo.request';

@Injectable()
export class RefreshTokenRepository {
  private logger: Logger;

  constructor(
    @InjectModel(RefreshTokenDbModel)
    private refreshTokenDbModel: typeof RefreshTokenDbModel,
  ) {
    this.logger = new Logger(RefreshTokenRepository.name);
  }

  async getRefreshToken(repoRequest: RefreshTokenGetRepoRequest): Promise<RefreshTokenGetRepoResponse> {
    try {
      const token = await this.refreshTokenDbModel.findOne({where: {sessionCode: repoRequest.sessionCode},});
      return {data: token};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({
          code: ErrorCodesEnum.DATABASE,
          message: e.message,
        });
      }

      throw e;
    }
  }

  async createRefreshToken(repoRequest: RefreshTokenCreateRepoRequest): Promise<void> {
    try {
      await this.refreshTokenDbModel.create({
        sessionCode: repoRequest.sessionCode,
        userId: repoRequest.userId,
        expirationTime: repoRequest.expirationTime
      });
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({
          code: ErrorCodesEnum.DATABASE,
          message: e.message,
        });
      }

      throw e;
    }
  }

  async updateRefreshToken(repoRequest: RefreshTokenUpdateRepoRequest): Promise<void> {
    try {
      await this.refreshTokenDbModel.update(
        {
          sessionCode: repoRequest.newSessionCode,
          expirationTime: repoRequest.expirationTime,
          creationTime: new Date().toISOString()
        },
        {where: {sessionCode: repoRequest.currentSessionCode}},
      );
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({
          code: ErrorCodesEnum.DATABASE,
          message: e.message,
        });
      }

      throw e;
    }
  }

  async deleteRefreshToken(repoRequest: RefreshTokenDeleteRepoRequest): Promise<void> {
    try {
      await this.refreshTokenDbModel.destroy({where: {sessionCode: repoRequest.sessionCode}});
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({
          code: ErrorCodesEnum.DATABASE,
          message: e.message,
        });
      }

      throw e;
    }
  }
}
