import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { SocketioService } from './socketio.service';
import { User, Message } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private url = 'http://localhost:3000';
    private id: number;
    private matchesInfos: User[] = [];

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private socketService: SocketioService
    ) {
        this.id = this.localStorageService.getItem('id');
    }

    public initSocket(): void {
        this.socketService.initSocket();
    }

    getMatches(): Observable<User[]> {
        return this.http.get<any[]>(this.url + '/likes/matches/' + this.id, { withCredentials: true }).pipe(
            switchMap(matches => {
                const userObservables: Observable<User | null>[] = [];

                for (const match of matches) {
                    const userObservable = this.http.get<any>(this.url + '/users/' + match, { withCredentials: true }).pipe(
                        map(user => ({
                            id: match,
                            username: user.username,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            picture_1: 'data:image/jpeg;base64,' + user.picture_1,
                            status: "Offline",
                            block: {
                                id: -1,
                                author_id: -1,
                                blocked_user_id: -1,
                                isBlocked: false
                            }
                        } as User)),
                        catchError(error => of(null))
                    );
                    userObservables.push(userObservable);
                }
                return forkJoin(userObservables).pipe(
                    map(users => users.filter(user => user !== null) as User[])
                );
            })
        );
    }

    public sendMessage(message: string, recipient_id: number): Observable<any> {
        this.socketService.sendMessage(message, recipient_id);
        return this.http.post(this.url + '/messages/create', { message: message, author_id: this.id, recipient_id: recipient_id }, { withCredentials: true });
    }

    public getMessages(): Observable<any> {
        return this.socketService.getMessages();
    }

    public getAllUserStatusEvents(): Observable<any> {
        return this.socketService.getAllUserStatusEvents();
    }

    public getMessagesFromUser(recipient: User): Observable<Message[]> {
        return this.http.get<Message[]>(this.url + '/messages/' + this.id + "/" + recipient.id, { withCredentials: true });
    }

    public getStatus(recipient: User): Observable<any> {
        return this.socketService.getStatus(recipient);
    }

    public handleDisconnect(): Observable<any> {
        return this.socketService.handleDisconnect();
    }

    public isUserBlocked(user: User): Observable<any> {
        return this.http.get(this.url + '/blocks/' + this.id + "/" + user.id, { withCredentials: true });
    }

    public blockUser(recipient: User): Observable<any> {
        return this.http.post(this.url + '/blocks/create/', { author_id: this.id, recipient_id: recipient.id }, { withCredentials: true });
    }

    public emitBlock(blockId: number, recipient: User) {
        this.socketService.blockUser(blockId, recipient);
    }

    public emitUnblock(blockId: number, recipient: User) {
        this.socketService.unblockUser(blockId, recipient);
    }

    public unblockUser(user: User): Observable<any> {
        return this.http.post(this.url + '/blocks/delete/', { id: user.block.id }, { withCredentials: true });
    }

    public handleBlock(): Observable<any> {
        return this.socketService.handleBlock();
    }

    public handleUnblock(): Observable<any> {
        return this.socketService.handleUnblock();
    }

    public reportUser(recipient: User): Observable<any> {
        return this.http.post(this.url + '/reports/create/', { author_id: this.id, recipient_id: recipient.id }, { withCredentials: true });
    }
}