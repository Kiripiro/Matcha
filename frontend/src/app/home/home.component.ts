import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SocketioService } from 'src/services/socketio.service';
import { HomeService } from 'src/services/home.service';
import { HomeUserData, UserSimplified } from 'src/models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username = "";
  interestingUsers: UserSimplified[] = [];
  userDisplayed!: HomeUserData;
  img: string[] = [];

  loading = true;
  error = false;

  personalProfil = false;
  likeWaiting = false;
  likeIcon = "favorite_outlined";
  match = false;
  you_blocked_he = false;
  he_blocked_you = false;
  blockButtonMessage = "Block";
  you_reported_he = false;
  reportButtonMessage = "Report";
  

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private homeService: HomeService,
    private router: Router,
  ) {
    this.authService.isLoggedEmitter.subscribe(value => {
      this.username = this.localStorageService.getItem(localStorageName.username);
    });
    console.log("constructor home")
    this.loading = true;
    this.error = false;
    this.homeService.getInterestingUsers().subscribe(
      (response) => {
        console.log('get getInterestingUsers successful:', response);
        this.interestingUsers = response.users;
        if (this.interestingUsers.length <= 0) {
          this.error = true;
        } else {
          this.newUserGenerate(this.interestingUsers[0].id);
        }
      },
      (error) => {
        console.error('get getInterestingUsers failed:', error);
        this.error = true;
      }
    );
  }

  newUserGenerate(id: number) {
    this.authService.getUserInfosById(id).subscribe(
      (response) => {
        console.log('get getUserInfosById successful:', response);
        this.userDisplayed = response.user;
        if (this.userDisplayed.picture_1) {
          this.img.push("data:image/jpeg;base64," + this.userDisplayed.picture_1);
        }
        if (this.userDisplayed.picture_2) {
          this.img.push("data:image/jpeg;base64," + this.userDisplayed.picture_2);
        }
        if (this.userDisplayed.picture_3) {
          this.img.push("data:image/jpeg;base64," + this.userDisplayed.picture_3);
        }
        if (this.userDisplayed.picture_4) {
          this.img.push("data:image/jpeg;base64," + this.userDisplayed.picture_4);
        }
        if (this.userDisplayed.picture_5) {
          this.img.push("data:image/jpeg;base64," + this.userDisplayed.picture_5);
        }
        this.loading = false;
      },
      (error) => {
        console.error('get getUserInfosById failed:', error);
        this.loading = false;
        this.error = true;
      }
    );
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
