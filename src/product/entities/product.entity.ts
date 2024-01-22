// product.entity.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Feature } from 'src/feature/entities/feature.entity';
import { Package } from 'src/package/entities/package.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@ObjectType()
@Entity({ name: 'Product' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ type: 'varchar' })
    name: string;

    @ManyToOne(() => Package, pkg => pkg.products) // Use 'pkg' as an alias for 'package'
    @JoinColumn({ name: 'packageId' })
    package: Package;

    @OneToMany(() => Feature, feature => feature.product, { cascade: true })
    features: Feature[];
}
