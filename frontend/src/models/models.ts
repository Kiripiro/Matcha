/* Chat */
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

/* Auth */
export interface RegisterResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		email: string,
		fist_name: string,
		last_name: string,
		age: number,
		location_permission: boolean
	};
}

export interface LoginResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		fist_name: string,
		last_name: string,
		age: number,
		gender: string,
		complete_register: boolean,
		sexual_preferences: string,
		biography: string,
		picture_1: string,
		picture_2: string,
		picture_3: string,
		picture_4: string,
		picture_5: string,
		location_permission: boolean,
		created_at: string
	};
}

export interface GetUserResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		fist_name: string,
		last_name: string,
		age: number,
		complete_register: boolean,
		gender: string,
		sexual_preferences: string,
		biography: string,
		picture_1: string,
		picture_2: string,
		picture_3: string,
		picture_4: string,
		picture_5: string,
		tags: string[],
		you_blocked_he: boolean,
		he_blocked_you: boolean,
		you_reported_he: boolean,
		location_permission: boolean
	};
}

export interface CompleteRegisterResponseData {
	message: string;
	user: {
		gender: string,
		sexual_preferences: string,
		biography: string,
		picture_1: string,
		picture_2: string,
		picture_3: string,
		picture_4: string,
		picture_5: string,
	};
}

/* Sockets */
export interface StatusData {
	userId: number;
	status: string;
}

/* Relations */
export interface CheckLikeResponseData {
	exist: boolean;
}

export interface CheckMatchResponseData {
	exist: boolean;
}

export interface CreateLikeResponseData {
	message: string;
	likeId: Number;
}

export interface DeleteLikeResponseData {
	message: string;
	deleted: boolean;
}

export interface CreateBlockResponseData {
	message: string;
	blockId: number;
	data: {
		author_id: number,
		recipient_id: number
	};
}

export interface DeleteBlockResponseData {
	message: string;
}

export interface CreateReportResponseData {
	message: string;
	blockId: number;
	data: {
		author_id: number,
		recipient_id: number
	};
}

export interface DeleteReportResponseData {
	message: string;
}

/* Settings */
export interface UserSettings {
	username: string;
	first_name: string;
	last_name: string;
	gender: string;
	sexual_preferences: string;
	biography: string;
	picture_1: string;
	picture_2: string;
	picture_3: string;
	picture_4: string;
	picture_5: string;
	tags: string[];
	location_permission: boolean;
}

/* Tags */
export interface Tag {
	id: number;
	name: string;
	owner_id: number;
}