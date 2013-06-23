(function(opera, window, document, Hogan, Stapes){
	"use strict";

    // If this script is loaded in "focus GS" mode, do nothing.
    if (window.location.search == "?focus=true"){
      return;
    }

	if (!Hogan || !Stapes) {
		throw new Error('Missing dependencies');
	}

	/**
	* Check what is currently playing in Grooveshark from Opera Speed Dial.
	* @module SpeedGroove
	*/
	window.SpeedGroove = window.SpeedGroove || {};

	/**
	* Hold the background script.
	* @namespace SpeedGroove
	* @class bgApp
	*/
	SpeedGroove.bgApp = undefined;

	var SpeedGrooveModel = Stapes.subclass();

	var SpeedGrooveView = Stapes.subclass({
		constructor: function(model){
			var foo;
			this.model = model;
			this.el = document.getElementById('container-playing');
			this.template = Hogan.compile( document.getElementById('template-playing').innerHTML );
		},
		render: function() {
			document.body.classList.add('playing');
			var song = this.model.get('currentSong');
			this.el.innerHTML = this.template.render(song);
			this.setSpeedDialUrl('index.html?focus=true');
			return this;
		},

		init: function(){
			document.body.classList.remove('playing');
			this.setSpeedDialUrl(this.constants.gsURL);
			return this;
		},

		setSpeedDialUrl: function(url){
			this.constants.speedDial.url = url;
			return this;
		},

		constants: {
			gsURL: "http://grooveshark.com",
			speedDial: opera.contexts.speeddial
		}

	});

	var SpeedGrooveController = Stapes.subclass({
		constructor: function(){
			var self = this;

			this.model = new SpeedGrooveModel();
			this.view = new SpeedGrooveView(this.model);
			this.session = {};

			this.model.on('change', function(){
				self.view.render();
			});

			this.on('tabClosed', function(e){
				if (e.evt.tab.id === this.session.tabId) {
					this.view.init();
					opera.extension.tabs.removeEventListener('close', e.handler);
				}
			});

			this.on('message', function(message){
				var method = 'handle' + message.data.topic;
				if (typeof this[method] === "function") {
					this[method](message);
					return true;
				}
				return false;
			});

			opera.extension.addEventListener('message', function(message){
				self.emit('message', message);
			});

			return this;
		},

		options: {
			urlRegex: /^http[s]?:\/\/grooveshark\.com.*/,
			intervalTime: 5000
		},

		handleINJECTED: function(message){
			var self = this;
			opera.extension.tabs.getAll().forEach(function(tab){
				if (tab.port === message.source) {
					this.session.tab = tab;
					this.session.tabId = tab.id;
				}
			},this);

			// Listen to closing tabs only if the injected script
			// is active.
			opera.extension.tabs.addEventListener('close', function handleTabClose(tabEvent){
				self.emit('tabClosed', {evt: tabEvent, handler: handleTabClose});
			});

			// This is more like a re-init. If we get a new "Injected"
			// message, then we set the view to its starting point again.
			this.view.init();
		},

		handleNEWSONG: function(message){
			// Let's assume that the latest injected script is
			// the only one which we should listen to.
			if (!(this.session.tab.port === message.source)) { return; }
			var song = message.data.body.song;
			this.model.set({
				currentSong: {
					songName: song.songName,
					albumName: song.albumName,
					albumID: song.albumID,
					artistName: song.artistName
				}
			});
			return;
		},

		pingTabs: function(){
			var urlRegEx = this.options.urlRegEx;
			var self = this;

			var intervalID = window.setInterval( function(){
				if (self.info.tab && !urlRegEx.test(self.info.tab.url)) {
					self.view.init();
					window.clearInterval(intervalID);
				}
			},this.options.intervalTime);
		},
	});

	SpeedGroove.bgApp = new SpeedGrooveController();

})(opera, window, window.document, window.Hogan, window.Stapes);
