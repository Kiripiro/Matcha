import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Notification } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  public displayNotifications$ = new BehaviorSubject<boolean>(false);
  public notificationsCount$ = new BehaviorSubject<number>(0);
  private closedNotifications: Notification[] = [];

  constructor() {}

  addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.getValue();
    currentNotifications.push(notification);
    this.notificationsSubject.next(currentNotifications);

    this.updateNotificationCount(1);
  }

  removeNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.getValue();
    const index = currentNotifications.indexOf(notification);
    if (index !== -1) {
      currentNotifications.splice(index, 1);
      this.notificationsSubject.next(currentNotifications);

      this.closedNotifications.push(notification);

      this.updateNotificationCount(-1);
    }
  }

  getClosedNotifications(): Notification[] {
    return this.closedNotifications;
  }

  showNotifications() {
    this.displayNotifications$.next(true);
  }

  getNotificationCount(): Observable<number> {
    return this.notificationsCount$.asObservable();
  }

  private updateNotificationCount(change: number) {
    const currentCount = this.notificationsCount$.value;
    this.notificationsCount$.next(currentCount + change);
  }
}
