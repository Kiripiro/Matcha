import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username = "";

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
    ) {
        this.authService.isLoggedEmitter.subscribe(value => {
          this.username = this.localStorageService.getItem(localStorageName.username);
        });
      }

  ngOnInit(): void {
    this.username = this.localStorageService.getItem(localStorageName.username);
  }


}
