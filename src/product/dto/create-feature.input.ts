import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreateProductFeatureInput {
  @IsString()
  @Field()
  name: string;
}
