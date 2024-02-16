import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { VectorSearchService } from "./vector-search.service";
import { searchObject } from "./vector-object.input";

@Controller("vector-search")
export class VectorSearchController {
  constructor(private readonly vectorSearchService: VectorSearchService) {}

  @Post("embed")
  embedProduct(
    @Body()
    body: {
      id: string;
      description: string;
      category: string;
      // description2: string;
    }
  ): Promise<void> {
    const { id, description, category } = body;
    return this.vectorSearchService.embedAndStore(
      id,
      description,
      // description2,
      category
    );
  }

  @Get("search/:query")
  searchProducts(@Param("query") query: string): Promise<searchObject[]> {
    return this.vectorSearchService.searchProducts(query, 5);
  }
}
