import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Approval } from "src/approval/entities/approval.entity";
import { Package } from "src/package/entities/package.entity";
import {  SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { User } from "src/user/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum RequestType {
  SubscriptionRenewal = 'Subscription Renewal',
  SubscriptionUpgrade = 'Subscription Upgrade',
  NewSubscription = 'New Subscription',
}
@ObjectType()
@Entity({ name: "Request" })
export class Request {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  //GOLD PACKAGE => Products + Additional Products ($$$) + Additional Features ($$$)
  //Zoho -> Zoho CRM, Zoho Desk -> Meeting Management Feature (Zoho CRM) {Beatlet}
  @Field(()=>String)
  @Column({ type: "enum", enum: RequestType, default: RequestType.NewSubscription })
  requestType: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.requests, { eager: true })
  user: User;

  @Field(() => Package)
  @ManyToOne(() => Package, (pkg) => pkg.requests, { eager: true })
  package: Package;

  @Field(() => SubscriptionEntity)
  @ManyToOne(() => SubscriptionEntity, (sub) => sub.requests, { eager: true })
  subscription: SubscriptionEntity;

  //TODO: PRODUCT AND FEATURES
  @Field(() => [Approval], { nullable: true })
  @OneToMany(() => Approval, (approval) => approval.request,{eager:true, cascade:true})
  approvals: Approval[];

  @Field()
  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  status: Status;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
