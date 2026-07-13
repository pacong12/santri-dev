import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WebhookController } from './webhook.controller.js';
import { AuthController } from './auth.controller.js';
import { SuperadminController } from './superadmin.controller.js';
import { SuperadminService } from './superadmin.service.js';
import { KelasController } from './kelas.controller.js';
import { SantriController } from './santri.controller.js';
import { TagihanController } from './tagihan.controller.js';
import { TransaksiController } from './transaksi.controller.js';
import { TenantController } from './tenant.controller.js';

@Module({
  imports: [],
  controllers: [
    AppController,
    WebhookController,
    AuthController,
    SuperadminController,
    KelasController,
    SantriController,
    TagihanController,
    TransaksiController,
    TenantController,
  ],
  providers: [AppService, SuperadminService],
})
export class AppModule {}
