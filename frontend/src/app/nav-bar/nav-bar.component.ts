import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss', '../app.component.scss'],
})
export class NavBarComponent implements OnInit {

  isLoggedIn: boolean | undefined;

  constructor(
    private router: Router,
    private authService: AuthService
    ) {
      this.isLoggedIn = this.authService.checkLog();
      this.authService.isLoggedEmitter.subscribe(value => {
        this.isLoggedIn = value;
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

}
