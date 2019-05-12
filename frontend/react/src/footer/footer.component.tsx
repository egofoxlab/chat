import React from 'react';
import './footer.component.scss';

export default class FooterComponent extends React.Component {

	render() {
		return (
			<footer className="footer">
				<address>
					©Copyright <a href="//egofoxlab.com" target="_blank">EGOFOXLAB</a>
				</address>
			</footer>
		);
	}

}
