import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthenticatedPayload {
    @Field()
    access_token: string;

    @Field()
    userId: string; // Only include userId
}