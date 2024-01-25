// feature.entity.ts
import { Field, ObjectType } from "@nestjs/graphql";
import { Plan } from "src/plan/entities/plan.entity";
import { Product } from "src/product/entities/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { FeatureType } from "../dto/feature-type.enum";

@ObjectType()
@Entity({ name: "Feature" })
export class Feature {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "varchar" })
  name: string;
  
  @Field(() => String)
  @Column({
    type: 'enum',
    enum: FeatureType,
    default: FeatureType.PRODUCT,
  })
  type: FeatureType;

}
