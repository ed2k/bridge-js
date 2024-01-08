
"use strict";

// =============================================================================================================

class QBModel extends Model {
	// The main class for the core application

	constructor(app) {
		super(app);

		// load the most important core classes
		Players.initialize();
		Cards.initialize();
		if (app.product.type == "tut")
		    this.tutorial = new Tutorial();
		if (app.product.type == "play")
		    this.dealControl = new DealControl();
		this.bdl = new BDL();
		this.game = new Game();
		this.dealFinder = new DealFinder(app);

		this.cmd="";
	}

	init() {
		this.dealFinder.setup();
	}

	createDeal(dealId,cmd) {
		// create an INTERNAL random deal and advance the state of the game according to "cmd"

		if (cmd!="") this.cmd=cmd;

		if (dealId!="") {
			if (typeof dealId == "number") {
				this.game.major = dealId;
				this.game.minor = 0;
			}
			else {
				this.game.major = parseInt(dealId) % 10000;
				this.game.minor = parseInt(dealId.replace(/^[0-9]*[^0-9]+/,'')) % 10000;
				if (this.game.minor>0) this.game.minor--;
			}
		}
		else {
			// pick a random deal
			this.game.major = Random.get(10000);
			this.game.minor = 0;
		}
		this.dealMajor = this.game.major;
		this.dealMinor = this.game.minor;

		this.game.source="INTERNAL";
		this.nextGame();

		this.changed({type:"source",name:"(random)"});

	}

	nextGame() {
		// step forward to the next game (BDL, Tutorial, INTERNAL/RANDOM)

		if (this.game.source=="BDL") {
			this.BDLDeal = this.bdl.parse(this.game.id);
			// load game and advance the state of the game according to "cmd"
			if (this.BDLDeal!=null) this.game.loadFromBDL(this.BDLDeal,this.cmd=="" ? this.bdl.cmd : this.cmd);
		}
		else if (this.game.source=="Tutorial") {
			this.tutorial.request("IDS_NEXT_DEAL");
		}
		else if (this.game.source=="QDeal") {
			this.dealControl.request("IDS_NEXT_DEAL");
		}		
		else {
			// next random game
			this.game.shuffleAndDeal(this.game.major*10000+this.game.minor+1,this.cmd);
		}
	}

	prevGame() {
		// step back to the previous game

		if (this.game.source=="BDL") {
			this.BDLDeal = this.bdl.parse(this.game.id,false,-1);
			if (this.BDLDeal!=null) this.game.loadFromBDL(this.BDLDeal,this.cmd=="" ? this.bdl.cmd : this.cmd);
		}
		if (this.game.source=="QDeal") {
			this.dealControl.request("IDS_PREV_DEAL");		
		}
		else if (this.game.source=="Tutorial" && this.tutorial.curStepNr>1) {
			this.tutorial.curStepNr--;
			this.game.loadFromTutorial(QBM.tutorial.unit,this.tutorial.curStepNr);
		}
		else {
			// random game
			if (this.game.minor>1) {
				this.game.shuffleAndDeal(this.game.major*10000+this.game.minor-1,this.cmd);
			}
		}
	}

	again(cmd) {
		// restart the current deal;
		// advance the state of the game according to "cmd"

		if (this.game.source == "BDL") {
			this.game.loadFromBDL(this.bdl.parse(this.game.id),cmd);
		}
		else if (this.game.source == "Tutorial") {
			// this.game.loadFromTutorial(QBM.tutorial.unit,this.tutorial.curStepNr);
			// only repeat play is possible:
		    QB.playWin.tableTab.collectTrick();
		    QBM.tutorial.request("IDS_REPEAT_PLAY");
		    QB.playWin.tableTab.refresh();		
		    QB.playWin.selectTab("Table");				
		}
		else if (this.game.source == "QDeal") {
		    QB.playWin.tableTab.collectTrick();
		    QBM.dealControl.request("IDS_REPEAT_PLAY");
		    QB.playWin.tableTab.refresh();		
		    QB.playWin.selectTab("Table");			
		}
		else {
			var previousBids = this.game.shuffleAndDeal(this.dealMajor*10000+this.dealMinor,cmd);
		}
	}

	autoBid(steps,previousBids) {
		// process the BDL bids or a series of given bids or make random bids

		if (this.game.source=="BDL") {
			var n=0,s=0;
			for (var bidId of this.game.bidsBDL) {
				if (++n <= this.game.bids.length) continue;
				if (steps>0 && ++s>steps) break;
				this.game.bid(bidId);
			}
		}
		else if (typeof previousBids != "undefined")	{
			for (var bidId of previousBids) {
				this.game.bid(bidId);
			}
		}
		else {
			this.game.randomBids(steps);
		}
	}

	autoPlay(steps) {
		if (this.game.source=="BDL") {
			// process tricks
			for (var trick of this.game.tricksBDL) {
				for (var cardId of trick.cards) {
					this.game.playCard(this.game.mover,Cards[cardId.substr(0,2)]);
				}
			}
		}
		else {
			this.game.randomTricks();
		}
	}

	enterBid(bidId) {
		if (this.game.source=="BDL") {

			// only the original bid from the BDL source will be accepted
			var accepted = this.game.bid(bidId);

			// let the three other players make their bids
			if (accepted) {
				var bidNr = this.game.bids.length;
				for (var n=0;n<=2;n++) {
					if (this.game.bids.length < this.game.bidsBDL.length) this.game.bid(this.game.bidsBDL[bidNr+n]);
				}

				// if the contract is agreed, play through
				if (this.game.contract== null || this.game.contract.level>0) this.autoPlay();
			}
		}
		else if (this.game.source=="Tutorial") {		
			this.tutorial.request("CM_USER_BID",bidId);
		}
		else if (this.game.source=="QDeal") {
			this.dealControl.request("CM_USER_BID",bidId);		
		}
		else {
			this.game.bid(bidId);
		}
	}

	move() {
		this.game.randomTrick();
	}

	start() {
	}

}
