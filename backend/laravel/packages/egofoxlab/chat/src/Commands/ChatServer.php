<?php

/**
 * Developed by EGOFOXLAB.
 * Site http://egofoxlab.com/
 * Copyright (c) 2019.
 */

namespace Egofoxlab\Chat\Commands;

use Egofoxlab\Chat\Classes\Providers\ChatProvider;
use Egofoxlab\Chat\Classes\Socket\ChatSocket;
use Egofoxlab\Chat\Classes\Struct\ChatRowStruct;
use Illuminate\Console\Command;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class ChatServer extends Command {
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'chat_server:serve';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Run chat server.';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function handle() {
		$this->info("Start `Chat Server`...");

		//  Create new chat
		$chatProvider = new ChatProvider();
		$chatProvider->createChat(
			(new ChatRowStruct())
				->setCode('chat_code_' . time())
				->setName('chat_name_' . time()),
			[
				33,
				99
			]
		);

		$server = IoServer::factory(
			new HttpServer(
				new WsServer(
					new ChatSocket()
				)
			),
			7000
		);

		$server->run();
	}

}
