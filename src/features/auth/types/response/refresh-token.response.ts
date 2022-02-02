import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  token: string;
}
