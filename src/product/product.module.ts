import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { FeatureModule } from "src/feature/feature.module";
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FeatureModule],
  providers: [ProductService,ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
