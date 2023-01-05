import { Module } from '@nestjs/common';
import { EmailNotificationsService } from './email-notifications.service';
import { EmailNotificationsController } from './email-notifications.controller';

@Module({
  controllers: [EmailNotificationsController],
  providers: [EmailNotificationsService]
})
export class EmailNotificationsModule {}
