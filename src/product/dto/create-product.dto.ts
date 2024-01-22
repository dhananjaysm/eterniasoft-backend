import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProductDTO {
    @Field()
    name: string;

    // Other fields...
}