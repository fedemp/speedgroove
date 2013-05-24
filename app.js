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
			this.view = new SpeedGrooveView(this.model);

			this.model.on('change', function(){
				self.view.render();
			});

      this.on('tabClosed', function(tabEvent){
        if (tabEvent.tab.id === this.__tabID) {
          this.reinit();
        }
      });

			this.on('message', function(message){
				var song, topic = message.data.topic;
				if (topic === 'NEWSONG') {
					song = message.data.body.song;
					this.model.set({
						currentSong: {
							songName: song.songName,
							albumName: song.albumName,
							artURL: song.artURL,
              artistName: song.artistName
						}
					});
          return this;
				}

        if (topic === 'INJECTED') {
          this.reinit();
          this.setSpeedDialUrl('focuser.html');
          return this;
        }

			});

			opera.extension.addEventListener('message', function(message){
				self.emit('message', message);
			});
      opera.extension.tabs.addEventListener('close', function(tabEvent){
        self.emit('tabClosed', tabEvent);
      });
		}, // end of constructor

    reinit: function(){
      document.body.classList.remove('playing');
      this.setSpeedDialUrl('http://grooveshark.com');
      return this;
    },

    setSpeedDialUrl: function(url){
      debugger;
      this.__speedDial.url = url;
      return this;
    },

    __speedDial: opera.contexts.speeddial,
    __tabID: undefined

	});

  SpeedGroove.bgApp.SpeedGrooveController = SpeedGrooveController;
  window.SpeedGroove = SpeedGroove;
  var a = new SpeedGroove.bgApp.SpeedGrooveController();
  
})(opera, window, window.document, Hogan, Stapes);
