import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VectorSearchController } from "./vector-search.controller";
import { VectorSearchService } from "./vector-search.service";
// import { DatabaseModule } from '../database/database.module';
import { VectorDatabaseModule } from "src/vectorDatabase/vectordb.module";
import {
  VectorProduct,
  VectorProductSchema,
} from "src/vectorProduct/vectorProduct.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VectorProduct.name, schema: VectorProductSchema },
    ]),
    VectorDatabaseModule,
  ],
  controllers: [VectorSearchController],
  providers: [VectorSearchService],
  exports: [VectorSearchService],
})
export class VectorSearchModule {}
