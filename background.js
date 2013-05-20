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

	SpeedGroove.bgApp = {
		/**
		 * Save a reference to current song.
		 *
		 * @property song
		 */
		song: undefined,

		/**
		 * Save a reference to the tab that is running Grooveshark.
		 *
		 * @property tab
		 */
		tab: undefined,

		/**
		 * Cache the ID of the tab that is running Grooveshark.
		 *
		 * @property tabID
		 */
		tabID: undefined,

		/**
		 * Save a reference to the interval of the pingTab method.
		 *
		 * @property intervalID
		 */
		intervalID: undefined,

		/**
		 * Cache the DIV that holds what's playing content.
		 *
		 * @property contentPlayingDiv
		 */
		contentPlayingDiv: (document.getElementById('container-playing')),

		/**
		 * Precompiled template for showing currently playing song.
		 *
		 * @property template
		 */
		template: (function(){
			var rawTemplate = '<div class="u-1-2"><img class="albumArt" src="{{artURL}}" alt="{{albumName}}"></div><div class="u-1-2"><b class="songName">{{songName}}</b><br><span class="artistName">{{artistName}}</span></div>';
			return Hogan.compile(rawTemplate);
		})(),

		/**
		 * Listen to messages from injected script.
		 *
		 * @method listen
		 * @param {Object} message An object that represents the message. It
		 * must contain a body and a topic.
		 */

		listen: function(message) {
			var topic = message.data.topic;
			if ( typeof this[topic] == 'function' ) {
				this[topic](message);
			}
		},

		/**
		 * This method is runned when we receive the first message. It saves
		 * the referece to the tab that runs Grooveshark and also its id.
		 *
		 * @method handleInject
		 */
		handleInject: function(message){
			// Get the tab that is running GS.
			var allTabs = opera.extension.tabs.getAll();
			var tabsLength = allTabs.length;
			while (tabsLength) {
				tabsLength -= 1;
				if (allTabs[length].port === message.source) {
					this.tab = allTabs[length];
					this.tabId = allTabs[length].id;
				}
				break; // break the while as soon as we find the needed tab.
			}

			// Start listening for tab closing.
			opera.extension.tabs.onclose = this.handleTabClose.bind(this);

			// Call the pingTab method.
			this.pingTab();
		},

		/**
		 * Ping the tab that is running GS to detect when we abandon the site.
		 *
		 * @method pingTab
		 */
		pingTab: function(){
			var urlRegEx = /^http[s]?:\/\/grooveshark\.com.*/; 
			this.intervalID = window.setInterval( (function(){
				if (this.tab && !urlRegEx.test(tab.url)) {
					this.destroy();
					window.clearInterval(this.intervalID);
				}
			}).bind(this), 5000);
		},

		/**
		 * React when a tab close to check if it was the one that was running
		 * Grooveshark.
		 *
		 * @method handleTabClose
		 * @param {Object} e Original tab close event.
		 */
		handleTabClose: function(e){
			if (e.tab.id === this.tabID){
				this.destroy();
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

			// Injected script takes care of filtering new songs.
			this.contentPlayingDiv.innerHTML = this.template.render(currentSong);

		},

		/**
		 * Remove all references so we can start fresh.
		 *
		 * @method destroy
		 */
		destroy: function(){
			this.song = null;
			window.clearInterval(this.intervalID);
		},

		/**
		 * Render the welcome screen in the Speed Dial tile.
		 *
		 * @method renderWelcome
		 */
		renderWelcome: function(){
			var messages = {nothingPlaying: 'Nothing is currently playing', gotoGrooveshark: 'Go to Grooveshark'}; // TODO: Use i18n.
			return Hogan.compile("<div class='not-playing-message'>{{nothingPlaying}}<br><b>{{gotoGrooveshark}}</b></div>").render(messages); // TODO: Move to external file.  
		},

		/**
		 * Init the app.
		 *
		 * @method init
		 */
		init: function(){
			opera.extension.addEventListener('message', this.listen.bind(this), false);
			// Note that we assume that scripts are loaded at the bottom of the
			// page.
			document.getElementById('container-not-playing').innerHTML = this.renderWelcome(); 
		}
	};

	SpeedGroove.bgApp.init();
})(opera, window, window.document, window.Hogan);
