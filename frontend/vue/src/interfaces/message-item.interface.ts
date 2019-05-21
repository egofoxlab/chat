/*
 * Developed by EGOFOXLAB.
 * Site http://egofoxlab.com/
 * Copyright (c) 2019.
 */

export class IMessageItem {

	/**
	 * User info
	 */
	public userInfo?: {
		//	User ID
		id: number,
		//	User name
		name: string
		//	User avatar
		avatar: string;
	};

	/**
	 * Message data
	 */
	public data?: {
		//	Message text
		text: string,
		//	Message date
		date: string
	};

}
