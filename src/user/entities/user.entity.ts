import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/role.enum";
import * as bcrypt from 'bcrypt'
import { IsEmail, IsNotEmpty } from "class-validator";
import { Package } from "src/package/entities/package.entity";
import { Request } from "src/request/entities/request.entity";
import { Approval } from "src/approval/entities/approval.entity";


@ObjectType()
@Entity({name : 'User'})
export class User {
    
    @Field((type)=>ID)
    @PrimaryGeneratedColumn('uuid')
    id : string ; 
    
    @Field()
    @Column({ type : 'varchar', unique : true })
    username : string ;

    @Column({ type : 'varchar' , nullable : false})
    password : string ;

    // hash password before insert
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.password){
            this.password = await bcrypt.hash(this.password , 10)
        }
    }

    @Field()
    @IsEmail()
    @IsNotEmpty()
    @Column({ type : 'varchar' , unique : true ,nullable : false })
    email : string ;

    @Field()
    @IsNotEmpty()
    @Column({ type : 'varchar'})
    firstName : string ;

    @Field()
    @Column({ type : 'varchar'})
    lastName : string ;

    @Field({nullable:true})
    @Column({nullable:true})
    department: string;

    @Field((type)=>[String])
    @Column({ type : 'enum', array : true , enum : Role , nullable : false ,default : []})
    roles : Role[] ;

    @OneToOne(() => Package, { cascade: true, eager: true }) // Define a one-to-one relationship
    @JoinColumn() // Specify the column that holds the foreign key
    package: Package;

    @OneToMany(() => Request, request => request.user)
    requests: Request[];
  
    @OneToMany(() => Approval, approval => approval.approver)
    approvals: Approval[];
}