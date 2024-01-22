import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, Length } from "class-validator";
import { Role } from "../enums/role.enum";

@InputType()
export class CreateUserInput{
    @IsNotEmpty({ message: 'Username cannot be empty' })
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
    @Field()
    username : string ; 
    
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @Length(6, 20, { message: 'Username must be between 3 and 20 characters' })
    @Field()
    password : string;
    
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email : string ;
    
    @IsNotEmpty()
    @Field()
    firstName : string ; 
    
    @IsNotEmpty()
    @Field()
    lastName : string ; 

    @Field((type)=>[String])
    selectedRoles?: Role[];
}