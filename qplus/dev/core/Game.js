"use strict";

class Game {

	constructor() {
		this.clear();
		this.source="INTERNAL"; // or "BDL"
	}

	clear() {
		this.id="";
		this.gameText="";
		this.gameKind="P";
		Cards.clear();
		this.cards=[];
		for(var card of Cards.all) this.cards.push(card);
		this.isMini=false;
		this.bids=[];
		this.contractInSpe= {NS:new Contract(null,null,0,""),EW:new Contract(null,null,0,"")};
		this.playersInSpe = "";
		this.triplePass=0;

		this.cardSequence=[];
		this.tricks=[];
		this.trickSum={NS:0,EW:0};
		this.currentTrickNr= -1;
		this.currentCardNr= 0;
		this.contract=null;
		this.setDealer(null);
		this.claimedTricks= -1;		
		this.result=0;
		this.resultString="";
		this.scoring="IMP";
		this.score=0;
		this.major=0;
		this.minor=0;
		this.gameSequence="";
		this.state="none";
		this.subState="none";

		this.dff = new DealForFiltering();	// a deal representation needed to use the "analyse" function of the DealFinder
	}

	setId(id) {
		this.id = this.dff.id = id;
	}

	loadFromTutorial(tut,replay) {
		// create and play a deal based on tutorial instructions
		// which was taken from a LKx file

		if (typeof tut.deal == "undefined") return;

		// reset (optionally keep previous bids)

		var haveSetAny;
		var old = {};
		if (replay) {
			old.id=this.id;
			old.major=this.major;
			old.minor=this.minor;
			old.bids=[]; for(var bid of this.bids) old.bids.push(bid.id);
		}

		var deal = tut.deal;

		this.clear();

		// the human player is initially SOUTH
		Players.N.setType("computer")	.setVisible(false);
		Players.E.setType("computer")	.setVisible(false);
		Players.S.setType("human")		.setVisible(true);
		Players.W.setType("computer")	.setVisible(false);

		// deal id
		if (replay) {
			this.setId(old.id);
			this.major  	= old.major;
			this.minor  	= old.minor;
		}
		else {
			this.setId(deal.id);
			this.major  	= deal.major;
			this.minor  	= deal.minor;
			var html = deal.dealText;
			for (var suit of Suits.allDenominations) {
				html = html.replace(RegExp("_"+suit.letter,"ig"),suit.html);
			}			
			this.gameText	= html;			
			this.gameKind   = deal.dealKind;			
		}
		if (this.gameKind == "D") {
		    this.source="QDeal";
			this.gameSequence = deal.dealSequence;
		}
		else {
		    this.source="Tutorial";
		}
		this.nextIdBDL	= deal.id + 1;

		if (isPresent(deal.scoring)) {
		    this.scoring = deal.scoring;
		}
		if (isPresent(deal.mode)) {
		    if (deal.mode == "mini") this.isMini = true;
		}
		// define vulnerability
		this.setVuln(deal.vuln);
		// define dealer (round robin or take from arguments)
		this.setDealer(Players[deal.dealer[0]]);

		// bids and tricks
		this.bidsBDL	= typeof deal.bids == "undefined" ? [] : deal.bids;
		this.dff.setBids(this.bidsBDL,this.dealer);

		this.meaningsBDL= [];
		this.tricksBDL	= [];

		// let players return cards to the deck
		Players.clearHands();

		// distribute cards
		haveSetAny = false;
		for (var player of Players.all) {
			if (typeof deal[player.id] != "undefined") {
				for (var suit of Suits.all) {
					for (var value of deal[player.id][suit.ID]) {
						player.assignCard(Cards[suit.id+value]);
					}
				}
			    if (isPresent(deal[player.id].human)) {
				    haveSetAny = true;
					if (deal[player.id].human) {
						player.setType("human");
						player.setVisible(true); // default						
					}
					else {
						player.setType("computer");
						player.setVisible(false); // default
					}
				}							
			    if (isPresent(deal[player.id].visible)) {
				    player.setVisible(deal[player.id].visible);	
				}
			}
		}
		if (haveSetAny) {
			if (Players.areAllComputer()) Players.setAllVisible(true);
			// default setting; in principle user set visibilities must now 
			// be checked again, but other visibilities make no sense.
		}

		Players.ready();
		this.dff.dealt(this);
		this.state="dealt";

		QBM.changed({type:"new game"});

		// execute old bids (if we are starting a "replay")
		if (replay) {
			this.startBidding();
			for (var bidId of old.bids) {
				this.bid(bidId,"");
			}
		}
	}

	loadFromBDL(bdl,cmd) {
		// create and play a deal which was taken from a BDL file

		this.source="BDL";

		// reset
		this.clear();

		// deal id
		this.setId(bdl.id);
		this.nextIdBDL	= bdl.nextIdBDL;
		this.major  	= bdl.major;
		this.minor  	= bdl.minor;

		// define vulnerability
		this.setVuln(bdl.vuln);

		// define dealer (round robin or take from arguments)
		this.setDealer(Players[bdl.dealer[0]]);

		// bids and tricks
		this.bidsBDL	= bdl.bids;
		this.dff.setBids(bdl.bids,this.dealer);

		this.meaningsBDL= bdl.meanings;
		this.tricksBDL	= bdl.tricks;

		// let players return cards to the deck
		Players.clearHands();

		// distribute cards
		for (var player of Players.all) {
			for (var suit of Suits.all) {
				for (var value of bdl.cards[player.id][suit.id]) {
					player.assignCard(Cards[suit.id+value]);
				}
			}
		}

		Players.ready();
		this.dff.dealt(this);
		this.state="dealt";

		QBM.changed({type:"new game"});

		this.performInitialCmd(cmd,bdl.bids,bdl.meanings,bdl.tricks);

	}
	
	setRoles(roles) {
		for (var player of Players.all) {
			if (typeof roles[player.id] != "undefined") {
			    if (isPresent(roles[player.id].human)) {
					if (roles[player.id].human) {
						player.setType("human");
						if (QB.product.type == "play") { 
							player.setVisible(true); 							
						}
					}
					else {
						player.setType("computer");	
						if (QB.product.type == "play") { 
							player.setVisible(false); 							
						}						
					}
				}			
			    if (isPresent(roles[player.id].visible)) {
				    player.setVisible(roles[player.id].visible);	
				}
			}
		}	
		if (QB.product.type == "play") {
			if (Players.areAllComputer()) Players.setAllVisible(true);		
		}		
	}
	
