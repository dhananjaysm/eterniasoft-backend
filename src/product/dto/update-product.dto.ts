import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateProductDTO {
    @Field()
    name: string;

    // Other fields...
}