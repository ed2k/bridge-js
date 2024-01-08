"use strict";

class Cards {
	// a card deck of 52 cards
	// this class also initializes Suits and Values

	static initialize() {
		Suits.initialize();
		Values.initialize();
		
		Cards.all=[];
		for (var suit of Suits.all) {
			for (var value of Values.all) {
				var card = new Card(suit, value);
				// create the card as an instance variable, so it can be accessed like (Cards.h5 or Cards["s7"]
				Cards[card.id] = card;
				// add to an array which is sorted by decreasing rank
				Cards.all.push(card);
			}
		}
		
		Cards.empty = new Card(Suits.empty,Values.empty);
	}
	
	static setFaceType() {
		for (var card of Cards.all) {
			card.setFaceType();
		}
	}
	
	static clear() {
		for(var card of Cards.all) card.clear();
	}
	
	static setLang(lang) {
		Suits.setLang(lang);
		Values.setLang(lang);
		for (var card of Cards.all) card.setLang();
	}
	
	static getBackImage() {
		var faceType = "4";
		if (theConfig.data.pictureCards) {
			faceType = "1";
			if (theConfig.data.largeSymbols) faceType = "3";
		}	
		return "img/c" + faceType + "/" + "2B.svg";
    }	
}
