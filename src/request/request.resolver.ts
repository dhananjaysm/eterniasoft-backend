import { Resolver, Query, Args, ID, Mutation, Int } from "@nestjs/graphql";
import { RequestService } from "./request.service";
import { Request } from "./entities/request.entity";
import { CreateRequestDto } from "./dto/create-request.dto";
import { HasRoles } from "src/user/decorator/role.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RoleGuard } from "src/auth/guards/role.guard";
import { Role } from "src/user/enums/role.enum";

@Resolver("Request")
export class RequestResolver {
  constructor(private readonly requestService: RequestService) {}

  @HasRoles(Role.Super)
  @UseGuards(JwtAuthGuard, RoleGuard)
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

  @Query(() => Int)
  async requestsCount() {
    return this.requestService.count();
  }
}
