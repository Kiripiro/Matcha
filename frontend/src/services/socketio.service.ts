import { Socket, io } from 'socket.io-client';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    picture_1: string;
    status?: string;
}
@Injectable({
    providedIn: 'root'
})
export class SocketioService {
    private url = 'http://localhost:3000';
    private socket: Socket;
    private id: number;

    constructor(
        private localStorageService: LocalStorageService,
    ) {
        this.id = this.localStorageService.getItem('id');
        this.socket = io(this.url, {
            query: { userId: this.id },
        });
    }

    public socketExists(): boolean {
        return this.socket !== null;
    }

    public initSocket(): void {
        if (this.id !== null && this.socketExists()) {
            this.socket.emit('init', this.id);
            this.sendUserStatus('online');
        }
    }

    private sendUserStatus(status: string): void {
        this.socket.emit('user-status', { userId: this.id, status });
    }

    public disconnect(): void {
        if (this.socket) {
            this.sendUserStatus('offline');
            this.socket.disconnect();
        }
    }

    public sendMessage(message: string, recipient_id: number): void {
        console.log("sendMessage", message, recipient_id);
        this.socket.emit('new-message', { message: message, author_id: this.id, recipient_id: recipient_id, date: new Date() });
    }

    public getMessages(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('refresh', (message) => {
                observer.next(message);
            });
        });
    }

    public getStatus(recipient: User): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('check-status', { senderId: this.id, recipientId: recipient.id })
            this.socket.on('status', (status) => {
                console.log("status", status);
                observer.next(status);
            });
        });
    }

    public userDisconnected(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('user-disconnected', (userId) => {
                observer.next(userId);
            });
        });
    }

    public handleDisconnect(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('user-disconnected', (userId) => {
                observer.next(userId);
            });
        });
    }
}