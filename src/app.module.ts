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
<<<<<<< HEAD
import { EmailModule } from "./email/email.module";
=======
import { SubscriptionModule } from "./subscription/subscription.module";
import { ProductModule } from "./product/product.module";

>>>>>>> aa19283161e753a6b3d268c952e190c9a303435f
@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req }) => ({ req }),
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    FeatureModule,
    RequestModule,
    ApprovalModule,
<<<<<<< HEAD
    EmailModule,
=======
    SubscriptionModule,
>>>>>>> aa19283161e753a6b3d268c952e190c9a303435f
    EventEmitterModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
