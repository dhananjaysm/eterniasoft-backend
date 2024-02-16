import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VectorDatabaseService } from "./vectordb.service";
import { VectorProduct } from "src/vectorProduct/vectorProduct.model";
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: "mongodb+srv://agarwalpawan6089:2lv0CKcKbWRpIvrX@cluster0.d9fm4mu.mongodb.net/?retryWrites=true&w=majority",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: "VectorProduct", schema: VectorProduct },
    ]), // Include your Mongoose model
  ],

  providers: [VectorDatabaseService],
  exports: [VectorDatabaseService],
})
export class VectorDatabaseModule {}
