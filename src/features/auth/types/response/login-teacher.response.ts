import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class LoginTeacherResponse {
  @Field()
  token: string;
}
