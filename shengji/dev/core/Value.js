"use strict";

class Value {

	constructor(id,rank,hcp) {
		this.id		= id;		// English letter
		this.rank	= rank;
		this.hcp	= hcp;
		this.setLang();
	}
	
	setLang() {
		if (this.rank<=7)	this.letter=this.id;
		else 				this.letter = theLang.tr("value_"+this.id.toUpperCase());	// the language dependent letter to use in text		
	}
	
};
