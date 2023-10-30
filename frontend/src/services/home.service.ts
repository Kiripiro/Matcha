import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { DialogService } from './dialog.service';
import { SocketioService } from './socketio.service';
import { GetInterestingUsersResponseData, GetUserResponseData } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
    private socketService: SocketioService
  ) {
  }

  getInterestingUsers(): Observable<GetInterestingUsersResponseData> {
    console.log("getInterestingUsers")
    return this.http.get<GetInterestingUsersResponseData>('http://localhost:3000/users/interesting', { withCredentials: true });
  }
}