import { Field, InputType } from '@nestjs/graphql';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';

@InputType()
export class UpdatePackageDTO {
    @Field({ nullable: true })
    name?: string;

    @Field(() => [UpdateProductDTO], { nullable: true })
    products?: UpdateProductDTO[];
}