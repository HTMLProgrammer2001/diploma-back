import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {TokenGetRepoResponse} from './repo-response/token-get.repo-response';
import {TokenCreateRepoRequest} from './repo-request/token-create.repo-request';
import {TokenDeleteRepoRequest} from './repo-request/token-delete.repo-request';
import {TokenUpdateRepoRequest} from './repo-request/token-update.repo-request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {TokenDbModel} from '../../db-models/token.db-model';
import {TokenGetRepoRequest} from './repo-request/token-get-repo.request';

@Injectable()
export class TokenRepository {
  private logger: Logger;

  constructor(@InjectModel(TokenDbModel) private tokenDbModel: typeof TokenDbModel) {
    this.logger = new Logger(TokenRepository.name);
  }

  async getToken(repoRequest: TokenGetRepoRequest): Promise<TokenGetRepoResponse> {
    try {
      const token = await this.tokenDbModel.findOne({where: {token: repoRequest.token}});
      return {data: token};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async createToken(repoRequest: TokenCreateRepoRequest): Promise<void> {
    try {
      await this.tokenDbModel.create({token: repoRequest.token, userId: repoRequest.userId});
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateToken(repoRequest: TokenUpdateRepoRequest): Promise<void> {
    try {
      await this.tokenDbModel.update({token: repoRequest.newToken}, {where: {token: repoRequest.currentToken}});
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async deleteCommission(repoRequest: TokenDeleteRepoRequest): Promise<void> {
    try {
      await this.tokenDbModel.destroy({where: {token: repoRequest.token}});
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }
}
