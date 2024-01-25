import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProductDTO {
    @Field({ nullable: true })
    name?: string;

    // @Field(() => [UpdateProductDTO], { nullable: true })
    // products?: UpdateProductDTO[];
}