import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsUUID } from "class-validator";

@InputType()
export class CreateRequestDto {

    @Field()
    @IsString()
    type: string;
    
    @Field()
    @IsUUID()
    userId: string;
  
    @Field()
    @IsUUID()
    packageId: string;
  }