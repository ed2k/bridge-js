
class TableTab extends View {

	constructor(app) {
		super(app);
		this.tableTop	 = 30;
		this.footerSpace = 36;
		this.cardSize 	 = 1;
		this.cardScale	 = 1;
		this.reviewTrickNr = -1;		
		this.setTrickSumPlayers = 0;
		this.setTrickSumDefense = 0;
		this.saveTrickSumPlayers = 0;
		this.saveTrickSumDefense = 0;
		this.haveGame = false;
		this.cardsToHiLight = [];
		this.displayBidsAtPlayer = false;
		this.displayTrumpOnly = false;	
		this.displayNoContract = false;	
		this.resultTexts = null;		
		this.hideBids = false;
		this.isRotated = false;
		this.symbolIsBusy = "&#8987;";    // Sanduhr Symbol
		this.symbolNotBusy = "&#128113;"; // Mensch Symbol
		/* andere Symbole:
			(Robot)&#129302; (Abacus)&#129518; (Hunde)&#128054; &#128021 (Menschen)&#128100; &#128113;
			(Glühbirne)&#128161; (Mäuse)&#128431; &#128432; (Sanduhren)&#8987; &#9203;	
		*/		
		this.currSymbolBusy = this.symbolNotBusy;
	}

	init() {

		// symbols for translation
		theLang.add({

			PlayTabTable: {
				en: "Game",
				de: "Spiel",
				fr: "Jeu",
				it: "Gioco",				
				es: "Juego",
				dk: "Spil",					
			},

			// boxes in the table edges (currently hidden)

			box_Game: {
				en: "Game",
				de: "Spiel",
				fr: "Donne",
				es: "Juego",
			},
			box_Dealer: {
				en: "Dealer",
				de: "Teiler",
				fr: "Donneur",
				es: "Dador",
			},
			box_Vuln: {
				en: "Vuln.",
				de: "Gefahr",
				fr: "Vuln.",
				es: "Vuln.",
			},
			box_Contract: {
				en: "Contract : &nbsp;",
				de: "Kontrakt : &nbsp;",
				fr: "Contrat : &nbsp;",
				es: "Contrato : &nbsp;",
			},
			box_Tricks: {
				en: "Tricks: &nbsp;",
				de: "Stiche: &nbsp;",
				fr: "Levées: &nbsp;",
				es: "Bazas: &nbsp;",
			},
			box_Result: {
				en: "Result : &nbsp;",
				de: "Resultat : &nbsp;",
				fr: "Rèsultat : &nbsp;",
				es: "exito : &nbsp;",
			},
			box_Score: {
				en: "Score : &nbsp;",
				de: "Punkte : &nbsp;",
				fr: "Score : &nbsp;",
				es: "Puntos : &nbsp;",
			},
		});

		// some key bindings (+/- : card size, L: toggle LogWin)
		var that=this;
		$(window).keydown(function(e) {
			if (!e.altKey) return;
			if 		(e.key=='+') { that.nextCardSize(+1); that.refresh(); }
			else if (e.key=='-') { that.nextCardSize(-1); that.refresh(); }
			else if (e.key=='b') {
				if (QB.product.type=="tut" && QBM.tutorial.gameState=="deal") {
					QBM.tutorial.request("IDS_START_BIDDING");
				}
			}
			else if (e.key=='p') {
				if (QB.product.type=="tut" && QBM.tutorial.gameState=="deal") {
					QBM.tutorial.request("IDS_SKIP_BIDDING");
				}
			}
			else if (e.key=='l') { QB.winManager.toggleDialog("LogWin"); }
		});

		// a click somewhere on the table issues the default action
		if (QB.product.type=="tut") {
			$(".QB #table").on("click",function(e) {
				if (e.target.id.indexOf("ch")!=0) {
					// only direct clicks onto the table, ignore forwarded events from sub-elements
					QBM.tutorial.requestDefaultAction();
				}
			});
		}
		if (QB.product.type=="play") {
			$(".QB #table").on("click",function(e) {
				if (e.target.id.indexOf("ch")!=0) {
					// only direct clicks onto the table, ignore forwarded events from sub-elements
					QBM.dealControl.requestDefaultAction();
				}
			});
		}

		// bind the card-play function to the cards on the table
		$(".QB .cardInHand").click(QB.playWin.tableTab.cardClicked);
		this.cardSize = theConfig.data.cardSize;
		this.curPointer = Players.N;

		this.ui = {
			bidHistoryStr: ".QB #PlayViewTable #bidHistory",
			bidHistory:  $(".QB #PlayViewTable #bidHistory"),
			bidsDoneStr: ".QB #PlayViewTable #bidDone",			
			bidsDone:  $(".QB #PlayViewTable #bidsDone"),
			bidSummaryStr: ".QB #PlayViewTable #bidSummary",
			bidSummary:  $(".QB #PlayViewTable #bidSummary"),
			miniBidHistoryStr: ".QB #PlayViewTable #miniBidHistory",			
			miniBidHistory:  $(".QB #PlayViewTable #miniBidHistory"),
			miniBidSummaryStr: ".QB #PlayViewTable #miniBidSummary",			
			miniBidSummary:  $(".QB #PlayViewTable #miniBidSummary"),
			buttons: $("#tableButtons"),
		}

		// add context menu to change type/visibility of players
		// right click on table and left click on ptr
		// var that=this;
		// $(".QB #table").on("contextmenu",function(e) { return that.contextMenuPlayers(e); });
		// $(".QB .ptr").on("click",function(e) { return that.contextMenuPlayers(e); });
		$(".QB #table").on("contextmenu",function(e) { QB.playWin.configTab.openPlayersDialog(); return false; });
		$(".QB .ptr").on("click",function(e) { QB.playWin.configTab.openPlayersDialog(); return false; });

		// react on resizing the PlayViewTable
		$("#PlayWin").on("dialogresizestop", function(e,ui) {
			QB.playWin.tableTab.resize(true);
		});

		// in tutorial mode we hide all boxes - now in any case
		// if (QB.product.type=="tut") {
			$("#box_NW").hide();
			$("#box_NE").hide();
			$("#box_SE").hide();
			$("#box_SW").hide();
		// }
		this.ui.miniBidHistory.hide();
		this.ui.miniBidSummary.hide();
		this.ui.bidHistory.hide();
		this.ui.bidSummary.hide();
	}

	loadLabels() {
		$(".QB #box_Label_Game").html(theLang.tr("box_Game"));
		$(".QB #box_Label_Dealer").html(theLang.tr("box_Dealer"));
		$(".QB #box_Label_Vuln").html(theLang.tr("box_Vuln"));
		$(".QB #box_Label_Contract").html(theLang.tr("box_Contract"));
		$(".QB #box_Label_Tricks").html(theLang.tr("box_Tricks"));
		$(".QB #box_Label_Result").html(theLang.tr("box_Result"));
		$(".QB #box_Label_Score").html(theLang.tr("box_Score"));		
	}

