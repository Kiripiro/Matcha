import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { SocketioService } from './socketio.service';

interface Block {
    id: number;
    author_id: number;
    blocked_user_id: number;
    isBlocked: boolean;
}

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    picture_1: string;
    status: string;
    block: Block;
}

interface Message {
    id: number;
    author_id: number;
    recipient_id: number;
    message: string;
    date: Date;
}

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

    public getMatches(): User[] {
        const matches = this.http.get(this.url + '/likes/matches/' + this.id, { withCredentials: true });
        matches.subscribe((res: any) => {
            res.forEach((match: any) => {
                this.http.get(this.url + '/users/' + match, { withCredentials: true }).subscribe((user: any) => {
                    const retUser: User = {
                        id: match,
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        picture_1: 'data:image/jpeg;base64,' + user.picture_1,
                        status: "Offline",
                        block: {
                            id: 0,
                            author_id: 0,
                            blocked_user_id: 0,
                            isBlocked: false
                        }
                    };
                    if (this.matchesInfos.find((user) => user.id === retUser.id))
                        return;
                    this.matchesInfos.push(retUser);
                });
            });
        });
        return this.matchesInfos;
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
        console.log('emit block', blockId, recipient);
        this.socketService.blockUser(blockId, recipient);
    }

    public emitUnblock(blockId: number, recipient: User) {
        console.log('emit unblock', blockId, recipient);
        this.socketService.unblockUser(blockId, recipient);
    }

    public unblockUser(user: User): Observable<any> {
        console.log(user.block.id);
        return this.http.post(this.url + '/blocks/delete/',  {id: user.block.id}, { withCredentials: true });
    }

    public handleBlock(): Observable<any> {
        return this.socketService.handleBlock();
    }

    public handleUnblock(): Observable<any> {
        return this.socketService.handleUnblock();
    }
}