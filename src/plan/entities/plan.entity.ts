// product.entity.ts
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Feature } from "src/feature/entities/feature.entity";
import { Product } from "src/product/entities/product.entity";
import { Request } from "src/request/entities/request.entity";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { UsageLimit } from "src/feature/entities/usage-limit.entity";
import { PlanFeature } from "./plan-feature.entity";
export enum PlanStatus {
  ACTIVE = "active",
  DISCONTINUED = "discontinued",
}
@ObjectType()
@Entity({ name: "Plan" })
export class Plan {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "varchar" })
  name: string;

  @Field()
  @Column({ type: "text" })
  description: string; // Detailed description of the plan

  @Field(() => Float)
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number; // Price of the plan

  @Field(() => Int)
  @Column({ type: "int" })
  duration: number; // Duration of the plan in days, months, etc.

  @Field()
  @Column({ type: "enum", enum: PlanStatus, default: PlanStatus.ACTIVE })
  status: string; // Status of the plan, e.g., active, discontinued

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  billingCycle: string; // e.g., 'monthly', 'yearly'

  @Field()
  @Column({ default: false })
  autoRenew: boolean;

  @Field()
  @Column({ nullable: true })
  trialPeriodDays: number;

  //RELATIONS
  @OneToMany(() => PlanFeature, (planfeature) => planfeature.plan, {
    cascade: true,
  })
  planFeatures: PlanFeature[];

  @OneToMany(() => UsageLimit, (usageLimit) => usageLimit.plan)
  usageLimits: UsageLimit[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => Request, (request) => request.plan)
  requests: Request[];

  // @Field(() => [Product], { nullable: true })
  // @ManyToMany(() => Product, (product) => product.plan, { eager: true })
  // products: Product[];
  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.plans, { eager: true })
  @JoinTable({
    name: "products_plans_id",
    joinColumn: {
      name: "plans",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "products",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
