// product.resolver.ts
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { PlanService } from "./plan.service";
import { Plan } from "./entities/plan.entity";
import { CreatePlanInput } from "./dto/create-plan.input";
import { UpdatePlanInput } from "./dto/update-plan.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RoleGuard } from "src/auth/guards/role.guard";
import { HasRoles } from "src/user/decorator/role.decorator";
import { Role } from "src/user/enums/role.enum";

@Resolver(() => Plan)
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}

  @Query(() => [Plan])
  async findPlans(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Query(() => Plan)
  async findPlan(@Args("planId") planId: string): Promise<Plan> {
    return this.planService.findOne(planId);
  }

  // @Query(() => Plan)
  // async deleteAllPlan(): Promise<void> {
  //   this.planService.deleteAll();
  // }

  @HasRoles(Role.Admin, Role.Super)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Mutation(() => Plan)
  async createPlan(@Args("planData") planData: CreatePlanInput): Promise<Plan> {
    return this.planService.create(planData);
  }

  @HasRoles(Role.Admin, Role.Super)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Mutation(() => Plan)
  async updatePlan(
    @Args("id") id: string,
    @Args("planData") planData: UpdatePlanInput
  ): Promise<Plan> {
    return this.planService.update(id, planData);
  }

  // @Mutation(() => Plan)
  // async removePlan(@Args("id") id: string): Promise<void> {
  //   return this.planService.remove(id);
  // }
}
