import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { RequestType } from "../entities/request.entity";
import { SubscriptionType } from "src/subscription/entities/subscription.entity";
registerEnumType(RequestType, {
  name: 'RequestType',
});
registerEnumType(SubscriptionType, {
  name: 'SubscriptionType',
});

@InputType()
export class CreateRequestDto {

  @Field(() => RequestType, { defaultValue: RequestType.NewSubscription })
    @IsEnum(RequestType)
    requestType: RequestType;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  subscriptionId?: string;

  @Field(() => SubscriptionType, { nullable: true })
  @IsEnum(SubscriptionType)
  @IsOptional()
  renewalType?: SubscriptionType;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsUUID()
  planId: string;
}
