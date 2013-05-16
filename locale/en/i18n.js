var SpeedGroove = SpeedGroove || {};

(function (window, SpeedGroove, undefined) {
	"use strict";

	SpeedGroove.i18n = {
		/**
		 * Get translation for specified string.
		 * @method t
		 * @param {String} Text to translate.
		 * @return {String} Translated text or sent text if translation is not
		 * found.
		 */
		t: function(text){
			return this._cache[string] || text;
		},

		/**
		 * Collection of translated strings.
		 *
		 * @property _cache
		 * @private
		 */
		_cache: {
			"Nothing is playing": "Nada se está reproduciendo",
			"Go to Grooveshark": "Vé a Grooveshark"
		}
	}; 
})(window, SpeedGroove);
