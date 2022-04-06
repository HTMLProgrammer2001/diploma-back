import {Injectable, Logger} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {AuthMapper} from '../mapper/auth.mapper';
import {LoginResponse} from '../types/response/login.response';
import {LoginRequest} from '../types/request/login.request';
import {RefreshTokenRepository} from '../../../data-layer/repositories/refresh-token/refresh-token.repository';
import {ResultResponse} from '../../../global/types/response/result.response';
import {RefreshTokenResponse} from '../types/response/refresh-token.response';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {JwtService} from '@nestjs/jwt';
import {IAccessTokenInfoInterface} from '../../../global/types/interface/IAccessTokenInfo.interface';
import {IRefreshTokenInfoInterface} from '../../../global/types/interface/IRefreshTokenInfo.interface';
import {LoginTeacherResponse} from '../types/response/login-teacher.response';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {RolesEnum} from '../../../global/constants/roles.enum';
import {AccessTokenTypeEnum} from '../../../global/constants/access-token-type.enum';
import {MailServiceInterface} from '../../../global/services/mail-service/mail-service.interface';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private jwtService: JwtService,
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
    private teacherRepository: TeacherRepository,
    private mailService: MailServiceInterface,
    private authMapper: AuthMapper,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const getUserByEmailRequest = this.authMapper.initializeGetUserByEmailRepoRequest(request.email);
      const {data: getUserByEmailResponse} = await this.userRepository.getUsers(getUserByEmailRequest);

      const userModel = getUserByEmailResponse.responseList[0];

      if (!userModel) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: 'Invalid email or password'
        });

        this.logger.error(error);
        throw error;
      }

      if (!bcrypt.compareSync(request.password, userModel.passwordHash)) {
        const error = new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: 'Invalid email or password'
        });

        this.logger.error(error);
        throw error;
      }

      const userSessionCode = crypto.randomBytes(20).toString('hex');
      const createRefreshTokenRepoRequest = this.authMapper
        .loginRequestToCreateRefreshTokenRepoRequest(userModel.id, userSessionCode);

      await this.refreshTokenRepository.createRefreshToken(createRefreshTokenRepoRequest);
      const refreshTokenPayload: IRefreshTokenInfoInterface = {sessionCode: userSessionCode, userId: userModel.id};
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: Number(this.configService.get('JWT_REFRESH_TOKEN_TTL_SECONDS'))
      });

      const accessTokenPayload: IAccessTokenInfoInterface = {
        type: AccessTokenTypeEnum.USER,
        userId: userModel.id,
        role: userModel.role?.id,
        email: userModel.email,
      };

      const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: Number(this.configService.get('JWT_ACCESS_TOKEN_TTL_SECONDS'))
      });

      this.logger.debug(`User with id ${userModel.id} logged in`);
      return {refreshToken, accessToken};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async logout(refreshToken: string): Promise<ResultResponse> {
    try {
      const {sessionCode, userId} = await this.jwtService.verify<IRefreshTokenInfoInterface>(
        refreshToken,
        {secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET')}
      );

      const getRefreshTokenRepoRequest = this.authMapper.initializeGetRefreshTokenRepoRequest(sessionCode);
      const {data: getRefreshTokenResponse} = await this.refreshTokenRepository.getRefreshToken(getRefreshTokenRepoRequest);

      if (!getRefreshTokenResponse) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Session code ${sessionCode} not exist`
        });

        this.logger.error(error);
        throw error;
      }

      const deleteRefreshTokenRepoRequest = this.authMapper.logoutRequestToDeleteRefreshTokenRepoRequest(sessionCode);
      await this.refreshTokenRepository.deleteRefreshToken(deleteRefreshTokenRepoRequest);

      this.logger.debug(`User with id ${userId} logged out`);
      return {result: true};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      //check refresh token validity
      const {sessionCode} = await this.jwtService.verify<IRefreshTokenInfoInterface>(
        refreshToken,
        {secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET')}
      );

      const getRefreshTokenRepoRequest = this.authMapper.initializeGetRefreshTokenRepoRequest(sessionCode);
      const {data: getRefreshTokenResponse} = await this.refreshTokenRepository.getRefreshToken(getRefreshTokenRepoRequest);

      if (!getRefreshTokenResponse) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Session code ${sessionCode} not exist`
        });

        this.logger.error(error);
        throw error;
      }

      //check user state
      const getUserByIdRequest = this.authMapper.initializeGetUserByIdRepoRequest(getRefreshTokenResponse.userId);
      const {data: getUserByIdResponse} = await this.userRepository.getUsers(getUserByIdRequest);

      const userModel = getUserByIdResponse.responseList[0];

      if (!userModel) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `User with id ${getRefreshTokenResponse.userId} not exist`
        });

        this.logger.error(error);
        throw error;
      } else if (userModel.isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `User with id ${getRefreshTokenResponse.userId} is deleted`
        });

        this.logger.error(error);
        throw error;
      }

      const newUserSessionCode = crypto.randomBytes(20).toString('hex');
      const updateRefreshTokenRepoRequest = this.authMapper
        .refreshTokenRequestToUpdateRefreshTokenRepoRequest(sessionCode, newUserSessionCode);

      await this.refreshTokenRepository.updateRefreshToken(updateRefreshTokenRepoRequest);
      const newRefreshTokenPayload: IRefreshTokenInfoInterface = {sessionCode: newUserSessionCode, userId: userModel.id};
      const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: Number(this.configService.get('JWT_REFRESH_TOKEN_TTL_SECONDS'))
      });

      const newAccessTokenPayload: IAccessTokenInfoInterface = {
        type: AccessTokenTypeEnum.USER,
        userId: userModel.id,
        role: userModel.role?.id,
        email: userModel.email,
      };

      const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: Number(this.configService.get('JWT_ACCESS_TOKEN_TTL_SECONDS'))
      });

      this.logger.debug(`User with id ${userModel.id} refreshed token`);
      return {refreshToken: newRefreshToken, accessToken: newAccessToken};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async loginTeacher(email: string): Promise<LoginTeacherResponse> {
    try {
      const getTeacherByEmailRepoRequest = this.authMapper.initializeGetTeacherByEmailRepoRequest(email);
      const {data: getTeacherResponse} = await this.teacherRepository.getTeachers(getTeacherByEmailRepoRequest);

      if (!getTeacherResponse.responseList.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teacher with email ${email} not exist`
        });

        this.logger.error(error);
        throw error;
      }

      const teacher = getTeacherResponse.responseList[0];

      const accessTokenPayload: IAccessTokenInfoInterface = {
        type: AccessTokenTypeEnum.TEACHER,
        role: RolesEnum.VIEWER,
        userId: teacher.id,
        email: teacher.email,
      };

      const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: Number(this.configService.get('JWT_TEACHER_ACCESS_TOKEN_TTL_SECONDS'))
      });

      this.logger.debug(`Send teacher access link to email ${email}`);
      await this.mailService.sendTeacherLoginMail(email, accessToken);
      return {result: true};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
