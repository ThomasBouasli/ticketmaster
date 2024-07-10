import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SQSModule } from './libs/sqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SQSModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        config: {
          endpoint: configService.get('AWS_ENDPOINT'),
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        },
      }),
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