	updatePlayerCards(tut) {
		Players.clearHands();
	    theULogger.log(1,'-- updatePlayerCards - played:');
        for (var tr = 0; tr <= this.currentTrickNr; tr++) {
			var trick = this.tricks[tr];
			for (var player of Players.all) {
				if (typeof trick.cards[player.nr] != "undefined") {
					var card = trick.cards[player.nr];
					// theULogger.log(1,'--- p:' + player.id + ' c:' + card.id);
					player.assignCard(card);
				}
			}
		}	
		var deal = tut.deal;	
		var haveSetAny = false;	
	    theULogger.log(1,'-- add cards:');	
		for (var player of Players.all) {
			if (typeof deal[player.id] != "undefined") {		
				for (var suit of Suits.all) {
					if (typeof deal[player.id][suit.ID] != "undefined") {
						for (var value of deal[player.id][suit.ID]) {
							var card = Cards[suit.id+value];
							// theULogger.log(1,'--- p:' + player.id + ' c:' + card.id);					
							player.assignCard(card);
						}
					}
				}
			    if (isPresent(deal[player.id].human)) {
				    haveSetAny = true;
					if (deal[player.id].human) {
						player.setType("human");
						player.setVisible(true); // default						
					}
					else {
						player.setType("computer");
						player.setVisible(false); // default
					}
				}							
			    if (isPresent(deal[player.id].visible)) {
				    player.setVisible(deal[player.id].visible);	
				}
			}
		}
		if (haveSetAny) {
			if (Players.areAllComputer()) Players.setAllVisible(true);
			// see loadFromTutorial
		}	
		Players.ready();
	    theULogger.log(1,'-- replay cards:');		
	    for (var tr = 0; tr <= this.currentTrickNr; tr++) {
			var trick = this.tricks[tr];
			for (var player of Players.all) {
				if (typeof trick.cards[player.nr] != "undefined") {
					var card = trick.cards[player.nr];
					// theULogger.log(1,'--- p:' + player.id + ' c:' + card.id);					
					player.playCard(trick,card);
				}
			}
		}	
	}

	shuffleAndDeal(id,cmd) {

		this.source="INTERNAL";

		// store (and finally return) the bid sequence of the previous game
		var previousBids = []; for (var bid of this.bids) previousBids.push(bid.id);

		// reset
		this.clear();

		// deal id
		this.major = Math.floor(id/10000);
		this.minor = id % 10000;
		if (this.minor==0) this.minor=1;
		this.id = (""+this.major).padStart(3,"0")+"-"+(""+this.minor).padStart(2,"0");

		// use fixed random seed to make deals reproducable
		Random.init(id);

		// define vulnerability
		this.setVuln((this.minor-1)%4+Math.floor(((this.minor-1)%16)/4));

		// define dealer (round robin or take from arguments)
		this.setDealer(Players.all[(this.minor-1)%4]);

		// shuffle cards: perform a large number of swap actions on the (sorted) cards
		var tmp, c1,c2;
		for(var n=0;n<500;n++) {
			c1 = Random.get(this.cards.length);
			c2 = Random.get(this.cards.length);
			tmp = this.cards[c1];
			this.cards[c1]=this.cards[c2];
			this.cards[c2]=tmp;
		}

		// let players return cards to the deck
		Players.clearHands();

		// distribute cards
		var player = this.dealer;
		for (var card of this.cards) {
			player.assignCard(card);
			player = Players.next(player);
		}

		Players.ready();
		this.dff.dealt(this);
		this.state="dealt";

		QBM.changed({type:"new game"});

		this.performInitialCmd(cmd,previousBids,null);

		return previousBids;

	}

	performInitialCmd(cmd,bids,meanings,tricks) {

		this.startBidding();

		if (cmd=="" || cmd=="-") return;

		// process given bids; execute a given number of bids (ignoring initial passes)
		var steps = 99;
		var ignoreInitialPassBids = false;
		if 		(cmd.substr(0,5)=="bids:") steps = parseInt(cmd.substr(5));
		else if (cmd.substr(0,5)=="Bids:") {
			steps = parseInt(cmd.substr(5));
			var initPasses=0; for (var bid of bids) if (bid=="-") initPasses++; else break;
			// add more steps to skip subsequent passes
			for (var b=this.bids.length+steps+initPasses;b<bids.length;b++) {
				if (bids[b]=="-") steps++;
				else break;
			}
			ignoreInitialPassBids=true;
		}
		this.performBids(steps,bids,meanings,ignoreInitialPassBids);

		if (this.contract==null || this.contract.level==0) return;	// no contract

		if (cmd.substr(0,3)=="bid" || cmd.substr(0,3)=="Bid") return;

		var steps = 52;
		if (cmd.substr(0,7)=="tricks:") steps = parseInt(cmd.substr(7))*4;
		if (cmd.substr(0,6)=="cards:") 	steps = parseInt(cmd.substr(6));
		this.performCards(steps,tricks);

		if (cmd!="review") return;

		// QB.playWin.review("start");

	}
	
	isMiniRound1() {
	   return this.isMini && this.bids.length < 4;
	}
	
	performBids(steps,bids,meanings,ignoreInitialPassBids) {

		if (typeof ignoreInitialPassBids=="undefined") ignoreInitialPassBids=false;

		// if no bids were passed: create random sequence or use BDL information
		if (typeof bids=="undefined" || bids==null || bids.length==0 ) {
			if (this.source=="BDL") {
				bids=this.bidsBDL.slice();
				meanings=this.meaningsBDL;
			}
			else {
				// use the remaining part of random bids
				bids = this.randomBids();
			}
			if (this.bids.length>0) bids.splice(0,this.bids.length);
		}
		var initPassed = 0;
		for (var b=0;b<3&&b<this.bids.length;b++) if (this.bids[b].id=="-") initPassed++; else break;
		for (var bb=0, b=initPassed;b<3&&bb<bids.length;b++,bb++) if (bids[bb]=="-") steps++; else break;

		if (typeof meanings == "undefined") meanings=[];
		for (var bidId of bids) {
			if (--steps <0) break;
			this.bid(bidId,meanings[this.bids.length+1]);
		}
	}