	resize(isLast) {
		// available screen dimensions
		var wW = QB.playWin.PWwidth;  
		var hW = QB.playWin.PWheight;
		if (wW <= 10) return; // not visible

		// change default card scale for small displays
		if (wW<1400) this.cardScale = 0.9 + (1400-wW)*0.0005;
		else		 this.cardScale = 1.0; // must be reset

		// calculate top/bottom for the table
		var tT 	= this.tableTop;
		var bT	= hW-this.footerSpace;
		var hT	= bT-tT;

		// calculate dimensions for the hands and the center
		var hNS = Math.floor(hT*0.23);
		// var wNS = QB.product.type=="tut" ? Math.floor(wW*0.98) : Math.floor(wW*0.82);
		// var lNS = QB.product.type=="tut" ? wW*0.01 : Math.floor((wW-wNS)*0.5);
	    var wNS = Math.floor(wW*0.98);
		var lNS = wW*0.01;		
		var hEW = Math.floor(hT*0.5)-1;
		var lW	= Math.floor(wW*0.01);

		var wC  = Math.floor(wW*0.30);
		if (wC < 260) wC = 260;
		if (wC > Math.floor(wW*0.40)) wC = Math.floor(wW*0.40); 
		var wEW = Math.floor((wW - wC) / 2.4) - 1;
		var hC = Math.floor(hT*0.44);
		if (hC < 200) hC = Math.floor((200 + hC) / 2);
		var tC;
		if (hT <= 600) {
		   tC = Math.floor((hW-hC)*0.40);
		}
		else {
		  if (hT <= 800) tC = Math.floor((hW-hC)*0.41);
		  else			 tC = Math.floor((hW-hC)*0.42);
		}
		// if center is relatively small: enlarge it during bidding
		if (   QBM.game.state=="dealt" || QBM.game.state=="bidding"
			|| QBM.game.state=="biddingFinished") {
			if (wC < 300 && !Players.E.isVisible() && !Players.W.isVisible()) {
				wC = Math.floor((300 + wC) / 2);
			}
			if (hC < 240 && !Players.N.isVisible()) {
				var oldhC = hC;
				hC = Math.floor((240 + hC) / 2);
				tC -= hC - oldhC; // shift asymetrically to North
				if (tC < 1) tC = 1;
			}		
		}
		var lC = Math.floor((wW-wC)*0.5);
		var lE  = Math.floor(wW - wEW) - lW;
		var tEW = Math.floor(hT*0.25);
		var tS  = Math.floor(hT*0.77);
		theULogger.log(1,'TableTab:resize ' + isLast + ' state ' + QBM.game.state
						  + ' wW:' + wW + ' hW:' + hW + ' hT:' + hT 
						  + ' tC:' + tC + ' lC:' + lC 
						  + ' wC:' + wC + ' hC:' + hC + ' lE:' + lE);

		// place hands and center
		$(".QB #table" ).css({left:0,top:tT	,width:wW,height:hT});
		$(".QB #footer").css({left:0,top:bT ,width:wW,height:this.footerSpace});

		var rotS="S",rotN="N",rotE="E",rotW="W";
		// rotate hands and pointers if necessary
		if (   theConfig.get("rotateHands")
            && QBM.game.state != "dealt"  // not too early
			&& QBM.game.state != "bidding"
			&& QBM.game.state != "biddingFinished"
            && QBM.game.contract
            && QBM.game.contract.declarer == Players.N) {
			rotS="N";rotN="S",rotE="W",rotW="E";
			this.isRotated = true;
		}

		// placement of hands (possibly rotated)
		$(".QB #hand"+rotN).css({width:wNS,height:hNS, top:0  ,left:lNS });
		$(".QB #hand"+rotW).css({width:wEW,height:hEW, top:tEW,left:lW  });
		$(".QB #hand"+rotE).css({width:wEW,height:hEW, top:tEW,left:lE  });
		$(".QB #hand"+rotS).css({width:wNS,height:hNS, top:tS, left:lNS });

		// placements of cards on the center of the table  (possibly rotated)
		var clip = "rect(0px,"+(wC*0.3)+"px,"+(hC*0.44)+"px,0px)";
		$(".QB #ct"+rotN).css({minWidth:70,minHeight:120, top:hC*0.03, left:wC*0.35, clip:clip});
		$(".QB #ct"+rotE).css({minWidth:70,minHeight:120, top:hC*0.30 ,left:wC*0.68, clip:clip});
		$(".QB #ct"+rotW).css({minWidth:70,minHeight:120, top:hC*0.30 ,left:wC*0.02, clip:clip});
		$(".QB #ct"+rotS).css({minWidth:70,minHeight:120, top:hC*0.53 ,left:wC*0.35, clip:clip});

		$(".QB #center").css({width:wC,height:hC, top:tC,left:lC });

		// bid history (overlay for table center)
		var bhWidth = (wC - 34) / 4;
		var bhHeight = hC / 10;
		if (bhHeight < 20) bhHeight = 20;
		var fontSize = 100;
		if (bhHeight >= 27 && bhWidth >= 54) fontSize = 125;
		if (bhHeight >= 34 && bhWidth >= 68) fontSize = 150;
		if (bhHeight >= 41 && bhWidth >= 82) fontSize = 175;
		if (bhHeight >= 48 && bhWidth >= 96) fontSize = 200;
		var strFontSize = fontSize.toString() + '%';
		$(this.ui.bidHistoryStr).css({width:wC-12,height:hC-14, top:tC+2 ,left:lC+2 });
		$(this.ui.bidHistoryStr + " .players").css({width:bhWidth,height:bhHeight,fontSize:strFontSize});
		$(this.ui.bidHistoryStr + " .bidC").css({width:bhWidth,height:bhHeight,fontSize:strFontSize});
		$(this.ui.bidHistoryStr + "  hr").css({width:wC-24});
	    // this.ui.bidSummary.css({marginTop:10,width:wC-30,height:bhHeight,fontSize:strFontSize});	
	    this.ui.bidSummary.css({marginTop:10,width:wC-30,fontSize:strFontSize});			
		this.ui.miniBidHistory.css({width:wC-8,height:hC-8, top:tC+4 ,left:lC+4 });
		this.ui.miniBidSummary.css({top:tC+hC-bhHeight-14,left:lC+7,width:wC-30,height:bhHeight,fontSize:strFontSize});		

		// scale cards on table, try to fit full card or use a significant magnification
		var cardWidth = wC*0.3;
		if (cardWidth<80) cardWidth=80;
		if (hC<wC*0.6) cardWidth*=(hC/wC);
		$(".cardOnTable").css({width:cardWidth});

		// info boxes in the four corners of the table
		if (QB.product.type!="tut") {
			var wB = Math.floor(wW*0.07);
			var hB = Math.floor(wB*0.60);
			$(".QB #box_NW") .css({width:wB,height:hB, top:4 ,left:4});
			$(".QB #box_NE") .css({width:wB,height:hB, top:4 ,left:wW-wB-16});
			$(".QB #box_SE") .css({width:wB,height:hB, top:hT-hB-16 ,left:wW-wB-16 });
			$(".QB #box_SW") .css({width:wB,height:hB, top:hT-hB-16 ,left:4 });
			$(".QB .infoBox").css({fontSize:""+Math.floor(wB*0.9)+"%"})
		}

		// four direction pointers at the border of the center of the table  (possibly rotated)
		var wPtrEW=wW*0.02;
		var hPtrEW=hW*0.09; if (hPtrEW<60) hPtrEW=60;
		var wPtrNS=wW*0.06; if (wPtrNS<80) wPtrNS=80;
		var hPtrNS=hW*0.03;
		$(".QB #ptr"+rotN).css({width:wPtrNS,height:hPtrNS, top:tC-hPtrNS-3	  ,left:(wW-wPtrNS)*0.5,
							    borderRadius:"20px 20px 0 0"});
		$(".QB #ptr"+rotS).css({width:wPtrNS,height:hPtrNS, top:tC+hC+3		  ,left:(wW-wPtrNS)*0.5,
							    borderRadius:"0 0 20px 20px", paddingBottom:"3px"});
		$(".QB #ptr"+rotW).css({width:wPtrEW,height:hPtrEW, top:(hT-hPtrEW)*0.5-2 ,left:lC-wPtrEW-4,
								borderRadius:"20px 0 0 20px", paddingTop:"0.5em", paddingRight:"3px"});
		$(".QB #ptr"+rotE).css({width:wPtrEW,height:hPtrEW, top:(hT-hPtrEW)*0.5-2 ,left:lC+wC+3,
							    borderRadius:"0 20px 20px 0", paddingTop:"0.5em", paddingRight:"3px"});

		// four player name labels attached to each hand  (possibly rotated)
		var wPlr=wNS*0.1;
		var hPlr=wPlr*0.2;
		$(".QB #plr"+rotN).css({top:tT+hPlr*0.2    ,left:(wNS-wPlr)*0.5 });
		$(".QB #plr"+rotS).css({top:tS+hNS-hPlr*1.2,left:(wNS-wPlr)*0.5 });
		$(".QB #plr"+rotW).css({top:tEW-hPlr-2     ,left:wPlr*0.1       });
		$(".QB #plr"+rotE).css({top:tEW-hPlr-2     ,left:lE+wPlr*0.07   });
		$(".QB .plr").css({fontSize:""+Math.floor(wPlr*0.7)+"%",width:wPlr,height:hPlr});
		$(".QB .plr div").css({marginLeft:Math.floor(wPlr*0.1),marginTop:Math.floor(hPlr*0.2)});

		if (isLast) {
			this.refresh();
		}
		QB.winManager.onResizeStop("PlayWin");
	}
	
