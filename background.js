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
	SpeedGroove.bgApp = {
	};

})(opera, window, window.document, Hogan, Stapes);
