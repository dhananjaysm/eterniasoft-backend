import { Module } from "@nestjs/common";
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        url: "postgres://eterniasoft_user:xxUV8nqSkFZIWJ00xZOEDSyjWcsZwcbv@dpg-cmmk718l5elc73ccnn8g-a.singapore-postgres.render.com/eterniasoft",
        // host: configService.get<string>("POSTGRES_HOST"),
        // port: configService.get<number>("POSTGRES_PORT"),
        // username: configService.get<string>("POSTGRES_USERNAME"),
        // password: configService.get<string>("POSTGRES_PASSWORD"),
        // database: configService.get<string>("POSTGRES_DATABASE"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
        ssl: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
