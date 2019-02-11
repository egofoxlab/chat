import {
	AfterViewInit,
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	ElementRef, ViewChild, ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import * as $ from 'jquery';
import {of} from "rxjs";
import {MessageComponent} from "./message/message.component";

declare let EgoChat;
declare let Identicon;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
	title = 'frontend';

	@ViewChild('messages', {read: ViewContainerRef}) _eMessages;

	private elementRef;
	private egoChat;

	constructor(private _elementRef: ElementRef,
				private resolver: ComponentFactoryResolver) {
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
	}

	private onMessage(message: MessageEvent) {
		console.log('On Message');

		this.addMessage(message.data);
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

	private addMessage(text: string) {
		const factory: ComponentFactory<MessageComponent> = this.resolver.resolveComponentFactory(MessageComponent);
		const componentRef: ComponentRef<MessageComponent> = this._eMessages.createComponent(factory);
		const component: MessageComponent = componentRef.instance;

		component.fromMe = false;
		component.text = text;
		component.date = '02.02.2019';
		component.avatar = this.generateAvatar();
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
