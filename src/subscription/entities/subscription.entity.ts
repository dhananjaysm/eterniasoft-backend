import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Package } from "src/package/entities/package.entity";
import { Request } from "src/request/entities/request.entity";
import { User } from "src/user/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from "typeorm";
export enum SubscriptionType {
  Monthly = "Monthly",
  Annual = "Annual",
}
export enum SubscriptionStatus {
  Active = "Active",
  Expired = "Expired",
  Cancelled = "Cancelled",
  // Add more status values as needed
}

registerEnumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
});


@ObjectType()
@Entity({ name: "Subscription" })
export class SubscriptionEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => SubscriptionType)
  @Column({ type: "enum", enum: SubscriptionType })
  subscriptionType: SubscriptionType; // Represents the subscription type (Monthly or Annual)

  @Field(() => SubscriptionStatus)
  @Column({
    type: "enum",
    enum: SubscriptionStatus,
    default: SubscriptionStatus.Active,
  })
  status: SubscriptionStatus;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user: User; // Represents the user who has subscribed

  @Field(() => Package) 
  @ManyToOne(() => Package, {eager:true})
  @JoinColumn()
  package: Package; // Represents the subscribed package

  @Field(() => Date)
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startDate: Date;

  @Field(() => Date)
  @Column({ type: "timestamp", nullable: true })
  endDate: Date; // Optional end date for subscriptions

  @Field(() => Int,{nullable:true})
  @Column({ type: "int", nullable: true }) // The renewal period in days
  renewalPeriod: number;

  @OneToMany(() => Request, (request) => request.subscription)
  requests: Request[];
}
