// package.entity.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Request } from 'src/request/entities/request.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
@ObjectType()
@Entity({ name: 'Package' })
export class Package {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ type: 'varchar', unique: true })
    name: string;

    @Field(()=>[Product],{nullable:true})
    @OneToMany(() => Product, product => product.package, { cascade: true })
    products: Product[];

    @OneToMany(() => Request, request => request.package)
    requests: Request[];
}