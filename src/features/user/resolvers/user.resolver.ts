import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserService} from '../service/user.service';
import {UserGetListRequest} from '../types/request/user-get-list.request';
import {UserResponse} from '../types/response/user.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {UserListResponse} from '../types/response/user-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {UserGetByIdRequest} from '../types/request/user-get-by-id.request';
import {UserCreateRequest} from '../types/request/user-create.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {UserUpdateRequest} from '../types/request/user-update.request';

@Resolver(of => UserResponse)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => UserListResponse)
  async getUserList(@Args('query') request: UserGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<UserResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.userService.getUserList(request);
  }

  @Query(returns => UserResponse)
  async getUserById(@Args('query') request: UserGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<UserResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.userService.getUserById(request);
  }

  @Mutation(returns => UserResponse)
  async createUser(@Args('body') request: UserCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<UserResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.userService.createUser(request);
  }

  @Mutation(returns => UserResponse)
  async updateUser(@Args('body') request: UserUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<UserResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.userService.updateUser(request);
  }

  @Mutation(returns => IdResponse)
  async deleteUser(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.userService.deleteUser(id, guid);
  }
}
