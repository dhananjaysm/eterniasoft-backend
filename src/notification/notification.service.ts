import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  create(message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({ message });
    return this.notificationRepository.save(notification);
  }
}
