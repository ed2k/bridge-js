
class BidBox extends View {

	// The bidding box with the bidding cards and a region bid explanations 
	// During the bidding process the bidding cards are visible AND
	// the window title contains the name of the player to bid

	constructor(app) {
		super(app);

		// symbols for translation
		theLang.add({
			BidBoxWin: {
				en: "Bidding Box",
				de: "Bietbox",
				fr: "Boîte à enchères",
				it: "Tabella licite",
				es: "Subasta",
				dk: "Meldeboks" 
			},
			ExplainPWin: {
				en: "-",
			},	
			ExplainBidsDone: {
				en: "Bids done",
				de: "Abgegebene Gebote",
			    fr: "Enchéres effectuées",
			    it: "Licite fatte",
			    dk: "Udførte meldinger",
			},				
			ExplainBidList: {
				en: "Possible bids",
				de: "Mögliche Gebote",
			    fr: "Enchéres possibles",
			    it: "Licite possibili",
			    dk: "Mulige meldinger",
			},		
			suggestedBid: {
				en: "suggested bid",
				de: "vorgeschlagenes Gebot",
				fr: "Enchère proposée",
				es: "subasta preferida",
			},
			altHands: {
				en: "alternative hands",
				de: "alternative Hände",
				fr: "mains alternatives",
				es: "manos alternativas",
			},
		});

		if (QB.product.type == "play") {
			this.ui = {
				boxWin:		$("#BidBoxWin"),
				boxCards:	$("#BidBoxCards"),
				explainWin: $("#ExplainPWin"),			
				explain:    $("#BidExplanations"),	
			}
		}
		else {
			this.ui = {
				boxWin:		$("#BidBoxWin"),
				boxCards:	$("#BidBoxCards"),
			}
		} 

		// react on resizing the bid box
		$("#BidBoxWin").on("dialogresizestop", function(e,ui) {
			QB.bidBox.resize();
		});

		// add click action to the cards in the bidding box
		$("#BidBoxCards .bid").each(function() {
			$(this).on("click",function() {
				// ignore bids if the player to bid is not a human
		        // theULogger.log(1,'BidBox:click ' + this.id + " mover: " + QBM.game.mover.name);					
				if (!QBM.game.mover.isHuman()) return;
				// reset orange border (in case the bid was highlighted)
				$("#BidBoxWin #"+this.id).css("border","");
				// execute the bid
				if (QBM.game.isMiniRound1()) {
				    QBM.enterBid(BidIdToMiniVal(this.id).toString());				
				}
				else {
				    QBM.enterBid(this.id);
				}
			});
		});

		// context menu for recording in expert mode
		if (QB.mode=="expert") {
			var that=this;
			$("#BidBoxCards .bid").on("contextmenu",function(e) {
				return that.contextMenuBids(e);
			});
		}
		
		this.html_pass = $("#BidBoxCards #-").html();
		this.html_x    = $("#BidBoxCards #x").html();
		this.html_xx   = $("#BidBoxCards #xx").html();
		this.highlightedBid = "";

		this.allBids = [
			"7nt","7s","7h","7d","7c",
			"6nt","6s","6h","6d","6c",
			"5nt","5s","5h","5d","5c",
			"4nt","4s","4h","4d","4c",
			"3nt","3s","3h","3d","3c",
			"2nt","2s","2h","2d","2c",
			"1nt","1s","1h","1d","1c",
		];
		
		if (QB.product.type == "play") {
			this.isBidinfoAll  = "0";
			this.isBidinfoOpps = "1";
			this.haveBidList = false;
			this.storedMeanings = "";			
			this.forcingHtml = "<span style='background-color:#fdb;padding:2px'>f</span>";
			this.artifHtml = "<span style='background-color:#ace;padding:2px'>a</span>";
		}
	}

