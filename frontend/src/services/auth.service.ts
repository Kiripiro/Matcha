import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { LocalStorageService, localStorageName } from './local-storage.service';
import { DialogService } from './dialog.service';
import { SocketioService } from './socketio.service';
import { GetUserResponseData, LoginResponseData, RegisterResponseData, CompleteRegisterResponseData } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
    private socketService: SocketioService
  ) {
    this.socketService.initSocket();
  }

  private isLogged = new Subject<boolean>();
  public isLoggedEmitter = this.isLogged.asObservable();
  logEmitChange(usr: boolean) {
    this.isLogged.next(usr);
  }

  getUserInfos(username: string): Observable<GetUserResponseData> {
    console.log("getUserInfos")
    return this.http.post<GetUserResponseData>('http://localhost:3000/users/username', { username }, { withCredentials: true });
  }

  getUserInfosById(id: number): Observable<GetUserResponseData> {
    console.log("getUserInfosById")
    return this.http.post<GetUserResponseData>('http://localhost:3000/users/id', { id }, { withCredentials: true });
  }

  checkLog() {
    if (!this.localStorageService.getItem(localStorageName.username))
      return false;
    return true;
  }

  checkCompleteRegister() {
    if (!this.localStorageService.getItem(localStorageName.completeRegister)) {
      return false;
    }
    return true;
  }

  checkLogAndLogout() {
    if (!this.checkLog()) {
      return ;
    }
    this.http.get<GetUserResponseData>('http://localhost:3000/users/id', { withCredentials: true }).subscribe({
        next: (response) => {
          console.log(response)
          this.localStorageService.setMultipleItems(
            { key: localStorageName.id, value: response.user.id || -1 },
            { key: localStorageName.username, value: response.user.username || "" },
            { key: localStorageName.firstName, value: response.user.first_name || "" },
            { key: localStorageName.lastName, value: response.user.last_name || "" },
            { key: localStorageName.age, value: response.user.age || -1 },
            { key: localStorageName.gender, value: response.user.gender || "" },
            { key: localStorageName.sexualPreferences, value: response.user.sexual_preferences || "" },
            { key: localStorageName.biography, value: response.user.biography || "" },
            { key: localStorageName.locationPermission, value: response.user.location_permission || false },
            { key: localStorageName.completeRegister, value: response.user.complete_register || false }
          );
          if (!this.socketService.socketExists()) {
            this.socketService.initSocket();
          }
          this.logEmitChange(true);
        },
        error: (error) => {
          console.error('User not log:', error);
          if (error == 'User not found') {
            this._frontLogOut('');
          } else {
            this._frontLogOut('Please try to log in again.');
          }
        }
      });
  }

  register(username: string, first_name: string, last_name: string, age: number, email: string, password: string): any {
    this.http.post<RegisterResponseData>('http://localhost:3000/users/register', { username, first_name, last_name, age, email, password }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.localStorageService.setMultipleItems(
            { key: localStorageName.id, value: response.user.id || -1 },
            { key: localStorageName.username, value: response.user.username || "" },
            { key: localStorageName.firstName, value: response.user.first_name || "" },
            { key: localStorageName.lastName, value: response.user.last_name || "" },
            { key: localStorageName.age, value: response.user.age || -1 },
            { key: localStorageName.locationPermission, value: response.user.location_permission || false }
          );
          if (!this.socketService.socketExists()) {
            this.socketService.initSocket();
          }
          this.router.navigate(['']);
          location.reload();
          this.logEmitChange(true);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
  }

  login(username: string, password: string) {
    this.http.post<LoginResponseData>('http://localhost:3000/users/login', { username, password }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.localStorageService.setMultipleItems(
            { key: localStorageName.id, value: response.user.id || -1 },
            { key: localStorageName.username, value: response.user.username || "" },
            { key: localStorageName.firstName, value: response.user.first_name || "" },
            { key: localStorageName.lastName, value: response.user.last_name || "" },
            { key: localStorageName.age, value: response.user.age || -1 },
            { key: localStorageName.completeRegister, value: response.user.complete_register || false },
            { key: localStorageName.sexualPreferences, value: response.user.sexual_preferences || "" },
            { key: localStorageName.biography, value: response.user.biography || "" },
            { key: localStorageName.picture1, value: response.user.picture_1 || "" },
            { key: localStorageName.picture2, value: response.user.picture_2 || "" },
            { key: localStorageName.picture3, value: response.user.picture_3 || "" },
            { key: localStorageName.picture4, value: response.user.picture_4 || "" },
            { key: localStorageName.picture5, value: response.user.picture_5 || "" },
            { key: localStorageName.locationPermission, value: response.user.location_permission || false },
            { key: localStorageName.createdAt, value: response.user.created_at || "" },
          );
          if (!this.socketService.socketExists()) {
            this.socketService.initSocket();
          }
          this.socketService.userConnect(response.user.id || -1);
          this.router.navigate(['']);
          location.reload();
          this.logEmitChange(true);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }

  logout() {
    this.socketService.disconnect();
    this.http.post('http://localhost:3000/users/logout', {}, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
        complete: () => {
          this._frontLogOut('');
        }
      });
  }

  completeRegister(gender: string, sexual_preferences: string, biography: string, files: string[], tags: string[]): any {
    this.http.post<CompleteRegisterResponseData>('http://localhost:3000/users/updateInfos', { gender, sexual_preferences, biography, files, tags }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('CompleteRegister success:', response);
          this.localStorageService.setMultipleItems(
            { key: localStorageName.completeRegister, value: true },
            { key: localStorageName.gender, value: response.user.gender || "" },
            { key: localStorageName.sexualPreferences, value: response.user.sexual_preferences || "" },
            { key: localStorageName.biography, value: response.user.biography || "" },
            { key: localStorageName.picture1, value: response.user.picture_1 || "" },
            { key: localStorageName.picture2, value: response.user.picture_2 || "" },
            { key: localStorageName.picture3, value: response.user.picture_3 || "" },
            { key: localStorageName.picture4, value: response.user.picture_4 || "" },
            { key: localStorageName.picture5, value: response.user.picture_5 || "" },
          );
          this.router.navigate(['']);

        },
        error: (error) => {
          console.error('CompleteRegister failed:', error);
        }
      });
  }

  _getUserInfosBack() {
    this.http.get('http://localhost:3000/users/1', { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('get successful:', response);
        },
        error: (error) => {
          console.error('get failed:', error);
        },
        complete: () => {
        }
      });
  }

  _frontLogOut(error: string) {
    this.logEmitChange(false);
    this.localStorageService.removeAllUserItem();
    this.router.navigate(['auth/login']);
    if (error.length > 0) {
      const dialogData = {
        title: 'Server error',
        text: error,
        text_yes_button: "",
        text_no_button: "Close",
        yes_callback: () => {},
        no_callback: () => {},
        reload: false
      };
      this.dialogService.openDialog(dialogData);
    }
  }

  refreshToken(): Observable<any> {
    return this.http.post('http://localhost:3000/users/refreshToken', {}, { withCredentials: true });
  }
}