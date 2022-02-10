import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {IdResponse} from '../../../global/types/response/id.response';
import {ProfileResponse} from '../types/response/profile.response';
import {GetProfileRequest} from '../types/request/get-profile.request';
import {EditProfileRequest} from '../types/request/edit-profile.request';
import {ProfileService} from '../service/profile.service';

@Resolver(of => ProfileResponse)
export class ProfileResolver {
  constructor(private profileService: ProfileService) {
  }

  @Query(returns => ProfileResponse)
  async getProfile(@Info() info: GraphQLResolveInfo):
    Promise<ProfileResponse> {
    const request = new GetProfileRequest();
    request.select = Object.keys(fieldsProjection(info));
    return this.profileService.getProfile(request);
  }

  @Mutation(returns => ProfileResponse)
  async editProfile(@Args('body') request: EditProfileRequest, @Info() info: GraphQLResolveInfo):
    Promise<ProfileResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.profileService.updateProfile(request);
  }

  @Mutation(returns => IdResponse)
  async deleteProfile(@Args('guid', {type: () => String}) guid: string): Promise<IdResponse> {
    return this.profileService.deleteProfile(guid);
  }
}
