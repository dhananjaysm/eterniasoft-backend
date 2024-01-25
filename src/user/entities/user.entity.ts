import { Field, ID, ObjectType, Int } from "@nestjs/graphql";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "../enums/role.enum";
import * as bcrypt from "bcrypt";
import { IsEmail, IsNotEmpty, IsInt, Min } from "class-validator";
import { Request } from "src/request/entities/request.entity";
import { Approval } from "src/approval/entities/approval.entity";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { UsageRecord } from "src/feature/entities/usage-record.entity";

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

  @Field()
  @Column({ type: "boolean", default: false })
  isVerified: boolean;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  passwordChangedAt: Date;

  @Field((type) => Int)
  @IsInt()
  @Min(100000)
  @Column({ type: "int", nullable: true })
  otp: number;

  @Field((type) => [SubscriptionEntity])
  @OneToOne(() => SubscriptionEntity, { cascade: true, eager: true }) // Define a one-to-one relationship
  @JoinColumn() // Specify the column that holds the foreign key
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];

  @OneToMany(() => UsageRecord, (usage) => usage.user)
  usageRecords: UsageRecord[];

  @OneToMany(() => Approval, (approval) => approval.approver)
  approvals: Approval[];
}
