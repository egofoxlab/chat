/*
 * Developed by EGOFOXLAB.
 * Site http://egofoxlab.com/
 * Copyright (c) 2019.
 */

import {AfterViewInit, Component, ElementRef} from "@angular/core";

declare const $;

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss']
})
export class MessageComponent implements AfterViewInit {

	private elementRef;

	/**
	 * Is message from ME
	 */
	public fromMe = false;

	/**
	 * Message text
	 */
	public text: string;

	/**
	 * Message date
	 */
	public date: string;

	/**
	 * Avatar URL
	 */
	private _avatar: string;


	public get avatar(): string {
		return this._avatar;
	}

	public set avatar(value: string) {
		this._avatar = value;

		this.setAvatar();
	}

	constructor(private _elementRef: ElementRef) {
		this.elementRef = $(_elementRef.nativeElement);
	}

	ngAfterViewInit(): void {
		this.setAvatar();
	}

	/**
	 * Set avatar
	 */
	public setAvatar() {
		this.elementRef.find('.avatar div').css('background-image', `url(${this._avatar})`);
	}

}
