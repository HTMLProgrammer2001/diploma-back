import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  refreshToken: string;

  @Field()
  accessToken: string;
}
