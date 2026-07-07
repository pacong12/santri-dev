import { prisma } from '@org/database';

export interface SendNotificationParams {
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  tagihanId?: string | null;
}

export interface INotificationService {
  sendNotification(params: SendNotificationParams): Promise<void>;
  getUserNotifications(tenantId: string, userId: string): Promise<any[]>;
  markAsRead(tenantId: string, id: string): Promise<void>;
}

export class DbNotificationService implements INotificationService {
  async sendNotification(params: SendNotificationParams): Promise<void> {
    await prisma.notifikasi.create({
      data: {
        tenantId: params.tenantId,
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        tagihanId: params.tagihanId || null,
      },
    });
  }

  async getUserNotifications(tenantId: string, userId: string): Promise<any[]> {
    return prisma.notifikasi.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(tenantId: string, id: string): Promise<void> {
    await prisma.notifikasi.update({
      where: { id, tenantId },
      data: { isRead: true },
    });
  }
}
