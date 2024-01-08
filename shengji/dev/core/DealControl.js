"use strict";

class DealControl {

	// processes a deal

	constructor() {
		this.defaultAction="";
		this.delayedRequestTimer = false;
		this.soundFinishedTimer = false;
		this.userCardPlayedAt = 0;
	}

	startup() {
		QB.playWin.matchTab.initMatchConfig();
		this.request("IDS_CONTINUE"); 	
        QB.playWin.selectTab("Table");
	}

	playUserCard(player,card) {
		var isAllowed = QBM.game.cardAllowed(player,card);
		if (isAllowed == "OK") {
			this.request("CM_USER_CARD",card.id);
		}
		else {
			var code = isAllowed.slice(0,2);
			var message = isAllowed.slice(3);
			if (code == "PC") {
				if (this.defaultAction == "IDS_NEXT_CARD")
					this.requestDefaultAction();
				return;
			}
			if (code == "NP") return;
			if (code == "NH") return;			
			QB.winManager.confirm(message);
		}
	}

	request(action,contents) {
		// the central function to process a user action and request its response
		// if action = null then contents is already the response

		var response;
        if (action != null && action != "") {
		    contents = contents || ""; // could be a bidId or a cardId

		    // if the user is going to play a card we note the current time
		    // later we delay the WASM response to be at least one second
		    if (action=="CM_USER_CARD") this.userCardPlayedAt=new Date().getTime();

		    // =========== CALL WASM =============================================
		    if (QB.debugJSI > 0) theULogger.log(0,
			    "========> " + action + "   " + contents
		    );
		    response = theEngine.processAction(action,contents);
		}
		else {
		    response = contents;
		}
		if (QB.debugJSO > 0) {
			// if ($("#LogWin").dialogExtend("state")!="minimized") QB.winManager.openDialog("LogWin");
			theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
		}

		// =========== PROCESS RESPONSE ======================================

		while (isPresent(response.needDealData)) {
			response = QB.playWin.dealsTab.loadDealData(response);
			theULogger.log(1,"- DealControl - after loadDealData");
			if (response == null) return; // when a deal file needs to be (asynchronously) loaded
			if (QB.debugJSO > 0) {
				theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
			}			
		}

		// display wait/busy info		
		if (isPresent(response.nextRequest)) {
			QB.playWin.tableTab.showEngineBusy(true);		
		}
		else {
			QB.playWin.tableTab.showEngineBusy(false);		
		}

		// store current state;
		if (isPresent(response.gameState)) {
			if (response.gameState == "bid" && this.gameState != "bid") {
			    QBM.game.state = "bidding";
				if (action != "IDS_START_BIDDING") QBM.game.startBidding();
			}
			if (response.gameState == "contract" && this.gameState != "contract") {			   
				theMemory.storeMatchConfig(theEngine.getMatchConfig(false));
				QBM.game.state = "biddingFinished";				
			}
			if (response.gameState == "lead") {
				if (isPresent(response.playerToLead))
					this.playerToLead = response.playerToLead;
				else
					this.playerToLead = null;
			}
		    if (response.gameState == "play" && this.gameState != "play") {
			    QBM.game.state = "playing";
			}
		    if (response.gameState == "over") {
			   if (this.gameState != "over") {
					theMemory.storeMatchConfig(theEngine.getMatchConfig(false));			   
					QBM.game.state = "finished";
			   }
			}
			if (isPresent(response.subState)) {
				QBM.game.subState = response.subState;
			}			
		}

		// present a conceptual text chapter if applicable
		if (isPresent(response.setCmd)) {
			if (response.setCmd.indexOf("open") == 0) {
				var manualFile = response.setCmd.replace(/.*?"([^"]+)".*/,"$1");
				QB.playWin.conceptsTab.loadHTML(manualFile.replace(".doc",".htm"));
				QB.playWin.selectTab("Concepts");
			}
		}

