<template>
    <footer class="footer">
        <address>
            ©Copyright <a href="//egofoxlab.com" target="_blank">EGOFOXLAB</a>
        </address>
    </footer>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component
	export default class FooterComponent extends Vue {

	}
</script>

<style lang="scss" scoped>
    :host {
        display: block;
        width: 100%;
        height: var(--footer-height);
    }

    .footer {
        display: flex;
        width: 100%;
        height: var(--footer-height);
        justify-content: flex-end;
        align-items: center;

        address {
            margin: 0;
            margin-right: 25px;
            padding: 0;
            text-align: right;
            font-size: 14px;
            font-style: normal;

            &, * {
                color: #fff;
            }
        }
    }

</style>
