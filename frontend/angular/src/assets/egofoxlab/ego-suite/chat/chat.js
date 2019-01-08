function EgoChat(options) {

	var self = this;

	/**
	 * Socket server URL
	 *
	 * * @type {null|string}
	 */
	self.serverUrl = null;

	/**
	 * WebSocket Connection
	 *
	 * @type {null|WebSocket}
	 */
	self.connection = null;

	/**
	 * `onOpen` listener
	 *
	 * @type {Array}
	 */
	self.onOpen = [];

	//	Set `Server URL`
	if (!empty(options.serverUrl)) {
		self.serverUrl = options.serverUrl;
	}

	/**
	 * Set `Server URL`
	 *
	 * @param {string} serverUrl
	 */
	self.setServerUrl = function (serverUrl) {
		self.serverUrl = serverUrl
	};

	/**
	 * Set `onOpen` listener
	 *
	 * @param {Function} onOpen
	 */
	self.setOnOpen = function (onOpen) {
		if (typeof onOpen === 'function') {
			self.onOpen.push(onOpen);
		}
	};

	self.init = function () {
		self.connection = new WebSocket(self.serverUrl);

		self.connection.onopen = _onOpen;


	};

	//region Auxiliary functions
	/**
	 * Internal `onOpen` listener
	 *
	 * @param {Event} e
	 * @private
	 */
	function _onOpen(e) {
		if (!Array.isArray(self.onOpen)) {
			return;
		}

		for (var key in self.onOpen) {
			if (!self.onOpen.hasOwnProperty(key)) {
				continue;
			}

			var item = self.onOpen[key];

			if (typeof item !== 'function') {
				continue;
			}

			item(e);
		}
	}
	//endregion

	return self;

}