	onTabBefore() {
		theULogger.log(1,'TableTab:onTabBefore, haveGame: ' + this.haveGame);
		if (QB.product.type=="tut" && !this.haveGame) {
			// can happen at the very beginning
			QBM.tutorial.request("IDS_CONTINUE");		
		}	
	}

	onChanged(what) {
		// receive results from the Model

		theULogger.log(1,'TableTab:onChanged ' + what.type);

		if      (what.type=="new game") {
			this.haveGame = true;
			this.onNewGame();
		}
		else if (what.type=="start bidding") {
			this.onStartBidding();
		}
		else if (what.type=="bid") {
			this.onBid(what.bidder, what.bid, what.nr);
		}
		else if (what.type=="biddingFinished") {
			this.onBiddingFinished(what.nrOfBids,what.showHistory);
		}
		else if (what.type=="card played") {
			this.onCardPlayed(what.player,what.card,what.winner,what.moveNr);
		}
		else if (what.type=="mover changed") {
			this.onMoverChange(what.player);
		}
		else if (what.type=="trickFinished") {
			this.onTrickFinished(what.trickSumPlayers,0,what.trickSumDefense);
		}
		else if (what.type=="undo trick") {
			this.onUndoTrick();
		}
		else if (what.type=="collect trick") {
			this.collectTrick();
		}
		else if (what.type=="gameFinished") {
			this.onGameFinished();
		}
	}

	onNewGame() {

		if (Players.getAllVisible()) Players.toggleAllVisible(true); // i.e. switching off
		this.cardsToHiLight = [];	
		if (QBM.game) {
			$(".QB #box_Game_1").html(QBM.game.major);
			$(".QB #box_Game_2").html("&nbsp; &nbsp; &nbsp; -"+QBM.game.minor);
		}
		if (QBM.game && QBM.game.dealer) {
			$(".QB #box_Vuln").html(theLang.tr("vuln"+Players.vuln));
			$(".QB #box_Dealer").html(QBM.game.dealer.name);
			/* needed?
			if (QBM.game.state == "none") {
				this.onMoverChange(QBM.game.dealer); // special case when only dealer is set			
			}
			*/
		}
		for (var player of Players.all) {
			// player pointer background
			$(".QB #ptr"+player.id).css({backgroundColor:player.vuln?"#fcc":"#ddd"});
			// player label name
			$(".QB #plr"+player.id).html("<div>"+player.name+"</div>");
			this.onHandChanged(player,"");
			this.showHand(player,player.isVisible());
			/*
			if (QB.product.type != "tut") {
			   $(".QB #ptr"+player.id).attr("title",player.hiPoints.t+" + "+ player.lengthPoints.t+ " + ("+player.distPoints.t+")");
			}
			*/
		}

		/* 
		$("#handN").css("background-color","#0d64af");
		$("#handE").css("background-color","#0d64af");
		$("#handS").css("background-color","#0d64af");
		$("#handW").css("background-color","#0d64af");
		*/
		$("#handN").css("background-color","#204080");
		$("#handE").css("background-color","#204080");
		$("#handS").css("background-color","#204080");
		$("#handW").css("background-color","#204080");

		// $(".QB .review")				.hide();
		// $(".QB #action_Review")			.hide();
		// $(".QB #action_Move")			.hide();
		// $(".QB #action_AutoPlay")		.hide();
		// $(".QB #action_StartBidding")	.show();
		// $(".QB #action_Bid")			.show();
		// $(".QB #action_AutoBid")		.show();
		// $(".QB #action_RepeatBid")		.hide();
		// $(".QB #action_RepeatPlay")		.hide();

		this.currSymbolBusy = this.symbolNotBusy;
		this.displayBidsAtPlayer = false;
		this.displayTrumpOnly = false;	
		this.displayNoContract = false;	
		this.hideBids = false;	
		this.resultTexts = null;
		this.isRotated = false;		
		this.saveTrickSumPlayers = 0;
		this.saveTrickSumDefense = 0;
		this.setTrickSumPlayers = 0;
		this.setTrickSumDefense = 0;
		this.clearTrick();
		for (var player of Players.all) this.onMoverChange(player);
		if (QBM.game && QBM.game.dealer) {
		    this.onMoverChange(QBM.game.dealer);
		}
		else {
			this.onMoverChange(Players.S);
		}

		// bid history
		if (QBM.game.isMini) {
			$(".QB #PlayViewTable #miniBidN").html("");
			$(".QB #PlayViewTable #miniBidE").html("");
			$(".QB #PlayViewTable #miniBidS").html("");
			$(".QB #PlayViewTable #miniBidW").html("");			
		    this.ui.miniBidHistory.show();
		    this.ui.miniBidSummary.hide();		
		}
		else {		
		    this.ui.bidHistory.show();
		    this.ui.bidsDone.show();			
		    var player;
		    if (QBM.game.dealer) {
			    $(this.ui.bidHistoryStr + " #p0").html((player=QBM.game.dealer).letter);
			    $(this.ui.bidHistoryStr + " #p1").html((player=Players.next(player)).letter);
			    $(this.ui.bidHistoryStr + " #p2").html((player=Players.next(player)).letter);
			    $(this.ui.bidHistoryStr + " #p3").html(Players.next(player).letter);
			    $(this.ui.bidHistoryStr + " #p0").css({backgroundColor:QBM.game.dealer.vuln?"#fcc":"#ddd"});
			    $(this.ui.bidHistoryStr + " #p1").css({backgroundColor:Players.next(QBM.game.dealer).vuln?"#fcc":"#ddd"});
			    $(this.ui.bidHistoryStr + " #p2").css({backgroundColor:QBM.game.dealer.vuln?"#fcc":"#ddd"});
			    $(this.ui.bidHistoryStr + " #p3").css({backgroundColor:Players.next(QBM.game.dealer).vuln?"#fcc":"#ddd"});
			    $(this.ui.bidHistoryStr + " .bidC").each( function() {$(this).hide();});
			}
			this.ui.bidSummary.hide();
		}		
		$("#box_Label_Contract").hide();	
		$("#box_Label_Tricks").hide();		
		$("#box_Label_Result").hide();		
		$("#box_Label_Score").hide();

		QB.winManager.arrangeDialogs();
        this.resize(false);
		this.clear();
		this.clearBoxes();

		Players.setSuitSeq([]);	// reset sequence of suits
	}

