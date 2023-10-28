import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CheckLikeResponseData,
    CheckMatchResponseData,
    CreateLikeResponseData,
    DeleteLikeResponseData
} from 'src/models/models';



interface CreateViewResponseData {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class RelationService {
    constructor(
        private http: HttpClient
    ) {
    }

    getCheckLike(authorId: Number, recipientId: Number): Observable<CheckLikeResponseData> {
        console.log("getCheckLike authorId = " + authorId + ", recipientId = " + recipientId)
        return this.http.get<CheckLikeResponseData>('http://localhost:3000/likes/check/' + authorId + '/' + recipientId, { withCredentials: true });
    }

    getCheckMatch(authorId: Number, recipientId: Number): Observable<CheckMatchResponseData> {
        console.log("getCheckMatch authorId = " + authorId + ", recipientId = " + recipientId)
        return this.http.get<CheckMatchResponseData>('http://localhost:3000/likes/checkMatch/' + authorId + '/' + recipientId, { withCredentials: true });
    }

    createLike(authorId: Number, recipientId: Number): Observable<CreateLikeResponseData> {
        console.log("createLike authorId = " + authorId + ", recipientId = " + recipientId);
        return this.http.post<CreateLikeResponseData>('http://localhost:3000/likes/create', { authorId, recipientId }, { withCredentials: true });
    }

    deleteLike(authorId: Number, recipientId: Number): Observable<DeleteLikeResponseData> {
        console.log("deleteLike authorId = " + authorId + ", recipientId = " + recipientId);
        return this.http.post<DeleteLikeResponseData>('http://localhost:3000/likes/delete', { authorId, recipientId }, { withCredentials: true });
    }

    createView(authorId: Number, recipientId: Number) {
        console.log("createView authorId = " + authorId + ", recipientId = " + recipientId);
        this.http.post<CreateViewResponseData>('http://localhost:3000/views/create', { authorId, recipientId }, { withCredentials: true }).subscribe(
            (response) => {
                console.log('post createView successful:', response);
            },
            (error) => {
                console.error('post createView failed:', error);
            })
    }

}