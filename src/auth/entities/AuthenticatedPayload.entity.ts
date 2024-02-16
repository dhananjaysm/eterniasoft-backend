import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/entities/user.entity";

@ObjectType()
export class AuthenticatedPayload {
  @Field()
  access_token: string;

  @Field()
  userId: string; // Only include userId

  @Field(() => User, { nullable: false })
  user: User;
}
