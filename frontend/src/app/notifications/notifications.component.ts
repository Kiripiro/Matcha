import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../models/models';
import { NotificationsService } from 'src/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss', '../app.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Input()
  public notifications: Array<Notification> = [];
  public displayNotifications: boolean = false;
  public closedNotifications: Notification[] = [];

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.notificationsService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });

    this.displayNotifications = this.notificationsService.displayNotifications$.getValue();

    this.notificationsService.displayNotifications$.subscribe((display) => {
      this.displayNotifications = display;
    });

    this.closedNotifications = this.notificationsService.getClosedNotifications();

    this.addRandomNotifications();
  }

  private addRandomNotifications() {
    for (let i = 0; i < 3; i++) {
      const randomId = Math.floor(Math.random() * 1000);
      const notificationTypes = ['success', 'info', 'warning', 'danger'];
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

      const newNotification: Notification = {
        id: randomId,
        type: randomType,
        strong: 'New Notification',
        message: `This is a ${randomType} notification.`,
      };

      this.notificationsService.addNotification(newNotification);
    }
  }

  public closeNotification(notification: Notification) {
    this.notificationsService.removeNotification(notification);
  }
}
