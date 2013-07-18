(function(opera, window, document, Hogan, Stapes, SpeedGroove){
  "use strict";
  if (!Hogan || !Stapes) {
    throw new Error('Missing dependencies');
  }

  /*
   * Abstract MVC componentes start here.
   * ====================================
   */

  /**
   * @description Contains the three main constructors of the MVC.
   * @submodule SpeedGroove.mvc
   */
  SpeedGroove.mvc = {};

  /**
   * @description Model containing currently playing (or last played) song.
   * @namespace SpeedGroove.mvc
   * @class SpeedGrooveModel
   * @constructor
   */
  SpeedGroove.mvc.SpeedGrooveModel = Stapes.subclass();

  /**
   * @description The view of the mvc. This takes care of rendering the Speed Dial tile
   * @namespace SpeedGroove.mvc
   * @class SpeedGrooveView
   * @constructor
   */
  SpeedGroove.mvc.SpeedGrooveView = Stapes.subclass({

    /**
     * @description Constructor for the view. It binds to a model, caches the rendering
     * context and compiles the template.
     * @method constructor
     * @for SpeedGrooveView
     * @param {SpeedGrooveModel} model Model to which the view will be binded.
     * @return void
     */
    constructor: function(model){
      this.model = model;

      this.el = document.getElementById('container-playing');

      this.template = Hogan.compile( document.getElementById('template-playing').innerHTML );
    },

    /**
     * @description Process the model to render the view.
     * @method render
     * @for SpeedGrooveView
     * @return {SpeedGrooveView} The view object
     * @chainable
     */
     render: function() {
      document.body.classList.add('playing');
      var song = this.model.get('currentSong');
      this.el.innerHTML = this.template.render(song);
      return this;
     },

    /**
     * @description Resets the view. Hide currently playing song, showing placeholder again
     * and set link of tile to Grooveshark.
     * @method init
     * @for SpeedGrooveView
     * @return {SpeedGrooveView} The view object
     * @chainable
     */
    init: function(){
      document.body.classList.remove('playing');
      this.setSpeedDialUrl('http://grooveshark.com');
      return this;
    },

    /**
     * @description Set Speed Dial url.
     * @method setSpeedDialUrl
     * @param url {string} New url
     * @for SpeedGrooveView
     * @return {SpeedGrooveView} The view object
     * @chainable
     */
    setSpeedDialUrl: function(url){
      this.__speedDial.url = url;
      return this;
    },

    /**
     * @description Reference to the `speeddial` object.
     * @property __speedDial
     * @for SpeedGrooveView
     * @type Object
     * @final
     */
    __speedDial: opera.contexts.speeddial,
  });

  /**
   * @description The controller in the MVC. It instatiates the model and the view and set events to update the model or the view when needed.
   * @namespace SpeedGroove.mvc
   * @class SpeedGrooveController
   * @constructor
   */
  SpeedGroove.mvc.SpeedGrooveController = Stapes.subclass({
    /**
     * The constructor functions instatiates a new model and view and binds them
     * to the controller instance. It also set events to update the view on
     * model change and update the model on messages from injected script and
     * tab events.
     * @method constructor
     * @for SpeedGrooveController
     * @return {SpeedGrooveController} New instance of the controller
     * @chainable
     */
     constructor: function(){
      var self = this;
      this.model = new SpeedGroove.mvc.SpeedGrooveModel();
      this.view = new SpeedGroove.mvc.SpeedGrooveView(this.model);

      this.model.on('change', function(){
        self.view.render();
      });

      this.on('tabClosed', function(tabEvent){
        if (tabEvent.tab.id === this.__tabID) {
          this.view.init();
        }
      });

      this.on('message', this.handleMessage);

    },

    /**
     * Read message topic and act accordingly. It may set the model or save a
     * reference (in a property) to the tab that is running Grooveshark.
     * @method handleMessage
     * @for SpeedGrooveController
     * @param {object} message The original message event.
     * @return void
     */
    handleMessage: function(){
      var song, topic = message.data.topic;
      if (topic === 'NEWSONG') {
        // Let's assume that the latest injected script is
        // the only one which we should listen to.
        if (this.__tab.port !== message.source) { return; }
        song = message.data.body.song;
        this.model.set({
          currentSong: {
            songName: song.songName,
            albumName: song.albumName,
            albumID: song.albumID,
            artistName: song.artistName
          }
        });
        return;
      }

      if (topic === 'INJECTED') {
        opera.extension.tabs.getAll().forEach(function(tab){
          if (tab.port === message.source) {
            this.__tab = tab;
            this.__tabID = tab.id;
          }
        },this);
        this.view.init();
        return;
      }
    },

    /**
     * Caches the ID of the tab where Grooveshark was loaded.
     * @property __tabID
     * @for SpeedGrooveController
     * @type number
     * @private
     */
    __tabID: undefined,

    /**
     * Caches the `tab` object where Grooveshark was loaded.
     * @property __tab
     * @for SpeedGrooveController
     * @type object
     * @private
     */
    __tab: undefined

  });

})(opera, window, window.document, Hogan, Stapes, SpeedGroove);
