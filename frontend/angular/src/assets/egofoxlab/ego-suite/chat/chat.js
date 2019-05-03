/**
 *
 * @param {object} options
 * @param {string} options.serverUrl - Server URL of chat
 * @param {string} options.format - Message format
 * @param {Function|Function[]} [options.onClose] - `onClose` listener/s
 * @param {Function|Function[]} [options.onError] - `onError` listener/s
 * @param {Function|Function[]} [options.onMessage] - `onMessage` listener/s
 * @param {Function|Function[]} [options.onOpen] - `onOpen` listener/s
 * @returns {EgoChat}
 * @constructor
 */
function EgoChat(options) {

	var self = this;

	/**
	 * Socket server URL
	 *
	 * * @type {null|string}
	 */
	self.serverUrl = null;

	/**
	 * Message format
	 *
	 * @type {string}
	 */
	self.format = EgoChat.Format.JSON;

	/**
	 * WebSocket Connection
	 *
	 * @type {null|WebSocket}
	 */
	self.connection = null;

	/**
	 * `onClose` listeners
	 *
	 * @type {Array}
	 */
	self.onClose = [];

	/**
	 * `onError` listeners
	 *
	 * @type {Array}
	 */
	self.onError = [];

	/**
	 * `onMessage` listeners
	 *
	 * @type {Array}
	 */
	self.onMessage = [];

	/**
	 * `onOpen` listeners
	 *
	 * @type {Array}
	 */
	self.onOpen = [];

	/**
	 * `onBeforeSend` listeners
	 *
	 * @type {Array}
	 */
	self.onBeforeSend = [];

	/**
	 * `onAfterSend` listeners
	 *
	 * @type {Array}
	 */
	self.onAfterSend = [];

	/**
	 * Set `Server URL`
	 *
	 * @param {string} serverUrl
	 */
	self.setServerUrl = function (serverUrl) {
		self.serverUrl = serverUrl
	};

	/**
	 * Set `Message Format`
	 *
	 * @param {string} format
	 */
	self.setFormat = function (format) {
		if (!EgoUtil.empty(format) && $.inArray(format, [
			EgoChat.Format.JSON
		]) !== -1) {
			self.format = format;
		}
	};

	//region `onClose` listener
	/**
	 * Set `onClose` listener
	 *
	 * @param {Function} onClose
	 */
	self.setOnClose = function(onClose) {
		EgoUtil.setListener(self.onClose, onClose);
	};

	/**
	 * Remove `onClose` listener by function
	 *
	 * @param {Function} onClose
	 */
	self.removeOnClose = function(onClose) {
		removeListener(self.onClose, onClose);
	};

	/**
	 * Remove all `onClose` listeners
	 */
	self.removeAllOnClose = function() {
		self.onClose = [];
	};
	//endregion

	//region `onError` listener
	/**
	 * Set `onError` listener
	 *
	 * @param {Function} onError
	 */
	self.setOnError = function(onError) {
		EgoUtil.setListener(self.onError, onError);
	};

	/**
	 * Remove `onError` listener by function
	 *
	 * @param {Function} onError
	 */
	self.removeOnError = function(onError) {
		removeListener(self.onError, onError);
	};

	/**
	 * Remove all `onError` listeners
	 */
	self.removeAllOnError = function() {
		self.onError = [];
	};
	//endregion

	//region `onMessage` listener
	/**
	 * Set `onMessage` listener
	 *
	 * @param {Function} onMessage
	 */
	self.setOnMessage = function(onMessage) {
		EgoUtil.setListener(self.onMessage, onMessage);
	};

	/**
	 * Remove `onMessage` listener by function
	 *
	 * @param {Function} onMessage
	 */
	self.removeOnMessage = function(onMessage) {
		removeListener(self.onMessage, onMessage);
	};

	/**
	 * Remove all `onMessage` listeners
	 */
	self.removeAllOnMessage = function() {
		self.onMessage = [];
	};
	//endregion

	//region `onOpen` listener
	/**
	 * Set `onOpen` listener
	 *
	 * @param {Function} onOpen
	 */
	self.setOnOpen = function (onOpen) {
		EgoUtil.setListener(self.onOpen, onOpen);
	};

	/**
	 * Remove `onOpen` listener by function
	 *
	 * @param {Function} onOpen
	 */
	self.removeOnOpen = function (onOpen) {
		removeListener(self.onOpen, onOpen);
	};

	/**
	 * Remove all `onOpen` listeners
	 */
	self.removeAllOnOpen = function () {
		self.onOpen = [];
	};
	//endregion

	//region `onBeforeSend` listener
	/**
	 * Set `onBeforeSend` listener
	 *
	 * @param {Function} onBeforeSend
	 */
	self.setOnBeforeSend = function (onBeforeSend) {
		EgoUtil.setListener(self.onBeforeSend, onBeforeSend);
	};

	/**
	 * Remove `onBeforeSend` listener by function
	 *
	 * @param {Function} onBeforeSend
	 */
	self.removeOnBeforeSend = function (onBeforeSend) {
		removeListener(self.onBeforeSend, onBeforeSend);
	};

	/**
	 * Remove all `onBeforeSend` listeners
	 */
	self.removeAllOnBeforeSend = function () {
		self.onBeforeSend = [];
	};
	//endregion

	//region `onAfterSend` listener
	/**
	 * Set `onAfterSend` listener
	 *
	 * @param {Function} onAfterSend
	 */
	self.setOnAfterSend = function (onAfterSend) {
		EgoUtil.setListener(self.onAfterSend, onAfterSend);
	};

	/**
	 * Remove `onAfterSend` listener by function
	 *
	 * @param {Function} onAfterSend
	 */
	self.removeOnAfterSend = function (onAfterSend) {
		removeListener(self.onAfterSend, onAfterSend);
	};

	/**
	 * Remove all `onAfterSend` listeners
	 */
	self.removeAllOnAfterSend = function () {
		self.onAfterSend = [];
	};
	//endregion

	//	Handle input options from users
	_handleInputOptions();

	self.init = function () {
		self.connection = new WebSocket(self.serverUrl);

		self.connection.onclose = _onClose;
		self.connection.onerror = _onError;
		self.connection.onmessage = _onMessage;
		self.connection.onopen = _onOpen;
	};

	/**
	 * Send message
	 *
	 * @param {String} message
	 */
	self.send = function(message) {
		EgoUtil.eachListener(self.onBeforeSend, function (listener) {
			listener();
		});

		self.connection.send(message);

		EgoUtil.eachListener(self.onAfterSend, function (listener) {
			listener();
		});
	};

	//region Auxiliary functions
	/**
	 * Handle input options
	 *
	 * @private
	 */
	function _handleInputOptions() {
		//	Set `Server URL`
		if (!EgoUtil.empty(options.serverUrl)) {
			self.serverUrl = options.serverUrl;
		}

		//	Set `Message Format`
		if (!EgoUtil.empty(options.format) && $.inArray(options.format, [
			EgoChat.Format.JSON
		]) !== -1) {
			self.format = options.format;
		}

		//	Set `onClose` listeners
		if (!EgoUtil.empty(options.onClose)) {
			if (Array.isArray(options.onClose)) {
				options.onClose.forEach(function (item) {
					self.setOnClose(item);
				});
			} else {
				self.setOnClose(options.onClose);
			}
		}

		//	Set `onError` listeners
		if (!EgoUtil.empty(options.onError)) {
			if (Array.isArray(options.onError)) {
				options.onError.forEach(function (item) {
					self.setOnError(item);
				});
			} else {
				self.setOnError(options.onError);
			}
		}

		//	Set `onMessage` listeners
		if (!EgoUtil.empty(options.onMessage)) {
			if (Array.isArray(options.onMessage)) {
				options.onMessage.forEach(function (item) {
					self.setOnMessage(item);
				});
			} else {
				self.setOnMessage(options.onMessage);
			}
		}

		//	Set `onOpen` listeners
		if (!EgoUtil.empty(options.onOpen)) {
			if (Array.isArray(options.onOpen)) {
				options.onOpen.forEach(function (item) {
					self.setOnOpen(item);
				});
			} else {
				self.setOnOpen(options.onOpen);
			}
		}
	}

	/**
	 * Internal `onClose` listener
	 *
	 * @param {Event} e
	 * @private
	 */
	function _onClose(e) {
		EgoUtil.eachListener(self.onClose, function (listener) {
			listener(e);
		});
	}

	/**
	 * Internal `onError` listener
	 *
	 * @param {Event} e
	 * @private
	 */
	function _onError(e) {
		EgoUtil.eachListener(self.onError, function (listener) {
			listener(e);
		});
	}

	/**
	 * Internal `onMessage` listener
	 *
	 * @param {Event} e
	 * @private
	 */
	function _onMessage(e) {
		EgoUtil.eachListener(self.onMessage, function (listener) {
			listener(e);
		});
	}

	/**
	 * Internal `onOpen` listener
	 *
	 * @param {Event} e
	 * @private
	 */
	function _onOpen(e) {
		EgoUtil.eachListener(self.onOpen, function (listener) {
			listener(e);
		});
	}
	//endregion

	return self;

}

//	Message format
EgoChat.Format = {
	JSON: 'json'
};

