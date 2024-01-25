// package.resolver.ts
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { CreateProductInput } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async findProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product)
  async findProduct(@Args("productId") productId: string): Promise<Product> {
    return this.productService.findOne({ id: productId });
  }

  @Mutation(() => Product)
  async createProduct(
    @Args("productData") productData: CreateProductInput
  ): Promise<Product> {
    return this.productService.createProduct(productData);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args("id") id: string,
    @Args("productData") productData: UpdateProductDTO
  ): Promise<Product> {
    return this.productService.update(id, productData);
  }

  @Mutation(() => Product)
  async removeProduct(@Args("id") id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
