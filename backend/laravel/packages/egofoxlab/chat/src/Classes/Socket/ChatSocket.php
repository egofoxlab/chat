<?php

namespace Egofoxlab\Chat\Classes\Socket;

use Egofoxlab\Chat\Classes\Socket\Base\BaseSocket;
use Ratchet\ConnectionInterface;

class ChatSocket extends BaseSocket {

	protected $clientList;

	public function __construct() {
		$this->clientList = new \SplObjectStorage();
	}

	function onOpen(ConnectionInterface $conn) {
		$this->clientList->attach($conn);

		$conn->send(json_encode([
			'type' => 'system',
			'userInfo' => [
				'id' => null,
				'name' => 'Administrator',
				'avatar' => null
			],
			'data' => [
				'text' => 'Welcome to EGO Chat demo!'
			]
		]));

		echo "New connection" . PHP_EOL;

		foreach ($this->clientList as $item) {
			$item->send("Greetings!\r\n
				Welcome to EGOCHAT!
				");
		}
	}

	function onClose(ConnectionInterface $conn) {
		$this->clientList->detach($conn);

		echo "Detach client. Current count: {$this->clientList->count()}" . PHP_EOL;

		foreach ($this->clientList as $item) {
			/** @var ConnectionInterface $client */
			$client = $item;

			$client->send("Someone detach.");
		}
	}

	function onError(ConnectionInterface $conn, \Exception $e) {
		echo "In client error occurred.";

		$conn->close();
	}

	function onMessage(ConnectionInterface $from, $msg) {
		$messageData = json_decode($msg, true);

		//  Do something with message for example check empty message, filter message etc.
		if (empty($messageData)) {
			return;
		}

		foreach ($this->clientList as $item) {
			/** @var ConnectionInterface $client */
			$client = $item;

			//$client->send("Hey! Message from someone! `{$msg}`");
			$client->send($msg);
		}
	}

}
