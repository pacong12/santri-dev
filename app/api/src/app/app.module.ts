import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WebhookController } from './webhook.controller.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [],
  controllers: [AppController, WebhookController, AuthController],
  providers: [AppService],
})
export class AppModule {}
