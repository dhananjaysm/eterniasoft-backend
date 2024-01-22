import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, Length } from "class-validator";

@InputType()
export class UpdateUserInput{
    @Field(()=>String)
    @Length(6 , 11)
    @IsOptional()
    password? : string ; 

    @Field(()=>String)
    @IsOptional()
    firstName? : string ; 


    @Field(()=>String)
    @IsOptional()
    lastName? : string ; 
}