import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetCitiesResponseData, GetInterestingUsersResponseData, GetSearchResultResponseData } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private http: HttpClient
  ) {
  }

  getCities(): Observable<GetCitiesResponseData> {
    return this.http.get<GetCitiesResponseData>('http://localhost:3000/users/cities', { withCredentials: true });
  }

  getSearchResult(age: string, fameRating: string, location: string, tags: string): Observable<GetSearchResultResponseData> {
    return this.http.get<GetSearchResultResponseData>('http://localhost:3000/users/search/' + age + "/" + fameRating + "/" + location + "/" + tags, { withCredentials: true });
  }

}