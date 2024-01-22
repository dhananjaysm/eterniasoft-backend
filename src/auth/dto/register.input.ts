import { InputType ,  Field} from "@nestjs/graphql";
import { IsNotEmpty , IsEmail, IsArray, ArrayNotEmpty} from 'class-validator';
import { Role } from "src/user/enums/role.enum";


@InputType()
export class RegisterInput{
    @IsNotEmpty()
    @Field()
    username : string ; 
    
    @IsNotEmpty()
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