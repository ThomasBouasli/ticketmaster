import { SQSClient } from '@aws-sdk/client-sqs';
import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  ReceiveMessageCommand,
  SendMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsService implements OnModuleInit, OnApplicationShutdown {
  private on = true;

  constructor(
    @Inject(SQSClient) private readonly client: SQSClient,
    private readonly emitter: EventEmitter2,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.pollMessages();
  }

  onApplicationShutdown() {
    this.on = false;
  }

  private async pollMessages() {
    while (this.on) {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.config.get('AWS_SQS_QUEUE_URL'),
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ['All'],
      });

      const { Messages } = await this.client.send(command);

      if (Messages) {
        for (const message of Messages) {
          const message_route = message.MessageAttributes['route'].StringValue;
          this.emitter.emit(message_route, message.Body, message.ReceiptHandle);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  public async sendMessage(route: string, message: any, delay: number = 0) {
    const command = new SendMessageCommand({
      QueueUrl: this.config.get('AWS_SQS_QUEUE_URL'),

      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        route: {
          DataType: 'String',
          StringValue: route,
        },
      },
      DelaySeconds: delay,
    });

    await this.client.send(command);
  }

  public async acknowledgeMessage(receiptHandle: string) {
    const command = new DeleteMessageCommand({
      QueueUrl: this.config.get('AWS_SQS_QUEUE_URL'),
      ReceiptHandle: receiptHandle,
    });

    await this.client.send(command);
  }
}
