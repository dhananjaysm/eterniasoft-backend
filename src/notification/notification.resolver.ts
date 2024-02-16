import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { HasRoles } from 'src/user/decorator/role.decorator';
import { Role } from 'src/user/enums/role.enum';

const pubSub = new PubSub();

@Resolver(of => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(returns => [Notification])
  async notifications() {
    return this.notificationService.findAll();
  }

  @Mutation(returns => Notification)
  async addNotification(@Args('message') message: string) {
    const newNotification = await this.notificationService.create(message);
    pubSub.publish('notificationAdded', { notificationAdded: newNotification });
    return newNotification;
  }

  @HasRoles(Role.Admin,Role.Super)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Subscription(returns => Notification)
  notificationAdded() {
    return pubSub.asyncIterator('notificationAdded');
  }
  
}