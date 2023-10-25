import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService, localStorageName } from 'src/services/local-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss', '../app.component.scss'],
})
export class NavBarComponent implements OnInit {

  isLoggedIn: boolean | undefined;

  username = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService
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

}
