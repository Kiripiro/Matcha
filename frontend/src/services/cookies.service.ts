import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  constructor() {}

  getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    console.log("size = " + document.cookie.length);
    console.log("doc.cookie = " + document.cookie);
    for (const cookie of cookies) {
        console.log("cookie = " + cookie);
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

//   setCookie(name: string, value: string, days: number): void {
//     const expirationDate = new Date();
//     expirationDate.setDate(expirationDate.getDate() + days);
//     const cookieValue = encodeURIComponent(value) + `; expires=${expirationDate.toUTCString()}`;
//     document.cookie = `${name}=${cookieValue}`;
//   }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}