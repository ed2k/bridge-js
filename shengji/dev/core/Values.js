"use strict";

class Values {

	static initialize() {

		theLang.add({
			value_A: {
				en: "A",
				dk: "E",
			},
			value_K: {
				en: "K",
				fr: "R",
			},
			value_Q: {
				en: "Q",
				de: "D",
				fr: "D",
				dk: "D",
			},
			value_J: {
				en: "J",
				de: "B",
				fr: "V",
				dk: "B",
			},
			value_T: {
				en: "T",
				de: "Z",
				fr: "X",
			},
		});

		Values.all=[
			new Value("A",12,4),
			new Value("K",11,3),
			new Value("Q",10,2),
			new Value("J", 9,1),
			new Value("T", 8,0),
			new Value("9", 7,0),
			new Value("8", 6,0),
			new Value("7", 5,0),
			new Value("6", 4,0),
			new Value("5", 3,0),
			new Value("4", 2,0),
			new Value("3", 1,0),
			new Value("2", 0,0)
		];
		Values.empty = new Value("",-1,-1);
		Values.empty.letter = '?';
	}

	static byLetter(letter) {
		for (var value of Values.all) {
			if (value.letter==letter) return value;
		}
		return Values.empty;
	}
	
	static byId(id) {
		for (var value of Values.all) {
			if (value.id==id) return value;
		}
		return Values.empty;
	}	

	static setLang() {
		for(var v of Values.all) v.setLang();
	}
}
