import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {MessageComponent} from "./message/message.component";

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		MessageComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	entryComponents: [
		MessageComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
