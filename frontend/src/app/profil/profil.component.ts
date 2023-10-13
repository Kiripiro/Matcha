import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss', '../app.component.scss']
})
export class ProfilComponent implements OnInit {

  username = "";
  userInfos: any;
  loading = true;
  error = false;

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