	performCards(steps,tricks) {

		if (typeof tricks=="undefined" || tricks==null) {
			if (this.source=="BDL") {
				tricks=this.tricksBDL;
			}
			else {
				tricks=null;
			}
		}
		if (tricks==null) {
			while (--steps>=0 && this.mover.hand.length>0) this.randomTrick();
		}
		else {
			var skip=this.currentCardNr;
			for (var trick of tricks) {
				for (var cardId of trick.cards) {
					if (--skip>=0) continue;
					if (--steps<0) break;
					this.playCard(this.mover,Cards[cardId.substr(0,2)]);
				}
				if (steps<0) break;
			}
		}
	}

	randomBids() {
		return ["1nt","-","2c","-","2s","-","4s","-","-","-"];
	}

	setVuln(vuln) {
		var vulnNr=0;
		if (typeof vuln=="number") 		vulnNr=vuln%4;
		else if	(vuln.match(/^-+$/))	vulnNr=0;
		else if (vuln.match(/^N.*S$/)) 	vulnNr=1;
		else if (vuln.match(/^E.*W$/))	vulnNr=2;
		else if (vuln.match(/^all/i))	vulnNr=3;
		this.vulnNr=vulnNr;
		this.vuln=["--","NS","EW","All"][this.vulnNr];
		this.dff.vuln = this.vuln;
		Players.assignVuln(this.vuln);
	}

	setDealer(dealer) {
		this.dealer=dealer;
		this.mover=dealer;
		this.lead=dealer;
		if (dealer!=null) this.dff.dealer = dealer.id;
	}

	nextDeal() {
		this.shuffleAndDeal(0);
	}

	startBidding() {
		QBM.changed({type:"start bidding"});
	}

	bid(bidId,alert,meaning) {
		var bidder = this.mover;
		var bid;
		theULogger.log(1,"- bid by " + bidder.name + " bid " + bidId + " alert:" + alert + " meaning:" + meaning);		
		if (this.isMini) {
		    if (this.bids.length == 4) {
			   bid = new Bid(bidId,bidder);		   
			}
			else {
			   var newBidId = MiniValToBidId(parseInt(bidId));
		       theULogger.log(1,"- newBidId = " + newBidId);				   
			   bid = new Bid(newBidId,bidder);
               if (this.bids.length == 3) {
			        var points0 = 0 + BidIdToMiniVal(this.bids[0].id);
		            var points1 = 0 + BidIdToMiniVal(this.bids[1].id);
		            var points2 = 0 + BidIdToMiniVal(this.bids[2].id);	
					var points3 = 0 + parseInt(bidId);	
					if (points0 + points2 == points1 + points3) {
						// equal points, no contract
					    this.mover = " ";
					}
					if (points0 + points2 > points1 + points3) {			
					    if (points0 >= points2) this.mover = Players.next(bidder);
						else 					this.mover = Players.prev(bidder);
					}
					else {					
					    if (points1 >= points3) this.mover = Players.next(Players.next(bidder));
						else					this.mover = bidder;
					}			
			   }
			   else {
					this.mover = Players.next(bidder);
			   }
			}
			this.bids.push(bid);  // length 3 above becomes 4!			
			QBM.changed({type:"bid", bidder:bidder, bid:bid, nr:this.bids.length-1});
            if (this.bids.length == 4) {
				if (this.mover == " ") {
			        contract = new Contract(null,null,0,null);	
			        this.setContract(contract);
				}
				else {
					// open hand of partner (later dummy)
					this.openDummyHand(this.mover.partner());								
				}
			}
		    if (this.bids.length == 5) {
			    contract = new Contract(null,null,0,null);
				contract.update(bidder,bid.suit,bid.level,"");
			    this.setContract(contract);
			}			
			return true;
		}	
		bid = new Bid(bidId,bidder);

		// theULogger.log(1,"- bid by " + bidder.name + " bid " + bidId);

		// check if bid is allowed
		if (bid.doubled == "D" && (this.playersInSpe=="" || bidder.otherParty!=this.playersInSpe)) return false;
		if (bid.doubled == "D" && bidder.otherParty==this.playersInSpe && this.contractInSpe[bidder.otherParty].doubled!="") return false;
		if (bid.doubled == "R" && bidder.party!=this.playersInSpe) return false;
		if (bid.doubled == "R" && bidder.party==this.playersInSpe && this.contractInSpe[bidder.party].doubled!="D") return false;
		if (!bid.pass && bid.doubled=="" && this.playersInSpe!="" && bid.rank< this.contractInSpe[this.playersInSpe].rank) return false;

		var bidNr = this.bids.length;
		/*
		if (   QB.product.type!="tut"
			&& this.source=="BDL"
			&& this.bidsBDL.length>bidNr
			&& bidId.replace("~","") != this.bidsBDL[bidNr].replace("~","")) {
			var currentBids = this.dff.bids;
			var altBids = this.dff.alternateBid(bidId,this.bids.length+1);
			this.dff.bids = altBids;
			var analysis = QBM.dealFinder.analyse(this.dff,this.bids.length+1,false);
			this.dff.bids=currentBids;
			var hints=[];
			for (var fil of analysis.filters) {
				hints[fil.pos] = fil.filter.ors[fil.orNr].hint + (fil.filter.conv!="" ? " ["+fil.filter.conv+"]":"");
			}
			meaning=hints[this.bids.length+1];

			// restore original bid and find suggested meaning
			var suggestedMeaning = "..";
			currentBids = this.dff.bids;
			this.dff.bids = this.dff.alternateBid(this.bidsBDL[bidNr],this.bids.length+1);
			var analysis = QBM.dealFinder.analyse(this.dff,this.bids.length+1,false);
			this.dff.bids=currentBids;
			var hints=[];
			for (var fil of analysis.filters) {
				hints[fil.pos] = fil.filter.ors[fil.orNr].hint + (fil.filter.conv!="" ? " ["+fil.filter.conv+"]":"");
			}
			suggestedMeaning=hints[this.bids.length+1];

			QBM.changed({type:"suggestedBid",
				bidder:this.mover,
				yourBid: new Bid(bidId,this.mover), yourMeaning: meaning,
				suggestedBid:new Bid(this.bidsBDL[bidNr],this.mover), suggestedMeaning: suggestedMeaning,
				altBids:altBids
			});
			return false;
		}
		*/

		// add bid to list
		this.bids.push(bid);
		this.dff.addBid(bid);

		/*
		if (   QB.product.type != "tut" 
		    && (typeof meaning == "undefined" || meaning == null || meaning == "") ) {
			var analysis = QBM.dealFinder.analyse(this.dff,this.bids.length,false);
			var hints=[];
			for (var fil of analysis.filters) {
				hints[fil.pos] = fil.filter.ors[fil.orNr].hint + (fil.filter.conv!="" ? " ["+fil.filter.conv+"]":"");
			}
			meaning=hints[this.bids.length];
		}
		*/

		bid.meaning = (typeof meaning == "undefined" || meaning == null ) ? "" : meaning;
		if (typeof alert != "undefined" && alert != null && alert != "") bid.setAlert(alert);

		// activate next bidder
		this.mover=Players.next(bidder);

		// update potential contract
		var contract = this.contractInSpe[bidder.party];
		if (bid.doubled=="D") {
			this.contractInSpe[bidder.otherParty].setDoubled("D");
			this.triplePass=0;
		}
		else if (bid.doubled=="R") {
			contract.setDoubled("R");
			this.triplePass=0;
		}
		else if (!bid.pass) {
			// normal bid
			contract.update(bidder,bid.suit,bid.level,"");
			this.playersInSpe=bidder.party;
			this.triplePass=0;
		}

		// notify UI
		QBM.changed({type:"bid", bidder:bidder, bid:bid, nr:this.bids.length-1});

		if (bid.pass) {
			if (++this.triplePass>=4 || (this.triplePass>=3 && this.playersInSpe!="")) {
				// passed three (four) times
				var contractParty=null;
				if (this.contractInSpe["NS"].rank==this.contractInSpe["EW"].rank) {
					this.setContract(this.contractInSpe["NS"]);
				}
				else if (this.contractInSpe["NS"].rank > this.contractInSpe["EW"].rank) {
					this.setContract(this.contractInSpe["NS"]);
				}
				else {
					this.setContract(this.contractInSpe["EW"]);
				}
			}
		}

		return true;
	}
	
