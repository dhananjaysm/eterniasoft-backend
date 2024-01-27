import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PassportConf } from "src/config/passport.config";
import { UserModule } from "src/user/user.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { JwtStartegy } from "./jwt/jwt.strategy";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [
    PassportModule.register(PassportConf),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY", "123456"),
        signOptions: {
          expiresIn: configService.get<string>("TOKEN_EXPIRATION", "20h"),
        },
      }),
    }),
    UserModule,
    ConfigModule,
    EmailModule,
  ],
  providers: [AuthService, AuthResolver, JwtStartegy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
