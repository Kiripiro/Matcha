import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CheckLikeResponseData,
    CheckMatchResponseData,
    CreateBlockResponseData,
    CreateLikeResponseData,
    CreateReportResponseData,
    DeleteBlockResponseData,
    DeleteLikeResponseData,
    DeleteReportResponseData,
    GetAllProfileLikesResponseData,
    GetAllProfileViewsResponseData
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

    createBlock(authorId: Number, recipientId: Number): Observable<CreateBlockResponseData> {
        return this.http.post<CreateBlockResponseData>('http://localhost:3000/blocks/create/', { author_id: authorId, recipient_id: recipientId }, { withCredentials: true });
    }

    deleteBlock(authorId: Number, recipientId: Number): Observable<DeleteBlockResponseData> {
        return this.http.post<DeleteBlockResponseData>('http://localhost:3000/blocks/delete/users', { author_id: authorId, recipient_id: recipientId }, { withCredentials: true });
    }

    createReport(authorId: Number, recipientId: Number): Observable<CreateReportResponseData> {
        return this.http.post<CreateReportResponseData>('http://localhost:3000/reports/create/', { author_id: authorId, recipient_id: recipientId }, { withCredentials: true });
    }

    deleteReport(authorId: Number, recipientId: Number): Observable<DeleteReportResponseData> {
        return this.http.post<DeleteReportResponseData>('http://localhost:3000/reports/delete/users', { author_id: authorId, recipient_id: recipientId }, { withCredentials: true });
    }

    getAllProfileViews(recipientId: number) {
        console.log(recipientId)
        return this.http.get<GetAllProfileViewsResponseData>('http://localhost:3000/views/recipient/' + recipientId, { withCredentials: true });
    }

    getAllProfileLikes(recipientId: number) {
        console.log(recipientId)
        return this.http.get<GetAllProfileLikesResponseData>('http://localhost:3000/likes/recipient/' + recipientId, { withCredentials: true });
    }
}