	setGivenContract(givenContract) {
		theULogger.log(1,'- declarer:' + givenContract.declarer + ' contract:' + givenContract.contract);	
	    var contract = new Contract(null,null,0,null);
		var declarer = Players.S;
		if (givenContract.declarer == "N") declarer = Players.N;
		if (givenContract.declarer == "E") declarer = Players.E;	
		if (givenContract.declarer == "W") declarer = Players.W;		
		var bid = new Bid(givenContract.contract,declarer);
		contract.update(declarer,bid.suit,bid.level,"");
		if (givenContract.risk == "x")  contract.setDoubled("D");
		if (givenContract.risk == "xx") contract.setDoubled("R");		
		this.setContract(contract);	  
	}

	setContract(contract) {
		this.contract= contract;
		if (contract.level==0) {
			// all players passed, no contract
			this.lead=this.mover=this.dealer;
			this.dff.decl = "S"; // to have it defined
		}
		else {
			// create first trick with LHO as lead
			this.lead=this.mover=this.contract.declarer.next();
			if (this.currentTrickNr == -1) // protect against 4 passes in BDX file
			    this.nextTrick(this.mover);

			var c = this.contract;
			this.dff.decl=c.declarer.id;
			if 		(c.level==0) this.dff.cl="-";
			else if (c.level==6) this.dff.cl="s";
			else if (c.level==7) this.dff.cl="gs";
			else if ((c.suit==Suits.nt && c.level>=3) || ((c.suit==Suits.d||c.suit==Suits.c) && c.level>=5) || ((c.suit==Suits.s || c.suit==Suits.h) && c.level>=4)) this.dff.cl="g";
			else this.dff.cl="p";

			if 		(this.contract.doubled=="D") 	this.dff.ct="x";
			else if (this.contract.doubled=="R") 	this.dff.ct="xx";
			else									this.dff.ct="n";

			this.dff.contract=c.level+["t","k","c","p","sa"][c.suit.rank]+this.dff.ct.replace("n","")+" "+this.dff.decl;
		}

		// in tutorial mode open the dummy directly after bidding (i.e. BEFORE the lead card is played)
		// - when North or South is declarer
		if (QB.product.type == "tut" && (this.dff.decl == "N" || this.dff.decl == "S")) {
            this.openDummyHand(this.lead.next());
		}
		this.state="biddingFinished";
		QBM.changed({type:"biddingFinished",nrOfBids:this.bids.length,showHistory:true});
	}

	nextTrick(lead) {
		// start new trick
		this.currentTrickNr++;
		var trick = new Trick(this.currentTrickNr,lead);
		// add the new trick; if we undid a move there may already be a trick
		// object for this round (currentTrickNr); in that case we must replace it
		if (this.tricks.length<=this.currentTrickNr) this.tricks.push(trick);
		else this.tricks[this.currentTrickNr]=trick;
		this.lead=this.mover=this.winner=lead;
		return lead;
	}

