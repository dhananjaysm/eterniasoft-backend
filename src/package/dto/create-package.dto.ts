// package.dto.ts
import { Field, InputType } from '@nestjs/graphql';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';

@InputType()
export class CreatePackageDTO {
    @Field()
    name: string;

    @Field(() => [CreateProductDTO], { nullable: true })
    products?: CreateProductDTO[];
}