import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feature } from "./entities/feature.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Feature])],
    providers: [],
    exports: [],
  })
  export class FeatureModule {}