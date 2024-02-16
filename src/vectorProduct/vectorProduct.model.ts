import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { moduleEnum } from "./module.enum";
import { v4 as uuidv4 } from "uuid";
@Schema()
export class VectorProduct extends Document {
  @Prop({ default: uuidv4, unique: true }) // Generate unique UUID
  id: string;

  @Prop({ unique: false })
  itemID: string;

  @Prop([Number])
  vector: number[];

  @Prop({ type: String, enum: moduleEnum })
  category: string;
}

export const VectorProductSchema = SchemaFactory.createForClass(VectorProduct);
