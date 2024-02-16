// product.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, In, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { CreateProductInput } from "./dto/create-product.dto";
import { Feature } from "src/feature/entities/feature.entity";
import { ProductFeature } from "./entities/product-feature.entity";
import { VectorSearchService } from "src/vectorSearch/vector-search.service";
import { moduleEnum } from "src/vectorProduct/module.enum";
import { searchObject } from "src/vectorSearch/vector-object.input";
type Where = FindOptionsWhere<Product>;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private dataSource: DataSource,
    private VectorSearchService: VectorSearchService
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(where: Where): Promise<Product> {
    return this.productRepo.findOne({ where, relations: ["plans"] });
  }
  async findProductsByIds(ids: string[]): Promise<Product[]> {
    return this.productRepo.findBy({ id: In(ids) });
  }
  async createProduct(
    createProductInput: CreateProductInput
  ): Promise<Product> {
    console.log("function called", createProductInput);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { productFeatures, ...productData } = createProductInput;
      const product = queryRunner.manager.create(Product, productData);
      // console.log("cake and bake");
      const savedProduct = await queryRunner.manager.save(Product, product);
      // console.log("bake and cake");
      if (productFeatures && productFeatures.length > 0) {
        for (const featureInput of productFeatures) {
          const feature = queryRunner.manager.create(ProductFeature, {
            ...featureInput,
            product: savedProduct, // Associate the feature with the created product
          });
          const result = await queryRunner.manager.save(feature);
          console.log("iteration completed");
          console.log(result.product.productFeatures);
        }
      }
      // console.log("saving...");

      // console.log("saved..");
      // console.log("new data....");
      await this.VectorSearchService.embedAndStore(
        savedProduct.id,
        savedProduct.description,
        moduleEnum.product
      );
      // console.log("new data....embeded");
      if (productFeatures && productFeatures.length > 0) {
        for (const featureInput of productFeatures) {
          // console.log("new data....embeded Product", featureInput);
          await this.VectorSearchService.embedAndStore(
            savedProduct.id,
            featureInput.name,
            moduleEnum.product
          );
        }
      }
      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create product: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, productData: UpdateProductDTO): Promise<Product> {
    await this.productRepo.update(id, productData);
    return this.findOne({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    console.log("function called", query);
    let products: Product[] = [];
    if (query == "*") {
      const products = this.findAll();
      console.log("products---", products);
      return products;
    }
    let productIds = await this.VectorSearchService.searchProducts(query, 1);

    products = await this.findProductsByIds(
      productIds.map((product) => product.id)
    );
    productIds = sortNumbers(productIds);
    // console.log(products.)
    // console.log(
    //   productIds.map((product) => {
    //     console.log("inside", product[0]);
    //     return products.find((el) => el.id == product.id);
    //   }),
    //   products
    // );

    let productsSorted: Product[] = [];
    productIds.forEach((el) => {
      const product = products.find((product) => product.id == el.id);
      if (product) productsSorted.push(product);
    });
    // console.log("product", productsSorted, products);
    return productsSorted;
  }

  async deleteAll(): Promise<void> {
    try {
      // Delete all data from the repository
      await this.productRepo.clear();
      console.log("deleted");
    } catch (error) {
      // Handle errors if necessary
      throw error;
    }
  }
}

function sortNumbers(productIds: searchObject[]) {
  // Use the sort method to sort the numbers in ascending order
  return productIds.sort((a, b) => b.similarity - a.similarity);
}