		// game clear
		if (response.gameState=="clean") {
			// let players return cards to the deck
			// reset
			var currGameText = QBM.game.gameText;
			if (this.gameState != "clean" || isPresent(response.deal)) {			
			    QBM.game.clear();
			    Players.clearHands();
				QB.playWin.clearTitle();
				QB.playWin.tableTab.clear();
				QB.playWin.tableTab.clearBoxes();		
				QB.bidBox.onNewGame(); /* clearing */		
			}
			/* with Q-play, deals do not come with state clean: 
			
			if (isPresent(response.deal) && isPresent(response.deal.dealText)) {
				var html = response.deal.dealText;
				for (var suit of Suits.allDenominations) {
					html = html.replace(RegExp("_"+suit.letter,"ig"),suit.html);
				}			
				QBM.game.gameText = html;
			}
			else {
			    QBM.game.gameText = currGameText;
			}
			if (isPresent(response.deal) && isPresent(response.deal.dealKind)) {
			    QBM.game.gameKind = response.deal.dealKind;
			}
			else {
				QBM.game.gameKind = "T";
			}			
			if (isPresent(response.deal)) {
				if (isPresent(response.deal.dealer)) {
					QBM.game.setDealer(Players[response.deal.dealer[0]]);
				}				
			    QBM.changed({type:"new game"});					
			}
			*/
		}
		this.gameState = response.gameState;		

		// if we received a new deal: create a new game for it
		if (	(response.gameState=="deal" )
			&& 	isPresent(response.deal) && isPresent(response.deal.dealer)) {
			if (isMissing(response.deal.dealText)) response.deal.dealText = "";
			if (isMissing(response.deal.dealKind)) response.deal.dealKind = "D";
			if (isMissing(response.deal.dealSequence)) response.deal.dealSequence = "";
			response.deal.id = response.deal.dealText;
			var posHyphen = response.deal.dealText.indexOf('-');
			response.deal.major = response.deal.dealText.slice(0,posHyphen);
			response.deal.minor = response.deal.dealText.slice(posHyphen+1);			
			QBM.game.loadFromTutorial(response,false);
			QB.playWin.selectTab("Table");
			theMemory.storeMatchConfig(theEngine.getMatchConfig(false));
			if (isMissing(response.deal.dealSource)) response.deal.dealSource = "unknown";
			if (response.deal.dealSource == "IDS_DEAL_NUMBER") 
				response.deal.dealSource = theLang.tr("IDS_DEAL_NUMBER",/&/g);
			QBM.changed({type:"source", name:response.deal.dealSource});
		}

		// response to a claim
		if (action=="IDS_CLAIM" && isPresent(response.userClaimAccepted)) {
		    theULogger.log(1,"- DealControl IDS_CLAIM for :" + contents + ":");
            if (response.userClaimAccepted) {
				QB.winManager.closeDialog("ClaimWin");
                QBM.game.setClaimedTricks(parseInt(contents,10));
            }
            else {
 				$("#ClaimWin #claimResponse").html(theLang.tr("IDS_CLAIM",/&/g) + " " + theLang.tr("IDS_CLAIM_NOT_ACCEPTED",/&/g));
            }
		}
		
		// update buttons in the footer area of the play table
		if (isPresent(response.playWin) && isPresent(response.playWin.buttons)) {
			var buttons = [];
			var prevPos = 0;
			this.defaultAction="";
			for (var button of response.playWin.buttons) {
				var done = false;
				var name = button.funct;
				var bPos = parseInt(button.pos);
				var bClass = "BFtTight";
				if (bPos == 1) bClass = "BFtFirst";
				if (bPos > prevPos + 1) bClass = "BFtSkip";
				prevPos = bPos;
				var label = "";				
				if (isPresent(button.disp)) {
                    if (button.disp.indexOf("_") > 0)
                        label = theLang.tr(button.disp,/&/g);
                    else
                        label = button.disp;
                }
                else {
					label = theLang.tr(name,/&/g);
                }

				if (name == "IDS_HINT") {
					label = "&nbsp;&#128161; Q&nbsp;"; // light bulb
					buttons.push(   "<button class=" + bClass 
								  + " onclick='QBM.dealControl.request(\""+name+"\");'"
								  + " style='color:#fa0;padding-top:0px;'>" + label + "</button>");									
					done = true;	
				}
				if (name=="IDS_REPEAT_DEAL") {
					buttons.push(  "<button class=" + bClass
								 + " onclick='QB.playWin.actionsTab.openRepeatDialog();'>"+label+"</button>");
					done = true;
				}
				if (name=="IDS_CLAIM") {
					buttons.push(  "<button class=" + bClass
								 + " onclick='QBM.dealControl.claim();'>"+label+"</button>");
					done = true;
				}
				if (name=="IDS_REVIEW") {
					if (isPresent(response.subState) && response.subState == "review") {
						QB.playWin.tableTab.review('start');
						buttons.push('<button class="review arrow" onclick="QB.playWin.tableTab.review(\'next card\');">=&gt;</button>');
						buttons.push('<button class="review arrow" onclick="QB.playWin.tableTab.review(\'prev card\');">&lt;=</button>');
						buttons.push('<button class="review arrow" onclick="QB.playWin.tableTab.review(\'next trick\');">==&gt;</button>');
						buttons.push('<button class="review arrow" onclick="QB.playWin.tableTab.review(\'prev trick\');">&lt;==</button>');
						buttons.push('<button class="review" onclick="QB.playWin.tableTab.review(\'end\');">x</button>');					
						// buttons.push('<button class="review" style="display:none;" onclick="QB.playWin.tableTab.review(\'end\');">×</button>');					
						done = true;
					}	
				}
				if (!done)
				    buttons.push(  "<button class=" + bClass
								 + " onclick='QBM.dealControl.request(\""+name+"\");'>"+label+"</button>");				
				if (name=="IDS_NEXT_CARD") this.defaultAction="IDS_NEXT_CARD";
			}
			QB.playWin.tableTab.showButtons(buttons,"");
		}

