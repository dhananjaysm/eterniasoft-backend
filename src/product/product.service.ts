// product.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, In, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { CreateProductInput } from "./dto/create-product.dto";
import { Feature } from "src/feature/entities/feature.entity";
import { ProductFeature } from "./entities/product-feature.entity";
type Where = FindOptionsWhere<Product>;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private dataSource: DataSource
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(where: Where): Promise<Product> {
    return this.productRepo.findOne({ where });
  }
  async findProductsByIds(ids: string[]): Promise<Product[]> {
    return this.productRepo.findBy({ id: In(ids) });
  }
  async createProduct(
    createProductInput: CreateProductInput
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { productFeatures, ...productData } = createProductInput;

      const product = queryRunner.manager.create(Product, productData);
      await queryRunner.manager.save(product);

      if (productFeatures && productFeatures.length > 0) {
        for (const featureInput of productFeatures) {
          const feature = queryRunner.manager.create(ProductFeature, {
            ...featureInput,
            product: product, // Associate the feature with the created product
          });
          await queryRunner.manager.save(feature);
        }
      }

      const savedProduct = await queryRunner.manager.save(Product, product);

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
}
