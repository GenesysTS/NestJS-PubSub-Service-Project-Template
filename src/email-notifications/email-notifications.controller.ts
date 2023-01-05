import { Controller } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailNotificationsService } from './email-notifications.service';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';
import {
  GooglePubSubMessageBody,
  GooglePubSubMessageDeliveryAttempts,
  GooglePubSubMessageHandler,
  GooglePubSubMessageMessageAttributes,
} from '@flosportsinc/nestjs-google-pubsub-connector';

@Controller()
export class EmailNotificationsController {
  constructor(
    private readonly emailNotificationsService: EmailNotificationsService,
  ) {}

  @GooglePubSubMessageHandler({
    subscriptionName: 'Request-SendEmailNotification-sub',
  })
  sendEmailNotification(
    @GooglePubSubMessageBody()
    sendEmailNotificationDto: SendEmailNotificationDto,
    @GooglePubSubMessageMessageAttributes() attributes,
    @GooglePubSubMessageDeliveryAttempts() attempts,
  ) {
    return this.emailNotificationsService.sendEmailNotification(
      sendEmailNotificationDto,
      attributes,
      attempts,
    );
  }
}
