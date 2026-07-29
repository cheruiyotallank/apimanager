import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationsComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Safaricom APIs Operational',
      message: 'All Safaricom M-Pesa integration endpoints are running normally with 99.98% uptime.',
      timestamp: '2026-07-29 13:45',
      type: 'success',
      read: false
    },
    {
      id: '2',
      title: 'PesaLink Coming Soon',
      message: 'PesaLink IPSL instant transfer APIs will be available next week for testing.',
      timestamp: '2026-07-29 12:30',
      type: 'info',
      read: false
    },
    {
      id: '3',
      title: 'Security Alert',
      message: 'Please review your API keys and rotate them if they are older than 90 days.',
      timestamp: '2026-07-28 16:20',
      type: 'warning',
      read: true
    }
  ];

  unreadCount: number = this.notifications.filter(n => !n.read).length;

  closeNotifications(): void {
    this.close.emit();
  }

  markAsRead(notification: NotificationItem): void {
    notification.read = true;
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'error': return 'bi-x-circle-fill';
      default: return 'bi-info-circle-fill';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-danger';
      default: return 'text-primary';
    }
  }

  getNotificationIconClass(type: string): string {
    const icon = this.getNotificationIcon(type);
    const color = this.getNotificationColor(type);
    return `bi ${icon} ${color}`;
  }
}
