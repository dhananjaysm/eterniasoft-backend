import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany } from "typeorm";

enum NotificationStatus {
  Sent = "SENT",
  Delivered = "DELIVERED",
  Read = "READ",
}

registerEnumType(NotificationStatus, {
  name: "NotificationStatus",
});

enum NotificationPriority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
}

registerEnumType(NotificationPriority, {
  name: "NotificationPriority",
});

@ObjectType()
@Entity()
export class Notification {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  message: string;

  @Field(type => NotificationStatus)
  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.Sent,
  })
  status: NotificationStatus;

  @Field(type => NotificationPriority)
  @Column({
    type: "enum",
    enum: NotificationPriority,
    default: NotificationPriority.Low,
  })
  priority: NotificationPriority;

  @ManyToMany(() => User, user => user.notifications)
  @JoinTable()
  users: User[];// Assuming recipient is identified by an integer ID

  @Field({ nullable: true })
  @Column({ nullable: true })
  payload: string; // JSON string or URL

  @Field(type => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