	clear() {
		this.ui.bidHistory.hide();
		this.ui.miniBidHistory.hide();
		this.ui.miniBidSummary.hide();	
		for (var player of Players.all) this.hideTableCard(player);
	}
	clearBoxes() {
		$(".QB #box_Game_1").html("");
		$(".QB #box_Game_2").html("");
		$(".QB #box_Vuln").html("");	
		$(".QB #box_Dealer").html("");	
		$(".QB #box_Contract").html("").hide();
		$(".QB #box_Tricks").html("").hide();
		$(".QB #box_Result").html("").hide();
		$(".QB #box_Score").html("").hide();
	}

	setDisplayBidsAtPlayer(bap) {
	    this.displayBidsAtPlayer = bap;
	}
	setDisplayTrumpOnly(tro) {
	    this.displayTrumpOnly = tro;
	}
	setDisplayNoContract(noc) {
	    this.displayNoContract = noc;
	}
	setResultTexts(resultTexts) {
		theULogger.log(1,'-- TT setResultTexts');	
		var html = "";
	    this.resultTexts = resultTexts;
		if (isPresent(this.resultTexts.headerText)) 
			html += this.resultTexts.headerText;
		if (isPresent(this.resultTexts.contractText))
			html += "<br>&nbsp;<br>" + this.resultTexts.contractText;
		if (isPresent(this.resultTexts.scoreSumText))
			html += "<br>&nbsp;<br>" + this.resultTexts.scoreSumText;
		this.showBidSummary(html);
	}

	setHideBids(hb) {
	    this.hideBids = hb;
		$(this.ui.bidHistoryStr + " #bid0").hide();		
	}	
	setShowBids(bidsToShow) { 
		theULogger.log(1,'-- TT setShowBids');
	    if (QBM.game.isMini || this.displayBidsAtPlayer) {
		    $(".QB #PlayViewTable #miniBidN").html("");
			$(".QB #PlayViewTable #miniBidE").html("");
			$(".QB #PlayViewTable #miniBidS").html("");
			$(".QB #PlayViewTable #miniBidW").html("");				
		}
		else {
			$(this.ui.bidHistoryStr + " .bidC").each( function() {$(this).hide();});		
		}
		var bidder = Players.N;
		if (QBM.game.dealer) bidder = QBM.game.dealer;
		for (var bidToShow of bidsToShow) {
			var html = "";
			if (QBM.game.isMini && bidToShow.bidNo <= 3) {
				html = bidToShow.bid;
			}
			else {
			    var bid = new Bid(bidToShow.bid,bidder);
			    if (this.displayTrumpOnly) html = bid.toHtmlTrumpOnly();
				else 					   html = bid.html;
				if (QBM.game.isMini && QBM.game.contract.declarer) bidder = QBM.game.contract.declarer;
			}
			if (QBM.game.isMini || this.displayBidsAtPlayer)  {
				if (bidToShow.bidNo >= 4) {
					if (bidder == Players.N) {
					    var tmpHtml = $(".QB #PlayViewTable #miniBid"+bidder.id).html() + "<br>" + html;
						html = tmpHtml;
					}
					else {
				        html += "<br>" + $(".QB #PlayViewTable #miniBid"+bidder.id).html();
					}
				}
				$(".QB #PlayViewTable #miniBid"+bidder.id).html(html).show();
			}
			else {
		        $(".QB #PlayViewTable #bidHistory #bid"+bidToShow.bidNo).html(html).show();	
			}
			bidder = bidder.next();
	    }	
	    this.ui.bidSummary.hide();		
	}
	
	showBidsOnTable() {
		theULogger.log(1,'-- TT ShowBidsOnTable');
		if (QBM.game.isMini || this.displayBidsAtPlayer) 
			this.ui.miniBidHistory.show();
		else 
			this.ui.bidHistory.show();	
	}

	showCardOnTable(player,card,wins) {
		theULogger.log(1,'-- TT ShowCardOnTable pl:' + player.id + ' card:' + card.id);	
		$(".QB #ct"+player.id).attr("src",card.svg).show();
		if (wins) {
			for (var pl of Players.all) {
				$(".QB #ct"+pl.id).css({
					filter:(player==pl) ? "brightness(1.0)":"brightness(0.9)",
					border:(player==pl) ? "solid 2px yellow":"",
					margin:(player==pl) ? "-2px 0 0 -2px":"",
				});
			}
		}
		else {
			$(".QB #ct"+player.id).css({filter:"brightness(0.9)",border:"",margin:""});
		}
	}

	onStartBidding() {
		if (QBM.game.isMini) QB.winManager.openDialog("BidBoxWin");
		QB.winManager.arrangeDialogs();
		// resize the table (it may become large during bidding)
		this.resize(true);

		$(".QB #action_StartBidding").hide();
		if (QBM.game.isMini || this.displayBidsAtPlayer) {
		    this.ui.miniBidHistory.show();		
		    if (QBM.game.dealer) {
				$(".QB #PlayViewTable #miniBid"+QBM.game.dealer.id).html("?").show();
			}
		}		
		else {
		    this.ui.bidHistory.show();
		    this.ui.bidsDone.show();			
			if (!this.hideBids)	
		        $(this.ui.bidHistoryStr + " #bid0").html("?").show();
		}
	}

	onBid(bidder, bid, nr) {
		this.onMoverChange(QBM.game.mover);
		if (QBM.game.isMini || this.displayBidsAtPlayer) {
			// theULogger.log(1,'bidder:' + bidder.id + ' length:' + QBM.game.bids.length + ' nr:' + nr);
		    var html = ""; 
			if (QBM.game.bids.length <= 4) {
				if (QBM.game.isMini) {
			        var points = BidIdToMiniVal(bid.id);
				    html = points.toString() + " P";
				}
				else {
					html = bid.html;
				}
			}
			else {
			    if (this.displayTrumpOnly) html = bid.toHtmlTrumpOnly();
				else 					   html = bid.html;
				if (bidder == Players.N) {
					var tmpHtml = $(".QB #PlayViewTable #miniBid"+bidder.id).html() + "<br>" + html;
					html = tmpHtml;
				}
				else {
				    html += "<br>" + $(".QB #PlayViewTable #miniBid"+bidder.id).html();
				}								
			}
			$(".QB #PlayViewTable #miniBid"+bidder.id).html(html);			
			if (!this.hideBids) $(".QB #PlayViewTable #miniBid"+bidder.id).show();	
		}
		else {
		    $(this.ui.bidHistoryStr + " #bid"+nr).css({backgroundColor:"#eee"});
		    $(this.ui.bidHistoryStr + " #bid"+nr).html(bid.html);
			if (!this.hideBids) $(".QB #bidHistory #bid"+nr).show();
		    if (QBM.game.mover.isHuman()) {
			    $(this.ui.bidHistoryStr + " #bid"+(nr+1)).css({backgroundColor:"#eee"});	
				$(this.ui.bidHistoryStr + " #bid"+(nr+1)).html("?");		
				if (!this.hideBids)	$(this.ui.bidHistoryStr + " #bid"+(nr+1)).show();
			}
		}
	}

