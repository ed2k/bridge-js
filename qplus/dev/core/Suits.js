"use strict";

class Suits {

	static initialize() {

		theLang.add({
			suitSpades: {
				en: "spades",
				de: "Pik",
				fr: "piques",
				it: "picche",
				es: "picas",
				dk: "spar",
			},
			suitHearts: {
				en: "hearts",
				de: "Coeur",
				fr: "cœurs",
				it: "cuori",
				es: "corazones",
				dk: "hjerter",
			},
			suitDiamonds: {
				en: "diamonds",
				de: "Karo",
				fr: "carreaux",
				it: "quadri",
				es: "diamantes",
				dk: "ruder",
			},
			suitClubs: {
				en: "clubs",
				de: "Treff",
				fr: "tréfles",
				it: "fiori",
				es: "tréboles",
				dk: "klør",
			},
			suitNotrump: {
				en: "notrump",
				de: "Sans Atout",
				fr: "sans atout",
				it: "senza atout",
				es: "sin triunfo",
				dk: "sans",
			},
			suit_s: {
				en: "s",
				de: "p",
				fr: "p",
				it: "p",
				es: "p",
				dk: "s",
			},
			suit_h: {
				en: "h",
				de: "c",
				fr: "c",
				it: "c",
				es: "c",
				dk: "h",
			},
			suit_d: {
				en: "d",
				de: "k",
				fr: "k",
				it: "q",
				es: "d",
				dk: "r",
			},
			suit_c: {
				en: "c",
				de: "t",
				fr: "t",
				it: "f",
				es: "t",
				dk: "k",
			},
			suit_nt: {
				en: "nt",
				de: "sa",
				fr: "sa",
				it: "sa",
				es: "st",
				dk: "ut",
			},
			suit_NT: {
				en: "NT",
				de: "SA",
				fr: "SA",
				it: "SA",
				es: "ST",
				dk: "UT",
			},
		});
		if (qbAndroidVersion > 0) {
			Suits.s = new Suit("s", "<span style='color:#025;font-size:80%'>&spades;</span>"	,3);
			Suits.h = new Suit("h", "<span style='color:#f00;font-size:80%'>&hearts;</span>"	,2);
			Suits.d = new Suit("d", "<span style='color:#e22;font-size:80%'>&diams;</span>" 	,1);
			Suits.c = new Suit("c", "<span style='color:#052;font-size:80%'>&clubs;</span>"	,0);		
		}
		else {
			Suits.s = new Suit("s", "<span style='color:#025'>&spades;</span>"	,3);
			Suits.h = new Suit("h", "<span style='color:#f00'>&hearts;</span>"	,2);
			Suits.d = new Suit("d", "<span style='color:#e22'>&diams;</span>" 	,1);
			Suits.c = new Suit("c", "<span style='color:#052'>&clubs;</span>"	,0);
		}

		// add a pseudo suit for notrump
		Suits.nt = new Suit("NT","<span style='color:#224;'>"+theLang.tr("suit_NT")+"</span>",4);

		// add pseudo suit for empty card
		Suits.empty = new Suit("","",-1,-1);

		Suits.all=[ Suits.s, Suits.h, Suits.d, Suits.c];

		Suits.allDenominations=[ Suits.s, Suits.h, Suits.d, Suits.c, Suits.nt ];

	}

	static byLetter(letter) {
		for (var suit of Suits.allDenominations) {
			if (suit.letter.toLowerCase()==letter.toLowerCase()) return suit;
		}
		return Suits.empty;
	}
	
	static byId(id) {
		for (var suit of Suits.allDenominations) {
			if (suit.id.toLowerCase()==id.toLowerCase()) return suit;
		}
		return Suits.empty;
	}

	static setLang() {
		for(var s of Suits.all) s.setLang();
	}
};
