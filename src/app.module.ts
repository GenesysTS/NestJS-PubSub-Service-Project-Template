import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailNotificationsModule } from './email-notifications/email-notifications.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [EmailNotificationsModule],
})
export class AppModule {}
