import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WebhookController } from './webhook.controller.js';

@Module({
  imports: [],
  controllers: [AppController, WebhookController],
  providers: [AppService],
})
export class AppModule {}
