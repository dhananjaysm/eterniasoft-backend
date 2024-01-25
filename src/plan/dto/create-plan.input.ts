import {
  Field,
  Float,
  InputType,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { PlanStatus } from "../entities/plan.entity";
import { IsArray, IsOptional } from "class-validator";
registerEnumType(PlanStatus, {
  name: "PlanStatus",
});
@InputType()
export class CreatePlanInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  duration: number; // Duration of the plan in days, months, etc.

  @Field(() => PlanStatus)
  status: PlanStatus;

  @Field({ nullable: true })
  billingCycle?: string; // e.g., 'monthly', 'yearly'

  @Field()
  autoRenew: boolean;

  @Field(() => Int, { nullable: true })
  trialPeriodDays?: number;

  @IsArray()
  @IsOptional()
  @Field(() => [String], { nullable: true })
  productIds?: string[];
}
