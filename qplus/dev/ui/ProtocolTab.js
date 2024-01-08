
class ProtocolWin extends View {
	
	// produces a BDL LOG file in the current language

	constructor(app) {
		super(app);
	}
	
	init() {
		// symbols for translation
		theLang.add({			
			Protocol: {
				en: "Protocol",
				de: "Protokoll",
				fr: "Protocol",
				es: "Protocol",			
			},
		});

		this.ui = {
			header: $("#QB_PlayProtocolHeader"),
			main: 	$("#QB_PlayProtocol"),
		}
		
		/* not in tabs anymore
		// auto scroll to current deal when tab becomes active
		$('#PlayArea').bind('easytabs:after', function(x) {
			var act = $("#PlayArea .active")[0].innerText;
			if (act == theLang.tr("PlayTabProtocol")) {
				var anchor =  $("#PlayViewProtocol a[name=P_"+QBM.game.id+"]");
				if (anchor.length) {
					$("#PlayViewProtocol")[0].scrollBy(0,anchor.position().top-70);
				}
			}
		});	
		*/
	}
	
	clear() {
		this.ui.main.html("");
	}

	onChanged(what) {
		// receive results from the Model
		theULogger.log(1,'ProtocolWin:onChanged ' + what.type);
		if 		(what.type=="new game") {
			this.onNewGame();
		}
		else if (what.type=="bid") {
			this.onBid(what);
		}
		else if (what.type=="biddingFinished") {
			this.ui.main.append("<br/>"+this.chapter(theLang.tr("contract")) + QBM.game.contract.toString() );
		}
		else if (what.type=="trickFinished") {
			this.onTrickFinished(what.trick);
		}
		else if (what.type=="gameFinished") {
			this.ui.main.append("<br/>"+this.chapter(theLang.tr("result"))
				+QBM.game.contract.toString()+" &nbsp; "
				+QBM.game.resultString+" &nbsp; "
				+QBM.game.id
			);
		}
	}

	onNewGame() {
		if (!QBM.game.dealer) return;
		
		var leftNS = "               ".replace(/ /g,"&nbsp;");
		this.ui.main.append("<br/><br/>************************************************************<br/>");
		this.ui.main.append(this.chapter(theLang.tr("deal"))+"<a name='P_"+QBM.game.id+"' href='Javascript:QB.playWin.loadDeal(\""+QBM.game.id+"\");'>"+QBM.game.id+"</a>");
		this.ui.main.append(this.chapter(theLang.tr("dealer"))+QBM.game.dealer.name);
		this.ui.main.append(this.chapter(theLang.tr("vulnerable"))+QBM.game.vuln);

		this.ui.main.append(this.chapter(theLang.tr("cards"))+leftNS+this.vals(Players.N,Suits.s));
		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.N,Suits.h));
		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.N,Suits.d));
		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.N,Suits.c));

		this.ui.main.append(this.chapter("")+" &nbsp; "+this.vals(Players.W,Suits.s)+" &nbsp;"+this.vals(Players.E,Suits.s));
		this.ui.main.append(this.chapter("")+" &nbsp; "+this.vals(Players.W,Suits.h)+" &nbsp;"+this.vals(Players.E,Suits.h));
		this.ui.main.append(this.chapter("")+" &nbsp; "+this.vals(Players.W,Suits.d)+" &nbsp;"+this.vals(Players.E,Suits.d));
		this.ui.main.append(this.chapter("")+" &nbsp; "+this.vals(Players.W,Suits.c)+" &nbsp;"+this.vals(Players.E,Suits.c));

		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.S,Suits.s));
		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.S,Suits.h));
		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.S,Suits.d));
		this.ui.main.append(this.chapter("")+leftNS+this.vals(Players.S,Suits.c));		
	}

	onBid(what) {
		if 	(what.nr==0) {
			// headline with player letters
			this.ui.main.append("<br/>"+this.chapter(theLang.tr("bids")));
			var player = what.bidder;			
			for(var n of [0,1,2,3]) {
				this.ui.main.append(player.letter.padEnd(10));
				player=Players.next(player);
			}
			this.ui.main.append(this.chapter("")+"---------------------------------------");
		}
		// new line
		if (what.nr%4==0) this.ui.main.append(this.chapter(""));
		// bid
		this.ui.main.append(what.bid.name.padEnd(10));
	}
	
	onTrickFinished(trick) {
		var label="";
		if (trick.nr==0) {
			// headline
			label= theLang.tr("tricks");
			this.ui.main.append("<br/>");
		}
		var nr=(""+(trick.nr+1)).padStart(2);
		this.ui.main.append(this.chapter(label)+nr+" &nbsp;"+trick.lead.letter+" &nbsp; &nbsp;");
		var player = trick.lead;
		for (var n=0;n<4;n++) {
			var card = trick.cards[player.nr];
			var tag="&nbsp;"
			if (player==trick.winner) tag = player.party==QBM.game.contract.declarer.party ? "+" : "-";
			this.ui.main.append(card.name+tag+" &nbsp;");
			var player = Players.next(player);
		}
		var filler = (trick.winner.party==QBM.game.contract.declarer.party) ? "&nbsp; &nbsp; " : "&nbsp; &nbsp; &nbsp; &nbsp; ";
		this.ui.main.append(filler+trick.cards[trick.winner.nr].suit.letter.toUpperCase());
	}

	chapter(text) {
		return "<br/>"+text.padEnd(13)+":   ";
	}
	
	vals(player,suit) {
		var text="";
		for (var card of player.hand) {
			if (card.suit==suit) text += card.value.letter+" ";
		}
		if (text=="") text="-";
		return text.padEnd(26);
	}

}

