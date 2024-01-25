import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureModule } from "src/feature/feature.module";
import { PlanService, } from "./plan.service";
import { PlanResolver, } from "./plan.resolver";
import { Plan } from "./entities/plan.entity";
import { ProductModule } from "src/product/product.module";

@Module({
  imports: [TypeOrmModule.forFeature([Plan]),ProductModule],
  providers: [PlanService,PlanResolver],
  exports: [PlanService],
})
export class PlanModule {}
