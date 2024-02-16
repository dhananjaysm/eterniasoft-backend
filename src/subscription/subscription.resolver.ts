// Subscription.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { HasRoles } from 'src/user/decorator/role.decorator';
import { Role } from 'src/user/enums/role.enum';

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

  @HasRoles(Role.Admin,Role.Super)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Query(() => Int)
  async subsCount() {
    return this.subscriptionService.count();
  }

  @Query(() => [SubscriptionEntity], { name: 'getSubscriptionsByDateRange' })
  async getSubscriptionsByDateRange(
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date,
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionService.getSubscriptionsByDateRange(startDate, endDate);
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
