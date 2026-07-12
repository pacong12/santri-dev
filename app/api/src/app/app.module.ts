import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WebhookController } from './webhook.controller.js';
import { AuthController } from './auth.controller.js';
import { SuperadminController } from './superadmin.controller.js';
import { SuperadminService } from './superadmin.service.js';

@Module({
  imports: [],
  controllers: [AppController, WebhookController, AuthController, SuperadminController],
  providers: [AppService, SuperadminService],
})
export class AppModule {}
