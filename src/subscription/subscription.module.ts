import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { PackageModule } from "src/package/package.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionResolver } from "./subscription.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    UserModule,
    PackageModule,
    EventEmitterModule,
  ],
  providers: [SubscriptionService,SubscriptionResolver],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