	onChanged(what) {
		// receive results from the Model
		theULogger.log(1,'BidBox:onChanged ' + what.type);		

		if 		(what.type=="bid") {
			this.onBid(what.bidder, what.bid);
		}
		else if (what.type=="new game") {
			this.onNewGame();
		}
		else if (what.type=="start bidding") {
			if (QB.product.type == "play") {
				if (!Players.areAllComputer()) this.show();
				this.isBidinfoAll  = theEngine.getConfigParam("preference.bidinfo_all");
				this.isBidinfoOpps = theEngine.getConfigParam("preference.bidinfo_opps");
			}
			else {
				if (QBM.game.mover.isHuman() && !QBM.tutorial.queuedBids()) 
					this.show();
			}
		}
		else if (what.type=="suggestedBid") {
			// currently not used
			/*
			var link=QB.makeUrl({bids:"^"+what.altBids.replace(/ /g,'_')});
			this.ui.msg.html(
				"<hr><b>"+what.bidder.name+" : "+what.yourBid.html+
				" &nbsp; <span style='color:blue'>??</span></b>"+
				"<i><a style='margin-left: 40px;color:blue;text-decoration:none' target='altHands' href='"+link+"'>&rArr; "+theLang.tr("altHands")+"</a> ..</i><br/>"+
				this.formatMeaning(what.yourMeaning,"")+
				"<p></p><b>" + what.bidder.name+" : "+
				what.suggestedBid.html+" &nbsp; <span style='color:blue'>!!</span></b><br/>"+this.formatMeaning(what.suggestedMeaning,"")
			);
			*/
		}
		else if (what.type=="biddingFinished") {
			this.onBiddingFinished();
		}
		else if (what.type=="card played") {
			if (what.moveNr == 0) {
			    // after the lead
				this.hide();
				if (QB.product.type == "play") 				
					QB.winManager.closeDialog("ExplainPWin");
			}
		}		
		else if (what.type=="trickFinished") {
			this.onTrickFinished(what.trick);
		}
		else if (what.type=="undo trick") {
			this.onUndoTrick();
		}
	}

	onNewGame() {
		this.setBoxTitle(theLang.tr("BidBoxWin"));	
		
		if (QB.product.type == "play") {
			this.haveBidList = false;
			this.storedMeanings = "";				
			this.ui.explain.html("");
			this.setExplainTitle(theLang.tr("ExplainPWin"));				
		}		

		if (!QBM.game.dealer) {
		   this.hide();
		   return;
		}

		for (var bidId of this.allBids) {
		    // enable all bid buttons
		    $("#BidBoxCards #"+bidId).prop("disabled","");
		    // set text			
			var bid = new Bid(bidId,"N");
			if (QBM.game.isMiniRound1()) {
				var i = BidIdToMiniVal(bidId);
				var html = "";
				if (i < 10) html = "&nbsp; ";
				html += i.toString() + " &nbsp;";
		        $("#BidBoxCards #"+bidId).html(html);			
			}
			else {
		        $("#BidBoxCards #"+bidId).html(bid.html);	
			}
			if (this.highlightedBid == bidId) {
				// remove orange border
				$("#BidBoxWin #"+bidId).css("border","");
				this.highlightedBid = "";
			}
		}
		if (QBM.game.isMini) {
		    $("#BidBoxCards #-").html("&nbsp; 0 &nbsp;");
		    $("#BidBoxCards #x").html("36 &nbsp;");
		    $("#BidBoxCards #xx").html("37 &nbsp;");
		    $("#BidBoxCards #-").prop("disabled","");	
			$("#BidBoxCards #x").prop("disabled","");	
			$("#BidBoxCards #xx").prop("disabled","");			
		}
		else {
		    $("#BidBoxCards #-").html(this.html_pass);	
		    $("#BidBoxCards #x").html(this.html_x);
		    $("#BidBoxCards #xx").html(this.html_xx);
			// enable pass
		    $("#BidBoxCards #-").prop("disabled","");		
			// disable x,xx		
	        $("#BidBoxCards #x").prop("disabled","disabled");
		    $("#BidBoxCards #xx").prop("disabled","disabled");
			// put dealer´s name into the title of the box
		}
		if (QBM.game.dealer) this.updateBoxTitle(QBM.game.dealer);

		// show all bidding cards
		this.ui.boxCards.show();
		$("#BidLevel0").css("margin-top","10px");		
		for (var level=1;level<=7;level++) $("#BidLevel"+level).show();
		$("#BidBoxWin").dialog("moveToTop");
	}
	
	updateBoxTitle(bidder) {
        if (bidder.isHuman()) {
			var title = "";
			if (QBM.game.isMini) {
				if (QBM.game.isMiniRound1()) {	    
					title += theLang.tr("L_POINTS");
		        }
				else {
					title += theLang.tr("contract");
				}
			}
			else {
				title += theLang.tr("bid");
			}
			title += " " + theLang.tr("L_OF") + " " + bidder.name;
			this.setBoxTitle(title);
		}
	}
	