	onBiddingFinished(nrOfBids,showHistory) {

		// resize the table (it may have been enlarged during bidding)
		// if (QB.product.type=="tut") this.resize(true);

		if (!(QBM.game.isMini || this.displayBidsAtPlayer))
			$(this.ui.bidHistoryStr + " #bid"+nrOfBids).hide();

		$("#box_Label_Contract").show();	$(".QB #box_Contract").show();

		if (QBM.game.contract.level==0) {
			$(".QB #box_Contract").html("--");
			if (QBM.game.isMini || this.displayBidsAtPlayer) {	
			    this.ui.miniBidSummary.html(theLang.tr("noContract")); // only for record
		    }
			else {
			    this.ui.bidSummary.html(theLang.tr("noContract")).show();
			}
			for (var player of Players.all)	this.showHand(player,true);
		}
		else {
			$("#hand"+QBM.game.contract.declarer.partner().id).css("background-color","#008070"); // was 0171d2
			if (QB.product.type!="tut") {
				$(".QB #box_Contract").html(QBM.game.contract.toHtml());
			}
			var html = QBM.game.contract.declarer.name + " " + theLang.tr("plays") + " ";
			if (this.displayTrumpOnly) {
				html += QBM.game.contract.toHtmlTrumpOnly();			
			}
			else {
				html +=   QBM.game.contract.level + " " + QBM.game.contract.suit.html 
					    + " " + QBM.game.contract.doubledHtml;	
			}
		    if (QBM.game.isMini || this.displayBidsAtPlayer) {
			    this.ui.miniBidSummary.html(html); // no show, only for record
			}
			else {
			    this.ui.bidSummary.html(html).show();
			}

			/*
			$(".QB #action_StartBidding")	.hide();
			$(".QB #action_Bid")			.hide();
			$(".QB #action_AutoBid")		.hide();
			$(".QB #action_Move")			.show();
			$(".QB #action_AutoPlay")		.show();
			$(".QB #action_RepeatBid")		.show();
			*/

			this.onMoverChange(QBM.game.mover);

			// change display order of suits
			var seq = {s:4,h:3,d:2,c:1};			
		    if (theConfig.get("sequenceSHCD")) seq = {s:4,h:3,d:1,c:2};
			// no change for trump nt or s
			if (QBM.game.contract.suit==Suits.h) 	   seq = {s:3,h:4,d:2,c:1};
			else if (QBM.game.contract.suit==Suits.d)  seq = {s:3,h:2,d:4,c:1};
			else if (QBM.game.contract.suit==Suits.c)  seq = {s:2,h:3,d:1,c:4};
			for (var player of Players.all) player.setSuitSeq(seq);
		}

		$("#box_Label_Tricks").show();		$("#box_Tricks").show();
		this.showTricksTaken(-1);
		if (!showHistory) {
		    this.ui.bidHistory.hide();
		    this.ui.miniBidHistory.hide();			
		}
		QB.playWin.setTitle();

		// re-arrange dialog layout
		// setTimeout(QB.winManager.arrangeDialogs,200);
	}

	hiLightBids(bidNrsToHilight) {
		for (var bidNo = 0; bidNo <= QBM.game.bids.length; bidNo++) {
		    if (bidNrsToHilight.indexOf(bidNo) >= 0) {
			    $(this.ui.bidHistoryStr + " #bid"+(bidNo)).css({backgroundColor:"#ffd"});	
		    }
		    else {
			    $(this.ui.bidHistoryStr + " #bid"+(bidNo)).css({backgroundColor:"#eee"});		
		    }
		}
	}
	
	setCardsToHiLight(cardsToHiLight) {
	   this.cardsToHiLight = cardsToHiLight;
	}
	clearCardsToHiLight() {
	   this.cardsToHiLight = [];
	}

	cardClicked(event) {
        var last7 = event.currentTarget.currentSrc.substr(-7);
		var cardSrc;
		if (last7.substr(0,1) == "/") cardSrc = last7.substr(1,2);
		else                          cardSrc = last7.substr(0,2);
		// theULogger.log(1,'- cardClicked: ' + event.currentTarget.currentSrc + ' = card: ' + cardSrc);		
		var card = Cards[cardSrc[1].toLowerCase()+cardSrc[0]];
		var player = Players[event.currentTarget.id[2]];
		if (QB.product.type=="tut") { QBM.tutorial.playUserCard(player,card); }
		else {
			if (QB.product.type=="play") QBM.dealControl.playUserCard(player,card);
			else QBM.game.playCard(player,card);
		}
	}

	onCardPlayed(player,card,winner,moveNr) {
		theULogger.log(1,'-- TT onCardPlayed pl:' + player.id + ' card:' + card.id + ' move:' + moveNr);	
		this.ui.bidHistory.hide();
		this.ui.miniBidHistory.hide();
		this.ui.miniBidSummary.hide();	

		// resize the table on first card (it may have been enlarged during bidding)
		if (moveNr==0) {
			if (QB.product.type == "play") QB.winManager.arrangeDialogs();
			this.resize(true);
		}
		this.showCardOnTable(player,card,player==winner);
		this.onHandChanged(player,"");
	}

