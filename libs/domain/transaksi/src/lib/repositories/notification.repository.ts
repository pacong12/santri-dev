export interface INotificationRepository {
  sendNotification(params: {
    tenantId: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    tagihanId?: string | null;
  }): Promise<void>;
}
