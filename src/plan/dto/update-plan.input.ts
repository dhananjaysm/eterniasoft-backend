import { Field, Float, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreatePlanInput } from "./create-plan.input";
import { PlanStatus } from "../entities/plan.entity";
import { IsArray, IsOptional } from "class-validator";

@InputType()
export class UpdatePlanInput extends PartialType(CreatePlanInput, InputType) {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => PlanStatus, { nullable: true })
  status?: PlanStatus;

  @Field(() => String, { nullable: true })
  billingCycle?: string;

  @Field(() => Boolean, { nullable: true })
  autoRenew?: boolean;

  @Field(() => Int, { nullable: true })
  trialPeriodDays?: number;

  @IsArray()
  @IsOptional()
  @Field(() => [String], { nullable: true })
  productIds?: string[];
}