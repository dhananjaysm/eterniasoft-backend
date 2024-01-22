// feature.entity.ts
import { Product } from "src/product/entities/product.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "Feature" })
export class Feature {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  // Other fields...

  @ManyToOne(() => Product, (product) => product.features)
  @JoinColumn({ name: "productId" })
  product: Product;
}
