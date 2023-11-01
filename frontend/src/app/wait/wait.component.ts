import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RelationService } from 'src/services/relation.service';
import { User } from 'src/models/models';
import { DialogService } from 'src/services/dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss', '../app.component.scss']
})
export class WaitComponent implements OnInit {

  text = "Waiting for validation of your email...";

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (!this.authService.checkLog()) {
      this.router.navigate(['auth/login']);
      return;
    }
    if (this.authService.checkEmailChecked()) {
      this.router.navigate(['']);
      return;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['token'] && params['token'].length > 0 && params['token'] != "wait") {
        this.text = "Wait...";
        this.authService.emailValidation(params['token']).subscribe(
          (response) => {
            console.log('emailValidation successful:', response);
            this.localStorageService.setItem(localStorageName.emailChecked, true);
            this.router.navigate(['auth/completeRegister']);
          },
          (error) => {
            console.error('emailValidation failed:', error);
            this.text = "Error";
          }
        );
      }
    })
  }
}
