// Product.entity.ts
import { Field, ObjectType } from "@nestjs/graphql";
import { Feature } from "src/feature/entities/feature.entity";
import { Plan } from "src/plan/entities/plan.entity";
import { Request } from "src/request/entities/request.entity";
import { SubscriptionProduct } from "src/subscription/entities/subscription-product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductFeature } from "./product-feature.entity";
@ObjectType()
@Entity({ name: "Product" })
export class Product {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "varchar", unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ type: "integer", nullable: true })
  maxUsers: number;

  @Field(() => [ProductFeature], { nullable: true })
  @OneToMany(() => ProductFeature, (product) => product.product, {eager:true, cascade: true })
  productFeatures: ProductFeature[];

//   @OneToMany(() => Request, (request) => request.product)
//   requests: Request[];

  @ManyToOne(() => Plan, (plan) => plan.products)
  plan: Plan;

  @OneToMany(
    () => SubscriptionProduct,
    (subscriptionProduct) => subscriptionProduct.product
  )
  subscriptions: SubscriptionProduct[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
