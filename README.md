# Chat

It is example of working two libraries of chat:
* php package [egofoxlab/laravel-chat](https://packagist.org/packages/egofoxlab/laravel-chat)
* npm package [@eogofoxlab/chat](https://www.npmjs.com/package/@egofoxlab/chat)

In this repository you find laravel backend and frontend with AngularJS, React.js and Vue.

## How run it?

For run **backend** chat you should do next steps:

* Go to `/backend/laravle`
* Configure your `.env`
* Run composer `omposer install`
* Run migration `php artisan migrate`
* Run chat `php artisan chat_server:serve` - also in this example you can find 
    extended class of `laravel-chat` in `/backend/laravel/app/Console/Commands/MyChat.php`
    it's mean that you can extending chat from box for your requirements.
    

##### AngularJS
For run **AngularJS frontend** chat you should do next steps:

* Go to `/backend/frontend/angular`
* Run `npm install`
* Run app `npm serve`

##### React.js
For run **React.js frontend** chat you should do next steps:

* Go to `/backend/frontend/react`
* Run `npm install`
* Run app `npm start`

##### React.js
For run **React.js frontend** chat you should do next steps:

* Go to `/backend/frontend/react`
* Run `npm install`
* Run app `npm start`

##### Vue
For run **Vue frontend** chat you should do next steps:

* Go to `/backend/frontend/vue`
* Run `npm install`
* Run app `npm serve`


Frontend use [@eogofoxlab/chat](https://www.npmjs.com/package/@egofoxlab/chat)
for working with chat.
