// src/vector-search/vector-search.service.ts

import { Injectable } from "@nestjs/common";
import * as tf from "@tensorflow/tfjs-node";

import { VectorDatabaseService } from "src/vectorDatabase/vectordb.service";
import { searchObject } from "./vector-object.input";
@Injectable()
export class VectorSearchService {
  private gloveModel: Map<string, tf.Tensor>; // Adjust the type according to tfjs's API

  constructor(private readonly databaseService: VectorDatabaseService) {
    this.gloveModel = this.loadGloveModel();
  }

  // private loadGloveModel(): Map<string, tf.Tensor> {
  //   const model = new Map<string, tf.Tensor>();
  //   // const glove = require("@tensorflow/tfjs-data/glove/6B_50/embedding.bin");
  //   const glove = require("./../../glove.6B.50d.txt");

  //   // Assuming glove is an object containing words and embeddings
  //   for (const word in glove) {
  //     model.set(word, tf.tensor(glove[word]));
  //   }

  //   return model;
  // }
  private loadGloveModel(): Map<string, tf.Tensor> {
    const fs = require("fs");
    const path = require("path");

    const gloveModel = new Map<string, tf.Tensor>();
    const filePath = path.resolve(__dirname, "./../../glove.6B.50d.txt"); // Adjust the path as necessary

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const lines = data.split("\n");

      for (const line of lines) {
        const [word, ...values] = line.trim().split(/\s+/);
        const vector = values.map(parseFloat);
        gloveModel.set(word, tf.tensor(vector));
      }
    } catch (error) {
      console.error("Error loading GloVe model:", error);
    }

    return gloveModel;
  }

  async embedAndStore(
    id: string,
    description: string,
    // description2: string,
    category: string
  ): Promise<void> {
    const vector = this.textToVector(description);
    // const search = this.textToVector(description2);
    // console.log(description, description2);
    // console.log("similarity", this.calculateSimilarity(vector, search));
    console.log("embedding...");
    await this.databaseService.storeProductVector(id, vector, category);
  }

  async searchProducts(query: string, k: number): Promise<searchObject[]> {
    const queryVector = this.textToVector(query);
    const productIds = await this.querySimilarProducts(queryVector, k);
    return productIds;
  }

  private textToVector(description: string): number[] {
    const words = description.toLowerCase().split(" ");
    const vectors = words.map((word) => {
      const tensor = this.gloveModel.get(word);
      return tensor ? Array.from(tensor.dataSync()) : new Array(50).fill(0);
    });
    const averagedVector = vectors
      .reduce(
        (acc, vector) => acc.map((value, i) => value + vector[i]),
        new Array(50).fill(0)
      )
      .map((sum) => sum / vectors.length);

    return averagedVector;
  }

  private async querySimilarProducts(
    queryVector: number[],
    k: number
  ): Promise<searchObject[]> {
    const productIds: searchObject[] = [];

    // Loop through stored product vectors, compare similarity, and return IDs
    const product = await this.databaseService.getProductVectors();
    // console.log(product);
    for (const {
      itemID,
      vector: storedVector,
    } of await this.databaseService.getProductVectors()) {
      console.log("itemID", itemID);
      const similarity = this.calculateSimilarity(queryVector, storedVector);
      // For simplicity, consider it a match if similarity is above a certain threshold
      console.log("similarity", similarity);
      let indexGlob = -1;
      if (similarity > 0.4) {
        const previousproduct = productIds.find((product, index) => {
          indexGlob = index;
          return product.id == itemID;
        });
        if (!previousproduct) productIds.push({ id: itemID, similarity });
        if (previousproduct && previousproduct.similarity < similarity)
          productIds[indexGlob] = { id: itemID, similarity };
      }
    }
    // console.log("group by--", productIds);
    return productIds;
  }

  private calculateSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length || vector1.length === 0) {
      throw new Error("Vectors must have the same non-zero length");
    }

    const dotProduct = vector1.reduce(
      (acc, value, i) => acc + value * vector2[i],
      0
    );
    const magnitude1 = Math.sqrt(
      vector1.reduce((acc, value) => acc + value ** 2, 0)
    );
    const magnitude2 = Math.sqrt(
      vector2.reduce((acc, value) => acc + value ** 2, 0)
    );

    if (magnitude1 === 0 || magnitude2 === 0) {
      throw new Error("Magnitude of vectors must be non-zero");
    }

    return dotProduct / (magnitude1 * magnitude2);
  }
}
