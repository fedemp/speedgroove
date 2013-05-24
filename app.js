(function(opera, window, document, Hogan, Stapes){
	"use strict";
	if (!Hogan || !Stapes) {
		throw new Error('Missing dependencies');
	}

	/**
	 * Check what is currently playing in Grooveshark from Opera Speed Dial.
	 * @module SpeedGroove
	 */
	var SpeedGroove = {};

	/**
	 * Hold the background script.
	 * @namespace SpeedGroove
	 * @class bgApp
	 */
	SpeedGroove.bgApp = {};

	var SpeedGrooveModel = Stapes.subclass();

	var SpeedGrooveView = Stapes.subclass({
		constructor: function(model){
			this.model = model; 

			this.el = document.getElementById('container-playing');

			this.template = Hogan.compile( document.getElementById('template-playing').innerHTML );
		},

		render: function() {
			var song = this.model.get('currentSong');
			this.el.innerHTML = this.template.render(song);
		}
	});

	var SpeedGrooveController = Stapes.subclass({
		constructor: function(){
			var self = this;
			this.model = new SpeedGrooveModel();
			this.view = new SpeedGrooveView();

			this.model.on('change', function(songId){
				this.view.render();
			});

			this.on('message', function(message){
				var song;
				if (message.data.topic === 'NEWSONG') {
					song = message.data.body.song;
					this.model.set({
						currentSong: {
							songTitle: song.songTitle,
							albumName: song.album,
							albumArt: song.albumArt
						}
					});
				}
			});


			opera.extension.addEventListener('message', function(message){
				self.emit('message', message);
			})
		},
	});

})(opera, window, window.document, Hogan, Stapes);
