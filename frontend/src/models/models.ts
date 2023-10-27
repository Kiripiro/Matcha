export interface Block {
	id: number;
	author_id: number;
	blocked_user_id: number;
	isBlocked: boolean;
  }

  export interface User {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	picture_1: string;
	status: string;
	block: Block;
  }

  export interface Message {
	id: number;
	author_id: number;
	recipient_id: number;
	message: string;
	date: Date;
  }

  export interface StatusData {
	userId: number;
	status: string;
  }