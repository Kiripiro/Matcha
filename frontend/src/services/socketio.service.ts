import { Socket, io } from 'socket.io-client';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusData, User } from 'src/models/models';

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
            reconnection: true,
            reconnectionAttempts: 3,
            timeout: 10000
        });
    }

    public socketExists(): boolean {
        return this.socket !== null;
    }

    public initSocket(): void {
        if (this.id !== null && this.socketExists()) {
            console.log("initSocket");
            this.socket.emit('init', this.id);
            this.sendUserStatus('Online');
        }
    }

    public disconnect(): void {
        console.log("disconnect");
        this.sendUserStatus('Offline'); //voir si utile
        this.socket.disconnect();
    }

    public userConnect(userId: number): void {
        console.log("userConnected"); //"connect" is a reserved event name
        this.socket.emit('userConnected', userId);
    }

    public sendMessage(message: string, recipient_id: number): void {
        this.socket.emit('new-message', { message: message, author_id: this.id, recipient_id: recipient_id, date: new Date() });
    }

    public getMessages(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('refresh', (message) => {
                observer.next(message);
            });
        });
    }

    public getAllUserStatusEvents(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('all-users-status-events', (status: StatusData) => {
                observer.next(status);
            });
        });
    }

    private sendUserStatus(status: string): void {
        console.log("sendUserStatus", status)
        this.socket.emit('user-status', { userId: this.id, status });
    }

    public getStatus(recipient: User): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('check-status', { senderId: this.id, recipientId: recipient.id })
            this.socket.on('status', (statusData: StatusData) => {
                console.log("status", statusData);
                observer.next(statusData);
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

    public blockUser(blockId: number, user: User) {
        this.socket.emit('block-user', { blockId: blockId, author_id: this.id, recipient_id: user.id });
    }

    public unblockUser(blockId: number, user: User) {
        this.socket.emit('unblock-user', { blockId: blockId, author_id: this.id, recipient_id: user.id });
    }

    public handleBlock(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('user-blocked', (userIds) => {
                observer.next(userIds);
            })
        })
    }

    public handleUnblock(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('user-unblocked', (userIds) => {
                observer.next(userIds);
            })
        })
    }
}