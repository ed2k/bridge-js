"use strict";

class Card {

	constructor(suit,value) {
		this.suit	= suit;
		this.value	= value;
		this.id		= suit.id+value.id;				// s5, hQ, ..
		this.rank	= suit.rank*13+value.rank;		// for ordering by rank of suit and value
		this.setFaceType();							// one of several card styles
		this.setLang();
		this.clear();
	}

	setFaceType() {
		if (this.id=="") {
			this.svg = "img/empty.png";
		}
		else {
		    var faceType = "4";
			if (theConfig.data.pictureCards) {
				faceType = "1";
				if (theConfig.data.largeSymbols) faceType = "3";
			}
			this.svg = "img/c" + faceType + "/" + this.value.id + this.suit.id.toUpperCase();
			if (!theConfig.data.englishSymbols) {
				if (theConfig.data.lang == "de") {
					if (this.value.id == "Q") this.svg += "D";
					if (this.value.id == "J") this.svg += "B";
				}
				if (theConfig.data.lang == "fr" ) {
					if (this.value.id == "K") this.svg += "R";
					if (this.value.id == "Q") this.svg += "D";
					if (this.value.id == "J") this.svg += "V";				
				}
			}
			this.svg += ".svg";
		}
	}

	clear() {
		this.trick=null;
	}

	setLang() {
		this.name	= this.suit.letter+this.value.letter;		// language dependent: p5, hD, ...
		this.html	= this.suit.html+this.value.letter;			// with red/green color for the suit symbol
	}
}
