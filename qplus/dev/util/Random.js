"use strict";

class Random {
		
	static init(seed) {
		Random.seed= Math.floor(1000000*seed);
	}
	
	static get(nr) {
		var x = Math.sin(Random.seed++) * 10000;
		return Math.floor(nr* (x - Math.floor(x)));
	}
}
Random.seed= (new Date()).getTime()%100000;

if (typeof module != "undefined") module.exports = Random;  // export declaration for node js