	cardAllowed(player,card) {
		// returns a two-character code, OK or an error, 
		// errors possibly followed by an explanation text.
		// explanations to the user are only optionally logged (level 1)

		if (this.currentTrickNr<0 || this.tricks.length<=0) {
			theULogger.log(0,  "- " + player.name + " played " + card.id
							 + " not during the play, state:" + this.state);
			return "NP -";
		}

		var trick = this.tricks[this.currentTrickNr];

		// is it the player's turn to move?
		if (player!=trick.mover) {
		    var explanation = this.mover.name + " " + theLang.tr("IDS_MUST_PLAY__NOT")
							  + " " + player.name + ") !";
			theULogger.log(1,   "- trick " + this.currentTrickNr + " - card " + card.html 
							  + " , " + explanation);
			if (trick.mover.isHuman()) return "PH " + explanation;
			return "PC " + explanation;
		}

		if (player==trick.lead) return "OK";

		// did the player put his card already?
		if (typeof trick.cards[player.nr] != "undefined") {
			theULogger.log(0,  "- " + player.name + " played " + card.id
							 + " possibly twice?");
			return "NH -";
		}

		// card to play follows suit
		var leadSuit = trick.cards[trick.lead.nr].suit;
		if (card.suit==leadSuit) return "OK";

		// different suit but player does not hold lead suit
		if (!player.hasSuit(leadSuit)) {
			// discard or ruff
			return "OK";
		}
		else {
			var explanation =   player.name + " " + theLang.tr("IDS_LEAD_SUIT_FOLLOW") 
							  + " " + leadSuit.html + " !";		
			theULogger.log(1,explanation);
			return "NF " + explanation;
		}
	}

	openDummyHand(dummy) {
		// open dummy hand -- lead player played first card of the game
		theULogger.log(1,"- openDummyHand - d:" + dummy.id);
		dummy.setVisible(true);
		if 		(dummy.partner().isHuman()) dummy.setType("human");
		else if (dummy.isHuman()) 			dummy.partner().setType("human");
		if (dummy.partner().isHuman()) dummy.partner().setVisible(true);
	}

	playCard(player,card) {
		if (card==null) return true;
		if (this.state!="biddingFinished" && this.state!="playing" ) return false;
		if (this.cardAllowed(player,card) != "OK") return false;
		var trick = this.tricks[this.currentTrickNr];
		if ((player.playCard(trick,card)!=null)) {
			this.cardSequence.push(card.id);
			this.currentCardNr++;
			// send signal to collect cards from previous trick
			if (player==trick.lead) QBM.changed({type:"collect trick",lead:trick.lead});
			this.state="playing";
			trick.cards[player.nr]=card;
			trick.winner=this.currentWinner();

			// theULogger.log(1,player.name+" played "+card.html);
			QBM.changed({type:"card played",player:player,card:card,winner:trick.winner,moveNr:this.currentCardNr-1});

			if (trick.nr==0 && player==trick.lead) {
				// open dummy hand -- lead player played first card of the game
				this.openDummyHand(player.next());
			}

			if (Players.next(trick.mover)==trick.lead) {
				// last player has given his card
				this.trickSum[trick.winner.party]++;
				QBM.changed({type:"trickFinished",
					trick:trick,
					trickSumPlayers:this.trickSum[this.contract.players],
					trickSumDefense:this.trickSum[this.contract.defense]
				});
				// progress to next trick
				if (this.currentTrickNr<12) {
					this.nextTrick(trick.winner);
				}
				else {
					this.state="finished";
					this.setResult(this.trickSum[this.contract.declarer.party],false);
				}
			}
			else {
				this.mover = trick.mover = Players.next(trick.mover);
			}

			QBM.changed({type:"mover changed",player:this.mover});
		}
		else {
			theULogger.log(0,"- move not possible: player:"+player.name+" "+card.name);
			return false;
		}
	}

	setClaimedTricks(nrtricks) {
	    theULogger.log(1,'- Game:setClaimedTricks ' + nrtricks);
		this.claimedTricks=nrtricks;			
        this.state="finished";
        this.setResult(nrtricks,true);
    }

	replay(cardSequence) {
	    theULogger.log(1,'- Game:replay');	
		if (typeof cardSequence=="undefined") {
			cardSequence = this.cardSequence.join(" ");
		}

		Cards.clear();
		this.cardSequence=[];

		this.tricks=[];
		this.trickSum={NS:0,EW:0};
		this.currentCardNr= 0;
		this.result=0;
		this.resultString="";
		this.score=0;
		var player=this.contract.declarer.next();
		this.lead=this.mover=player;
		this.currentTrickNr= -1;
		this.nextTrick(this.mover);

		if (this.state!="biddingFinished") {
			this.state="biddingFinished";	
			QBM.changed({type:"biddingFinished",nrOfBids:this.bids.length,showHistory:false});		
		}
		if (cardSequence!="") {
			for (var cardId of cardSequence.split(" ")) {
				this.playCard(player,Cards[cardId]);
				if (this.currentCardNr%4==0 && this.tricks.length>0) player= this.tricks[Math.floor(this.currentCardNr/4)-1].winner;
				else player=player.next();
			}
		}
	}

	undoLastTrick() {
		var trick= this.tricks[this.currentTrickNr];
		if (trick.cards.length==0) {
			this.currentTrickNr--;
			trick= this.tricks[this.currentTrickNr];
		}
		for (var player=trick.lead.prev(); ; player=player.prev()) {
			if (!isPresent(trick.cards[player.nr])) continue;
			player.unplayCard(trick,trick.cards[player.nr]);
			this.currentCardNr--;
			if (player==trick.lead) break;
		}
		// update the number of tricks if we took back a complete trick
		if (isPresent(trick.cards[trick.lead.prev().nr])) this.trickSum[trick.winner.party]--;
		trick.reset();
		QBM.changed({type:"undo trick"});
		this.mover=this.lead=trick.lead;
	}

	currentWinner() {
		var trick = this.tricks[this.currentTrickNr];
		var winner=trick.winner;
		var topCard=trick.cards[trick.winner.nr];
		for (var player=Players.next(trick.winner); player!=trick.lead; player=Players.next(player)) {
			var card = trick.cards[player.nr];
			if (typeof card=="undefined") break;
			if (card.suit==topCard.suit && card.value.rank > topCard.value.rank) {
				topCard=card;
				winner=player;
			}
			else {
				// check ruffing
				if (card.suit!=topCard.suit && card.suit==this.contract.suit) {
					topCard=card;
					winner=player;
				}
			}
		}
		return winner;
	}

	trickWonBy(player) {
		this.tricks[this.currentTrickNr].winner=player;
		theULogger.log(1,"trick "+this.currentTrickNr+" won by "+player.name);
	}

