import { ClientGooglePubSub } from '@flosportsinc/nestjs-google-pubsub-connector';
import { Injectable, Logger } from '@nestjs/common';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';

@Injectable()
export class EmailNotificationsService {
  sendEmailNotification(
    sendEmailNotificationDto: SendEmailNotificationDto,
    attributes,
    attempts,
  ) {
    Logger.debug(
      `Service 'sendEmailNotification' called with attrs=${JSON.stringify(
        attributes,
      )}, attempts=${attempts}, DTO=${JSON.stringify(
        sendEmailNotificationDto,
      )}`,
    );

    // Add implementation of service here

    // Sending new PubSub message with original request
    const msg = JSON.stringify({ sendEmailNotificationDto });
    new ClientGooglePubSub().publishToTopic(
      'SendEmailNotification-Complete',
      Buffer.from(msg),
      {
        timestamp: new Date().toISOString(),
      },
    );

    Logger.debug(
      `Sent PubSub Topic 'SendEmailNotification-Complete' with body=${JSON.stringify(
        sendEmailNotificationDto,
      )}`,
    );

    return;
  }
}
