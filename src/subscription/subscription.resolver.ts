// Subscription.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';

@Resolver("Subscription")
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Query(() => [SubscriptionEntity],{name : 'findAllSubscriptions'})
  async findSubscriptions(): Promise<SubscriptionEntity[]> {
    return this.subscriptionService.findAll();
  }

  @Query(() => SubscriptionEntity,{name : 'findSubscriptionById'})
  async findSubscription(@Args('id') id: string): Promise<SubscriptionEntity> {
    return this.subscriptionService.findOne({id:id});
  }

  @Query(() => [SubscriptionEntity])
  async userSubscriptions(
    @Args('userId') userId: string,
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionService.getUserSubscriptions(userId);
  }

//   @Mutation(() => Subscription,{name : 'createSubscription'})
//   async createSubscription(@Args('SubscriptionData') SubscriptionData: CreateSubscriptionDTO): Promise<Subscription> {
//     return this.subscriptionService.create(SubscriptionData);
//   }

//   @Mutation(() => Subscription,{name:"updateSubscription"})
//   async updateSubscription(
//     @Args('id') id: string,
//     @Args('SubscriptionData') SubscriptionData: UpdateSubscriptionDTO,
//   ): Promise<Subscription> {
//     return this.subscriptionService.update(id, SubscriptionData);
//   }

//   @Mutation(() => Subscription,{name:"removeSubscription"})
//   async removeSubscription(@Args('id') id: string): Promise<void> {
//     return this.subscriptionService.remove(id);
//   }
}