	setResult(nrTricks, byClaim) {
		this.result=nrTricks-6-this.contract.level;
		var suitNr=0;
        var delay = 1000;
        if (byClaim) delay = 100;
		if (this.contract.suit==Suits.nt) suitNr=2;
		else if (this.contract.suit.rank>=2) suitNr=1;
		var vuln = this.contract.declarer.vuln ? 3 : 0;
		var dbl  = 0;
		if (this.contract.doubled=="D") dbl=1;
		else if (this.contract.doubled=="R") dbl=2;

		if (this.result<0) this.score = Game.scoreTable[0][vuln+dbl][-this.result-1];
		else               this.score = Game.scoreTable[this.contract.level][suitNr][vuln+dbl][this.result];

		this.resultString = "=&nbsp;";
		if 		(this.result>0) this.resultString = "+"+this.result;
		else if (this.result<0) this.resultString = this.result;
		this.resultString+= " &nbsp; "+(""+this.score).padStart(5).replace(/ /g,"&nbsp;");

		// tell UI about finished game with 1 second delay (or claim: 1/10 second)
		// so the user can see the last trick before it gets collected
		setTimeout(function() {	QBM.changed({type:"gameFinished",game:QBM.game}); },delay );
	}

	randomTrick() {

		// on lead play random card
		var hand = this.mover.hand;
		if (this.mover==this.lead) this.playCard(this.mover,hand[Random.get(hand.length)]);
		else {
			var trick = this.tricks[this.currentTrickNr];
			var leadSuit=trick.cards[trick.lead.nr].suit;
			var n=this.mover.suitLengths[leadSuit.id];
			if (n>0) {
				// must follow lead suit
				n=Random.get(n);
				for (var card of hand) {
					if (card.suit==leadSuit) {
						if (--n<0) {
							this.playCard(this.mover,card);
							break;
						}
					}
				}
			}
			else {
				this.playCard(this.mover,hand[Random.get(hand.length)]);
			}
		}

	}

}

Game.scoreTable = [

	// defeated contracts
	[
		[  -50, -100, -150, -200, -250, -300, -350, -400, -450, -500, -550, -600, -650],
		[ -100, -300, -500, -800,-1100,-1400,-1700,-2000,-2300,-2600,-2900,-3200,-3500],
		[ -200, -600,-1000,-1600,-2200,-2800,-3400,-4000,-4600,-5200,-5800,-6400,-7000],
		[ -100, -200, -300, -400, -500, -600, -700, -800, -900,-1000,-1100,-1200,-1300],
		[ -200, -500, -800,-1100,-1400,-1700,-2000,-2300,-2600,-2900,-3200,-3500,-3800],
		[ -400,-1000,-1600,-2200,-2800,-3400,-4000,-4600,-5200,-5800,-6400,-7000,-7600],
	],

	// inner groups: / vuln=false, doubled = "",""D","R" / vuln=true, doubled = "",""D","R"

	// ================================= LEVEL 1
	[
		// -------------------- MINOR SUIT
		[
			[   70,   90,  110,  130,  150,  170,  190],
			[  140,  240,  340,  440,  540,  640,  740],
			[  230,  430,  630,  830, 1030, 1230, 1430],
			[   70,   90,  110,  130,  150,  170,  190],
			[  140,  340,  540,  740,  940, 1140, 1340],
			[  230,  630, 1030, 1430, 1830, 2230, 2630],
		],
		// -------------------- MAJOR SUIT
		[
			[   80,  110,  140,  170,  200,  230,  260],
			[  160,  260,  360,  460,  560,  660,  760],
			[  520,  720,  920, 1120, 1320, 1520, 1720],
			[   80,  110,  140,  170,  200,  230,  260],
			[  160,  360,  560,  760,  960, 1160, 1360],
			[  720, 1120, 1520, 1920, 2320, 2720, 3120],
		],
		// -------------------- NOTRUMP
		[
			[   90,  120,  150,  180,  210,  240,  270],
			[  180,  280,  380,  480,  580,  680,  780],
			[  560,  760,  960, 1160, 1360, 1560, 1760],
			[   90,  120,  150,  180,  210,  240,  270],
			[  180,  380,  580,  780,  980, 1180, 1380],
			[  760, 1160, 1560, 1960, 2360, 2760, 3160],
		]
	],

	// ================================= LEVEL 2
	[
		// -------------------- MINOR SUIT
		[
			[   90,  110,  130,  150,  170,  190],
			[  180,  280,  380,  480,  580,  680],
			[  560,  760,  960, 1160, 1360, 1560],
			[   90,  110,  130,  150,  170,  190],
			[  180,  380,  580,  780,  980, 1180],
			[  760, 1160, 1560, 1960, 2360, 2760],
		],
		// -------------------- MAJOR SUIT
		[
			[  110,  140,  170,  200,  230,  260],
			[  470,  570,  670,  770,  870,  970],
			[  640,  840, 1040, 1240, 1440, 1640],
			[  110,  140,  170,  200,  230,  260],
			[  670,  870, 1070, 1270, 1470, 1670],
			[  840, 1240, 1640, 2040, 2440, 2840],
		],
		// -------------------- NOTRUMP
		[
			[  120,  150,  180,  210,  240,  270],
			[  490,  590,  690,  790,  890,  990],
			[  680,  880, 1080, 1280, 1480, 1680],
			[  120,  150,  180,  210,  240,  270],
			[  690,  890, 1090, 1290, 1490, 1690],
			[  880, 1280, 1680, 2080, 2480, 2880],
		]
	],

	// ================================= LEVEL 3
	[
		// -------------------- MINOR SUIT
		[
			[  110,  130,  150,  170,  190],
			[  470,  570,  670,  770,  870],
			[  640,  840, 1040, 1240, 1440],
			[  110,  130,  150,  170,  190],
			[  670,  870, 1070, 1270, 1470],
			[  840, 1240, 1640, 2040, 2440],
		],
		// -------------------- MAJOR SUIT
		[
			[  140,  170,  200,  230,  260],
			[  530,  630,  730,  830,  930],
			[  760,  960, 1160, 1360, 1560],
			[  140,  170,  200,  230,  260],
			[  730,  930, 1130, 1330, 1530],
			[  960, 1360, 1760, 2160, 2560],
		],
		// -------------------- NOTRUMP
		[
			[  400,  430,  460,  490,  520],
			[  550,  650,  750,  850,  950],
			[  800, 1000, 1200, 1400, 1600],
			[  600,  630,  660,  690,  720],
			[  750,  950, 1150, 1350, 1550],
			[ 1000, 1400, 1800, 2200, 2600],
		]
	],

	// ================================= LEVEL 4
	[
		// -------------------- MINOR SUIT
		[
			[  130,  150,  170,  190],
			[  510,  610,  710,  810],
			[  720,  920, 1120, 1320],
			[  130,  150,  170,  190],
			[  710,  910, 1110, 1310],
			[  920, 1320, 1720, 2120],
		],
		// -------------------- MAJOR SUIT
		[
			[  420,  450,  480,  510],
			[  590,  690,  790,  890],
			[  880, 1080, 1280, 1480],
			[  620,  650,  680,  710],
			[  790,  990, 1190, 1390],
			[ 1080, 1480, 1880, 2280],
		],
		// -------------------- NOTRUMP
		[
			[  430,  460,  490,  520],
			[  610,  710,  810,  910],
			[  920, 1120, 1320, 1520],
			[  630,  660,  690,  720],
			[  810, 1010, 1210, 1410],
			[ 1120, 1520, 1920, 2320],
		]
	],

	// ================================= LEVEL 5
	[
		// -------------------- MINOR SUIT
		[
			[  400,  420,  440],
			[  550,  650,  750],
			[  800, 1000, 1200],
			[  600,  620,  640],
			[  750,  950, 1150],
			[ 1000, 1400, 1800],
		],
		// -------------------- MAJOR SUIT
		[
			[  450,  480,  510],
			[  650,  750,  850],
			[ 1000, 1200, 1400],
			[  650,  680,  710],
			[  850, 1050, 1250],
			[ 1200, 1600, 2000],
		],
		// -------------------- NOTRUMP
		[
			[  460,  490,  520],
			[  670,  770,  870],
			[ 1040, 1240, 1440],
			[  660,  690,  720],
			[  870, 1070, 1270],
			[ 1240, 1640, 2040],
		]
	],

	// ================================= LEVEL 6
	[
		// -------------------- MINOR SUIT
		[
			[  920,  440],
			[ 1090, 1190],
			[ 1380, 1580],
			[ 1370, 1390],
			[ 1540, 1740],
			[ 1830, 2230],
		],
		// -------------------- MAJOR SUIT
		[
			[  980, 1010],
			[ 1210, 1310],
			[ 1620, 1820],
			[ 1430, 1460],
			[ 1660, 1860],
			[ 2070, 2470],
		],
		// -------------------- NOTRUMP
		[
			[  990, 1020],
			[ 1230, 1330],
			[ 1660, 1860],
			[ 1440, 1470],
			[ 1680, 1880],
			[ 2110, 2510],
		]
	],

	// ================================= LEVEL 7
	[
		// -------------------- MINOR SUIT
		[
			[ 1440],
			[ 1630],
			[ 1960],
			[ 2140],
			[ 2330],
			[ 2660],
		],
		// -------------------- MAJOR SUIT
		[
			[ 1510],
			[ 1770],
			[ 2240],
			[ 2210],
			[ 2470],
			[ 2940],
		],
		// -------------------- NOTRUMP
		[
			[ 1520],
			[ 1790],
			[ 2280],
			[ 2220],
			[ 2490],
			[ 2980],
		]
	]
];