	onHandChanged(player,cardToHighlight) {
		// theULogger.log(1,'-- TT onHandChanged, pl:' + player.id + ' #hi:' + this.cardsToHiLight.length);
		var width		= $("#handN").width();
		if (width<=0) return;
		if (player.handOrig.length<=0) {
			$(".QB #hand"+player.id).hide();
			return;
		}		

		var widthNS		= width;
		var heightNS	= $(".QB #handN").height()*0.9;	
		var cardWidth	= Math.min(widthNS/(13+4),heightNS*0.8/1.6); // 1.6=aspect ratio of cards
		var cardHeight 	= cardWidth*1.33;
		cardWidth *= this.cardSize;

		var cardNr=0;
		var finished = QBM.game.state=="finished";
		var isVisible = player.isVisible() || Players.getAllVisible();
		var inHand, anyInHand, doHighlight;		

		if (player==Players.N || player==Players.S) {
			// NORTH / SOUTH HANDS

			var bendsN = [15,14,13,12,11,10,9,10,11,12,13,14,15];
			var bendsS = [ 6, 5, 4, 3, 2, 1,0, 1, 2, 3, 4, 5, 6];
			// no bending would be:
			// var bendsN = [15,15,15,15,15,15,15,15,15,15,15,15,15];
			// var bendsS = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

			var leftNS		= width*0.01;
			var borderTBNS	= $(".QB #handN").height()*0.05
			var separation = Math.min(3.9,0.6+widthNS/500);
			var shiftXNS	= (widthNS-separation*cardWidth)/13;

			$(".QB .cardInHand").width(Math.round(cardWidth*this.cardScale))
							    .css("clip","rect(0px,"+Math.ceil(cardWidth*this.cardScale)+"px,auto,0px)");

			var top;
			var leftOrig = Math.round(leftNS);
			var left = leftOrig;
			var suit = player.handOrig[0].suit;
			var cardPos=0;
			var diffHeight = heightNS - cardHeight;
			if (diffHeight > cardHeight / 2) diffHeight = cardHeight / 2;
			if (isVisible) {
			    for (var card of player.handOrig) {
				    if (player==Players.N)	top = borderTBNS + diffHeight - diffHeight/15*bendsN[cardPos];	
				    else					top = borderTBNS + diffHeight/15*bendsS[cardPos];
				    if (suit != card.suit) {
					    leftOrig+=cardWidth*separation*0.25	;
					    left = leftOrig;
					    suit = card.suit;
				    }
				    inHand = this.isInHand(player,finished,card);
				    doHighlight =    (cardToHighlight.length > 0 && card.id == cardToHighlight)
								  || this.cardsToHiLight.includes(card.id);
				    this.showCardinHand(finished,player,card,cardNr,left,top,inHand,doHighlight);
				    leftOrig+=shiftXNS;
				    if (inHand) left+=shiftXNS;
				    cardNr++;
				    cardPos++;
				}
			}
			else {
			    var nrCards = player.hand.length;
				var row1 = Math.floor((2 + nrCards) / 4);
				if (row1 == 0) row1 = 1;
				var row2 = row1 + row1;
				if (row2 > nrCards) row2 = nrCards;
				var row3 = row2 + row1;
				if (row3 > nrCards) row3 = nrCards;
				var remain = nrCards - row3;
				if (remain > row1) {
					row1++; row2++; row3++;
					remain--;
				}
				if (remain < row3 - row2 - 1) {
				    row3--;
					remain++;
				}				
				cardPos = Math.floor((13 - nrCards) / 2);
				if (row1 <= 2) left += (4 - row1)*cardWidth*separation*0.35;
				for (var card of player.hand) {	
			        if (player==Players.N)	top = borderTBNS + diffHeight - diffHeight/15*bendsN[cardPos];	
			        else					top = borderTBNS + diffHeight/15*bendsS[cardPos];
				    if (cardNr == row1 || cardNr == row2 || cardNr == row3) {
						left += cardWidth*separation*0.25;					
					}
					this.showCardinHand(finished,player,card,cardNr,left,top,true,false);
					left+=shiftXNS;
					cardNr++;
				    cardPos++;
				}
			}
		}
		else {
			// EAST / WEST HANDS
			var heightEW	= $(".QB #handE").height();
			var widthEW		= $(".QB #handE").width();
			var shiftX 		= width*0.04;
			var deltaH 		= Math.floor($(".QB #handW").height()/4.5);

			cardWidth*=this.cardSize;

			var top = heightEW*0.05;
			var left;
			if (isVisible) {
			    var lastSuitLength=0, lastLeft=0;
			    var suit;		
				var nrVoidSuits=0;
				var deltaDone=false;
			    for (suit of Suits.all) {
				    if (player.suitLengthsOrig[suit.id] == 0)
					nrVoidSuits++;
				}
				suit = null;
			    for (var card of player.handOrig) {
				    if (suit != card.suit) {
					    if (suit == null) {
							suit = card.suit;
					        if (player.suitSeq[suit.id] < 4) {
								deltaDone = true;
							    if (nrVoidSuits == 1) top += deltaH*0.4;
							    if (nrVoidSuits == 2) top += deltaH*0.8;
								if (nrVoidSuits == 3) top += deltaH*0.8*(4 - player.suitSeq[suit.id]);
							}
						}
						else {
							suit = card.suit;
						    top += deltaH;
							if (deltaDone) {
							    if (nrVoidSuits == 1) top += deltaH*0.2;						
							    if (nrVoidSuits >= 2) top += deltaH*0.4;
							}
							else {
							    if (nrVoidSuits == 1) top += deltaH*0.4;						
							    if (nrVoidSuits >= 2) top += deltaH*0.8;
							}
						}				
						anyInHand = false;
					    var suitLength = finished ? player.suitLengthsOrig[suit.id] : player.suitLengths[suit.id];
					    left = (widthEW-cardWidth)*0.65 - shiftX*(suitLength-2)*0.5;
					    if (suitLength==lastSuitLength && left==lastLeft) left += shiftX/3;
					    lastSuitLength = suitLength;
					    lastLeft = left;
						// theULogger.log(1,'--- s ' + suit.id + ' fin ' + finished + ' len ' + suitLength + ' = left ' + left);					
				    }
				    inHand = this.isInHand(player,finished,card);
					if (inHand) anyInHand = true;
				    doHighlight =   (cardToHighlight.length > 0 && card.id == cardToHighlight)
								  || this.cardsToHiLight.includes(card.id);				
				    this.showCardinHand(finished,player,card,cardNr,left,top+(cardNr%2?3:0),inHand,doHighlight);
				    if (anyInHand) left += shiftX;
				    else           left += shiftX / 2;
				    cardNr++;
			    }
			}
			else {
			    var nrCards = player.hand.length;
				var row1 = Math.floor((2 + nrCards) / 4);
				if (row1 == 0) row1 = 1;
				var row2 = row1 + row1;
				if (row2 > nrCards) row2 = nrCards;
				var row3 = row2 + row1;
				if (row3 > nrCards) row3 = nrCards;
				var remain = nrCards - row3;
				if (remain > row1) {
					row1++; row2++; row3++;
					remain--;
				}
				if (remain < row3 - row2 - 1) {
				    row3--;
					remain++;
				}
				if (player == Players.W && remain != row1) {
				   // West has reverse symmetry
				   var delta = remain - row1;
				   row1 += delta; row2 += delta; row3 += delta;
				   if (row2 - row1 > row3 - row2) row2--;
				}
				if (nrCards == 2) {
					if (player == Players.E) top += deltaH;
				}
				if (nrCards == 1) {
					top += deltaH;
				}
				left = (widthEW-cardWidth)*0.65 - shiftX*0.7;
				// theULogger.log(1,'oHC: p:' + player.id + ' total:' + total); 
	
			    for (var card of player.hand) {
				    if (cardNr == row1 || cardNr == row2 || cardNr == row3) {
					    top += deltaH;
						left = (widthEW-cardWidth)*0.65 - shiftX*0.7;						
					}				
				    this.showCardinHand(finished,player,card,cardNr,left,top+(cardNr%2?3:0),true,false);
					left+=shiftX;
				    cardNr++;				
				}
			}
		}
		// hide remaininig cards if there are less than 13 in handOrig
		for (;cardNr<=12;cardNr++) $(".QB #ch"+player.id+cardNr).hide();
	}

	onMoverChange(mover) {
		// pointer
		
		if (mover==null) return;
		// theULogger.log(1,'-- TT onMoverChange p:' + mover.letter); 		

		$(".QB #ptr"+this.curPointer.id).html(this.curPointer.party=="NS"? " "+this.curPointer.letter+" " : "<br/>"+this.curPointer.letter);

		var ptr=mover.letter;
		if (this.isRotated) {
			if 		(mover==Players.N) ptr="&#9660;"+ptr+"&#9660;";
			else if (mover==Players.E) ptr="&#9664;<br/>"+ptr+"<br/>&#9664;";
			else if (mover==Players.S) ptr="&#9650;"+ptr+"&#9650;";
			else if (mover==Players.W) ptr="&#9654;<br/>"+ptr+"<br/>&#9654;";		
		}
		else {
			if 		(mover==Players.N) ptr="&#9650;"+ptr+"&#9650;";
			else if (mover==Players.E) ptr="&#9654;<br/>"+ptr+"<br/>&#9654;";
			else if (mover==Players.S) ptr="&#9660;"+ptr+"&#9660;";
			else if (mover==Players.W) ptr="&#9664;<br/>"+ptr+"<br/>&#9664;";
		}
		$(".QB #ptr"+mover.id).html(ptr);
		this.curPointer=mover;
	}

	onTrickFinished(trickSumPlayers,isClaimed,trickSumDefense) {
		theULogger.log(1,'-- TT onTrickFinished c:' + isClaimed + ' ' + trickSumPlayers + '-' + trickSumDefense);
		var claimedFlag = " ";
		if (isClaimed == 1) claimedFlag = "! ";
		this.setTrickSumPlayers = trickSumPlayers;
		this.setTrickSumDefense = trickSumDefense;
		$(".QB #tut_Tricks").html(trickSumPlayers + claimedFlag + ": " + trickSumDefense);		
		if (QB.product.type == "play") {
			$(".QB #box_Tricks").html(
				"<br/><span style='font-size:125%'>&nbsp; &nbsp;"
				+ trickSumPlayers + claimedFlag + ": " + trickSumDefense + "</span>"
			);
			// clear "result" if we have less that 13 tricks altogether
			if (trickSumPlayers+trickSumDefense!=13) {
				$(".QB #box_Result").html("");
			}
		}
	}

