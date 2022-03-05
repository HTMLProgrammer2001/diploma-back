import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
class NotificationTeacherModelResponse {
  @Field(type => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
export class NotificationTeacherResponse {
  @Field(type => NotificationTeacherModelResponse,{nullable: true})
  teacher: NotificationTeacherModelResponse;

  @Field({nullable: true})
  internshipHours: number;

  @Field({nullable: true})
  lastAttestationDate: string;

  @Field({nullable: true})
  nextAttestationDate: string;
}
