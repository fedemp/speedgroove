(function(opera, window, document, Hogan){
	"use strict";
	if (!Hogan) {
		throw new Error('Hogan is missing');
	}

	/*
	 * Check what is currently playing in Grooveshark from Opera Speed Dial.
	 *
	 * @module SpeedGroove
	 */
	var SpeedGroove = {};
	var content = document.getElementById('inner-container');

	SpeedGroove.bgApp = {
		/**
		 * Save a reference to current song.
		 *
		 * @property song
		 */
		song: undefined,

		/**
		 * Precompiled template for showing currently playing song.
		 *
		 * @property template
		 */
		template: (function(){
			var rawTemplate = '<div><img src="{{artURL}}" alt="{{albumName}}"><br><b class="songName">{{songName}}</b><br><span class="artistName">{{artistName}}</span></div>';
			return Hogan.compile(rawTemplate);
		})(),

		/**
		 * Listen to messages from injected script.
		 *
		 * @method listen
		 * @param {Object} message An object that represents the message. It must contain a `topic` and a `body`.
		 */

		listen: function(message) {
			var topic = message.data.topic;
			if ( typeof SpeedGroove.bgApp[topic] == 'function' ) {
				SpeedGroove.bgApp[topic](message);
			}
		},

		/**
		 * Handle changes in play status.
		 *
		 * @method handlePlayStatus
		 * @param {Object} message Original message sent by injected script.
		 */

		handlePlayStatus: function(message) {
			var currentSong = message.data.body.song;
			var status = message.data.body.status;

			// Got a new song!
			if (!this.song || currentSong.songID !== this.song.songID) {
				this.song = currentSong;
				content.innerHTML = this.template.render(currentSong);
			}

		},

		/**
		 * Init the app.
		 *
		 * @method init
		 */
		init: function(){
			opera.extension.addEventListener('message', this.listen, false);
		}
	};

	SpeedGroove.bgApp.init();
})(opera, window, window.document, window.Hogan);
