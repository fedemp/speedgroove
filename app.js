/* global opera, window, Hogan, Stapes */
(function(opera, window, document, Hogan, Stapes){
  'use strict';
  if (!Hogan || !Stapes) {
    throw new Error('Missing dependencies');
  }

  /**
   * @description Check what is currently playing in Grooveshark from Opera
   * Speed Dial.
   * @module SpeedGroove
   * @main
   */
  var SpeedGroove = {};

  /**
   * @description Background script container.
   * @class bgApp
   * @static
   */
  SpeedGroove.bgApp = {
    /**
     * @description Init the bgApp. Creates a new controller and binds
     * Opera events to controller events.
     * @method init
     * @return void
     */
    init: function(){
      var app = new SpeedGroove.mvc.SpeedGrooveController();
      opera.extension.addEventListener('message', function(message){
        app.emit('message', message);
      });
      opera.extension.tabs.addEventListener('close', function(tabEvent){
        app.emit('tabClosed', tabEvent);
      });
    }
  };

  window.SpeedGroove = SpeedGroove;

})(opera, window, window.document, Hogan, Stapes);
