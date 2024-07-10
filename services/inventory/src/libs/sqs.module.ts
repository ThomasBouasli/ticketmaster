import { DynamicModule, Module } from '@nestjs/common';
import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SqsService } from './sqs.service';

interface SQSModuleOptions {
  config: SQSClientConfig;
}

interface AsyncSQSModuleOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<SQSModuleOptions> | SQSModuleOptions;
}

@Module({
  imports: [EventEmitterModule.forRoot({ global: true })],
  providers: [SqsService],
  exports: [SqsService, EventEmitterModule],
})
export class SQSModule {
  static register(options: SQSModuleOptions): DynamicModule {
    const client = new SQSClient(options);
    return {
      module: SQSModule,
      providers: [
        {
          provide: SQSClient,
          useValue: client,
        },
      ],
      exports: [SQSClient],
    };
  }

  static registerAsync(options: AsyncSQSModuleOptions): DynamicModule {
    return {
      module: SQSModule,
      imports: options.imports,
      providers: [
        {
          provide: SQSClient,
          useFactory: async (...args: any[]) => {
            const { config } = await options.useFactory(...args);
            return new SQSClient(config);
          },
          inject: options.inject,
        },
      ],
      exports: [SQSClient],
    };
  }
}
