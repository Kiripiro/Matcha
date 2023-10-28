import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { GetUserResponseData } from "src/models/models";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class SettingsService {
	private url = "http://localhost:3000";
	constructor(
		private localStorageService: LocalStorageService,
		private http: HttpClient
	) { }

	public getUser(): Observable<GetUserResponseData> {
		const id = this.localStorageService.getItem("id");
		return this.http.get<GetUserResponseData>(this.url + `/users/${id}`, { withCredentials: true });
	}

	public updateUser(user: any): Observable<any> {
		const id = this.localStorageService.getItem("id");
		return this.http.post(this.url + `users/${id}`, user, { withCredentials: true });
	}
}