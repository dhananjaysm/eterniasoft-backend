// package.dto.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, Length, IsDecimal, IsOptional, IsInt, Min, Max, IsArray } from 'class-validator';
import { CreateFeatureInput } from 'src/feature/dto/create-feature.input';
import { CreateProductFeatureInput } from './create-feature.input';

@InputType()
export class CreateProductInput {
  @IsString()
  @Length(1, 255)
  @Field()
  name: string;

  @IsOptional()
  @Field({ nullable: true })
  price?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @Min(1)
  @Max(1000)
  @IsOptional()
  @Field({ nullable: true })
  maxUsers?: number;

  @IsArray()
  @Field(() => [CreateProductFeatureInput], { nullable: 'itemsAndList' })
  productFeatures?: CreateProductFeatureInput[];
}