import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username = "";

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
    ) {
        this.authService.isLoggedEmitter.subscribe(value => {
          this.username = this.localStorageService.getItem(localStorageName.username);
        });
      }

  ngOnInit(): void {
    if (this.authService.checkLog() && !this.authService.checkCompleteRegister()) {
      this.router.navigate(['auth/completeRegister']);
    }
    this.username = this.localStorageService.getItem(localStorageName.username);
  }

  getInfosBack() {
    this.authService._getUserInfosBack();
  }

}
