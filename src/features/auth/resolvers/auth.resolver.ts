import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {SetMetadata} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {LoginResponse} from '../types/response/login.response';
import {LoginRequest} from '../types/request/login.request';
import {ResultResponse} from '../../../global/types/response/result.response';
import {RefreshTokenResponse} from '../types/response/refresh-token.response';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {
  }

  @Mutation(returns => LoginResponse)
  @SetMetadata(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, false)
  async login(@Args('body') request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @Mutation(returns => ResultResponse)
  @SetMetadata(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, false)
  async logout(@Args('refreshToken') refreshToken: string): Promise<ResultResponse> {
    return this.authService.logout(refreshToken);
  }

  @Mutation(returns => RefreshTokenResponse)
  @SetMetadata(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, false)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshToken);
  }
}
