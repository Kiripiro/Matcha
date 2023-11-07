import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../models/models';
import { NotificationsService } from 'src/services/notifications.service';
import { SocketioService } from 'src/services/socketio.service';
import { AuthService } from 'src/services/auth.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss', '../app.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Input()
  public notifications: Array<Notification> = [];
  public displayNotifications: boolean = false;

  constructor(
    private notificationsService: NotificationsService,
    private socketioService: SocketioService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.notificationsService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });

    this.displayNotifications = this.notificationsService.displayNotifications$.getValue();

    this.notificationsService.displayNotifications$.subscribe((display) => {
      this.displayNotifications = display;
    });
    this.subscribeToNotifications();
  }

  public subscribeToNotifications() {
    this.socketioService.getNotifications().subscribe({
      next: (response) => {
        if (response.author_id) {
          this.authService.getUserInfosById(response.author_id).pipe(
            switchMap((userResponse) => {
              console.log(userResponse);
              const notification: Notification = {
                author_id: response.author_id,
                type: response.type,
                strong: userResponse.user.username,
                message: response.message,
              };
              return of(notification);
            })
          ).subscribe({
            next: (notification) => {
              console.log(notification);
              this.notificationsService.addNotification(notification);
            },
            error: (error) => {
              console.log(error);
            }
          });
        }
      }
    });
  }

  public closeNotification(notification: Notification) {
    this.notificationsService.removeNotification(notification);
  }
}
