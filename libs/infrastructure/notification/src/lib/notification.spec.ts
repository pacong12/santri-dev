import { vi, describe, it, expect } from 'vitest';
import { DbNotificationService } from './notification.js';
import { prisma } from '@org/database';

vi.mock('@org/database', () => ({
  prisma: {
    notifikasi: {
      create: vi.fn().mockResolvedValue({ id: 'notif-1' }),
      findMany: vi.fn().mockResolvedValue([{ id: 'notif-1', title: 'Test Notif' }]),
      update: vi.fn().mockResolvedValue({ id: 'notif-1', isRead: true }),
    },
  },
}));

describe('DbNotificationService', () => {
  const service = new DbNotificationService();

  it('should call prisma.notifikasi.create with correct data', async () => {
    const params = {
      tenantId: 'tenant-1',
      userId: 'user-1',
      title: 'New Bill',
      message: 'You have a new bill of Rp 500k',
      type: 'BILLING',
      tagihanId: 'tagihan-1',
    };

    await service.sendNotification(params);

    expect(prisma.notifikasi.create).toHaveBeenCalledWith({
      data: {
        tenantId: 'tenant-1',
        userId: 'user-1',
        title: 'New Bill',
        message: 'You have a new bill of Rp 500k',
        type: 'BILLING',
        tagihanId: 'tagihan-1',
      },
    });
  });

  it('should call prisma.notifikasi.findMany with correct filter', async () => {
    const result = await service.getUserNotifications('tenant-1', 'user-1');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Notif');
    expect(prisma.notifikasi.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-1', userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should call prisma.notifikasi.update to mark as read', async () => {
    await service.markAsRead('tenant-1', 'notif-1');

    expect(prisma.notifikasi.update).toHaveBeenCalledWith({
      where: { id: 'notif-1', tenantId: 'tenant-1' },
      data: { isRead: true },
    });
  });
});
