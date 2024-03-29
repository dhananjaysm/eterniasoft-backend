import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserReslover } from "./user.resolver";
import { UserService } from "./user.service";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [TypeOrmModule.forFeature([User]), EventEmitterModule],
  providers: [UserService, UserReslover],
  exports: [UserService],
})
export class UserModule {}
