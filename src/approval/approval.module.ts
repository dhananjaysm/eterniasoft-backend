import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Approval } from "./entities/approval.entity";
import { ApprovalService } from "./approval.service";
import { ApprovalResolver } from "./approval.resolver";
import { RequestModule } from "src/request/request.module";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Approval]),forwardRef(() => RequestModule),forwardRef(() => UserModule)],
    providers: [ApprovalService,ApprovalResolver],
    exports: [ApprovalService],
  })
  export class ApprovalModule {}
  