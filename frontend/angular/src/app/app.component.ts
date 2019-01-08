import {AfterViewInit, Component, ElementRef} from '@angular/core';
import * as $ from 'jquery';

declare let EgoChat;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'frontend';

    private elementRef;
    private connection;

    constructor(private _elementRef: ElementRef) {
        this.elementRef = $(_elementRef.nativeElement);
    }

    ngAfterViewInit(): void {
        this.initChat();
    }

    private initChat() {
        const egoChat = new EgoChat({
            serverUrl: 'ws://localhost:7000'
        });

        egoChat.setOnOpen((e) => {
            console.log(e);
        });

        egoChat.init();

        /*this.connection = new WebSocket('ws://localhost:7000');

        this.connection.onopen = (e: any) => {
            console.log(`WS - OPEN CONNECTION`);
        };

        this.connection.onmessage = (e: any) => {
            console.log(`WS - OPEN MESSAGE: ${e.data}`);

            this.addMessage(e.data);
        };*/
    }

    private addMessage(message: string) {
        if (message === undefined || message === null) {
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

        if (input === undefined || input === null) {
            alert('Fill input field!');
        }

        input = input.trim();

        if (input === '') {
            alert('Fill input field!');
        }

        this.connection.send(input);

        this.elementRef.find('#chat-input').val('');
    }

}
