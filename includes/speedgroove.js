// ==UserScript==
//  @include http://grooveshark.com/*
// ==/UserScript==

(function(opera, window, undefined){

	"use strict";

	/*
	 * Check what is currently playing in Grooveshark from Opera Speed Dial.
	 *
	 * @module SpeedGroove
	 */
	var SpeedGroove = {

		var fgApp = {
			/**
			 * Cache current song id
			 *
			 * @property songID
			 */
			songID: undefined,

			/**
			 * Listen to change in playback status
			 *
			 * @method listenStatus
			 * @param {Object} songEvent Original event object fired by Grooveshark.
			 */
			listenStatus: function(songEvent){
				// Check before sending a message to background script if it's actually a new song
				if (songEvent.song && songEvent.song.songID != SpeedGroove.songID) {
					opera.extension.postMessage({topic: 'handlePlayStatus', body: songEvent});
				}
			},

			/**
			 * Init the app.
			 *
			 * @method init
			 */
			init: function(){
				window.addEventListener('load', function(){
					window.Grooveshark.setSongStatusCallback(SpeedGroove.listenStatus);
				});
			}
		}
	};
	SpeedGroove.fgApp.init();

})(this.opera, this.window);
