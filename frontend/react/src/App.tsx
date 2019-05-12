import './App.scss';
import * as React from "react";
import $ from 'jquery';
import HeaderComponent from "./header/header.component";
import FooterComponent from "./footer/footer.component";
import * as Identicon from "identicon.js";
import {RefObject} from "react";
import MessageComponent from "./message/message.component";
import * as EgoUtil from "@egofoxlab/util";
import {Chat} from "@egofoxlab/chat";
import {IMessageItem} from "./interfaces/message-item.interface";
import {IUserInfo} from "./interfaces/user-info.interface";

export default class App extends React.Component {

    private _elementRef: any = React.createRef();

    private elementRef: any = React.createRef();

    private _eMessages: RefObject<HTMLDivElement> = React.createRef();

    //	Chat instance
    private egoChat!: Chat;

    //	Current user info
    private userInfo!: IUserInfo;

    //	Chat users
    private users: any = {};

    private messages: IMessageItem[] = [];

    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };

        this.initUser();
        this.initChat();
    }

    componentDidMount() {
        this.elementRef = $(this._elementRef.current);
    }

    /**
     * Init user info
     */
    private initUser() {
        this.userInfo = new IUserInfo();
        //	Mock user ID 'cause it's dome and use single chat like one private
        this.userInfo.id = Math.floor((new Date()).getTime() / 1000);
        //	User name
        this.userInfo.name = `User ${this.userInfo.id}`;
        //	User avatar
        this.userInfo.avatar = this.generateAvatar();
    }

    /**
     * Init chat
     */
    private initChat() {
        this.egoChat = new Chat({
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

        //	Parse old message(history)
        EgoUtil.getArrItem(messageItem!.data, 'oldMessages', []).forEach((oldMessage) => {
            const oldMessageItem = this.parseInputMessage(oldMessage);

            //	Skip empty messages
            if (EgoUtil.empty(oldMessageItem)) {
                return;
            }

            this.addMessage(oldMessageItem!);
        });

        this.addMessage(messageItem!);
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
                chatId: 1,
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
        this.messages.push(message);

        this.setState({
            messages: this.messages
        });
    }

    /**
     * Parse input message
     *
     * @param data
     */
    private parseInputMessage(data: any): IMessageItem | null {
        let messageItem;
        let messageData;

        //	Parse input message data
        try {
            if (typeof data === 'string') {
                messageData = JSON.parse(data);
            } else if (typeof data === 'object') {
                messageData = data;
            } else {
                throw new Error('Invalid message data.');
            }

            messageItem = new IMessageItem();
            messageItem.userInfo = {
                id: parseInt(messageData.userInfo.id, 10),
                name: messageData.userInfo.name,
                avatar: EgoUtil.empty(messageData.userInfo.avatar) ? this.generateAvatar() : messageData.userInfo.avatar
            };

            //	Check saved users
            if (messageItem.userInfo.id > 0) {
                if (EgoUtil.empty(this.users[messageItem.userInfo.id])) {
                    //	Save user
                    this.users[messageItem.userInfo.id] = messageItem.userInfo;
                } else {
                    messageItem.userInfo.avatar = this.users[messageItem.userInfo.id].avatar;
                }
            }

            //	Check message type
            switch (messageData.type) {
                //	Generate avatar for system message
                case 'system':
                    messageItem.userInfo.avatar = this.generateAvatar();

                    break;
            }

            messageItem.data = {
                text: messageData.data.text,
                date: messageData.data.date,
                ...messageData.data
            };
        } catch (ex) {
            console.warn(ex.message);

            return null;
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

    render() {
        return (
            <div ref={this._elementRef}>
                <HeaderComponent/>

                <main>
                    <div className="content">
                        <div className="inner-content">
                            <div className="messages" ref={this._eMessages}>
                                {
                                    this.state['messages'].map((item, i) => {
                                        return <div key={i}>
                                            <MessageComponent
                                                fromMe={this.userInfo.id === item.userInfo.id}
                                                name={item.userInfo.name}
                                                text={item.data.text}
                                                date={item.data.date}
                                                avatar={item.userInfo.avatar}
                                            />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="footer-container">
                        <div className="form">
                            <div className="input">
                                <div className="wrap">
                                    <textarea
                                        id="chat-input"
                                        rows={3}
                                        placeholder="Your message..."
                                    />
                                </div>
                            </div>
                            <div className="send">
                                <button
                                    type="button"
                                    onClick={this.eventSend.bind(this)}
                                >
                                    SEND
                                </button>
                            </div>
                        </div>

                        <FooterComponent/>
                    </div>
                </main>
            </div>
        );
    }
}
