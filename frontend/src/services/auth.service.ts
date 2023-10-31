import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { LocalStorageService, localStorageName } from './local-storage.service';
import { DialogService } from './dialog.service';
import { SocketioService } from './socketio.service';
import { GetUserResponseData, LoginResponseData, RegisterResponseData, CompleteRegisterResponseData, IpApiResponseData, LocationIQApiResponseData, UpdateLocationResponseData } from '../models/models';
import { environment } from 'src/environments/environment.template';


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

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        const latitudeSaved = this.localStorageService.getItem(localStorageName.latitude);
        const longitudeSaved = this.localStorageService.getItem(localStorageName.longitude);
        if (!latitudeSaved || !longitudeSaved || !this._isInsideRadius(latitudeSaved, longitudeSaved, latitude, longitude, 30)) {
          this.updateLocation(latitude, longitude);
        }
      },
      (error) => {
        console.error('getLocation error : ', error);
        this.getLocationWithIp();
      });
    } else {
      console.log('Location not available with this browser.');
      this.getLocationWithIp();
    }
  }

  getLocationWithIp() {
    const latitudeSaved = this.localStorageService.getItem(localStorageName.latitude);
    const longitudeSaved = this.localStorageService.getItem(localStorageName.longitude);
    this.http.get<IpApiResponseData>('http://ip-api.com/json/?fields=status,message,lat,lon').subscribe(data => {
      const ipApiData: IpApiResponseData = data;
      if (ipApiData && ipApiData.lat && ipApiData.lon && ipApiData.lat > -90.0
        && ipApiData.lat < 90.0 && ipApiData.lon > -180.0 && ipApiData.lon < 180.0
        && !this._isInsideRadius(latitudeSaved, longitudeSaved, ipApiData.lat, ipApiData.lon, 30)) {
          this.updateLocation(ipApiData.lat, ipApiData.lon);
        }
    });
  }

  updateLocation(latitude: number, longitude: number) {
    const apiKey = environment.location_iq_key || 'default';
    const url = "https://us1.locationiq.com/v1/reverse?key="+apiKey+"&lat="+latitude+"&lon="+longitude+"&format=json";
      this.http.get<LocationIQApiResponseData>(url).subscribe(data => {
        const locationApiData = data;
        var city = "";
        if (locationApiData.address.municipality) {
          city = locationApiData.address.municipality;
        } else if (locationApiData.address.city) {
          city = locationApiData.address.city;
        }
        this.http.post<UpdateLocationResponseData>('http://localhost:3000/users/updateLocation', { latitude, longitude, city }, { withCredentials: true })
        .subscribe({
          next: (response) => {
            console.log('updateLocation successful:', response);
            this.localStorageService.setMultipleItems(
              { key: localStorageName.latitude, value: latitude},
              { key: localStorageName.longitude, value: longitude},
              { key: localStorageName.city, value: response.user.city || "" }
            );
          },
          error: (error) => {
            console.error('updateLocation failed:', error);
          }
        });
      });
  }

  _isInsideRadius(
    originalLatitude: number,
    originalLongitude: number,
    newLatitude: number,
    newLongitude: number,
    radiusInKm: number
  ): boolean {
    const earthRadiusInKm = 6371;
    const differenceLatitude = this._toRadians(newLatitude - originalLatitude);
    const differenceLongitude = this._toRadians(newLongitude - originalLongitude);
    //haversine formula
    const a =
      Math.sin(differenceLatitude / 2) * Math.sin(differenceLatitude / 2) +
      Math.cos(this._toRadians(originalLatitude)) * Math.cos(this._toRadians(newLatitude)) *
      Math.sin(differenceLongitude / 2) * Math.sin(differenceLongitude / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = earthRadiusInKm * c;
  
    return distance <= radiusInKm;
  }
  
  _toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
}