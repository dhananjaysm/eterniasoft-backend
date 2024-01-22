import { Field, ObjectType } from "@nestjs/graphql";
import { Request } from "src/request/entities/request.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity({ name: 'Approval' })
export class Approval {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Request, request => request.approvals)
  request: Request;
 
  @Field()
  @Column({ default: false })
  approved: boolean;

  @Field()
  @Column({ nullable: true })
  approverComments: string;

  @Field(()=> User)
  @ManyToOne(() => User,{eager :true})
  approver: User; // Assuming the approver is identified by an ID

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
 
  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}