	onGameFinished() {
		theULogger.log(1,'-- TT onGameFinished ');	
		if (!QBM.game.score) {
			$(".QB #box_Result").html("");
			return;
		}
		this.clearTrick();
		var res = "=";
		if 		(QBM.game.result>0)	res = "+"+QBM.game.result;
		else if (QBM.game.result<0)	res = QBM.game.result;
		$(".QB #box_Label_Result").show();	$(".QB #box_Result").html(res).show();
		$(".QB #box_Label_Score").show();	$(".QB #box_Score").html(QBM.game.score).show();
		this.saveTrickSumPlayers = this.setTrickSumPlayers;
		this.saveTrickSumDefense = this.setTrickSumDefense;
		this.showTricksTaken(12);

		if (QB.product.type == "play") {
			// review after bidding
			this.reviewTrickNr= -2;
			this.onMoverChange(Players.next(QBM.game.contract.declarer));
			for(var player of Players.all) {
				this.onHandChanged(player,"");
				this.showHand(player,true);
			}
		}
		else {
			this.reviewTrickNr= -1;
			this.onMoverChange(Players.next(QBM.game.contract.declarer));
			for(var player of Players.all) {
				this.onHandChanged(player,"");
			}
		}

		// show bid (=play) summary
		/*
		if (QB.product.type=="tut") {
		    var html = QBM.game.contract.toHtml() + " &nbsp; &nbsp; " + res + " &nbsp; " + QBM.game.score;
			if (QBM.game.isMini) {
				this.ui.miniBidSummary.html(html);
			}
			else {		
				this.ui.bidSummary.html(html);				
			}			
		}
		else {
		*/
		    // The result text comes from the engine via setResultTexts;
			// however, this can be before or after the UI switches to finished
			// - when the texts are not yet there the summary text is cleared.
			if (this.resultTexts == null) {
			    if (QBM.game.isMini) {
				    this.ui.miniBidSummary.html("");
			    }
			    else {		
				    this.ui.bidSummary.html("");				
			    }
			}
		/* } */
		if (QBM.game.isMini) {
		    this.ui.miniBidSummary.show();		
		}
		else {
		    this.ui.bidHistory.show();
		    this.ui.bidsDone.hide();		
		    this.ui.bidSummary.show();
		}
	}
	
	restoreNumberOfTricks() {
		theULogger.log(1,'-- TT restoreNumberOfTricks: ' + this.saveTrickSumPlayers + ' - ' + this.saveTrickSumDefense);
		this.onTrickFinished(this.saveTrickSumPlayers,0,this.saveTrickSumDefense);
	}

	showBidSummary(text) {
		theULogger.log(1,'-- TT showBidSummary'); 	
	    var html = text;
		for (var suit of Suits.allDenominations) {
	        html = html.replace(RegExp("_"+suit.letter,"ig"),suit.html);
		}
		if (QBM.game.isMini) {
		    this.ui.miniBidSummary.html(html).show();
		}
		else {
			this.ui.bidHistory.show();		
		    this.ui.bidSummary.html(html).show();
		}
	}

	showHand(player,visib) {
		theULogger.log(1,"-- TT showHand pl:" + player.id + " visib " + visib);
		if (visib || theConfig.data.showHiddenHands || Players.getAllVisible()) { 
			$(".QB #hand"+player.id).show();
		}
		else {
		    $(".QB #hand"+player.id).hide();
		}
	}

	isInHand(player,finished,card) {
		// return true if a card shall be displayed in a player´s hand
        if (card.trick == null) return true;
        if (!finished) return false; // because it is in a trick
        if (this.reviewTrickNr < 0) return true;
		if (card.trick.nr < this.reviewTrickNr) return false;
		if (   card.trick.nr == this.reviewTrickNr
            && this.reviewCardNr >= card.trick.lead.distance(player))
                return false;
        return true;
	}

	showCardinHand(finished,player,card,cardNr,left,top,inHand,doHighlight) {
	    // theULogger.log(1,"-- TT sCiH pl:" + player.id + " c:" + card.id + " h:" + doHighlight);
		if (!inHand) {
		    $(".QB #ch"+player.id+cardNr).hide();
		}
		else {
	        var filter = "brightness(0.9)";
		    var opacity = 1;		
		    if (player.isVisible() || Players.getAllVisible()) {
			    if (doHighlight) filter = "brightness(1.0)";
                if (finished) {
                    if (card.trick != null) {
                        if (this.reviewTrickNr==-2) {
						    if (card.trick.winner==player) filter = "brightness(1.0)";
                        }
                        else {
                            if (card.trick.nr==this.reviewTrickNr) {
							    filter = "brightness(1.0)";
                                opacity = 0.9;							
						    }
                        }
					}
				}
		        $(".QB #ch"+player.id+cardNr).attr("src",card.svg)
							.css({left:left, top:top, filter:filter, opacity:opacity}).show();
            }
			else {
				opacity = 1.0;
				filter = "brightness(0.6)"				
		        $(".QB #ch"+player.id+cardNr).attr("src",Cards.getBackImage())
							.css({left:left, top:top, filter:filter, opacity:opacity}).show();
			}
		}
	}

	showTricksTaken(nr) {
		var sum = { "NS":0, "EW":0 };
		var isClaimed = 0;
		if (nr == 12 && QBM.game.claimedTricks >= 0) {
			sum[QBM.game.contract.players] = QBM.game.claimedTricks;
			sum[QBM.game.contract.defense] = 13 - QBM.game.claimedTricks;
			isClaimed = 1;
		}
		else {
			var trick;		
			for (trick of QBM.game.tricks) {
				if (trick.nr>nr) break;
				sum[trick.winner.party]++;
			}		
		}
		this.onTrickFinished(sum[QBM.game.contract.players],isClaimed,sum[QBM.game.contract.defense]);
	}

	hideTableCard(player) {
		$(".QB #ct"+player.id).hide();
	}

	collectTrick() {
		for (var player of Players.all) {
			this.hideTableCard(player);
		}
		this.onMoverChange(QBM.game.mover);
	}
	
	clearTrick() {
		for (var player of Players.all) {
			this.hideTableCard(player);
		}
	}	

	onUndoTrick() {
		this.collectTrick();
		this.refresh();
		this.showTricksTaken(QBM.game.currentTrickNr-1);
	}

    resetCardSize() {
		this.cardSize = theConfig.data.cardSize;	
	}
	
	nextCardSize(dir) {
		if (dir>0)	this.cardSize=Math.min(2.5,this.cardSize*1.1);
		else		this.cardSize=Math.max(0.3,this.cardSize/1.1);
		theConfig.set("cardSize",this.cardSize);
	}

	refresh() {
		for (var player of Players.all) this.onHandChanged(player,"");
	}
	
	showEngineBusy(busy) {
		theULogger.log(1,"-- TT showEngineBusy: " + busy);	
		if (busy) this.currSymbolBusy = this.symbolIsBusy;	
		else      this.currSymbolBusy = this.symbolNotBusy;
		var engineBusy = $(".QB #engineBusy");
		if (engineBusy != null) {
			engineBusy.html(this.currSymbolBusy);
		}
		else {
			theULogger.log(1,"- engineBusy == null ?");
		}
	}

	review(cmd) {
	    theULogger.log(1,"-- TT review - cmd " + cmd);	
		if (cmd=="start") {
			this.reviewTrickNr=-1;
			this.reviewCardNr=3;
			this.reviewPlayer = QBM.game.tricks[0].lead;
			$(".QB .review").show();
			$(".QB #action_Review").hide();
			for(var player of Players.all) this.onHandChanged(player,"");
			this.ui.bidHistory.show();
		    this.ui.bidsDone.show();
			this.ui.bidSummary.hide();	
			$(".QB #box_Tricks").html("");
		}
		else if (cmd=="end") {
			this.onGameFinished();
			$(".QB .review").hide();
			this.ui.bidsDone.hide();
			this.ui.bidSummary.show();					
			if (QB.product.type=="play") {
				QBM.dealControl.request("IDS_REVIEW_END");
			}	
			if (QB.product.type=="tut") {
				QBM.tutorial.request("IDS_REVIEW_END");
			}				
		}
		else if (cmd=="next card") 	this.showReview(+1);
		else if (cmd=="prev card") 	this.showReview(-1);
		else if (cmd=="next trick") {
			for (var n of [0,1,2,3]) {
				setTimeout(function() {
					QB.playWin.tableTab.showReview(+1);
					QB.playWin.tableTab.showTricksTaken(QB.playWin.tableTab.reviewTrickNr);
				},400*n+10);
				if (this.reviewTrickNr>=0 && (this.reviewCardNr+n)%4==2) break;
			}
		}
		else if (cmd=="prev trick") {
			for (var n of [0,1,2,3]) {
				this.showReview(-1);
				if (this.reviewCardNr==3) break;
			}
			this.showTricksTaken(this.reviewTrickNr);
		}
	}

