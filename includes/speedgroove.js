// ==UserScript==
//  @include http://grooveshark.com/*
// ==/UserScript==

(function(opera, window, undefined){
  "use strict";

  var SpeedGroove = {};

  /**
  * @description Namespace for the injected script methods.
  * @class fgApp
  * @static
  */
  SpeedGroove.fgApp = {

    /**
    * @description Cache current song id.
    * @property songID
    * @type number
    * @for fgApp
    */
    songID: undefined,

    /**
    * @description Listen to change in playback status
    * @method listenStatus
    * @param {Object} songEvent Original event object fired by Grooveshark.
    */
    listenStatus: function(songEvent){
      // Check before sending a message to background script if it's
      // actually a new song.
      if (songEvent.song && songEvent.song.songID != this.songID) {
        this.songID = songEvent.song.songID;
        opera.extension.postMessage({topic: 'NEWSONG', body: songEvent});
      }
    },

    /**
    * @description Send messages to background scripts.
    * @method message
    * @param {Object} message Message to send.
    *   @param {String} message.topic The name of the function that will be called.
    *   @param {any} [message.body] Any content that the function may
    * find relevant.
    */
    message: function(message){
      opera.extension.postMessage(message);
    },

    /**
    * @description Init the app.  * Send the background script a signal that the script has been injected and set the callback for song status changes.
    * @method init
    */
    init: function(){
      this.message({topic: 'INJECTED'});
      window.addEventListener('load', function(){
        window.Grooveshark.setSongStatusCallback(SpeedGroove.fgApp.listenStatus.bind(SpeedGroove.fgApp));
      });
    }
  }
};
SpeedGroove.fgApp.init();

})(this.opera, this.window);
