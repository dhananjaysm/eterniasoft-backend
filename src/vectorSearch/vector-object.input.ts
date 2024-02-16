import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class searchObject {
  @Field(() => Int, { nullable: true })
  similarity?: number;

  @Field(() => String, { nullable: true })
  id?: string;
}
