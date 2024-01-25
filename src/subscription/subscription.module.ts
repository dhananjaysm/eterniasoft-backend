import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { ProductModule } from "src/product/product.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionResolver } from "./subscription.resolver";
import { PlanModule } from "src/plan/plan.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    UserModule,
    PlanModule,
    EventEmitterModule,
  ],
  providers: [SubscriptionService,SubscriptionResolver],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
