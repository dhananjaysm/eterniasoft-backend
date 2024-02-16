import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";
import { ProductFeature } from "./entities/product-feature.entity";
import { VectorSearchModule } from "src/vectorSearch/vector-search.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    VectorSearchModule,
    ProductFeature,
  ],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