		// in case we received a queue of pre-defined bids to make
		if (isPresent(response.bidsToMake)) this.bidsInQueue = true;

		// at start of Bidding
		if (action=="IDS_START_BIDDING") {
			if (response.gameState != "contract")		
			    QBM.game.startBidding();
		}

		// if the user made a bid
		if (action=="CM_USER_BID" && isPresent(response.userBidAccepted)) {
			if (response.userBidAccepted) {
				// correct bid
				/*
				theAudioPlayer.stop(); // stop explanation for preceding (not accepted) bid
				if (this.soundFinishedTimer!==false) {
					clearTimeout(this.soundFinishedTimer);
					this.soundFinishedTimer=false;
				}
				*/
				QB.bidBox.enableAll();
			}
			else {
				// wrong bid: we might want to reduce the number of enabled bids
				QB.bidBox.enableOnly(response.bidsToEnable);
			}
		}

		if (isPresent(response.bidToSuggest)) {
			// if the user requested a bid solution hint we highlight the correct bid
			theULogger.log(1,'bidToSuggest: ' + response.bidToSuggest);
			QB.bidBox.highlight(response.bidToSuggest);
		}	
		if (isPresent(response.bidInfoText)) {
			QB.playWin.tableTab.showBidSummary(response.bidInfoText);
		}	
		if (isPresent(response.bidNrsToHilight)) {
			theULogger.log(1,'- bidNrsToHilight');
			QB.playWin.tableTab.hiLightBids(response.bidNrsToHilight);
		}
		if (isPresent(response.meaningOfBids)) {
			theULogger.log(1,'- meaningOfBids');
			QB.bidBox.showMeaningOfBids(response.meaningOfBids);
		}	
		if (isPresent(response.displayBidsAtPlayer)) {
			theULogger.log(1,'- displayBidsAtPlayer ');
			QB.playWin.tableTab.setDisplayBidsAtPlayer(response.displayBidsAtPlayer);
		}	
		if (isPresent(response.displayTrumpOnly)) {
			theULogger.log(1,'- displayTrumpOnly ');
			QB.playWin.tableTab.setDisplayTrumpOnly(response.displayTrumpOnly);
		}	
		if (isPresent(response.displayNoContract)) {
			theULogger.log(1,'- displayNoContract ');
			QB.playWin.tableTab.setDisplayNoContract(response.displayNoContract);
		}		
		if (isPresent(response.roles)) {
			theULogger.log(1,'-- roles: ');
			QBM.game.setRoles(response.roles);
		    QB.playWin.tableTab.refresh();			
		}	
		if (isPresent(response.hideBids)) {
			theULogger.log(1,'- hideBids ');
			QB.playWin.tableTab.setHideBids(response.hideBids);
		}				

		// execute a bid requested by the engine - can be an opponent´s bid or a correct user bid
		if (isPresent(response.bidsToMake)) {
			if (QBM.game.bids.length==0) QBM.game.startBidding();
			var bidsRemaining=response.bidsToMake.length;
			var alert, meaning;
			for (var bidToMake of response.bidsToMake) {
				if (!--bidsRemaining && (!response.nextRequest ||
					response.nextRequest.button!="CM_NEXT_BID")) this.bidsInQueue=false; 	// last bid to be made
				alert = "";
				if (typeof(bidToMake.alert) != "undefined" && bidToMake.alert != null)
					alert = bidToMake.alert;
				meaning = "";
				if (typeof(bidToMake.meaning) != "undefined" && bidToMake.meaning != null)
					meaning = bidToMake.meaning;					
				QBM.game.bid(bidToMake.bid,alert,meaning);
			}
		}

