import { Resolver, Query, Args, ID, Mutation } from "@nestjs/graphql";
import { RequestService } from "./request.service";
import { Request } from "./entities/request.entity";
import { CreateRequestDto } from "./dto/create-request.dto";

@Resolver("Request")
export class RequestResolver {
  constructor(private readonly requestService: RequestService) {}

  @Query(() => [Request])
  async getAllRequests(): Promise<Request[]> {
    return this.requestService.getAllRequests();
  }

  @Query(() => Request)
  async getRequestById(
    @Args("requestId", { type: () => ID }) requestId: string
  ): Promise<Request | undefined> {
    return this.requestService.getRequestById(requestId);
  }

  @Mutation(returns => Request)
  async createRequest(
    @Args('createRequestInput') createRequestInput: CreateRequestDto,
  ): Promise<Request> {
    return this.requestService.createRequest(createRequestInput);
  }
}
