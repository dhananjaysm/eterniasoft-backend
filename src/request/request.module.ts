import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { ApprovalModule } from "src/approval/approval.module";
import { RequestService } from "./request.service";
import { RequestResolver } from "./request.resolver";
import { UserModule } from "src/user/user.module";
import { PackageModule } from "src/package/package.module";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [TypeOrmModule.forFeature([Request]),UserModule,PackageModule,EventEmitterModule],
  providers: [RequestService,RequestResolver],
  exports: [RequestService],
})
export class RequestModule {}
