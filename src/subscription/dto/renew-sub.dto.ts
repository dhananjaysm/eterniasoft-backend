import { IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { SubscriptionType } from '../entities/subscription.entity'; // Import the SubscriptionType enum
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RenewSubscriptionDto {
  @Field()
  subscriptionId: string; // ID of the subscription to renew

  @Field()
  userId: string; // ID of the user associated with the subscription

  @Field(() => SubscriptionType)
  renewalType: SubscriptionType; // Desired renewal type (Monthly or Annual)
}