	showReview(dir) {
		if (dir>0) {
			if (this.reviewCardNr >= 3) {
				this.collectTrick();
				if (this.reviewTrickNr>=12) {
					// wrap around
					this.reviewTrickNr= -2;
					this.reviewPlayer= QBM.game.tricks[0].lead;
					for(var player of Players.all) this.onHandChanged(player,"");
					this.reviewTrickNr= -1;
					this.onMoverChange(this.reviewPlayer);
					this.ui.bidHistory.show();
					this.ui.bidsDone.show();						
					this.showTricksTaken(this.reviewTrickNr);
					return;
				}
				this.showTricksTaken(this.reviewTrickNr);
				this.reviewTrickNr++;
				this.reviewCardNr=0;
				this.reviewPlayer=QBM.game.tricks[this.reviewTrickNr].lead;
				for(var player of Players.all) this.onHandChanged(player,""); // update to highlight cards of next trick
			}
			else {
				this.reviewCardNr++;
				this.reviewPlayer= Players.next(this.reviewPlayer);
				if (this.reviewCardNr>=3) {
					this.showTricksTaken(this.reviewTrickNr);
				}
			}
			this.onCardPlayed(
				this.reviewPlayer,
				QBM.game.tricks[this.reviewTrickNr].cards[this.reviewPlayer.nr],
				QBM.game.tricks[this.reviewTrickNr].winner,
				this.reviewTrickNr*4+this.reviewCardNr,
			);
			this.onHandChanged(this.reviewPlayer,"");

			// highlight next lead player (winner of current trick)
			if (this.reviewCardNr==3 && this.reviewTrickNr<12) {
				var nextLead=QBM.game.tricks[this.reviewTrickNr].winner;
				this.reviewCardNr=-1;
				this.reviewTrickNr++;
				this.onHandChanged(nextLead,"");
				this.reviewTrickNr--;
				this.reviewCardNr=3;
			}
		}
		else if (this.reviewTrickNr>=0) {
			this.hideTableCard(this.reviewPlayer);
			this.reviewTrickNr--;
			this.onHandChanged(this.reviewPlayer,"");
			this.reviewTrickNr++;
			this.reviewCardNr--;
			if (this.reviewCardNr < 0) {
				this.collectTrick();
				this.reviewCardNr=3;
				this.reviewTrickNr--;
				this.showTricksTaken(this.reviewTrickNr);
				if (this.reviewTrickNr>=0) {
				    this.reviewPlayer=Players.prev(QBM.game.tricks[this.reviewTrickNr].lead);
				    for(var player of Players.all) {
					    this.onHandChanged(player,"");
					    this.onCardPlayed(
						    player,
						    QBM.game.tricks[this.reviewTrickNr].cards[player.nr],
						    QBM.game.tricks[this.reviewTrickNr].winner,
						    this.reviewTrickNr*4+this.reviewCardNr,
					    );
				    }
				}
			}
			else {
				this.reviewPlayer= Players.prev(this.reviewPlayer);
			}
		}
		this.onMoverChange(this.reviewPlayer);
		theULogger.log(1,"-- TTR Trick: " + this.reviewTrickNr + " Card:" + this.reviewCardNr);
		if (this.reviewTrickNr <= -1) {	
			this.ui.bidHistory.show();
		    this.ui.bidsDone.show();
		}					
	}

	showButtons(buttons,givenTopTricks) {
		theULogger.log(1,"-- TableTab - showButtons state " + QBM.game.state + ' tt:' + givenTopTricks);
		var pLead = null;
		var html="";
		var helpKey = "hto-clean"; 
		if (buttons.length == 0) {
			helpKey = "hto-explain";
		}
		else {
			if (QBM.game.state == "dealt") {
				helpKey = "hto-deal";
				if (QBM.game.gameKind == "Q") helpKey = "hto-start-quiz";				
			}
		    if (QBM.game.state == "bidding") {
				helpKey = "hto-bid";
				if (QBM.game.isMini) {
					if (QBM.game.isMiniRound1()) helpKey = "hto-bid-m-p";
					else			             helpKey = "hto-bid-m-s";
				}
			}			
			if (QB.product.type == "play") {
				if (QBM.dealControl.gameState == "lead") {
					// the engine switches the state with the last user pass
					// and sets the buttons for the lead
					// while QBM.game has not yet switched
					helpKey = "hto-lead";
					if (QBM.dealControl.playerToLead != null) {
						for (var player of Players.all) {
							if (player.id == QBM.dealControl.playerToLead)
								pLead = player;
						}
					}
				}
				if (QBM.game.state == "biddingFinished") {
					helpKey = "hto-lead";
					if (pLead == null) {
						if (   QBM.game.contract != null 
							&& QBM.game.contract.declarer != null) {
							pLead = QBM.game.contract.declarer.next();
						}
					}
				}
			}
			else {
			    if (QBM.game.state == "biddingFinished") 
					helpKey = "hto-endbid";
			}
			if (QBM.game.state == "lead") helpKey = "hto-lead";
			if (QBM.game.state == "playing") helpKey = "hto-play";	
			if (QBM.game.state == "finished") {
				if (QBM.game.subState == "review") 
					helpKey = "hto-over-r";
				else
					helpKey = "hto-over-s";
			}
		}
		if (helpKey == "hto-lead" && pLead != null) {
			if (pLead.isHuman()) {
				var noteLead =   "<span id=noteLead style='color:#ee0;margin-left:15px'>" 
							   + pLead.name + " " + theLang.tr("L_LEADS") + ".</span>";
				html += noteLead;
			}
		}
		for (var button of buttons) {
			html+= button;
		}		
		html+="<button onclick='QB.showHelpText(\"" + helpKey + "\");'" 
		       + " style='float:right;margin-right:6px;min-width:8%;'>" + theLang.tr("IDS_HELP").replace("&","") + "</button>";
		
		if (QB.product.type=="play") {		
		// and waiting state (function showEngineBusy)
		    html += "<span id=engineBusy style='float:right;width:21px;margin-right:6px;margin-top:3px;padding:3px;border:solid 1px gray;'>"
				    + this.currSymbolBusy + "</span>";
		}

		// and tricks counter / button		
		if (   QBM.game.contract != null && QBM.game.contract.declarer != null
		    && QBM.game.state != "dealt" && QBM.game.state != "bidding" 
			&& QBM.game.state != "biddingFinished") {
		    var tricksTaken = this.setTrickSumPlayers + " : " + this.setTrickSumDefense;
		    html+="<button id='tut_Tricks' onclick='QB.bidBox.toggleTrickHistory();' style='background-color:#ee0;float:right;margin-right:6px;'>"
			    + tricksTaken + "</button>";
		}
		if (givenTopTricks != "") {
			html += "<div style='font-weight:600;color:black;background-color:#4b4;float:right;margin-right:6px;margin-top:9px;'> " 
				     + "Top tricks" + " : " + givenTopTricks + " </div>";
		}
	
		this.ui.buttons.html(html);
	}
}
