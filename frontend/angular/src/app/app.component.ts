import {AfterViewInit, Component, ElementRef, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {of} from "rxjs";

declare let EgoChat;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
	title = 'frontend';

	private elementRef;
	private egoChat;

	constructor(private _elementRef: ElementRef) {
		this.elementRef = $(_elementRef.nativeElement);
	}

	ngAfterViewInit(): void {
		this.initChat();
	}

	private initChat() {
		this.egoChat = new EgoChat({
			serverUrl: 'ws://localhost:7000',
			onOpen: [this.onOpen.bind(this)],
			onMessage: [this.onMessage.bind(this)]
		});

		this.egoChat.init();
	}

	private onOpen(e) {
		console.log('On Open');

		console.log(e);
	}

	private onMessage(message: MessageEvent) {
		console.log('On Message');

		console.log(message.data);
	}

	private addMessage(message: string) {
		if (EgoUtil.empty(message)) {
			return;
		}

		message = message.trim();

		if (message === '') {
			return;
		}

		$('#message-container').append(`<div>${message}</div>`);
	}

	public eventSend(e) {
		let input = this.elementRef.find('#chat-input').val();

		if (EgoUtil.empty(input)) {
			alert('Fill input field!');
		}

		input = input.trim();

		if (input === '') {
			alert('Fill input field!');
		}

		this.egoChat.send(input);

		this.elementRef.find('#chat-input').val('');
	}

}
