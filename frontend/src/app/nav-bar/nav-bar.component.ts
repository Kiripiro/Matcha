import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService, localStorageName } from 'src/services/local-storage.service';
import { NotificationsService } from 'src/services/notifications.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss', '../app.component.scss'],
})
export class NavBarComponent implements OnInit {

  isLoggedIn: boolean | undefined;

  username = "";
  notificationCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    protected notificationsService: NotificationsService
  ) {
    this.isLoggedIn = this.authService.checkLog();
    if (this.isLoggedIn) {
      this.username = this.localStorageService.getItem(localStorageName.username);
    }
    this.authService.isLoggedEmitter.subscribe(value => {
      this.isLoggedIn = value;
      if (this.isLoggedIn) {
        this.username = this.localStorageService.getItem(localStorageName.username);
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLogAndLogout();
    this.notificationsService.notificationsCount$.subscribe((notifications) => {
      console.log(notifications);
      this.notificationCount = notifications;
    });
  }

  logOut() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['']);
  }

  profile() {
    this.router.navigate(['profile/' + this.localStorageService.getItem('username')]);
  }

  showNotifications() {
    this.notificationsService.showNotifications();
  }
}
