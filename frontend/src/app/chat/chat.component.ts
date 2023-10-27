import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ChatService } from 'src/services/chat.service';

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

  @ViewChild(MatMenuTrigger) private menuTrigger!: MatMenuTrigger;
  @ViewChild('chatMessagesContainer') private myScrollContainer!: ElementRef;
  @ViewChild('inputContainer') private inputContainer!: ElementRef;
  @ViewChild('input') private input!: ElementRef;

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

    this.chatService
      .handleBlock()
      .subscribe((users) => {
        if (this.selectedConversation) {
          if (this.selectedConversation.id == users.author_id) {
            if (this.input) {
              this.input.nativeElement.disabled = true;
              this.input.nativeElement.placeholder = "The relationship is blocked with this user";
            }
            this.selectedConversation!.block = {
              id: users.blockId,
              author_id: users.author_id,
              blocked_user_id: users.recipient_id,
              isBlocked: true
            }
          }
        }
      });

    this.chatService
      .handleUnblock()
      .subscribe((users) => {
        if (this.selectedConversation) {
          if (this.selectedConversation.id == users.author_id) {
            if (this.input) {
              this.input.nativeElement.disabled = false;
              this.input.nativeElement.placeholder = "Type a message...";
            }
            this.selectedConversation!.block = {
              id: 0,
              author_id: 0,
              blocked_user_id: 0,
              isBlocked: false
            }
          }
        }
      });
  }

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
      status: match.status,
      block: match.block
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

    this.chatService.isUserBlocked(user).subscribe({
      next: (res: any) => {
        if (res && res.exist) {
          this.selectedConversation!.block = {
            id: res.data[0].id,
            author_id: res.data[0].author_id,
            blocked_user_id: res.data[0].recipient_id,
            isBlocked: true
          }
          if (this.input) {
            this.input.nativeElement.disabled = true;
            this.input.nativeElement.placeholder = "The relationship is blocked with this user";
          }
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
        if (messages) {
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
        }
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
        if (res && res.message == "Block created") {
          if (this.selectedConversation)
            this.chatService.emitBlock(res.blockId, this.selectedConversation);
          this.selectedConversation!.block = {
            id: res.blockId,
            author_id: res.data.author_id,
            blocked_user_id: res.data.recipient_id,
            isBlocked: true
          }
          if (this.input) {
            this.input.nativeElement.disabled = true;
            this.input.nativeElement.placeholder = "The relationship is blocked with this user";
          }
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  unblockUser(user: User) {
    this.chatService.unblockUser(user).subscribe({
      next: (res: any) => {
        if (res && res.message == "Block deleted") {
          if (this.selectedConversation)
            this.chatService.emitUnblock(res.blockId, this.selectedConversation);
          this.selectedConversation!.block = {
            id: 0,
            author_id: 0,
            blocked_user_id: 0,
            isBlocked: false
          };
          if (this.input) {
            this.input.nativeElement.disabled = false;
            this.input.nativeElement.placeholder = "Type a message...";
          }
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}