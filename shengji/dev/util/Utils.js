"use strict";

/*
	class Utils: A collection of useful static functions
 */

 class Utils {

	static getBrowserLanguage() {
		return navigator.language.replace(/-.*/,'');  // throw away second part, thus a value like "en-US" becomes "en"
	}

    static escapeHTML(str) {
	    return str.replace(/[&<>"'\/]/g, function (s) {
	      	var entityMap = {
	          	"&": "&amp;",
	          	"<": "&lt;",
	          	">": "&gt;",
	          	'"': '&quot;',
	          	"'": '&#39;',
	          	"/": '&#x2F;'
	        };
			return entityMap[s];
	    });
	}
}

