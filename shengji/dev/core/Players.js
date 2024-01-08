"use strict";

class Players {

	// a singleton class holding all Player instances

	static initialize() {

		theLang.add({
			playerN: {
				en: "N",
			},
			playerE: {
				en: "E",
				de: "O",
				fr: "E",
				it: "E",
				es: "É",
				dk: "Ø",
			},
			playerS: {
				en: "S",
			},
			playerW: {
				en: "W",
				de: "W",
				fr: "O",
				it: "O",
				es: "O",
				dk: "V",
			},
			playerNameN: {
				en: "North",
				de: "Nord",
				fr: "Nord",
				it: "Nord",
				es: "Norte",
				dk: "Nord",
			},
			playerNameE: {
				en: "East",
				de: "Ost",
				fr: "Est",
				it: "Est",
				es: "Éste",
				dk: "Øst"
			},
			playerNameS: {
				en: "South",
				de: "Süd",
				fr: "Sud",
				it: "Sud",
				es: "Sur",
				dk: "Syd",
			},
			playerNameW: {
				en: "West",
				de: "West",
				fr: "Ouest",
				it: "Ovest",
				es: "Oueste",
				dk: "Vest",
			},
		});

		Players.isAllVisible = false;
		// create the four players
		Players.N = new Player(0,"N",theLang.tr("playerN"),theLang.tr("playerNameN"),"NS");
		Players.E =	new Player(1,"E",theLang.tr("playerE"),theLang.tr("playerNameE"),"EW");
		Players.S = new Player(2,"S",theLang.tr("playerS"),theLang.tr("playerNameS"),"NS");
		Players.W = new Player(3,"W",theLang.tr("playerW"),theLang.tr("playerNameW"),"EW");

		Players.all = [ Players.N, Players.E, Players.S, Players.W ];
		Players.NS 	= [ Players.N, Players.S ];
		Players.EW	= [ Players.E, Players.W ];

		// default vulnerability
		Players.assignVuln("--");
	}

	static setLang() {
		for(var pl of Players.all) pl.setLang();
	}

	static clearHands() {
		for (var player of Players.all) player.clearHand();
	}

	static showHands() {
		if (typeof QB.playWin == "undefined") return;
		for (var player of Players.all) QB.playWin.tableTab.showHand(player,player.isVisible());
	}	

	static setAllVisible(visible) {
		for (var player of Players.all) player.setVisible(visible);
	}
	
	static toggleAllVisible(fromStart) {
		this.isAllVisible = !this.isAllVisible;
		if (!fromStart) {
			// force redraw
		    for (var player of Players.all) player.setVisible(player.isVisible());
		}
	}

	static getAllVisible() {
		return this.isAllVisible;
	}
	
	static areAllComputer() {
		for (var player of Players.all) 
			if (!player.isComputer()) return false;
		return true;
	}	

	static setSuitSeq(suitSeq) {
		for (var player of Players.all) player.setSuitSeq(suitSeq);
	}

	static nextNr(playerNr) {
		return (playerNr+1)%4;
	}

	static prevNr(playerNr) {
		return (playerNr+3)%4;
	}

	static next(player) {
		return this.all[this.nextNr(player.nr)];
	}

	static prev(player) {
		return this.all[this.prevNr(player.nr)];
	}

	static assignVuln(vuln) {
		Players.vuln = vuln;
		Players.N.assignVuln ((vuln=="NS" || vuln=="All") ? 1 : 0);
		Players.S.assignVuln ((vuln=="NS" || vuln=="All") ? 1 : 0);
		Players.E.assignVuln ((vuln=="EW" || vuln=="All") ? 1 : 0);
		Players.W.assignVuln ((vuln=="EW" || vuln=="All") ? 1 : 0);
	}

	static ready() {
		for (var player of this.all) player.ready();
	}

}
