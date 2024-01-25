import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { SubscriptionEntity } from "./subscription.entity";

@ObjectType()
@Entity()
export class SubscriptionProduct {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubscriptionEntity)
  subscription: SubscriptionEntity;

  @ManyToOne(() => Product)
  product: Product;

  // Other fields like quantity, addedDate, etc.
}
