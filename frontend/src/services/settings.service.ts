import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { GetUserResponseData } from "src/models/models";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class SettingsService {
	constructor(
		private localStorageService: LocalStorageService,
		private http: HttpClient
	) { }

	public getUser(): Observable<GetUserResponseData> {
		const id = this.localStorageService.getItem("id");
		return this.http.get<GetUserResponseData>(`http://localhost:3000/users/${id}`, { withCredentials: true });
	}
}