	formatMeaning(bid,mSource,nr) {
		// if nr == 0 the player should be outputted
		var meaning = "...";
		if (mSource == "") return meaning;
		else meaning = mSource;
		var html;
		for (var suit of Suits.allDenominations) {
			meaning = meaning.replace(RegExp("_"+suit.letter,"ig"),suit.html);
		}
		meaning = meaning.replace("=f",this.forcingHtml);
		meaning = meaning.replace("=a",this.artifHtml);
		if (nr == 0) 
			html =   "<div><span style='width:64px;font-weight:600;display:inline-block'>"
				   + bid.bidder.letter + " " + bid.html + "</span>"
				   + "<span class='legend'>" + meaning + "</span></div>";
		else
			html =   "<div><span style='width:50px;font-weight:600;display:inline-block'>"
				   + bid.html + "</span>"
				   + "<span class='legend'>" + meaning + "</span></div>";
		return html;
	}

	onBid(bidder,bid) {
		this.updateBoxTitle(QBM.game.mover);
        if (QBM.game.isMini) {
		    if (!(QBM.game.isMiniRound1())) {	    
				for (var bidId of this.allBids) {
				    var showBid = new Bid(bidId,bidder);
					$("#BidBoxCards #"+bidId).html(showBid.html);					
				    if (! (  bidId == "5c" || bidId == "5d" || bidId == "4h" || bidId == "4s"
					      || bidId == "3nt" || bidId.substr(0,1) == "1") ) {
					    $("#BidBoxCards #"+bidId).prop("disabled","disabled");					
					}
				}
		        $("#BidBoxCards #-").html(this.html_pass);	
		        $("#BidBoxCards #x").html(this.html_x);
		        $("#BidBoxCards #xx").html(this.html_xx);				
				$("#BidBoxCards #-").prop("disabled","disabled");	
				$("#BidBoxCards #x").prop("disabled","disabled");	
				$("#BidBoxCards #xx").prop("disabled","disabled");
				if (QB.playWin.tableTab.displayTrumpOnly) QB.winManager.closeDialog("BidBoxWin");	
			}
		}
		else {	
			// disable bids which are no longer available		
			var found = false;		
		    for (var bidId of this.allBids) {
			    if (bidId==bid.id) found=true;
			    if (found) {
				    $("#BidBoxCards #"+bidId).prop("disabled","disabled");
			    }
		    }   
		    // hide lower levels of bidding cards
			// theULogger.log(1,'BidBox::onBid id:' + bid.id + ' level:' + bid.level);
			if (bid.level > 0) {
				for (var level=1;level<bid.level;level++) $("#BidLevel"+level).hide();
				$("#BidLevel0").css("margin-top",(10 * bid.level).toString()+"px");
			}
			
		    // enable/disable (re)double
		    var doublePossible = (QBM.game.playersInSpe==bidder.party && QBM.game.contractInSpe[bidder.party].doubled=="");
		    $("#BidBoxCards #x").prop("disabled",doublePossible ? "" : "disabled");
		    var redoublePossible = (QBM.game.playersInSpe==bidder.otherParty && QBM.game.contractInSpe[bidder.otherParty].doubled=="D");
		    $("#BidBoxCards #xx").prop("disabled",redoublePossible ? "" : "disabled");

			if (this.highlightedBid != "") {
				// remove orange border
				$("#BidBoxWin #"+this.highlightedBid).css("border","");
				this.highlightedBid = "";
			}

		    // show the meaning of the bid (if provided)
			if (QB.product.type != "tut") {
				if (this.haveBidList) {
					// clear the window
					this.haveBidList = false;
					if (this.storedMeanings.length > 10)
						this.setExplainTitle(theLang.tr("ExplainBidsDone"));
					else 
						this.setExplainTitle(theLang.tr("ExplainPWin"));
					this.ui.explain.html(this.storedMeanings);
					this.storedMeanings = "";
				}				
				var showMeaning =    (this.isBidinfoAll == "1")
								  || (this.isBidinfoOpps == "1" && !bidder.isHumanSide());
				if (showMeaning) {
					QB.winManager.openDialog("ExplainPWin");				
					var meaning = this.formatMeaning(bid,bid.meaning,0);
					if (meaning != "...") {
						this.setExplainTitle(theLang.tr("ExplainBidsDone"));					
						this.ui.explain.append(meaning);
					}
			    }
		    }
			$("#BidBoxWin").dialog("moveToTop");
		}

		// show bid box if next player is visible
		if (QB.product.type=="tut") {
			if (bidder.next().isVisible() && !QBM.tutorial.queuedBids()) this.show();
		}
	}

