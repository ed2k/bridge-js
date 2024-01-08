"use strict";

class Player {

	constructor(nr,id,letter,name,party) {
		this.nr		= nr;
		this.id		= id;		// English letter
		this.party	= party;
		this.otherParty = (party=="NS") ? "EW" : "NS";
		this.vuln	= false;
		this.setLang();
		this.clearHand();
		this.setType("computer");
		this.setVisible(false);
		this.setLocation("internal");
		this.setSuitSeq([]);
	}

	setType(type) {
		this.type=type;
		return this;
	}

	setVisible(visible) {
		// theULogger.log(1,"--- setVisible p: " + this.id + " = " + visible);
		var oldVisible = this.visible;
		this.visible = visible;
		if (typeof QB.playWin != "undefined") {
		    if (oldVisible != visible) QB.playWin.tableTab.onHandChanged(this,"");
			QB.playWin.tableTab.showHand(this,visible);
		}
		return this;
	}

	setLocation(location) {
		this.location=location;
		return this;
	}

	isVisible() {
		return this.visible;
	}

	isHuman() {
		return this.type=="human";
	}

	isHumanSide() {
		return    this.type=="human"
			   || this.partner().type == "human";
	}	

	isComputer() {
		return this.type=="computer";
	}

	isInternal() {
		return this.location=="internal";
	}

	isExternal() {
		return this.location=="external";
	}

	setLang() {
		this.letter	= theLang.tr("player"+this.id);		// language dependent letter
		this.name	= theLang.tr("playerName"+this.id);	// language dependent generic name, eg. "North"
		return this;
	}

	setSuitSeq(suitSeq) {
		// define the preferred sequence of suits for hand display
		if (suitSeq.s)	{ this.suitSeq = suitSeq; }
		else {
		    if (theConfig.get("sequenceSHCD"))
			    this.suitSeq = { s:4,h:3,d:1,c:2 };
			else 
			    this.suitSeq = { s:4,h:3,d:2,c:1 };			
		}
		this.orderHand();
	}

	clearHand() {
		this.cards    = {};	// holds trickNr or -1 (=in hand) for cards owned by the player
		this.played	  = [];	// holds cards in sequence of play
		this.hand	  = [];	// remaining cards of the player during play
		this.handOrig = [];	// cards originally given to the player
		this.suitLengths 		= {s:0,h:0,d:0,c:0};
		this.suitLengthsOrig	= {s:0,h:0,d:0,c:0};
		this.hiPoints			= {s:0,h:0,d:0,c:0,t:0};
		this.lengthPoints		= {s:0,h:0,d:0,c:0,t:0};
		this.distPoints			= {s:0,h:0,d:0,c:0,t:0};
		this.totalPoints		= 0;
		this.lengths			= [0,0,0,0];
		return this;
	}

	getHand() {
		return this.hand;
	}

	holds(card) {
		return (typeof this.cards[card.id] != "undefined" && this.cards[card.id]==-1);
	}

	hasSuit(suit) {
		return this.suitLengths[suit.id]>0;
	}

	assignCard(card) {
		this.cards[card.id] = -1;
		this.suitLengths[card.suit.id]++;
		this.suitLengthsOrig[card.suit.id]++;
		this.hand.push(card);
		this.handOrig.push(card);
		this.orderHand();
	}

	orderHand() {
		// order cards and original cards according to the preferred suit sequence
		var that=this;
		this.handOrig.sort(function(a,b) {
			var sa = that.suitSeq[a.suit.id];
			var sb = that.suitSeq[b.suit.id];
			if (sa>sb) return -1;
			if (sa<sb) return +1;
			if (a.value.rank>b.value.rank) return -1;
			if (a.value.rank<b.value.rank) return +1;
			return 0;
		});
		this.hand.sort(function(a,b) { return that.suitSeq[a.suit.id] < that.suitSeq[b.suit.id]; });
	}

	ownsCardsOfSuit(suit) {
		var cards=[];
		for(var cardId in this.cards) {
			if (this.cards[cardId]==-1 && suit.id==cardId[0]) cards.push(Cards[cardId]);
		}
		return cards;
	}

	holdsCardsOfSuit(suit) {
		var cards=[];
		for(var cardId in this.cards) {
			if (this.cards[cardId]==-1 && suit.id==cardId[0] && Cards[cardId].trick==null) cards.push(Cards[cardId]);
		}
		return cards;
	}

	assignVuln(vuln) {
		this.vuln=vuln;
	}

	next() {
		return Players.next(this);
	}

	prev() {
		return Players.prev(this);
	}

	partner() {
		return this.next().next();
	}

	ready() {
		// called when all cards have been dealt

		// calculate points hiPoints, lenPoints, distPoints
		for(var c of this.hand) {
			this.hiPoints[c.suit.id]+=c.value.hcp;
		}
		for (var suit of Suits.all) {
			this.hiPoints.t += this.hiPoints[suit.id];
			if(this.suitLengths[suit.id]>=5 && this.hiPoints[suit.id]>=4) {
				this.lengthPoints[suit.id] = this.suitLengths[suit.id]-4; 		// length points per suit
				this.lengthPoints.t += this.lengthPoints[suit.id];				// total length points
			}
			else if(this.suitLengths[suit.id]<= 2) {
				this.distPoints[suit.id] = 3 - this.suitLengths[suit.id];	// distribution points per suit
				this.distPoints.t += this.distPoints[suit.id];				// total distribution points
			}
			this.totalPoints += this.hiPoints[suit.id]+this.lengthPoints[suit.id]+this.distPoints[suit.id];	// total points
		}
		this.lengths = [this.suitLengths.s,this.suitLengths.h,this.suitLengths.d,this.suitLengths.c].sort().reverse();
	}

	playCard(trick,card) {
		if (!this.holds(card)) {
			theULogger.log(0,"player "+this.name+" does not hold "+card.html);
			return null;
		}
		this.played.push(card);
		var index = this.hand.indexOf(card);
		if (index > -1) this.hand.splice(index, 1);
		this.suitLengths[card.suit.id]--;
		card.trick=trick;
		return card;
	}

	unplayCard(trick,card) {
		if (!this.holds(card)) {
			theULogger.log(0,"unplay: player "+this.name+" is not owner of "+card.html);
		}
		if (card !=this.played.pop()) {
			theULogger.log(0,"unplay: player "+this.name+", card "+card.html+ "was not the last card played.");
		};
		var cardNr = card.rank;
		// theULogger.log(1,"unplay: pl:" + this.id + " card:" + card.id + " rank:" + cardNr);
		for(var c=0;c<this.hand.length;c++) {
			if (this.hand[c]==card) {
				theULogger.log(0,"unplay: player "+this.name+" already holds "+card.html);
				break;
			}
			if (cardNr > this.hand[c].rank) {
				this.hand.splice(c,0,card);
				break;
			}
		}
		if (c==this.hand.length) this.hand.splice(0,0,card);	
		this.suitLengths[card.suit.id]++;
		card.trick=null;
	}

	distance(player) {
		// return the distance TO the given player
		if (this.nr<=player.nr) return player.nr-this.nr;
		else return 4 - this.nr + player.nr;
	}
}
