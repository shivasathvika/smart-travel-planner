import { Subject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private notifications$ = new Subject<Notification>();

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  getNotifications() {
    return this.notifications$.asObservable();
  }

  success(message: string, options: Partial<Notification> = {}) {
    this.show({
      type: 'success',
      message,
      duration: 5000,
      ...options,
      id: this.generateId(),
    });
  }

  error(message: string, options: Partial<Notification> = {}) {
    this.show({
      type: 'error',
      message,
      duration: 0, // Errors stay until dismissed
      ...options,
      id: this.generateId(),
    });
  }

  warning(message: string, options: Partial<Notification> = {}) {
    this.show({
      type: 'warning',
      message,
      duration: 7000,
      ...options,
      id: this.generateId(),
    });
  }

  info(message: string, options: Partial<Notification> = {}) {
    this.show({
      type: 'info',
      message,
      duration: 5000,
      ...options,
      id: this.generateId(),
    });
  }

  private show(notification: Notification) {
    this.notifications$.next(notification);
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default NotificationService.getInstance();
