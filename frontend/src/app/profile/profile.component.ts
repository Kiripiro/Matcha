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
  you_blocked_he = false;
  he_blocked_you = false;
  blockButtonMessage = "Block";
  you_reported_he = false;
  reportButtonMessage = "Report";

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private relationService: RelationService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (!this.authService.checkLog()) {
      this.router.navigate(['auth/login']);
      return;
    }
    if (!this.authService.checkCompleteRegister()) {
      this.router.navigate(['auth/completeRegister']);
      return;
    }
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
          this.you_blocked_he = this.userInfos.you_blocked_he;
          this.he_blocked_you = this.userInfos.he_blocked_you;
          if (this.you_blocked_he) {
            this.blockButtonMessage = "Unblock";
          }
          this.you_reported_he = this.userInfos.you_reported_he;
          if (this.you_reported_he) {
            this.reportButtonMessage = "Unreport";
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
          );
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
          );
          if (!this.personalProfil && !this.he_blocked_you && !this.you_blocked_he) {
            this.relationService.createView(this.localStorageService.getItem('id'), this.userInfos.id);
          }
          this.img.splice(0, this.img.length)
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
    if (this.authService.checkLog() && !this.authService.checkCompleteRegister()) {
      this.router.navigate(['auth/completeRegister']);
    }
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

  blockCallback() {
    this.relationService.createBlock(this.localStorageService.getItem(localStorageName.id), this.userInfos.id).subscribe(
      (response) => {
        console.log('createBlock successful:', response);
      },
      (error) => {
        console.error('createBlock failed:', error);
      }
    )
  }

  unblockCallback(): void {
    this.relationService.deleteBlock(this.localStorageService.getItem(localStorageName.id), this.userInfos.id).subscribe(
      (response) => {
        console.log('deleteBlock successful:', response);
      },
      (error) => {
        console.error('createBlock failed:', error);
      }
    )
  }

  block() {
    if (this.you_blocked_he) {
      const dialogData = {
        title: 'Unblock',
        text: "Are you sure to unblock this user ?",
        text_yes_button: "Yes",
        text_no_button: "No",
        yes_callback: () => this.unblockCallback(),
        no_callback: function () { },
        reload: true
      };
      this.dialogService.openDialog(dialogData);
    }
    else {
      const dialogData = {
        title: 'Block',
        text: "Are you sure to block this user ?",
        text_yes_button: "Yes",
        text_no_button: "No",
        yes_callback: () => this.blockCallback(),
        no_callback: function () { },
        reload: true
      };
      this.dialogService.openDialog(dialogData);
    }

  }

  reportCallback() {
    this.relationService.createReport(this.localStorageService.getItem(localStorageName.id), this.userInfos.id).subscribe(
      (response) => {
        console.log('createReport successful:', response);
      },
      (error) => {
        console.error('createReport failed:', error);
      }
    )
  }

  unreportCallback(): void {
    this.relationService.deleteReport(this.localStorageService.getItem(localStorageName.id), this.userInfos.id).subscribe(
      (response) => {
        console.log('deleteReport successful:', response);
      },
      (error) => {
        console.error('deleteReport failed:', error);
      }
    )
  }

  report() {
    if (this.you_reported_he) {
      const dialogData = {
        title: 'Unreport',
        text: "Are you sure to unreport this user ?",
        text_yes_button: "Yes",
        text_no_button: "No",
        yes_callback: () => this.unreportCallback(),
        no_callback: function () { },
        reload: true
      };
      this.dialogService.openDialog(dialogData);
    }
    else {
      const dialogData = {
        title: 'Report',
        text: "Are you sure to report this user ?",
        text_yes_button: "Yes",
        text_no_button: "No",
        yes_callback: () => this.reportCallback(),
        no_callback: function () { },
        reload: true
      };
      this.dialogService.openDialog(dialogData);
    }

  }

}