	onBiddingFinished() {
		if (   QB.product.type == "play"
			&& (this.isBidinfoOpps == "1" || this.isBidinfoAll == "1") ) {
			// show now the meaning of all bids
			this.setExplainTitle(theLang.tr("ExplainBidsDone"));				
			this.ui.explain.html("");
			for (var bid of QBM.game.bids) {
				var meaning = this.formatMeaning(bid,bid.meaning,0);	
				if (meaning != "...") {
				    this.ui.explain.append(meaning);
			    }			
			}
		}	
		this.resize();
		this.hide();
	}
	
	showMeaningOfBids(meaningOfBids) {
		QB.winManager.openDialog("ExplainPWin");	
		var bidder = QBM.game.mover;	
		var title = theLang.tr("ExplainBidList") + " " + theLang.tr("L_OF") + " " + bidder.name;
		var i = 1;
		if (!this.haveBidList) {
			this.haveBidList = true;
			this.storedMeanings = this.ui.explain.html();
		}			
		this.setExplainTitle(title);
		this.ui.explain.html("");
		for (var bidEntry of meaningOfBids) {
			var bid = new Bid(bidEntry.bid,bidder);
			// theULogger.log(1,'- bid: ' + bidEntry.bid + ' meaning: ' + bidEntry.meaning);
			var meaning = this.formatMeaning(bid,bidEntry.meaning,i);	
			if (meaning != "...") {
				this.ui.explain.append(meaning);
			}			
		}
	}

	onTrickFinished(trick) {
		/* no action here:
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
		this.ui.tricks.append(filler+trick.cards[trick.winner.nr].suit.html+"\n");
		*/
	}

	onUndoTrick() {
		/*
		this.ui.tricks.html("<hr/>");
		for (var t=0; t<QBM.game.currentTrickNr;t++) {
			this.onTrickFinished(QBM.game.tricks[t]);
		}
		*/
	}

	enableOnly(bidsToEnable) {
		if (typeof bidsToEnable == "undefined") return;
		bidsToEnable= bidsToEnable.join(" ")+" ";
		for (var bid of this.allBids) {
			if (bidsToEnable.indexOf(bid+" ")<0) {
				$("#BidBoxWin #"+bid).prop("disabled","disabled");
			}
		}
		$("#BidBoxWin").dialog("moveToTop");
	}

	enableAll() {
		for (var bid of this.allBids) {
			if (QBM.game.bids.length>0 && bid==QBM.game.bids[QBM.game.bids.length-1].id) break;
			$("#BidBoxWin #"+bid).prop("disabled","");
		}
	}

	highlight(bid) {
	    if (QBM.game.isMiniRound1()) {
			bid = MiniValToBidId(bid);
		}
		if (bid == "p" || bid=="pass") bid="-";
		this.highlightedBid = bid;
		$("#BidBoxWin #"+bid).css("border","solid 3px #fa0");
		$("#BidBoxWin").dialog("moveToTop");
	}

	resize() {
		/*
		if (QB.product.type != "play") return;	
		var winWidth = Math.floor(this.ui.explainWin.width());
		var winHeight = Math.floor(this.ui.explainWin.height());	
		theULogger.log(1,'BidBox:resize - Explanation w:' + winWidth + ' h:' + winHeight);
		if (winWidth <= 10) return; // the window is not visible
		*/
		/*
		this.explanationWidth = Math.floor(winWidth - 70);
		// reformat the meanings to use the full available window width	-- not necessary
		$("#BidExplanations .legend").each(function() {
			$(this).css({width:this.explanationWidth});
		});
		*/
	}

	setBoxTitle(title) {
		this.ui.boxWin.dialog("option","title",title);
	}
	
	setExplainTitle(title) {
		this.ui.explainWin.dialog("option","title",title);
	}

	show() {
		QB.winManager.openDialog("BidBoxWin");
		if (QB.product.type == "play")
			QB.winManager.openDialog("ExplainPWin");		
		var winWidth = Math.floor(this.ui.boxWin.width());
		var winHeight = Math.floor(this.ui.boxWin.height());
		var fontSize = 100;
		var paddingW = "8px";
		if (winHeight >= 220 && winHeight <= 320) {
			fontSize = (Math.floor(winHeight / 10) - 2) * 5;
		}
		if (winHeight >= 320) fontSize = 150;
		if (winWidth < 270) {
			// in vertical mode	
			paddingW = "7px";
			fontSize = 95;
			if (winWidth <= 260) {
				paddingW = "6px";
				fontSize = 90;			
			}
		}
		theULogger.log(1,  'BidBox:show, state= ' + QBM.game.state 
						  + ' w:' + winWidth + ' h:' + winHeight 
						  + ' fs:' + fontSize + ' pd:' + paddingW);			
		var strFontSize = fontSize.toString() + '%';		
		$("#BidBoxWin .bid").css({fontSize:strFontSize,
								  paddingLeft:paddingW,paddingRight:paddingW,paddingTop:"1px",paddingBottom:"1px"}); 		
		$("#-")[0].scrollIntoView();
		$("#BidBoxWin").css({opacity:1.0});
		$("#BidBoxWin").dialog("moveToTop");		
	}

