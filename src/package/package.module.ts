import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Package } from "./entities/package.entity";
import { ProductModule } from "src/product/product.module";
import { PackageService } from "./package.service";
import { PackageResolver } from "./package.resolver";
import { RequestModule } from "src/request/request.module";

@Module({
  imports: [TypeOrmModule.forFeature([Package]), ProductModule],
  providers: [PackageService,PackageResolver],
  exports: [PackageService],
})
export class PackageModule {}
