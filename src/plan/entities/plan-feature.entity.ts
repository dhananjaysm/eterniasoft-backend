// plan-feature.entity.ts in your Plan module

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Plan } from './plan.entity';  // Import your Plan entity

@ObjectType()
@Entity()
export class PlanFeature {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  // Add other specific fields for PlanFeature here

  @ManyToOne(() => Plan, plan => plan.planFeatures)
  plan: Plan;
}
