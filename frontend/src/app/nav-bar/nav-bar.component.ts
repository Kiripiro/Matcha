import { Component, OnInit } from '@angular/core';
import { CookiesService } from '../../services/cookies.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss', '../app.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private cookiesService: CookiesService) {}
  ngOnInit(): void {
    console.log("AAAAA");
    const cookie = this.cookiesService.getCookie("accessToken");
    console.log(cookie);
    if (this.cookiesService.getCookie("accessToken") != null) {
      console.log("TEEEEEEEEEEEEST");
    }
  }

}
