import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';


interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
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
    private socket: Socket;
    private id: number;
    private matchesInfos: User[] = [];

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
    ) {
        this.socket = io(this.url);
        this.id = this.localStorageService.getItem('id');
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
                        last_name: user.last_name
                    };
                    this.matchesInfos.push(retUser);
                });
            });
        });
        return this.matchesInfos;
    }

    public sendMessage(message: string, recipient_id: number): Observable<any> {
        return this.http.post(this.url + '/messages/create', { message: message, author_id: this.id, recipient_id: recipient_id }, { withCredentials: true });
    }

    public getMessages = () => {
        return new Observable((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }

    public getMessagesFromUser(recipient: User): Observable<Message[]> {
        return this.http.get<Message[]>(this.url + '/messages/' + this.id + "/" + recipient.id, { withCredentials: true });
    }
}