(function(opera, window, document){
	"use strict";

	/*
	 * Check what is currently playing in Grooveshark from Opera Speed Dial.
	 *
	 * @module SpeedGroove
	 */
	var SpeedGroove = {

		bgApp: {
			/**
			 * Save a reference to current song.
			 *
			 * @property song
			 */

			song: undefined,

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

				if (!this.song || currentSong.songID !== this.song.songID) {
					this.song = currentSong;
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
		}
	}; 
	SpeedGroove.bgApp.init();
})(opera, window, window.document);
