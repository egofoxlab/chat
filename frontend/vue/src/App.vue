<template>
    <div>
        <HeaderComponent></HeaderComponent>

        <main id="app">
            <div class="content">
                <div class="inner-content">
                    <div class="messages">

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

	@Component({
		components: {
			HeaderComponent,
			FooterComponent
		},
	})
	export default class App extends Vue {

		constructor() {
			super();

			console.log(EgoUtil.empty(false));

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
