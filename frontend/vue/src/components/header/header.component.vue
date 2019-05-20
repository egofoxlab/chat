<template>
    <header class="header">
        <div class="logo">
            <div class="image">
                <div style="background-image: url('/assets/images/fox-brand.png');"></div>
            </div>

            <span>
			EGO CHAT
		</span>
        </div>
        <div class="chat-name">

        </div>
    </header>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component({
		name: 'HeaderComponent'
	})
	export default class HeaderComponent extends Vue {

		public message = 'Header component';

	}
</script>

<style scoped lang="scss">
    .header {
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        width: 100%;
        height: var(--header-height);
        background-color: #94b5c2;
        box-shadow: 0 2px 24px 0 rgba(121, 121, 121, 0.45);
        z-index: 99999;

        .logo {
            display: inline-flex;
            width: 250px;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            .image {
                display: inline-block;
                width: 88px;
                height: 60px;
                border-radius: 100%;

                div {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                }

                img {
                    width: 100%
                }
            }

            span {
                font-size: 20px;
                color: #fff;
            }
        }

        .chat-name {
            display: inline-flex;
            flex-grow: 1;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
    }

</style>
