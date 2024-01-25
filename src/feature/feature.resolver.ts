import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";
import { Feature } from "./entities/feature.entity";
import { FeatureService } from "./feature.service";
import { CreateFeatureInput } from "./dto/create-feature.input";

@Resolver(() => Feature)
export class FeatureResolver {
  constructor(private readonly featureService: FeatureService) {}

  @Query(() => [Feature])
  async findAll(): Promise<Feature[]> {
    return this.featureService.findAll();
  }

  @Query(() => Feature)
  async findOne(@Args("id") id: string): Promise<Feature> {
    return this.featureService.findOne(id);
  }

  @Mutation(() => Feature)
  async createFeature(
    @Args("createFeatureInput") createFeatureInput: CreateFeatureInput
  ): Promise<Feature> {
    return this.featureService.create(createFeatureInput);
  }

  // Add mutations for update, delete, and other necessary operations...
}
