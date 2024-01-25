import { IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { SubscriptionType } from '../entities/subscription.entity'; // Import the SubscriptionType enum

export class UpgradeSubscriptionDto {
  @IsNotEmpty()
  @IsUUID() // You can use other validation decorators based on your needs
  userId: string; // User's UUID

  @IsNotEmpty()
  @IsUUID() // You can use other validation decorators based on your needs
  packageId: string; // Package's UUID

  @IsNotEmpty()
  @IsEnum(SubscriptionType, {
    message: 'Invalid subscription type. Allowed values: Monthly, Annual',
  })
  subscriptionType: SubscriptionType; // Monthly or Annual

  // You can add other validation decorators and attributes as needed
}