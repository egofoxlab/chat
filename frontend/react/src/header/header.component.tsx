import React from 'react';
import './header.component.scss';
export default class HeaderComponent extends React.Component {

	render() {
		return (
			<header className="header">
				<div className="logo">
					<div className="image">
						<div
							style={{backgroundImage: 'url(/assets/images/fox-brand.png)'}}
						/>
					</div>

					<span>
						EGO CHAT
					</span>
				</div>
				<div className="chat-name">

				</div>
			</header>
		);
	}

}
