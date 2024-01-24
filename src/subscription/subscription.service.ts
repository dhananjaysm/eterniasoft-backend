import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { PackageService } from "src/package/package.service";
import {
  SubscriptionEntity,
  SubscriptionStatus,
  SubscriptionType,
} from "./entities/subscription.entity";
import { CreateSubscriptionDto } from "./dto/create-sub.dto";
import { UserService } from "src/user/user.service";
import { RenewSubscriptionDto } from "./dto/renew-sub.dto";
type Where = FindOptionsWhere<SubscriptionEntity>;

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly packageService: PackageService, // Import your package service
    private readonly userService: UserService // Import your user service
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto
  ): Promise<SubscriptionEntity> {
    const { userId, packageId, subscriptionType } = createSubscriptionDto;

    // Fetch the user and package entities
    const user = await this.userService.findOne({ id: userId }); // Implement this method in your user service
    const pkg = await this.packageService.findOne({ id: packageId }); // Fetch the selected package

    if (!user || !pkg) {
      // Handle cases where user or package is not found
      // You can throw an exception or handle this case as needed
      throw new Error("User or Package not found");
    }

    // Check if a subscription with the same user and package already exists
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: user.id },
        package: { id: packageId },
      },
    });

    if (existingSubscription) {
      // Handle the case where a duplicate subscription is not allowed
      throw new Error("Subscription already exists for this user and package");
    }

    const subscription = new SubscriptionEntity();
    subscription.user = user;
    subscription.package = pkg;
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

    return this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.find();
  }
  async findOne(where: Where): Promise<SubscriptionEntity> {
    return this.subscriptionRepository.findOne({ where });
  }

  async renewSubscription(
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
    renewedSubscription.package = subscription.package;
    renewedSubscription.startDate = currentDate;
    renewedSubscription.endDate = newEndDate;
    renewedSubscription.status = SubscriptionStatus.Active;

    await this.subscriptionRepository.save(renewedSubscription);

    return renewedSubscription;
  }

  async upgradeSubscription(
    userId: string,
    packageId: string
  ): Promise<SubscriptionEntity> {
    // Fetch the user and package entities
    const user = await this.userService.findOne({ id: userId });
    const pkg = await this.packageService.findOne({ id: packageId });

    if (!user || !pkg) {
      // Handle cases where user or package is not found
      throw new Error("User or Package not found");
    }

    // Check if a subscription with the same user and package already exists
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: user.id },
        package: { id: packageId },
      },
    });

    if (!existingSubscription) {
      // Handle the case where the existing subscription is not found
      throw new Error("Subscription not found for this user and package");
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
      throw new NotFoundException('User subscriptions not found');
    }
    return userSubscriptions;
  }
}