class RecordTab extends View {
	
	// displays the bids and tricks (not the cards) of the current deal only

	constructor(app) {
		super(app);
	}
	
	init() {
		// symbols for translation
		theLang.add({			
			PlayTabRecord: {
				en: "&nbsp;&nbsp;&#128221; &nbsp;", // unicode memo symbol 	
			},
			RecordHeading: {
				en: "Auction and played cards",
				de: "Biet- und Spielverlauf",
				fr: "Enchères et cartes jouées",
				es: "Subasta y cartas jugadas"
			},		
			PlayTabRecordTitle: {
				en: "Game protocol",
				de: "Spiel-Protokoll",
				fr: "Protocole du jeu",
				es: "Protocolo de juego",
			},		
			ScoringIMP: {
				en: "Team tourn.",
				de: "Teamturnier",
				fr: "Match par 4",
				es: "Torneo de equipo",
			},
			ScoringMP: {
				en: "Pair tourn.",
				de: "Paarturnier",
				fr: "Tourn. p. paires",
				es: "Torneo de parejas",
			},
		});	
		this.ui = {
			heading: $("#QB_PlayRecordHeading"),		
			bids: 	 $("#QB_PlayRecordBids"),
			tricks:	 $("#QB_PlayRecordTricks"),			
		}
		this.lastTrickNr = 0;		
	}

	onChanged(what) {
		// receive results from the Model
		theULogger.log(1,'RecordTab:onChanged ' + what.type + ' state= ' + QBM.game.state);
		if 		(what.type=="new game") {
			this.onNewGame();
		}
		else if (what.type=="biddingFinished") {
			this.onBiddingFinished();
		}
		else if (what.type=="trickFinished") {
			this.onTrickFinished(what.trick);
		}
		else if (what.type=="undo trick") {
			this.ui.tricks.append("  ◄");
		}		
		else if (what.type=="gameFinished") {		
			if (this.lastTrickNr < 12 && what.game.claimedTricks >= 0)
				this.ui.tricks.append("\n* " + theLang.tr("IDS_CLAIM") + " : " + what.game.claimedTricks);
			this.ui.tricks.append("\n<p>" + theLang.tr("result")				
								  + " &nbsp; " + QBM.game.resultString);
		}
	}

	onNewGame() {
		if (!QBM.game.dealer) return;
		var html = "<h3>" + theLang.tr("RecordHeading") + "</h3>"; 
		var vulnerable = "---";
		if (QBM.game.vuln == "N/S" || QBM.game.vuln == "NS")  vulnerable = theLang.tr("vulnNS");
		if (QBM.game.vuln == "E/W" || QBM.game.vuln == "EW")  vulnerable = theLang.tr("vulnEW");	
		if (QBM.game.vuln == "All" || QBM.game.vuln == "all") vulnerable = theLang.tr("vulnall");		
		var scoring = "Rubber"; // currently not supported
		if (QBM.game.scoring == "IMP") scoring = theLang.tr("ScoringIMP");
		if (QBM.game.scoring == "MP") scoring = theLang.tr("ScoringMP");		
		html +=   theLang.tr("deal") + " : " + QBM.game.id 
		        + " - " + theLang.tr("dealer") + " : " + QBM.game.dealer.name
				+ " - " + theLang.tr("vulnerable") + " : " + vulnerable
				+ " - " + theLang.tr("L_SCORING") + " : " + scoring
				+ "<p>";
		this.ui.heading.html(html);
		this.ui.bids.html("");
		this.ui.tricks.html("");
		this.lastTrickNr = 0;
	}

	onBiddingFinished() {
		// copy Bidding History Table from Table Center	
	    if (QBM.game.isMini) 
			this.ui.bids.html($("#miniBidHistory").html() + "<br>" + $("#miniBidSummary").html());	
		else
			this.ui.bids.html($("#bidHistory").html());			
	}	
	
	onTrickFinished(trick) {
		this.lastTrickNr = trick.nr;
		if (trick.nr == 0) this.ui.tricks.append("\n. ");
		else 			   this.ui.tricks.append("\n  ");
		var nr=(""+(trick.nr+1)).padStart(2);
		this.ui.tricks.append(nr+" "+trick.lead.letter+"  ");
		var player = trick.lead;
		for (var n=0;n<4;n++) {
			var card = trick.cards[player.nr];
			var tag=" "
			if (player==trick.winner) tag = player.party==QBM.game.contract.declarer.party ? "+" : "-";
			this.ui.tricks.append(card.html+tag+" ");
			var player = Players.next(player);
		}
		var filler = (trick.winner.party==QBM.game.contract.declarer.party) ? "  " : "     ";
		this.ui.tricks.append(filler+trick.cards[trick.winner.nr].suit.html);	
	}
}
