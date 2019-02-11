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
		foreach ($this->clientList as $item) {
			/** @var ConnectionInterface $client */
			$client = $item;

			$client->send("Hey! Message from someone! `{$msg}`");
		}
	}

}
