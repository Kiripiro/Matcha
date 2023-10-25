import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
  img: string[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loading = true;
    this.error = false;
    this.route.params.subscribe(params => {
      this.username = params['username'];
      console.log("username = " + this.username);
      if (this.username == "") {
        console.log("username vide");
        this.error = true;
      }
      this.authService.getUserInfos(this.username).subscribe(
        (response) => {
          console.log('get userInfos successful:', response);
          this.loading = false;
          this.userInfos = response;
          if (!this.userInfos.complete_register) {
            this.error = true;
            return;
          }
          console.log(this.userInfos);
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
          console.error('get failed:', error);
          this.loading = false;
          this.error = true;
        }
      );
    });
  }

  ngOnInit(): void {

  }

}
