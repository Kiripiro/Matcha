import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService, localStorageName } from "./local-storage.service";
import { GetUserResponseData, LocationIQApiResponseData, UpdateLocationResponseData, UserSettings } from "src/models/models";
import { Observable, map, of, switchMap } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment.template";

@Injectable({
	providedIn: "root"
})
export class SettingsService {
	private url = "http://localhost:3000";
	constructor(
		private localStorageService: LocalStorageService,
		private authService: AuthService,
		private http: HttpClient
	) { }

	public getUser(): Observable<GetUserResponseData> {
		return this.http.get<GetUserResponseData>(this.url + `/users/id`, { withCredentials: true });
	}

	public updateUser(user: Partial<UserSettings>, files: string[] | null): Observable<any> {
		return this.http.post(this.url + `/users/settingsUpdate`, { user, files }, { withCredentials: true });
	}

	public updateUserLocation(latitude: number, longitude: number): Observable<string> {
		const apiKey = environment.location_iq_key || 'default';
		const url = "https://us1.locationiq.com/v1/reverse?key=" + apiKey + "&lat=" + latitude + "&lon=" + longitude + "&format=json";

		return this.http.get<LocationIQApiResponseData>(url).pipe(
			map((data) => {
				const locationApiData = data;
				let city = "";
				if (locationApiData.address.municipality) {
					city = locationApiData.address.municipality;
				} else if (locationApiData.address.city) {
					city = locationApiData.address.city;
				}
				this.localStorageService.setMultipleItems(
					{ key: localStorageName.latitude, value: latitude },
					{ key: localStorageName.longitude, value: longitude },
					{ key: localStorageName.city, value: city || "" },
					{ key: localStorageName.locationPermission, value: true }
				);
				return city;
			})
		);
	}

	public deleteUser(): Observable<any> {
		return this.http.post(this.url + `/users/delete`, null, { withCredentials: true });
	}
}