// product.resolver.ts
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product],{name : 'findAllProducts'})
  async findProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product,{name : 'findProductById'})
  async findProduct(@Args("id") id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product,{name : 'createProduct'})
  async createProduct(
    @Args("productData") productData: CreateProductDTO
  ): Promise<Product> {
    return this.productService.create(productData);
  }

  @Mutation(() => Product,{name:"updateProduct"})
  async updateProduct(
    @Args("id") id: string,
    @Args("productData") productData: UpdateProductDTO
  ): Promise<Product> {
    return this.productService.update(id, productData);
  }

  @Mutation(() => Product,{name:"removeProduct"})
  async removeProduct(@Args("id") id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
