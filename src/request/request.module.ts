import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { ApprovalModule } from "src/approval/approval.module";
import { RequestService } from "./request.service";
import { RequestResolver } from "./request.resolver";
import { UserModule } from "src/user/user.module";
import { ProductModule } from "src/product/product.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { PlanModule } from "src/plan/plan.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    UserModule,
    ProductModule,
    PlanModule,
    SubscriptionModule,
    EventEmitterModule,
  ],
  providers: [RequestService, RequestResolver],
  exports: [RequestService],
})
export class RequestModule {}
