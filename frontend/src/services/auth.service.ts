import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { LocalStorageService, localStorageName } from './local-storage.service';
import { DialogService } from './dialog.service';

interface RegisterResponseData {
  message: string;
  user: {
    id: number,
    username: string,
    email: string,
    fist_name: string,
    last_name: string,
    age: number,
    location_permission: boolean
  };
}

interface LoginResponseData {
  message: string;
  user: {
    id: number,
    username: string,
    fist_name: string,
    last_name: string,
    age: number,
    gender: string,
    sexual_preferences: string,
    biography: string,
    picture_1: string,
    picture_2: string,
    picture_3: string,
    picture_4: string,
    picture_5: string,
    location_permission: boolean,
    created_at: string
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService
  ) { }

  private isLogged = new Subject<boolean>();
  public isLoggedEmitter = this.isLogged.asObservable();
  logEmitChange(usr: boolean) {
    this.isLogged.next(usr);
  }

  getUserInfos() {
    if (!this.localStorageService.getItem("username"))
      return null;
    const data = {
      username: this.localStorageService.getItem("username") || null
    }
    return data;
  }

  checkLog() {
    if (!this.localStorageService.getItem("username"))
      return false;
    return true;
  }

  register(username: string, first_name: string, last_name: string, age: number, email: string, password: string): any {
    this.http.post<RegisterResponseData>('http://localhost:3000/users/register', { username, first_name, last_name, age, email, password }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.localStorageService.setMultipleItems(
            { key: localStorageName.id, value: response.user.id || -1 },
            { key: localStorageName.username, value: response.user.username || "" },
            { key: localStorageName.firstName, value: response.user.fist_name || "" },
            { key: localStorageName.lastName, value: response.user.last_name || "" },
            { key: localStorageName.age, value: response.user.age || -1 },
            { key: localStorageName.locationPermission, value: response.user.location_permission || false }
          );
          this.router.navigate(['']);
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
            { key: localStorageName.firstName, value: response.user.fist_name || "" },
            { key: localStorageName.lastName, value: response.user.last_name || "" },
            { key: localStorageName.age, value: response.user.age || -1 },
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
          this.router.navigate(['']);
          this.logEmitChange(true);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }

  logout() {
    this.http.post('http://localhost:3000/users/logout', {}, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
        complete: () => {
          this._frontLogOut(false);
        }
      });
  }

  _getUserInfosBack() {
    this.http.get('http://localhost:3000/users/' + this.localStorageService.getItem('id'), { withCredentials: true })
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

  _frontLogOut(errorHasOccured: boolean) {
    this.localStorageService.removeAllUserItem();
    this.router.navigate(['']);
    this.logEmitChange(false);
    if (errorHasOccured) {
      const dialogData = {
        title: 'Server error',
        text: 'An authentication error has occured, please log in again.'
      };
      this.dialogService.openDialog(dialogData);
    }
  }

  refreshToken(): Observable<any> {
    return this.http.post('http://localhost:3000/users/refreshToken', {}, { withCredentials: true });
  }
}