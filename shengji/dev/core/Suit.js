"use strict";

class Suit {

	constructor(id,html,rank) {
		this.id		= id;				// the English letter
		this.ID		= id.toUpperCase();	// the English letter
		this.html	= html;				// html representation (colored symbol)
		this.rank	= rank;				// a number to order by rank
		this.setLang();
	}

	setLang() {
		if (this.id=="") 	this.letter="";
		else				this.letter = theLang.tr("suit_"+this.id);	// the language dependent letter to use in text
	}

}
