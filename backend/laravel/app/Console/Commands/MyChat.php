<?php

namespace App\Console\Commands;

use Egofoxlab\LaravelChat\Classes\Socket\ChatSocket;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class MyChat extends \Egofoxlab\LaravelChat\Commands\ChatServer {

	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'my_chat:serve';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'My Chat';

	/**
	 * Your custom port for chat for default using 7000
	 */
	//protected $port = 8000;

	/**
	 * Execute the console command.
	 *
	 * @throws \DomainException
	 * @throws \RuntimeException
	 * @throws \UnexpectedValueException
	 */
	public function handle() {
		$this->info("Start `My Chat Server` on port {$this->port}...");

		$server = IoServer::factory(
			new HttpServer(
				new WsServer(
					new ChatSocket()
				)
			),
			$this->port
		);

		$server->run();
	}

}
