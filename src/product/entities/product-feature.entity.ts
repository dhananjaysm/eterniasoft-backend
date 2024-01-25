// product-feature.entity.ts in your Product module

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';  // Import your Product entity

@ObjectType()
@Entity()
export class ProductFeature {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  // Add other specific fields for ProductFeature here

  @ManyToOne(() => Product, product => product.productFeatures)
  product: Product;
}
