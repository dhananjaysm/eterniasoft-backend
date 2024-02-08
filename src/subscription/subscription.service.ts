import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import {
  SubscriptionEntity,
  SubscriptionStatus,
  SubscriptionType,
} from "./entities/subscription.entity";
import { CreateSubscriptionDto } from "./dto/create-sub.dto";
import { UserService } from "src/user/user.service";
import { RenewSubscriptionDto } from "./dto/renew-sub.dto";
import { ProductService } from "src/product/product.service";
import { PlanService } from "src/plan/plan.service";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Role } from "src/user/enums/role.enum";
type Where = FindOptionsWhere<SubscriptionEntity>;

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly planService: PlanService, // Import your package service
    private readonly userService: UserService, // Import your user service
    private eventEmitter: EventEmitter2
  ) {}

  async createPlanSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    requestId?: string
  ): Promise<SubscriptionEntity> {
    const { userId, planId, subscriptionType } = createSubscriptionDto;

    // Fetch the user and package entities
    const user = await this.userService.findOne({ id: userId }); // Implement this method in your user service
    const plan = await this.planService.findOne(planId); // Fetch the selected package

    if (!user || !plan) {
      // Handle cases where user or package is not found
      // You can throw an exception or handle this case as needed
      throw new Error("User or Package not found");
    }

    // Check if a subscription with the same user and package already exists
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: user.id },
        plan: { id: planId },
      },
    });

    if (existingSubscription) {
      // Handle the case where a duplicate subscription is not allowed
      throw new Error("Subscription already exists for this user and package");
    }

    const subscription = new SubscriptionEntity();
    subscription.user = user;
    subscription.plan = plan;
    subscription.subscriptionType = subscriptionType;
    subscription.status = SubscriptionStatus.Active;

    // Initialize the start date to the current date
    subscription.startDate = new Date();

    if (subscriptionType === SubscriptionType.Monthly) {
      // For monthly subscriptions, set the end date to one month from the start date
      const endDate = new Date(subscription.startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      subscription.endDate = endDate;
    } else if (subscriptionType === SubscriptionType.Annual) {
      // For annual subscriptions, set the end date to one year from the start date
      const endDate = new Date(subscription.startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      subscription.endDate = endDate;
    }
    const savedSubscription = await this.subscriptionRepository.save(
      subscription
    );
    this.eventEmitter.emit("subscription.created", {
      subscriptionId: savedSubscription.id,
      requestId,
    });

    return subscription;
  }

  @OnEvent("user.created", { async: true })
  async handleUserCreatedEvent(event: { email: string; roles: Role[] }) {
    // CHECK FOR INTERNAL USER IF IT EXISTS IN ANY PRODUCTS
    const { email, roles } = event;
    if (roles.includes(Role.Internal)) {
      
      //Example ZOHO API CALL

//  https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.15ca3fdaff8257954a03c4c86617276d.bc33befd4f36b8276da7b681704fecf7&client_id=1000.O38353TCVAAIFZ0OSXVR65SR28MS6N&client_secret=6834f0dc2249a9ad48f92fe08887c3b4779a2f5495&grant_type=refresh_token

    }
  }

  async findAll(): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.find();
  }
  async findOne(where: Where): Promise<SubscriptionEntity> {
    return this.subscriptionRepository.findOne({ where });
  }

  async renewPlanSubscription(
    renewSubscriptionDto: RenewSubscriptionDto // Specify the desired renewal type (Monthly or Annual)
  ): Promise<SubscriptionEntity> {
    const { subscriptionId, userId, renewalType } = renewSubscriptionDto;

    // Find the subscription to renew
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    // Check if the subscription is eligible for renewal
    const currentDate = new Date();
    if (
      subscription.status === SubscriptionStatus.Active ||
      subscription.status === SubscriptionStatus.Cancelled
    ) {
      throw new NotFoundException("Subscription is not eligible for renewal");
    }

    // Calculate the new end date based on the renewal type
    const newEndDate = new Date();
    if (renewalType === SubscriptionType.Monthly) {
      // For monthly renewal, add 1 month to the current date
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (renewalType === SubscriptionType.Annual) {
      // For annual renewal, add 1 year to the current date
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    // Create a new subscription record with the updated end date
    const renewedSubscription = new SubscriptionEntity();
    renewedSubscription.subscriptionType = renewalType;
    renewedSubscription.user = subscription.user;
    renewedSubscription.plan = subscription.plan;
    renewedSubscription.startDate = currentDate;
    renewedSubscription.endDate = newEndDate;
    renewedSubscription.status = SubscriptionStatus.Active;

    await this.subscriptionRepository.save(renewedSubscription);

    return renewedSubscription;
  }

  async upgradePlanSubscription(
    userId: string,
    planId: string
  ): Promise<SubscriptionEntity> {
    // Fetch the user and package entities
    const user = await this.userService.findOne({ id: userId });
    const plan = await this.planService.findOne(planId);

    if (!user || !plan) {
      // Handle cases where user or package is not found
      throw new Error("User or Product not found");
    }

    // Check if a subscription with the same user and package already exists
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: user.id },
        plan: { id: plan.id },
      },
    });

    if (!existingSubscription) {
      // Handle the case where the existing subscription is not found
      throw new Error("Subscription not found for this user and product");
    }

    if (existingSubscription.subscriptionType === SubscriptionType.Annual) {
      // Handle the case where the subscription is already annual
      throw new Error(
        "Cannot upgrade to annual, already an annual subscription"
      );
    }

    // Upgrade the subscription to annual
    existingSubscription.subscriptionType = SubscriptionType.Annual;

    // Update the end date to one year from the current date
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    existingSubscription.endDate = endDate;

    return this.subscriptionRepository.save(existingSubscription);
  }

  async getUserSubscriptions(userId: string): Promise<SubscriptionEntity[]> {
    const userSubscriptions = await this.subscriptionRepository.find({
      where: { user: { id: userId } },
    });
    if (!userSubscriptions) {
      throw new NotFoundException("User subscriptions not found");
    }
    return userSubscriptions;
  }

  async count(): Promise<number> {
    return this.subscriptionRepository.count();
  }

  async getSubscriptionsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.find({
      where: {
        startDate: Between(startDate, endDate),
      },
    });
  }

  
}