class Contract {
	constructor(declarer,suit,level,doubled) {
		this.inventors = {c:null,d:null,h:null,s:null,nt:null};
		this.declarer=declarer;
		this.suit=suit;
		this.level=level;
		if (suit==null) this.rank=0;
		else this.rank= suit.rank+level*10;
		this.setDoubled(doubled);
	}

	update(bidder,suit,level,doubled) {
		this.suit=suit;
		this.level=level;
		this.rank=suit.rank+level*10;
		this.setDoubled(doubled);
		if (this.inventors[suit.id] == null) this.inventors[suit.id] = bidder;
		this.declarer = this.inventors[suit.id];
		this.players = this.declarer.party;
		this.defense = (this.declarer.party=="NS") ? "EW" : "NS";
	}

	setDoubled(doubled) {
		this.doubled=doubled;
		this.doubledString="";
		this.doubledHtml = "";

		if (doubled=="D") {
			this.doubledString="x&nbsp;";
			this.doubledHtml = "<span style='color:red'>x&nbsp;</span>";
		}
		if (doubled=="R") {
			this.doubledString="xx";
			this.doubledHtml = "<span style='color:blue'>xx</span>";
		}
	}

	toString() {
		if (this.level==0) return "---";
		return this.level+this.suit.letter+" "+this.doubledString+" "+this.declarer.letter+" ";
	}
	
	toLongString() {
		if (this.level==0) return "---";
		return this.declarer.name.padEnd(8).replace(/ /g,"&nbsp;")+" "+this.level+" "+this.suit.html+(this.suit==Suits.nt?"":"&nbsp;")+" "+this.doubledString;
	}	

	toHtml() {
		if (this.level==0) return "---";
		return this.level+" "+(this.suit==Suits.nt ? this.suit.letter : this.suit.html)+" "+this.doubledString+" &nbsp; "+this.declarer.letter+" ";
	}
	
	toHtmlTrumpOnly() {
		var html = "";
		if (this.suit.id == "NT") {
			html = theLang.tr("L_WITHOUT") + " " + theLang.tr("trump");
		}
		else {
			html = theLang.tr("L_WITH") + " " + theLang.tr("trump") + " " + this.suit.html;
		}
		return html;
	}	

}

class Trick {
	constructor(nr,lead) {
		this.nr		= nr;
		this.lead	= lead;
		this.reset();
	}

	reset() {
		this.mover	= this.lead;
		this.winner = this.lead;
		this.cards	= [];
	}
}

