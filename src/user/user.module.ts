import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserReslover } from "./user.resolver";
import { UserService } from "./user.service";
import { PackageModule } from "src/package/package.module";
import { RequestModule } from "src/request/request.module";

@Module({
    imports : [
        TypeOrmModule.forFeature([User]) ,
    ] ,
    providers : [UserService , UserReslover] ,
    exports : [UserService]
})
export class UserModule {}