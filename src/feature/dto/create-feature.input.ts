import { InputType, Field } from "@nestjs/graphql";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { FeatureType } from "./feature-type.enum";

@InputType()
export class CreateFeatureInput {
  @IsString()
  @Field()
  name: string;

  @IsEnum(FeatureType)
  @Field(() => FeatureType)
  type: FeatureType;

  
  @IsUUID()
  @Field({ nullable: true }) // nullable: true because you might not need to provide an ID when creating a new Feature
  productId?: string;

  @IsUUID()
  @Field({ nullable: true })
  planId?: string;

  // Add other fields if necessary
}