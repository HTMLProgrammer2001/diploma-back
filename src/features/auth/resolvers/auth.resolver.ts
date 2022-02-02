import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {AuthService} from '../service/auth.service';
import {LoginResponse} from '../types/response/login.response';
import {LoginRequest} from '../types/request/login.request';
import {ResultResponse} from '../../../global/types/response/result.response';
import {RefreshTokenResponse} from '../types/response/refresh-token.response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(returns => LoginResponse)
  async login(@Args('body') request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @Mutation(returns => ResultResponse)
  async logout(): Promise<ResultResponse> {
    return this.authService.logout();
  }

  @Mutation(returns => RefreshTokenResponse)
  async refreshToken(): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken();
  }
}
