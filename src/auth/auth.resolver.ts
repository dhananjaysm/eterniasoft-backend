import { Args, InputType, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { AuthenticatedPayload } from "./entities/AuthenticatedPayload.entity";


@Resolver(()=> AuthenticatedPayload)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService , 
    ){}

    @Mutation(()=>AuthenticatedPayload)
    async register(@Args('registerInput') registerInput:RegisterInput){
        const result = await this.authService.register(registerInput);

        return result ; 
    }

    @Mutation(()=> AuthenticatedPayload)
    async login(@Args('loginInput') loginInput:LoginInput){
        const result = await this.authService.login(loginInput);

        return result ; 
    }

}