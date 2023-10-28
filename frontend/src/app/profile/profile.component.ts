import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RelationService } from 'src/services/relation.service';
import { User } from 'src/models/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../app.component.scss']
})
export class ProfileComponent implements OnInit {

  username = "";
  userInfos: any;
  loading = true;
  error = false;
  personalProfil = false;
  img: string[] = [];
  likeWaiting = false;
  likeIcon = "favorite_outlined";
  match = false;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private relationService: RelationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loading = true;
    this.error = false;
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if (this.username == "") {
        console.log("username vide");
        this.error = true;
      }
      this.authService.getUserInfos(this.username).subscribe(
        (response) => {
          console.log('get userInfos successful:', response);
          this.userInfos = response;
          if (!this.userInfos.complete_register) {
            this.error = true;
            return;
          }
          if (this.username == this.localStorageService.getItem(localStorageName.username)) {
            this.personalProfil = true;
          }
          this.relationService.getCheckLike(this.localStorageService.getItem('id'), this.userInfos.id).subscribe(
            (response) => {
              console.log('get getCheckLike successful:', response);
              if (response != null) {
                if (response.exist) {
                  this.likeIcon = "favorite";
                } else {
                  this.likeIcon = "favorite_outlined";
                }
              }
              this.loading = false;
            },
            (error) => {
              console.error('get checkLike failed:', error);
              this.loading = false;
              this.error = true;
            }
          )
          this.relationService.getCheckMatch(this.localStorageService.getItem('id'), this.userInfos.id).subscribe(
            (response) => {
              console.log('get getCheckMatch successful:', response);
              if (response != null) {
                if (response.exist) {
                  this.match = true;
                } else {
                  this.match = false;
                }
              }
            },
            (error) => {
              console.error('get checkLike failed:', error);
              this.loading = false;
              this.error = true;
            }
          )
          if (this.userInfos.picture_1) {
            this.img.push("data:image/jpeg;base64," + this.userInfos.picture_1);
          }
          if (this.userInfos.picture_2) {
            this.img.push("data:image/jpeg;base64," + this.userInfos.picture_2);
          }
          if (this.userInfos.picture_3) {
            this.img.push("data:image/jpeg;base64," + this.userInfos.picture_3);
          }
          if (this.userInfos.picture_4) {
            this.img.push("data:image/jpeg;base64," + this.userInfos.picture_4);
          }
          if (this.userInfos.picture_5) {
            this.img.push("data:image/jpeg;base64," + this.userInfos.picture_5);
          }
        },
        (error) => {
          console.error('get userInfos failed:', error);
          this.loading = false;
          this.error = true;
        }
      );
    });
  }

  ngOnInit(): void {

  }

  like() {
    this.likeWaiting = true;
    if (this.likeIcon == "favorite") {
      this.relationService.deleteLike(this.localStorageService.getItem(localStorageName.id), this.userInfos.id).subscribe(
        (response) => {
          console.log('get deleteLike successful:', response);
          this.likeIcon = "favorite_outlined";
          this.match = false;
          this.likeWaiting = false;
        },
        (error) => {
          console.error('get deleteLike failed:', error);
          this.likeWaiting = false;
        }
      )
    }
    else {
      this.relationService.createLike(this.localStorageService.getItem(localStorageName.id), this.userInfos.id).subscribe(
        (response) => {
          console.log('get createLike successful:', response);
          this.likeIcon = "favorite";
          this.likeWaiting = false;
          this.relationService.getCheckMatch(this.localStorageService.getItem('id'), this.userInfos.id).subscribe(
            (response) => {
              console.log('get getCheckMatch successful:', response);
              if (response != null) {
                if (response.exist) {
                  this.match = true;
                } else {
                  this.match = false;
                }
              }
            },
            (error) => {
              console.error('get checkLike failed:', error);
              this.loading = false;
              this.error = true;
            }
          )
        },
        (error) => {
          console.error('get createLike failed:', error);
          this.likeWaiting = false;
        }
      )
    }
  }
}