		if (response.gameState=="bid") {
			if (QBM.game.isMini) QB.bidBox.updateTitle(QBM.game.mover);
		}
		// contract reached? (at the end of bidding or when replaying with previous bids)
		if (response.gameState=="lead") {
			// rearrange dialogs: explain window becomes larger and covers bidding box
			QB.winManager.arrangeDialogs();
		}
		if (isPresent(response.cardToSuggest)) {
			theULogger.log(1,'cardToSuggest: ' + response.cardToSuggest);
			QB.playWin.tableTab.onHandChanged(QBM.game.mover,response.cardToSuggest);
		}
		if (isPresent(response.cardInfoText)) {
			theULogger.log(1,'cardInfoText: ' + response.cardInfoText);
			QB.playWin.tableTab.showBidSummary(response.cardInfoText);
		}			

		// if we are going to replay (keep bidding)
		if (action=="IDS_REPEAT_PLAY") {
			QB.playWin.tableTab.clearCardsToHiLight();					
			QB.playWin.tableTab.clearTrick();
			QBM.game.replay("");	// start from the beginning
			if (isPresent(response.deal)) {
			   QBM.game.updatePlayerCards(response); 
			}
			if (!(Players.areAllComputer())) {
			    for (var player of Players.all) {
			        if (player.isComputer()) player.setVisible(false);
			    }
			}			
			QB.playWin.tableTab.refresh();
		}

		// open end play dialog
		if (isPresent(response.endPlayDialog)) {
			// compose the dialog contents
			QB.winManager.setDialogTitle("EndPlayWin",theLang.tr(response.endPlayDialog.caption));
			if (isPresent(response.endPlayDialog.category)) {
				$("#EndPlayWin .category").html(
					theLang.tr("IDS_PLAY_TYPE") + " " + response.endPlayDialog.category + "<br>&nbsp;<br>"
				);
			}
			else {
				$("#EndPlayWin .category").html("");			
			}
			if (isPresent(response.endPlayDialog.text))	{
			    var html = response.endPlayDialog.text;
			    for (var suit of Suits.allDenominations) {
				    html = html.replace(RegExp("_"+suit.letter,"ig"),suit.html);
			    }
			    $("#EndPlayWin .text").html(html);
			}
            if (isPresent(response.endPlayDialog.question)) {
			    $("#EndPlayWin .question").html(theLang.tr(response.endPlayDialog.question));
            }
			else {
				$("#EndPlayWin .question").html("");
			}
			var buttons=[];
			for (var button of response.endPlayDialog.buttons) {
				buttons.push({
					text:theLang.tr(button.funct,/&/g),
					value:button.funct,
					click: function(e) {
						QB.winManager.closeDialog("EndPlayWin");
						QBM.dealControl.request("CM_PLAY_END",e.target.value);
					},
				});
			}
			$("#EndPlayWin").dialog("option","buttons",buttons);
			QB.winManager.openDialog("EndPlayWin");
			/*
			if (isPresent(response.endPlayDialog.sound)) {
				this.lastSound=response.endPlayDialog.sound;			
				setTimeout(function() {
					QBM.tutorial.toggleSound();
				},50);
			}
			*/
		}

		// in game state == "over"
		if (response.gameState=="over" || response.gameState=="review") {
	        theULogger.log(1,'-- DC - over');
			if (isPresent(response.clearTable)) {
				QB.playWin.tableTab.clear();
			}

			// show the hands
			if (isPresent(response.cardsToHiLight)) {
				theULogger.log(1,'-- DC cardsToHiLight');			
				QB.playWin.tableTab.setCardsToHiLight(response.cardsToHiLight);				
			}
			if (isPresent(response.handsToShow)) {
				for (var playerId in response.handsToShow) {
					var player = Players[playerId];
					player.clearHand();
					var hand = response.handsToShow[playerId];
					player.setVisible(hand.visible);
					for (var suit of Suits.all) {
						if (isPresent(hand[suit.ID])) {
							for (var value of hand[suit.ID]) {
								player.assignCard(Cards[suit.id+value]);
							}
						}
					}
				}
			}
			if (isPresent(response.showDoneBids)) {
				theULogger.log(1,'-- DC showDoneBids');			
				if (isPresent(response.bidsToShow)) QB.playWin.tableTab.setShowBids(response.bidsToShow);				
				QB.playWin.tableTab.showBidsOnTable();
			}
			if (isPresent(response.resultTexts)) {
				QB.playWin.tableTab.setResultTexts(response.resultTexts);			
			}
			QB.playWin.tableTab.refresh();
		}

