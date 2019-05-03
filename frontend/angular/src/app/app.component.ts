import {
	AfterViewInit,
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	ElementRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import * as $ from 'jquery';
import {MessageComponent} from "./message/message.component";
import {IUserInfo} from "./interfaces/user-info.interface";
import {IMessageItem} from "./interfaces/message-item.interface";
import * as EgoUtil from "@egofoxlab/util";

declare let EgoChat;
declare let Identicon;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

	title = 'EGO Chat';

	//	Messages container
	@ViewChild('messages', {read: ViewContainerRef}) _eMessages;

	//	Root element of component
	private elementRef;

	//	Chat instance
	private egoChat;

	//	Current user info
	private userInfo: IUserInfo;

	constructor(private _elementRef: ElementRef,
				private resolver: ComponentFactoryResolver) {
		this.elementRef = $(_elementRef.nativeElement);
	}

	ngAfterViewInit(): void {
		this.initUser();
		this.initChat();
	}

	/**
	 * Init user info
	 */
	private initUser() {
		this.userInfo = new IUserInfo();
		//	Mock user ID 'cause it's dome and use single chat like one private
		this.userInfo.id = (new Date()).getTime();
		//	User name
		this.userInfo.name = `User ${this.userInfo.id}`;
		//	User avatar
		this.userInfo.avatar = this.generateAvatar();
	}

	/**
	 * Init chat
	 */
	private initChat() {
		this.egoChat = new EgoChat({
			serverUrl: 'ws://localhost:7000',
			onOpen: [this.onOpen.bind(this)],
			onMessage: [this.onMessage.bind(this)]
		});

		this.egoChat.init();
	}

	/**
	 * Listener of open connection
	 *
	 * @param message
	 */
	private onOpen(message: MessageEvent) {
		const messageItem = this.parseInputMessage(message.data);

		//	Check empty message item
		if (EgoUtil.empty(messageItem)) {
			return;
		}

		this.addMessage(messageItem);
	}

	/**
	 * Listener on coming message
	 *
	 * @param message
	 */
	private onMessage(message: MessageEvent) {
		const messageItem = this.parseInputMessage(message.data);

		//	Check empty message item
		if (EgoUtil.empty(messageItem)) {
			return;
		}

		this.addMessage(messageItem);
	}

	/**
	 * Send message to chat
	 *
	 * @param e
	 */
	public eventSend(e) {
		let input = this.elementRef.find('#chat-input').val();
		input = EgoUtil.empty(input) ? '' : input;
		input = input.trim();

		if (input === '') {
			alert('Fill input field!');

			return;
		}

		//	Send JSON message
		this.egoChat.send(JSON.stringify({
			userInfo: {
				id: this.userInfo.id,
				name: this.userInfo.name,
				avatar: this.userInfo.avatar
			},
			data: {
				text: input
			}
		}));

		this.elementRef.find('#chat-input').val('');
	}

	/**
	 * Add message to chat
	 *
	 * @param message
	 */
	private addMessage(message: IMessageItem) {
		const factory: ComponentFactory<MessageComponent> = this.resolver.resolveComponentFactory(MessageComponent);
		const componentRef: ComponentRef<MessageComponent> = this._eMessages.createComponent(factory);
		const component: MessageComponent = componentRef.instance;

		component.fromMe = this.userInfo.id === message.userInfo.id;
		component.name = message.userInfo.name;
		component.text = message.data.text;
		component.date = '02.02.2019';
		component.avatar = message.userInfo.avatar;
	}

	/**
	 * Parse input message
	 *
	 * @param data
	 */
	private parseInputMessage(data: string): IMessageItem|null {
		let messageItem;

		//	Parse input message data
		try {
			const messageData = JSON.parse(data);
			messageItem = new IMessageItem();

			messageItem.userInfo = {
				id: parseInt(messageData.userInfo.id, 10),
				name: messageData.userInfo.name,
				avatar: messageData.userInfo.avatar
			};

			//	Check message type
			switch (messageData.type) {
				//	Generate avatar for system message
				case 'system':
					messageItem.userInfo.avatar = this.generateAvatar();

					break;
			}

			messageItem.data = {
				text: messageData.data.text
			};
		} catch (ex) {
			console.warn(`Can't parse input incoming message.`);
		}

		//	Check empty message item
		if (EgoUtil.empty(messageItem)) {
			return null;
		}

		return messageItem;
	}

	/**
	 * Generate avatar
	 */
	private generateAvatar() {
		// set up options
		const hash = "c157a79031e1c40f85931829bc5fc552";  // 15+ hex chars
		const options = {
			foreground: [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],               // rgba black
			background: [255, 255, 255, 255],         // rgba white
			margin: 0.25,                              // 20% margin
			size: 420,                                // 420px square
			format: 'svg'                             // use SVG instead of PNG
		};

		// create a base64 encoded SVG
		const data = new Identicon(hash, options).toString();

		// write to a data URI
		return 'data:image/svg+xml;base64,' + data;
	}

}
