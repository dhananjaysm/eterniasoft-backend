// src/vector-search/database.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
// import { Product } from "./product.model";
import { VectorProduct } from "src/vectorProduct/vectorProduct.model";

@Injectable()
export class VectorDatabaseService {
  constructor(
    @InjectModel(VectorProduct.name) private productModel: Model<VectorProduct>
  ) {}

  // async storeProductVector(id: string, vector: number[]): Promise<void> {
  //   await this.productModel.findOneAndUpdate(
  //     { id },
  //     { id, vector },
  //     { upsert: true, new: true }
  //   );
  // }
  async storeProductVector(
    id: string,
    vector: number[],
    category: string
  ): Promise<void> {
    console.log("db called...", { itemID: id, category });
    await this.productModel.create(
      { itemID: id, vector, category } // Set the document if it doesn't exist
    );
  }

  async getProductVector(id: string): Promise<number[] | undefined> {
    const product = await this.productModel.findOne({ itemID: id });
    return product?.vector;
  }

  async getProductVectors(): Promise<
    Array<{ itemID: string; vector: number[] }>
  > {
    const products = await this.productModel.find();
    // const productVectors = new Map<string, number[]>();
    // products.forEach((product) => {
    //   productVectors.set(product.itemID, product.vector);
    // });
    return products;
  }
}