		// undo last trick
		if (action=="IDS_UNDO") {
			QBM.game.undoLastTrick();
			if (isPresent(response.deal)) {
				// the engine changed back cards
			    QBM.game.updatePlayerCards(response); 
			    QB.playWin.tableTab.refresh();	
			}
		}

		// play a card if requested by the response
		if (isPresent(response.cardToPlay)) {

			// on lead: resize the table (it may have been enlarged during bidding)
			if (QBM.game.currentCardNr==0) QB.playWin.tableTab.resize(true);

			var delay = 0;
			if (   QBM.game.currentCardNr > 0
				// && !QBM.dealControl.actions.length
				&& !QBM.game.mover.isHuman()) {
				// delay the card played by the program, 400 and 800 are ms
				var now = new Date().getTime();
				var needed = now - this.userCardPlayedAt;
				if ((QBM.game.currentCardNr % 4) == 0) { // lead
					if (needed < 400) delay = 400 - needed;
				}
				else {
					if (needed < 800) delay = 800 - needed;
				}
				/*
				theULogger.log(1,   '-- delay ' + delay + ' cardNr: ' + QBM.game.currentCardNr
				                  + ' mover: ' + QBM.game.mover.id);
				*/
				if (delay < 10) delay = 0;
			}
			if (delay > 0) {
				setTimeout(function() {
					QBM.game.playCard(QBM.game.mover,Cards[response.cardToPlay]);
					QBM.dealControl.afterPotentialDelay(action,contents,response);
				},delay);
			}
			else {
				QBM.game.playCard(QBM.game.mover,Cards[response.cardToPlay]);
				this.afterPotentialDelay(action,contents,response);
			}
		}
		else {
			this.afterPotentialDelay(action,contents,response);
		}

	}

	queuedBids() {
		return this.bidsInQueue;
	}

	afterPotentialDelay(action,contents,response) {

	    theULogger.log(1,'-- DC - afterPotentialDelay');
		if (   isPresent(response.cardToPlay) 
		    && isPresent(response.deal)) {
			// the engine changed cards
			QBM.game.updatePlayerCards(response); 
			QB.playWin.tableTab.refresh();			
		}

		// put a played card onto the table
		if (isPresent(response.cardToShow)) {
			QB.playWin.tableTab.showCardOnTable(
				Players[response.cardToShow.player],
				Cards[response.cardToShow.card],
				isPresent(response.cardToShow.wins) && response.cardToShow.wins,
			);
		}

		// show tricks taken
		if (isPresent(response.tricksDeclToShow)) {
			QB.playWin.tableTab.onTrickFinished(response.tricksDeclToShow,0,response.tricksOppToShow);
		}
		if (isPresent(response.tricksClaimedToShow)) {
			QB.playWin.tableTab.onTrickFinished(response.tricksClaimedToShow,1,13 - response.tricksClaimedToShow);
		}

		// restore user play after the end of the BidExplanations
		// if (isPresent(response.subState) && response.subState=="none") {
	    //    theULogger.log(1,'- afterPotentialDelay - replay, state: '+ response.gameState);
		//	QB.playWin.tableTab.restoreNumberOfTricks();
		// }

		// auto-play forced cards
		if (   (action=="IDS_NEXT_CARD" || action=="IDS_NEXT_CARD_ADV")
		    && (theConfig.get("playForcedCards") && response.gameState!="over")
		 	&& QBM.game.mover.isHuman()) {
			var trick = QBM.game.tricks[QBM.game.currentTrickNr];
			if (QBM.game.mover!=trick.lead || QBM.game.currentTrickNr==12) {
			    var forcedCardId="";
			    if (QBM.game.currentTrickNr==12) {
				    for (var suit of Suits.all) {
					    var cards = QBM.game.mover.holdsCardsOfSuit(suit);
					    if (cards.length>0) { forcedCardId=cards[0].id;	break; }
				    }
				}
			    else {
				    var leadSuit = trick.cards[trick.lead.nr].suit;
				    var cards = QBM.game.mover.holdsCardsOfSuit(leadSuit);
				    if (cards.length==1) forcedCardId=cards[0].id;
			    }
			    if (forcedCardId!="") {
				    setTimeout(function(){
					    QBM.dealControl.request("CM_USER_CARD",forcedCardId);
				    },300);
			    }
			    else {
				    // QBM.dealControl.performNextRemainingAutomaticAction();
				}
				return;
			}
		}

		// schedule a delayed follow-up request
		if(isPresent(response.nextRequest)) {
	        // theULogger.log(1,'-- DC - have nextRequest: ' + response.nextRequest.button);		
			var delay = 100*response.nextRequest.delay;
			this.delayedRequestTimer = setTimeout(function() {
				QBM.dealControl.delayedRequestTimer=false;
				QBM.dealControl.request(response.nextRequest.button);
			}
			,delay);
		}
	}

	claim() {
		// let the user claim a certain number of tricks

		QB.winManager.setDialogTitle("ClaimWin",theLang.tr("IDS_CLAIM"));

		var buttons=[];
		buttons.push({
			text:theLang.tr("IDS_VERIFY",/&/g),
			click: function(e) {
				var nr;
				var nrtricksId;
				for (nr = 0; nr <= 13; nr++) {
					nrtricksId = "#nrtricks" + nr.toString();
					if ($(nrtricksId) && $(nrtricksId).is(':checked')) {
						theULogger.log(1,'- claim:verify - nr = ' + nr.toString());
					    QBM.dealControl.request("IDS_CLAIM",nr.toString() + "+");
						break;
					}
				}
			},
		});
		buttons.push({
			text:theLang.tr("IDS_ACCEPT",/&/g),
			click: function(e) {
				var nr;
				var nrtricksId;
				for (nr = 0; nr <= 13; nr++) {
					nrtricksId = "#nrtricks" + nr.toString();
					if ($(nrtricksId) && $(nrtricksId).is(':checked')) {
						theULogger.log(1,'- claim:accept - nr = ' + nr.toString());
					    QBM.dealControl.request("IDS_CLAIM",nr.toString() + "-");
						break;
					}
				}
			},
		});
		buttons.push({
			text:theLang.tr("L_CANCEL",/&/g),
			// style: "display:block",
			click: function(e) { QB.winManager.closeDialog("ClaimWin");	},
		});
		buttons.push({
			text:theLang.tr("IDS_HELP",/&/g),
			// style: "float:right",
			click: function(e) { QB.showHelpText("claim-concede"); },
		});
		$("#ClaimWin").dialog("option","buttons",buttons);
		var html = "<b>" + theLang.tr("IDS_HOW_MANY_TRICKS") + "<p>";
		var defenseTricks = 0;
		var playerTricks = 0;
		for (var t=0;t<Math.floor(QBM.game.currentCardNr/4);t++) {
			if (QBM.game.tricks[t].winner.party==QBM.game.contract.declarer.otherParty) defenseTricks++;
			else playerTricks++;
		}
		var level = parseInt(QBM.game.contract.level);
		var min= playerTricks;
		var nr = min;
		var i = 0;
		var haveCheck = "";
		for (; nr <= 13 - defenseTricks; nr++) {
			if ((i % 5) == 0) html += "<br>";
			if (nr == 13 - defenseTricks) haveCheck = "checked";
			html +=
				  "<input id='nrtricks" + nr.toString() + "' type='radio' name='nrtricks' value='x'"
				+ haveCheck + " >" + nr.toString().padStart(2) + " &nbsp;</input>" + " ";
			i++;
		}
		html += "<div id='claimResponse'></div>";
		html += "</b>";
		$("#ClaimWin").html(html);

		QB.winManager.openDialog("ClaimWin");
	}

	requestDefaultAction() {
	    theULogger.log(1,'- requestDefaultAction: ' + QBM.dealControl.defaultAction);	
		if (QBM.dealControl.defaultAction != "") {
			// theULogger.log(1,'- mover: ' + QBM.game.mover.id + ' currentCardNr: ' + QBM.game.currentCardNr);			
			if (   QBM.game.mover.isVisible() && QBM.game.mover.isHuman() 
			    && QBM.game.currentCardNr%4==0) QB.playWin.tableTab.collectTrick();
			else QBM.dealControl.request(QBM.dealControl.defaultAction);
			QBM.dealControl.defaultAction = "";
		}
	}

}
