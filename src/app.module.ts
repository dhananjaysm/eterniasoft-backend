import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./config/database.module";
import { UserModule } from "./user/user.module";
import { FeatureModule } from "./feature/feature.module";
import { RequestModule } from "./request/request.module";
import { ApprovalModule } from "./approval/approval.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SubscriptionModule } from "./subscription/subscription.module";
import { ProductModule } from "./product/product.module";
import { NotificationModule } from "./notification/notification.module";

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req }) => ({ req }),
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        "graphql-ws": true,
      },
    }),
    UserModule,
    AuthModule,
    ProductModule,
    FeatureModule,
    RequestModule,
    ApprovalModule,
    SubscriptionModule,
    EventEmitterModule.forRoot(),
    NotificationModule,
  ],
  providers: [],
})
export class AppModule {}
