import { Field, ID, ObjectType, Int, Subscription } from "@nestjs/graphql";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../enums/role.enum";
import * as bcrypt from "bcrypt";
import { IsEmail, IsNotEmpty, IsInt, Min } from "class-validator";
import { Request } from "src/request/entities/request.entity";
import { Approval } from "src/approval/entities/approval.entity";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { UsageRecord } from "src/feature/entities/usage-record.entity";
import { Notification } from "src/notification/entities/notification.entity";

@ObjectType()
@Entity({ name: "User" })
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "varchar", unique: true })
  username: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  // hash password before insert
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Field()
  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Field()
  @IsNotEmpty()
  @Column({ type: "varchar" })
  firstName: string;

  @Field()
  @Column({ type: "varchar" })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  department: string;

  @Field((type) => [String])
  @Column({
    type: "enum",
    array: true,
    enum: Role,
    nullable: false,
    default: [],
  })
  roles: Role[];

  @Field((type) => [SubscriptionEntity],{nullable:true})
  @OneToMany(() => SubscriptionEntity,(sub)=>sub.user,{eager:true}) // Define a one-to-one relationship
  @JoinColumn() // Specify the column that holds the foreign key
  subscriptions: SubscriptionEntity[];

  @Field((type) => [Request])
  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];

  @OneToMany(() => UsageRecord, (usage) => usage.user)
  usageRecords: UsageRecord[];

  @OneToMany(() => Approval, (approval) => approval.approver)
  approvals: Approval[];

  @ManyToMany(() => Notification, (notification) => notification.users)
  notifications: Notification[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
