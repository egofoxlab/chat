<template>
    <div>
        <HeaderComponent></HeaderComponent>

        <main id="app">
            <div class="content">
                <div class="inner-content">
                    <div
                            ref="messages"
                            class="messages"
                    >
                        <template v-for="message in messages">
                            <MessageComponent
                                    v-bind:fromMe="userInfo.id === message.userInfo.id"
                                    v-bind:name="message.userInfo.name"
                                    v-bind:text="message.data.text"
                                    v-bind:date="message.data.date"
                                    v-bind:avatar="message.userInfo.avatar"
                            ></MessageComponent>
                        </template>
                    </div>
                </div>
            </div>

            <div class="footer-container">
                <div class="form">
                    <div class="input">
                        <div class="wrap">
					<textarea
                            id="chat-input"
                            rows="3"
                            placeholder="Your message..."
                    ></textarea>
                        </div>
                    </div>
                    <div class="send">
                        <button
                                type="button"
                                v-on:click="eventSend($event)"
                        >
                            SEND
                        </button>
                    </div>
                </div>

                <FooterComponent></FooterComponent>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import HeaderComponent from './components/header/header.component.vue';
	import FooterComponent from '@/components/footer/footer.component.vue';
	import * as EgoUtil from '@egofoxlab/util';
	import MessageComponent from '@/components/message/message.component.vue';
	import {Chat} from '@egofoxlab/chat';
	import {IUserInfo} from '@/interfaces/user-info.interface';
	import {IMessageItem} from '@/interfaces/message-item.interface';
	import * as Identicon from 'identicon.js';
	import $ from 'jquery';

	@Component({
		components: {
			HeaderComponent,
			FooterComponent,
			MessageComponent
		},
	})
	export default class App extends Vue {

		private elementRef: any;

		private _eMessages: any;

		//	Chat instance
		private egoChat!: Chat;

		//	Current user info
		private userInfo!: IUserInfo;

		//	Chat users
		private users: any = {};

		private messages: IMessageItem[] = [];

		public mounted() {
			this.elementRef = $(this.$el);
			this._eMessages = $(this.$refs.messages);

			this.initUser();
			this.initChat();
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
				onMessage: [this.onMessage.bind(this)],
				onError: [function (e) {
					console.log(e);
				}]
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
		 * Add message to chat
		 *
		 * @param message
		 */
		private addMessage(message: IMessageItem) {
			this.messages.push(message);
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
			const hash = 'c157a79031e1c40f85931829bc5fc552';  // 15+ hex chars
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
</script>

<style lang="scss">
    html {
        scroll-behavior: smooth;

        height: 100%;

        body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;

            * {
                box-sizing: border-box;
                font-family: 'Roboto', sans-serif;
            }

            main {
                position: relative;
                min-height: 100%;

                > .content {
                    width: 100%;
                    padding-top: var(--header-height);
                    padding-bottom: var(--footer-height);

                    .inner-content {
                        padding: 25px;

                        .messages {

                        }
                    }
                }

                .footer-container {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    display: block;
                    width: 100%;
                    height: var(--footer-height);
                    background-color: #94b5c2;

                    .form {
                        display: flex;
                        width: 100%;
                        min-height: 100px;

                        .input {
                            padding: 10px 25px;
                            padding-top: 20px;
                            flex-grow: 1;

                            .wrap {
                                background-color: #fff;
                                height: 100%;
                                padding: 10px 12px;
                                border-radius: 2px;

                                textarea {
                                    width: 100%;
                                    height: 100%;
                                    padding: 10px;
                                    resize: none;
                                    border: none;
                                    outline: none;
                                    font-size: 16px;
                                }
                            }
                        }

                        .send {
                            width: 150px;
                            padding-top: 20px;
                            padding-right: 25px;
                            flex-shrink: 0;

                            button {
                                width: 100%;
                                padding: 10px;
                                margin: 0;
                                border: none;
                                outline: none;
                                background-color: #50ab33;
                                box-shadow: 0 5px 12px #50ab3391;
                                color: #fff;
                                font-size: 18px;
                                text-shadow: none;
                                border-radius: 30px;
                                cursor: pointer;
                                transition: background-color 150ms ease-in-out;

                                &:hover, &:active {
                                    background-color: #008329;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    :root {
        --header-height: 85px;
        --footer-height: 180px;
    }

    @media (max-width: 600px) {
        html {
            body {
                main {
                    .footer-container {
                        .form {
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;

                            .input {
                                width: 100%;
                            }

                            .send {
                                padding-top: 0;
                            }
                        }
                    }
                }
            }
        }
    }

</style>