	hide() {
		theULogger.log(1,'BidBox:hide, state= ' + QBM.game.state);	
		if (   QBM.game.state == "dealt"
			|| QBM.game.state == "bidding") {
			$("#BidBoxWin").css({opacity:0.25});
		}
		else {
		    QB.winManager.closeDialog("BidBoxWin");
		}
	}

	toggleTrickHistory() {
		// currently deactived:
		// QB.winManager.toggleDialog("BidBoxWin");
		// this.ui.tricks[0].scrollIntoView();
	}

	contextMenuBids(e) {
		// a popup window which allows to record a spoken explanation text for a bid
		$("#ContextMenuBids").dialog({
			position:{my:'center',at:'center',of:window},
			width:500,
			buttons:[
				{
					text:"ok",
					click: function() {
						$("#ContextMenuBids").dialog("close");
					}
				},
			],
		});
		var recName=e.target.id;
		var html=`
			<div id="controls">
					<button id="recordStartButton" onclick="QB.bidBox.startRecording('`+recName+`');">Record</button>
					<button id="recordStopButton" onclick="QB.bidBox.stopRecording();" disabled>Stop</button>
			</div>
			<ol id="recordingsList"></ol>
			<!-- inserting these scripts at the end to be able to use all the elements in the DOM -->
			<script src="WebAudioRecorder.min.js"></script>
		`;
		$("#ContextMenuBids").html(html);
		return false;
	}

	startRecording(recName) {
		navigator.mediaDevices.getUserMedia(
			{ audio: true, video:false }
		).then(function(stream) {
			var audioContext = new AudioContext();
			QB.bidBox.gumStream = stream;
			var input = audioContext.createMediaStreamSource(stream);
			// input.connect(audioContext.destination) // do not play inout via speakers

			QB.bidBox.recorder = new WebAudioRecorder(input, {
			  workerDir: "./",
			  encoding: "mp3",
			  numChannels:2, //2 is the default, mp3 encoding supports only 2
			});
			QB.bidBox.recorder.onComplete = function(recorder, blob) {
				QB.bidBox.createDownloadLink(blob,recName);
				QB.bidBox.recordedBlob = blob;
			};
			QB.bidBox.recorder.setOptions({ timeLimit:120, encodeAfterRecord:true, mp3: {bitRate: 320} });
			QB.bidBox.recorder.startRecording();

		}).catch(function(err) {
		  	//enable the record button if getUserMedia() fails
			$("#recordStartButton").prop('disabled',false);
	    	$("#recordStopButton").prop('disabled',true);
		});

		//disable the record button
		$("#recordStartButton").prop('disabled',true);
		$("#recordStopButton").prop('disabled',false);
	}

	stopRecording() {
		// stop microphone access
		QB.bidBox.gumStream.getAudioTracks()[0].stop();

		// toggle buttons
		$("#recordStartButton").prop('disabled',false);
		$("#recordStopButton").prop('disabled',true);

		//tell the recorder to finish the recording (stop recording + encode the recorded audio)
		QB.bidBox.recorder.finishRecording();
	}

	createDownloadLink(blob,recName) {
		var url = (window.URL || window.webkitURL).createObjectURL(blob);
		var path = QBM.tutorial.section.name+" &nbsp; / &nbsp; S"+
		(QBM.tutorial.step.number.replace(/^.*[.]/,'')).padStart(2,"0")+" &nbsp; / &nbsp; ";
		$("#recordingsList").append(
			"<li>"+
				"<audio controls src='"+url+"'></audio>"+
				path+
				"<a href='"+url+"' download='"+recName+".mp3'>"+recName+".mp3</a>"+
				" ... "+
				"<button onclick='QB.bidBox.saveRecording(\""+recName+"\");'>upload</button>"+
			"</li>"
		);
	}

	saveRecording(recName) {
		var formData = new FormData();
		formData.append("name",recName);
		formData.append("audio",QB.bidBox.recordedBlob);
		var request = new XMLHttpRequest();
		request.open("POST","saveAudio.php");
		request.send(formData);
	}
}
