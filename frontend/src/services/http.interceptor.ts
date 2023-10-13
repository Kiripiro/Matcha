import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {


  constructor(
    private authService: AuthService,
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // console.log("test = " + error.error)
          if (error.error == "Missing refreshToken" || error.error == "Invalid refreshToken") {
          // console.log("test 2 = " + error.error)

            this.authService._frontLogOut(true);
            return throwError(() => error);
          } else if (error.error == "Missing accessToken") {
            return this.authService.refreshToken().pipe(
              switchMap(() => {
                return next.handle(request);
              }),
              catchError((refreshError: any) => {
                return throwError(() => refreshError);
              })
            );
          } else {
            return throwError(() => error);
          }
        }
        return throwError(() => error);
      })
    );
  }
}