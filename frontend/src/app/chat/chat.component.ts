import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ChatService } from 'src/services/chat.service';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  picture_1: string;
  status: string;
}

interface Message {
  id: number;
  author_id: number;
  recipient_id: number;
  message: string;
  date: Date;
}

interface StatusData {
  userId: number;
  status: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  message!: string;
  users: User[] = [];
  selectedConversation: User | null = null;
  selectedConversationMessages: Message[] = [];

  constructor(
    private chatService: ChatService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.chatService.initSocket();
    this.chatService
      .getAllUserStatusEvents()
      .subscribe((statusData: StatusData) => {
        console.log("user status update, userId = " + statusData.userId + ", status = " + statusData.status)
        if (this.selectedConversation?.id == statusData.userId) {
          this.selectedConversation.status = statusData.status;
        }
      });
    this.chatService
      .getMessages()
      .subscribe((message: unknown) => {
        this.selectedConversationMessages.push(message as Message);
        this.scrollToBottom();
      });
    this.getMatches();
  }

  @ViewChild(MatMenuTrigger) private menuTrigger!: MatMenuTrigger;
  @ViewChild('chatMessagesContainer') private myScrollContainer!: ElementRef;
  @ViewChild('inputContainer') private inputContainer!: ElementRef;
  @ViewChild('input') private input!: ElementRef;

  triggerMenu() {
    this.menuTrigger.openMenu();
  }

  scrollToBottom(): void {
    try {
      this.changeDetectorRef.detectChanges();
      const container = this.myScrollContainer.nativeElement as HTMLElement;
      const lastMessage = container.lastElementChild as HTMLElement;
      const inputContainer = this.inputContainer.nativeElement as HTMLElement;

      if (lastMessage && container && inputContainer) {
        const scrollPosition = lastMessage.offsetTop - container.clientHeight + lastMessage.clientHeight + inputContainer.clientHeight;
        container.scrollTop = scrollPosition;
      }
    } catch (err) {
      console.log(err);
    }
  }

  getMatches() {
    const matches = this.chatService.getMatches();
    matches.map(match => ({
      id: match.id,
      username: match.username,
      first_name: match.first_name,
      last_name: match.last_name,
      picture_1: 'data:image/jpeg;base64,' + match.picture_1,
      status: match.status
    }));
    this.users = matches;
  }

  sendMessage(recipient_id: number | null) {
    if (!this.message || !recipient_id || recipient_id == null || !this.selectedConversation || !this.selectedConversation.id) {
      return;
    }
    this.chatService.sendMessage(this.message, recipient_id).subscribe({
      next: (res: any) => {
        this.selectedConversationMessages.push({
          id: res.id,
          author_id: res.author_id,
          recipient_id: res.recipient_id,
          message: res.data.message,
          date: new Date(res.data.date)
        });
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.message = '';
  }

  selectUser(user: User) {
    this.selectedConversation = user;

    const isBlocked = this.chatService.isUserBlocked(user).subscribe({
      next: (res: any) => {
        if (res.exist) {
          //disable this.input and add a placeholder "You have blocked this user"
          console.log(this.input.nativeElement);
          this.input.nativeElement.disabled = true;
          this.input.nativeElement.placeholder = "The relationship is blocked with this user";
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.chatService.getStatus(user).subscribe({
      next: (statusData: StatusData) => {
        console.log(statusData);
        user.status = statusData.status;
        if (this.selectedConversation && this.selectedConversation.id == statusData.userId)
          this.selectedConversation.status = statusData.status;
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.chatService.getMessagesFromUser(user).subscribe({
      next: (messages: Message[]) => {
        messages.forEach((message) => {
          message.date = new Date(message.date);
        });

        messages.sort((message1, message2) => {
          const date1 = new Date(message1.date).getTime();
          const date2 = new Date(message2.date).getTime();
          return date1 - date2;
        });
        this.selectedConversationMessages = messages;
        this.scrollToBottom();
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.selectedConversationMessages = [];
        }
        else {
          console.log(err);
        }
      }
    });
  }

  viewProfile(user: User) {
    this.router.navigate(['/profile/' + user.username]);
  }

  blockUser(user: User) {
    this.chatService.blockUser(user).subscribe({
      next: (res: any) => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.selectedConversation = null;
        this.selectedConversationMessages = [];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}