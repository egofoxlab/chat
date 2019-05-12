import './App.scss';
import * as React from "react";
import $ from 'jquery';
import HeaderComponent from "./header/header.component";
import FooterComponent from "./footer/footer.component";

export default class App extends React.Component {

    private elementRef: any = React.createRef();

    componentDidMount() {
        const e = $(document);
    }

    /**
     * Send message
     */
    eventSend() {
        console.log('send message');

        console.log(this.elementRef);
    }

    render() {
        return (
            <div ref={this.elementRef}>
                <HeaderComponent/>

                <main>
                    <div className="content">
                        <div className="inner-content">
                            <div className="messages">

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
