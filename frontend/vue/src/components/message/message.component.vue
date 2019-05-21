<template>
    <div
            ref="elementRef"
            class="message"
            v-bind:class="{'from-me': fromMe}"
    >
        <div class="wrap">
            <div
                    class="name"
                    v-bind:class="{'from-me': fromMe}"
            >
                {{name}}
            </div>
            <div
                    v-if="!fromMe"
                    class="avatar"
            >
                <div></div>
            </div>
            <div class="content">
                <div class="text">{{text}}</div>
                <div class="info">
                    {{date}}
                </div>
            </div>
            <div
                    v-if="fromMe"
                    class="avatar"
            >
                <div></div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
	import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
	import $ from 'jquery';

	@Component
	export default class MessageComponent extends Vue {

		/**
		 * Is message from ME
		 */
		@Prop(Boolean)
		public fromMe!: boolean;

		/**
		 * User name
		 */
		@Prop(String)
		public name!: string;

		/**
		 * Message text
		 */
		@Prop(String)
		public text!: string;

		/**
		 * Message date
		 */
		@Prop(String)
		public date!: string;

		@Prop(String)
		public avatar!: string;

		private elementRef;

		public mounted() {
			this.elementRef = $(this.$el);

			this.setAvatar();
		}

		@Watch('avatar')
		public onAvatar(val: any, oldVal: any) {
			this.setAvatar();
		}

		/**
		 * Set avatar
		 */
		public setAvatar() {
			this.elementRef.find('.avatar div').css('background-image', `url(${this.avatar})`);
		}

	}
</script>

<style lang="scss" scoped>
    .message {
        padding-bottom: 10px;

        &.from-me {
            .wrap {
                margin-right: 0;
                margin-left: auto;

                .avatar:first-child {
                    display: none;
                }

                .avatar:last-child {
                    display: block !important;
                }

                .content {
                    margin-left: 0 !important;
                    margin-right: 10px;
                }
            }
        }

        .wrap {
            display: flex;
            max-width: 400px;
            min-width: 200px;
            flex-wrap: wrap;

            .name {
                width: 100%;
                margin-bottom: 5px;
                padding-right: 20px;
                font-size: 14px;
                text-align: right;

                &.from-me {
                    padding-right: 0;
                    padding-left: 20px;
                    text-align: left;
                }
            }

            .avatar {
                width: 50px;
                flex-shrink: 0;

                &:last-child {
                    display: none;
                }

                div {
                    width: 50px;
                    height: 50px;
                    border-radius: 100%;
                    background-color: #ccc;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    box-shadow: 2px 2px 5px 0 #efefef;
                }
            }

            .content {
                margin-left: 10px;
                flex-grow: 1;

                .text {
                    min-height: 50px;
                    padding: 15px;
                    border-radius: 25px;
                    background-color: #fff;
                    box-shadow: 0 0 6px rgba(51, 51, 51, 0.12);
                    white-space: pre-line;
                }

                .info {
                    padding-top: 10px;
                    padding-right: 25px;
                    text-align: right;
                    font-size: 11px;
                    color: #333;
                }
            }
        }
    }
</style>
