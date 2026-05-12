import apiClient from './client';

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotificationResponse[]> {
  const { data } = await apiClient.get('/api/notifications');
  return data.data as NotificationResponse[];
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get('/api/notifications/unread-count');
  return data.data as number;
}

export async function markRead(id: number): Promise<void> {
  await apiClient.put(`/api/notifications/${id}/read`);
}

export async function markAllRead(): Promise<void> {
  await apiClient.put('/api/notifications/read-all');
}
