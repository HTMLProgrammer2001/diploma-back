import {Injectable, Logger} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import {AuthMapper} from '../mapper/auth.mapper';
import {LoginResponse} from '../types/response/login.response';
import {LoginRequest} from '../types/request/login.request';
import {TokenRepository} from '../../../data-layer/repositories/token/token.repository';
import {ResultResponse} from '../../../global/types/response/result.response';
import {RefreshTokenResponse} from '../types/response/refresh-token.response';
import {RequestContext} from '../../../global/services/request-context';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private tokenRepository: TokenRepository,
    private userRepository: UserRepository,
    private authMapper: AuthMapper,
    private requestContext: RequestContext,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const getUserByEmailRequest = this.authMapper.initializeGetUserByEmailRepoRequest(request.email);
      const {data: getUserByEmailResponse} = await this.userRepository.getUsers(getUserByEmailRequest);

      const userModel = getUserByEmailResponse.responseList[0];

      if(!userModel) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `User with email ${request.email} not exist`
        });
      }

      if(!bcrypt.compareSync(request.password, userModel.passwordHash)) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: 'Incorrect password'
        });
      }

      const userSessionToken = crypto.randomBytes(20).toString('hex');
      const createTokenRepoRequest = this.authMapper.loginRequestToCreateTokenRepoRequest(userModel.id, userSessionToken);
      await this.tokenRepository.createToken(createTokenRepoRequest);

      return {token: this.requestContext.getToken()};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async logout(): Promise<ResultResponse> {
    return {result: true};
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    return {token: ''};
  }
}
