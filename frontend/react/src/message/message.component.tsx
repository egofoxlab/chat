/*
 * Developed by EGOFOXLAB.
 * Site http://egofoxlab.com/
 * Copyright (c) 2019.
 */

import * as React from "react";
import './message.component.scss';
import $ from 'jquery';

interface IMessageProps {
    fromMe: boolean;
    name: string;
    text: string;
    date: string;
    avatar: string;
}

export default class MessageComponent extends React.Component<IMessageProps> {

    private _elementRef: React.RefObject<HTMLDivElement> = React.createRef();
    private elementRef: any;

    /**
     * Is message from ME
     */
    public fromMe = false;

    /**
     * User name
     */
    public name!: string;

    /**
     * Message text
     */
    public text!: string;

    /**
     * Message date
     */
    public date!: string;

    /**
     * Avatar URL
     */
    private _avatar!: string;

    constructor(props) {
        super(props);

        this.fromMe = this.props.fromMe;
        this.name = this.props.name;
        this.text = this.props.text;
        this.date = this.props.date;
        this._avatar = this.props.avatar;
    }

    componentDidMount(): void {
        this.elementRef = $(this._elementRef.current!);

        this.setAvatar();
    }

    public get avatar(): string {
        return this._avatar;
    }

    public set avatar(value: string) {
        this._avatar = value;

        this.setAvatar();
    }

    /**
     * Set avatar
     */
    public setAvatar() {
        console.log(this.elementRef.get(0));
        console.log(this._avatar);
        this.elementRef.find('.avatar div').css('background-image', `url(${this._avatar})`);
    }

    public render() {
        return (
            <div
                className={`message ${this.fromMe ? 'from-me' : ''}`}
                ref={this._elementRef}
            >
                <div className="wrap">
                    <div
                        className="name"
                    >
                        {this.name}
                    </div>
                    {
                        !this.fromMe ?
                            <div
                                className="avatar"
                            >
                                <div/>
                            </div>
                            :
                            null
                    }
                    <div className="content">
                        <div className="text">
                            {this.text}
                        </div>
                        <div className="info">
                            {this.date}
                        </div>
                    </div>
                    {
                        this.fromMe ?
                            <div
                                className="avatar"
                            >
                                <div/>
                            </div>
                            :
                            null
                    }
                </div>
            </div>

        );
    }

}