class Bid {
	constructor(id,bidder) {
		// eg  "1nt" or "2d~" or "2d«1»"
		// theULogger.log(0,'-- Bid::ctor id:' + id + ': bidder:' + bidder.id);

		this.id=id;				// English, eg "3nt", "double"
		this.info="";

		this.bidder = bidder;

		if (id.indexOf("«")>0) {
			this.info=id.replace(/^[^«]+«/,'').replace("»",'');
			this.id=id.replace(/«[^»]+»/,'');
		}

		this.suffix=""; // artificial = "~"
		if (id.substr(-1)=="~") {
			this.suffix="~";
			this.id = id.substr(0,id.length-1);
		}

		this.suit=null;
		this.level=0;
		this.rank=0;
		this.doubled="";
		this.pass=false;
		this.meaning="";

		this.name="";			// lang specific, eg "3SA", "x"
		if 	(this.id=="pass" || this.id=="p" || this.id=="-" ) {
			this.pass=true;
			this.html = " -"+this.suffix+" ";
			this.name = "-"+this.suffix;
		}
		else if (this.id=="double" || this.id=="x" || this.id=="X") {
			this.doubled="D";
			this.html="<span style='color:red'>x</span>"+this.suffix;
			this.name = "x"+this.suffix;
		}
		else if (this.id=="redouble" || this.id=="xx" || this.id=="XX") {
			this.doubled="R";
			this.html="<span style='color:blue'>xx</span>"+this.suffix;
			this.name = "xx"+this.suffix;
		}
		else {
			this.level=id[0];
			this.suit=Suits[this.id.substr(1).replace(/[~«].*/,"")];
			this.rank=this.suit.rank+this.level*10;
			this.html=this.level+" "+this.suit.html+this.suffix;
			this.name=this.level+this.suit.letter+this.suffix;
		}
	}
	
	setAlert(alert) {
		if (alert != "") {
			if (alert == "AN") this.suffix = ".";
			if (alert == "AF") this.suffix = "a";	
			if (alert == "IN") this.suffix = ":";
			if (alert == "IF") this.suffix = "s";			
			this.html += " " + this.suffix;
		}
	}
	
	toHtmlTrumpOnly() {
		var html = "";
		if (this.suit.id == "NT") {
			html = theLang.tr("suitNotrump");
		}
		else {
			html = theLang.tr("trump") + " " + this.suit.html;
		}
		return html;
	}
}
function BidIdToMiniVal(id) {
	if 	(id=="-"  || id=="p")  return 0;	
	if  (id=="x"  || id=="X")  return 36;
	if  (id=="xx" || id=="XX") return 37;	
	var i = (0 + id.substr(0,1)) * 5;
	var s = id.substr(1,1);
	if (s == "c") i -= 4;
	if (s == "d") i -= 3;	
	if (s == "h") i -= 2;	
	if (s == "s") i -= 1;
	// no change for nt
	return i;
}

function MiniValToBidId(i) {
    if (i == 0) return "-";
	if (i == 36) return "x";
	if (i == 37) return "xx";
	var l = 1 + Math.floor(i / 5);
    var r = i % 5;
	var suit = "nt";
    if (r == 0) l--;
    if (r == 1) suit = "c";
    if (r == 2) suit = "d";
    if (r == 3) suit = "h";
    if (r == 4) suit = "s";
    return l.toString() + suit;
}

class DealForFiltering {
	constructor() {
		this.bids="";
		this.bproc = "u";	// bidding process:		"u" = undisturbed, "c" = competitive
		this.cl = "-",		// contract level:		"-" = no contract, "p" = partial game, "g"=game, "s"=slam, "gs"= grand slam
		this.contract = "";	// e.g. "2dk xx S"
		this.ct = "n";		// "n" (normal), "x" (doubled), "xx" (redoubled)
		this.dealer = "";	// dealer (player id)
		this.decl = "";		// declarer (player id)

		this.hp	=	{N:{s:0,h:0,d:0,c:0,t:0},E:{s:0,h:0,d:0,c:0,t:0},S:{s:0,h:0,d:0,c:0,t:0},W:{s:0,h:0,d:0,c:0,t:0}},
		this.hlp=	{N:{s:0,h:0,d:0,c:0,t:0},E:{s:0,h:0,d:0,c:0,t:0},S:{s:0,h:0,d:0,c:0,t:0},W:{s:0,h:0,d:0,c:0,t:0}},
		this.ls	=	{N:{s:0,h:0,d:0,c:0},	 E:{s:0,h:0,d:0,c:0},    S:{s:0,h:0,d:0,c:0},    W:{s:0,h:0,d:0,c:0}},
		this.l	=	{N:[],E:[],S:[],W:[]},
		this.id = "";		// e.g. 4711-024
		this.opener = "";	// first player (/id) who made a non-pass bid
		this.result="0 0";	// number of tricks and score
		this.vuln="--";		// "--","N/S","E/W","All"
	}

	setBids(bids,dealer) {
		this.bids=bids.join(" ");
		var bidder=dealer;
		var opener;
		for(var bid of bids) {
			if (this.opener=="" && bid!= "-") {
				opener = bidder;
				this.opener=bidder.id;
			}
			else if (bid!="-" && this.opener.party!=bidder.party) this.bproc="c";
			bidder=Players.next(bidder);
		}
	}

	addBid(bid) {
		if (this.bids=="") 	this.bids = bid.id;
		else				this.bids += " "+bid.id;
		if (this.opener!="" && bid.id!="-" && Players[this.opener].party!=bid.bidder.party) this.bproc="c";
	}

	alternateBid(bid,nr) {
		var bids = this.bids.split(" ");
		bids.splice(nr-1,99);
		bids.push(bid);
		return bids.join(" ");
	}

	dealt(game) {
		for(var player of Players.all) {
			var pl = player.id;
			for (var n=0;n<4;n++) this.l[pl][n] = player.lengths[n];
			for (var suit of Suits.all) {
				var s = suit.rank;
				this.ls[pl][s]  = player.suitLengths[suit.id];
				this.hlp[pl][s] = player.hiPoints[suit.id]+player.lengthPoints[suit.id];
				this.hp[pl][s]  = player.hiPoints[suit.id];
			}
			this.hlp[pl].t = player.hiPoints.t + player.lengthPoints.t;	// total points
			this.hp[pl].t  = player.hiPoints.t;							// total points
		}
	}
}
