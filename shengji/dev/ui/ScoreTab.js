
class ScoreTab extends View {

	constructor(app) {
		super(app);
	    this.scoreTabOverview = new ScoreTabOverview(app);
		this.scoreTabDetails1 = new ScoreTabDetails1(app);
		this.scoreTabDetails2 = new ScoreTabDetails2(app);		
	}
	
	clear() {
		this.scoreTabOverview.clear();
		this.scoreTabDetails1.clear();
		this.scoreTabDetails2.clear();	
	}
	
	init() {
		// symbols for translation
		theLang.add({
			PlayTabScore: {
				en: "Score",			
			},			
			ScoreTabOverview: {
				en: "Table",
				de: "Tabelle",	
				fr: "Table",	
			    it: "Tabella",
				dk: "Resultatark",
			},	
			ScoreTabDetails1: {
				en: "Details 1",
				de: "Details 1",				
			    fr: "Détails 1",
				it: "Dettagli 1",
				dk: "Detaljer 1",				
			},		
		    ScoreTabDetails2: {
				en: "Details 2",
				de: "Details 2",				
			    fr: "Détails 2",
				it: "Dettagli 2",				
				dk: "Detaljer 2",
			},		
		    ScorePairResults: {
				en: "Pair results",
				de: "Paar-Ergebnisse",				
			    fr: "Résultats des paires",
				it: "Risultati delle coppie",				
				dk: "Parresultater",
			},					
			filledByTable: {
				en: "- filled by the table",
				de: "- gefüllt durch die Tabelle",				
			    fr: "- remplie par le table",
				it: "- riempita dalla tabella",				
				dk: "- udfyldt af resultatark",
			},		
		});			
		
		this.ui = {
			main: $("#PlayViewScore"),
		}
		this.scoreTabOverview.init();
		this.scoreTabDetails1.init();
		this.scoreTabDetails2.init();	
		this.selectedId = "ScoreTabOverview";
		this.isNewGame = false;
	}
	
	onTabBefore() {	
		theULogger.log(1,'- ScoreTab::onTabBefore, selected: ' + this.selectedId)
		if (this.isNewGame && this.selectedId != "ScoreTabOverview") {
			this.isNewGame = false;
			$("#PlayViewScore").easytabs("select","#ScoreTabOverview");	
			$("#ScoreAreaDetails1").hide(); // a fix, because easytabs does not
			$("#ScoreAreaDetails2").hide();
		}
		else {
			if (this.selectedId == "ScoreTabOverview")
				this.scoreTabOverview.onTabBefore();
			if (this.selectedId == "ScoreTabDetails1")
				this.scoreTabDetails1.onTabBefore();	
			if (this.selectedId == "ScoreTabDetails2")
				this.scoreTabDetails2.onTabBefore();
		}
	}

	onChanged(what) {
		// receive results from the Model
		theULogger.log(1,'- ScoreTab::onChanged' + what.type);
		if (what.type=="new game") {
			this.isNewGame = true;
		}	
	}	

	scoreDeal2Html(deal) {
		// This function interpretes the deal json created by the engine 
		// function infoScore(), parameter "scoreEntryProt1" or "scoreEntryProt2".
		// The code is straight-forward but a log of the deal json is needed
		// to understand it.
	    var html = "";
		var i;
		var player;
		var flag;
	    if (isPresent(deal.dealText)) {	
			html += theLang.tr("IDS_W_RECORD") + " : " + theLang.tr("L_DEAL") + " : " + deal.dealText;
		}
		var dealerMark = theLang.tr("L_DEALER").slice(0,1) + ":&nbsp;";
		var isVuln = [ false, false, false, false ];
		var playerNames = [ "", "", "", "" ];
		if (deal.vuln == "NS" || deal.vuln == "All") { isVuln[0] = true; isVuln[2] = true; }
		if (deal.vuln == "EW" || deal.vuln == "All") { isVuln[1] = true; isVuln[3] = true; }	
		var playerNames = [ "", "", "", "" ];
		if (isPresent(deal.playerNames)) {
			var role;
			for (i=0; i<= 3; i++) {
				playerNames[i] = deal.playerNames[i];
				if (playerNames[i].length >= 7) {
					if (playerNames[i].slice(0,6) == "__R__:") {
						// decoding of the encoded role:
						role = playerNames[i].slice(6,7);
						playerNames[i] = "role:" + role; // mainly debug
						if (role == "C") playerNames[i] = theLang.tr("IDS_COMPUTER");
						if (role == "H") playerNames[i] = theLang.tr("IDS_HUMAN");					
					}
				}
			}
		}
	    html += '<table width="100%">';
	    html += '<tr><td colspan="2" align=center>';	// North
	    html += '<table border width="400" align=center bgcolor="#c0e0f0">';
	    html += '<caption><b><center>';
		if (deal.dealer == "N") html += dealerMark;
		if (isVuln[0]) html += '<font color="#F00000">';		
		html += theLang.tr("playerNameN");
		if (isVuln[0]) html += '</font>';	
		if (playerNames[0] != "") html += ' (' + playerNames[0] + ')';
		html += '</center></b></caption>';
	    html += '<tr>';
		for (var suit of Suits.all) {
			html += '<td>&nbsp;' + suit.html;
			for (var value of deal["N"][suit.ID]) {
				html += ' ' + Values.byId(value).letter;				
			}
			html += '</td>';
		}
	    html += '</tr></table></td></tr>';
	    html += '<tr><td align=left>'; // West
	    html += '<table border width="200" align=left bgcolor="#c0e0f0">'; 
	    html += '<caption><b><center>';
		if (deal.dealer == "W") html += dealerMark;	
		if (isVuln[3]) html += '<font color="#F00000">';
		html += theLang.tr("playerNameW");
		if (isVuln[3]) html += '</font>';
		if (playerNames[3] != "") html += ' (' + playerNames[3] + ')';
		html += '</center></b></caption>';
		for (var suit of Suits.all) {
			html += '<tr><td>&nbsp;' + suit.html;
			for (var value of deal["W"][suit.ID]) {
				html += ' ' + Values.byId(value).letter;				
			}
			html += '</td></tr>';
		}
		html += '</table></td>';
	    html += '<td align=right>'; // East
	    html += '<table border width="200" align=right bgcolor="#c0e0f0">'; 
	    html += '<caption><b><center>';
		if (deal.dealer == "E") html += dealerMark;			
		if (isVuln[1]) html += '<font color="#F00000">';
		html += theLang.tr("playerNameE");
		if (isVuln[1]) html += '</font>';
		if (playerNames[1] != "") html += ' (' + playerNames[1] + ')';
		html += '</center></b></caption>';
		for (var suit of Suits.all) {
			html += '<tr><td>&nbsp;' + suit.html;
			for (var value of deal["E"][suit.ID]) {
				html += ' ' + Values.byId(value).letter;				
			}
			html += '</td></tr>';
		}
	    html += '</table></td></tr>';   
	    html += '<tr><td colspan="2" align=center>'; // South
	    html += '<table border width="400" align=center bgcolor="#c0e0f0">';	   
	    html += '<caption><b><center>';
		if (deal.dealer == "S") html += dealerMark;	
		if (isVuln[2]) html += '<font color="#F00000">';		
		html += theLang.tr("playerNameS");
		if (isVuln[2]) html += '</font>';
		if (playerNames[2] != "") html += ' (' + playerNames[2] + ')';		
		html += '</center></b></caption>';
	    html += '<tr>';
		for (var suit of Suits.all) {
			html += '<td>&nbsp;' + suit.html;
			for (var value of deal["S"][suit.ID]) {
				html += ' ' + Values.byId(value).letter;				
			}
			html += '</td>';
		}	   
	    html += '</tr></table></td></tr></table>';
	    html += '<hr>';
	    html += '<table width="100%">';
		if (isPresent(deal.bids) && deal.bids.length > 0) {
		    var dealer = Players.N;
		    if (deal.dealer == "E") dealer = Players.E;
			if (deal.dealer == "S") dealer = Players.S;
			if (deal.dealer == "W") dealer = Players.W;	
			html += '<tr><td valign=top>'; // Auction and Contract
			html += '<table border>';
			html += '<tr><td><b>' + theLang.tr("L_BIDS") + '</b></td>'; // heading
			player = dealer;
			for (i=1; i<=4; i++) {
				html += '<td width="45" align=center>' + player.letter + '</td>';
				player = player.next();
			}
			html += '</tr>';
			i = 0;
			for (var bidText of deal.bids) {
				if ((i % 4) == 0) {
					html += '<tr><td></td>';
				}
				html += '<td align=center>';
				if (bidText == "p") { html += 'p'; }
				else {
					var posHyphen = bidText.indexOf('-');				
					if (posHyphen >= 0) {
						flag = bidText.slice(posHyphen);
						bidText = bidText.slice(0,posHyphen);
						if (flag == "-A") bidText += '~';
					}				
					var bid = new Bid(bidText,player); // player does not matter
					if (typeof bid == "undefined") html += '??';
					else html += bid.html;	
				}
				html += '</td>';
				i++;
				if ((i % 4) == 0 || i == deal.bids.length) {
					html += '</tr>';
				}
			}
		}
		html += '<tr><td><b>' + theLang.tr("L_CONTRACT") + '</b></td>';
		var contract = deal.contract;
		for (var suit of Suits.allDenominations) {		
			contract = contract.replace(RegExp("_"+suit.letter,"ig"),suit.html);
		}
	    html += '<td colspan=4 align=center>' + contract + '</td></tr>';
	    html += '</table></td>';
	
	    html += '<td align=right valign=top>'; // Tricks + Result
	    html += '<table border>';
		if (isPresent(deal.declarer) && deal.declarer != "" && deal.declarer != "?") {	
			var declarer = Players.N;
			if (deal.declarer == "E") declarer = Players.E;
			if (deal.declarer == "S") declarer = Players.S;
			if (deal.declarer == "W") declarer = Players.W;			
			html += '<tr><td><b>' + theLang.tr("L_TRICKS") + '</b></td>'; // heading and first trick
			i = 0;
			player = declarer.next();
			var trickNo = 1;
			var isWinner;
			var winner = player; // to have it defined
			var winSuit = "s"; 
			var card;
			for (var cardText of deal.cards) {
				if (i % 4 == 0) {
					if (i > 0) html += '<tr><td></td>';
					html +=   '<td width="30">&nbsp;' + trickNo + ':</td>'
							+ '<td width="25">&nbsp;' + player.letter + '</td>';		
				}
				isWinner = false;
				if (cardText.length > 2) {
					flag = cardText.slice(2,4);
					if (flag == "-w") {
						isWinner = true;
						winner = player;
						winSuit = cardText.slice(0,1);
					}
					cardText = cardText.slice(0,2);
				}
				if (isWinner)  html += '<td width="35" align=center bgcolor="#d0e0f0">';
				else           html += '<td width="35" align=center>';
				if (cardText == "??") {
					html += '??';
				}
				else {
					card = Cards[cardText];
					if (typeof card == "undefined") html += cardText;
					else					        html += card.html; 
				}
				html += '</td>';
				player = player.next();
				i++;
				if ((i % 4) == 0 || i == deal.cards.length) {
					html += '<td width="30" bgcolor="#d0e0f0">&nbsp;';
					if (winner.party != declarer.party)
						html += '&nbsp;&nbsp;';
					html += Suits.byId(winSuit).html;
					html += '</td></tr>';
					trickNo++;
					player = winner;
				}
			}
		}
		var result = deal.result;
		for (var suit of Suits.allDenominations) {		
			result = result.replace(RegExp("_"+suit.letter,"ig"),suit.html);
		}		
	    html +=   '<tr><td><b>' + theLang.tr("L_RESULT") + '</b></td>'
				+ '<td colspan=7 align=center>' + result + '</td><tr>'; 
	    html += '</table></td></tr></table>';
	    return html;
	}	
}

class ScoreTabOverview extends View {

	constructor(app) {
		super(app);
	}
	
	clear() {
		this.ui.scoreTab.html("");
	}
	
	init() {
		this.ui = {
			header:	$("#QB_ScoreOVHeader"),
			scoreTab: $("#QB_ScoreOVTable"),
			footer:	$("#QB_ScoreOVFooter"),			
		}
		this.ui.header.html("");
		this.ui.footer.html("");
		this.footerSpace = 36;
	}
	
	flipOC() {
		theULogger.log(1,'- scoreTab::flipOC');	
		theEngine.infoScore("flipOC","");
		this.doUpdate();		
	}
	
	doForget() {
		theULogger.log(1,'- scoreTab::doForget');	
		theEngine.infoScore("deleteLast","");
		this.doUpdate();
	}
	
	addButtons() {
		var html = "";
		if (this.isTeam) {
			if (this.haveThirdResult) {
				var nameOC = "O &lt;-&gt; C";
				if (this.haveflippedOC) nameOC = "C &lt;-&gt; O"; 
				html +=   "<button onclick='QB.playWin.scoreTab.scoreTabOverview.flipOC();'>"
					    + nameOC + "</button>";
			}		
		}
		if (   (this.isTeam || this.isRubber)
			&& this.nrLines > 0) {
			html +=   "<button onclick='QB.playWin.scoreTab.scoreTabOverview.doForget();'>"
					+ theLang.tr("IDS_DELETE").replace("&","") + "</button>";		
		}	
		var helpKey = "score-o-match-p";
		if (this.isTeam) {
			helpKey = "score-o-match-t";
			if (this.haveThirdResult) helpKey = "score-o-match-t3";		
		}
		if (this.isRubber) helpKey = "score-o-rubber";
		html +=   "<button onclick='QB.showHelpText(\"" + helpKey + "\");'" 
		        + " style='float:right;margin-right:8%;min-width:8%;'>" + theLang.tr("IDS_HELP").replace("&","") + "</button>";
	    this.ui.footer.html(html);
	}
	
	makeSpanned(iText,iClass) {
		// theULogger.log(1,'- makeSpanned iText:' + iText);	
		var modText = iText.toString();
		for (var suit of Suits.allDenominations) {		
			modText = modText.replace(RegExp("_"+suit.letter,"ig"),suit.html);
		}		
		var html = "<span class=" + iClass + ">" + modText + "</span>";
		return html;
	}
	
	fillRubberTable(response) {
		var html = "";
		if (!isPresent(response.nrHands)) return html;	
		var textClassNorm = "rubberTextNorm";
		var textClassLast = "rubberTextLast";
		var finished = isPresent(response.isComplete) && response.isComplete;
		var textClassFinished = finished ? textClassLast : textClassNorm;
		var textClass;
		if (isPresent(response.teamNames)) {
			var strFinished = finished ? theLang.tr("L_RUBBER_FINISHED") : " ";
			html +=   "<tr class=scoreRubberHead>"
					+ "<td class=scoreRubberHeadC1>" 
						+ this.makeSpanned(strFinished,textClassFinished) + "</td>"
					+ "<td class=scoreRubberHeadC2>" 
						+ this.makeSpanned(response.teamNames[0],textClassNorm) + "</td>"
					+ "<td class=scoreRubberHeadC3>" 
						+ this.makeSpanned(response.teamNames[1],textClassNorm) + "</td>"
					+ "<td class=scoreRubberHeadC4> </td>"
					+ "</tr>";
		}
		var column1 = "", column2 = "", column3 = "", column4 = "";
		var isFirst = true;
		for (var line of response.aboveLines) {	
			if (isPresent(line.NSexpl)) {
				if (!isFirst) column1 += "&nbsp;<br>";
				textClass = textClassNorm;
				if (isPresent(line.NSlast) && line.NSlast) textClass = textClassLast;
				column1 += this.makeSpanned(line.NSexpl,textClass);
			}
			if (isPresent(line.NSpoints)) {
				if (!isFirst) column2 += "&nbsp;<br>";
				textClass = textClassNorm;
				if (isPresent(line.NSlast) && line.NSlast) textClass = textClassLast;
				column2 += this.makeSpanned(line.NSpoints,textClass);
			}
			if (isPresent(line.EWpoints)) {
				if (!isFirst) column3 += "&nbsp;<br>";
				textClass = textClassNorm;	
				if (isPresent(line.EWlast) && line.EWlast) textClass = textClassLast;			
				column3 += this.makeSpanned(line.EWpoints,textClass);
			}				
			if (isPresent(line.EWexpl)) {
				if (!isFirst) column4 += "&nbsp;<br>";
				textClass = textClassNorm;	
				if (isPresent(line.EWlast) && line.EWlast) textClass = textClassLast;				
				column4 += this.makeSpanned(line.EWexpl,textClass);
			}					
			isFirst = false;
			this.nrLines++;			
		}
		if (column2 == "") column2 = "&nbsp;";
		if (column3 == "") column3 = "&nbsp;";
		html +=   "<tr class=scoreRubberAbove>"
				+ "<td class=scoreRubberAC1>" + column1 + "</td>"
				+ "<td class=scoreRubberAC2>" + column2 + "</td>"
				+ "<td class=scoreRubberAC3>" + column3 + "</td>"
				+ "<td class=scoreRubberAC4>" + column4 + "</td>"
				+ "</tr>";
		isFirst = true;	
		for (var rGame of response.belowGames) {
			column1 = "", column2 = "", column3 = "", column4 = "";
			var isFirst1 = true, isFirst2 = true; 
			for (var rEntry of rGame.entries) {
				if (rEntry.team == "NS") {
					if (!isFirst1) {
						column1 += "<br>";
						column2 += "<br>";
					}
					textClass = textClassNorm;
					if (rEntry.last) textClass = textClassLast;
					column1 += this.makeSpanned(rEntry.expl,textClass);
					column2 += this.makeSpanned(rEntry.points,textClass);	
					isFirst1 = false;
				}
				if (rEntry.team == "EW") {
					if (!isFirst2) {
						column3 += "<br>";
						column4 += "<br>";
					}	
					textClass = textClassNorm;
					if (rEntry.last) textClass = textClassLast;			
					column3 += this.makeSpanned(rEntry.points,textClass);					
					column4 += this.makeSpanned(rEntry.expl,textClass);	
					isFirst2 = false;
				}
			}
			this.nrLines++;
			if (isFirst) 
				html += "<tr class=scoreRubberBelow1>";
		    else
				html += "<tr class=scoreRubberBelow>";
			html +=   "<td class=scoreRubberBC1>" + column1 + "</td>"
					+ "<td class=scoreRubberBC2>" + column2 + "</td>"
					+ "<td class=scoreRubberBC3>" + column3 + "</td>"
					+ "<td class=scoreRubberBC4>" + column4 + "</td>"
					+ "</tr>";	
			isFirst = false;
		}
		if (isFirst) {
			/* no entries below, the table entry should be there regardless */
			html +=   "<tr class=scoreRubberBelow1>"
					+ "<td class=scoreRubberBC1> </td><td class=scoreRubberBC2>&nbsp;</td>"
					+ "<td class=scoreRubberBC3>&nbsp;</td><td class=scoreRubberBC4> </td>"
					+ "</tr>";			
		}
		if (isPresent(response.currentSum)) {
			html +=   "<tr class=scoreRubberSum>"
					+ "<td class=scoreRubberSumC1>" 
					    + theLang.tr("L_CURRENT") + ":" + "</td>"
					+ "<td class=scoreRubberSumC2>" 
					   + this.makeSpanned(response.currentSum[0],textClassNorm) + "</td>"
					+ "<td class=scoreRubberSumC3>" 
					   + this.makeSpanned(response.currentSum[1],textClassNorm) + "</td>";
			html += "<td class=scoreRubberSumC4>";
			if (isPresent(response.totalSum)) {	
				if (response.totalSum[0] + response.totalSum[1] > 0) {
					html += this.makeSpanned(   theLang.tr("L_TOTAL") 
											  + ": "  + response.totalSum[0].toString()
											  + " - " + response.totalSum[1].toString(),
											 textClassFinished);
				}
			}
			html += "</td></tr>";
		}
		return html;
	}
	
	fillMatchTable(response) {
	    var html = "";
		if (isPresent(response.matchEntries)) {	
			theULogger.log(1,'- ScoreTabOverView::fillMatchTable');
			var haveContract1, haveContract2;
			var contract1Str, contract2Str, result1Str, result2Str, imp1Str, imp2Str;
			var classTabNr1Str, classTabNr2Str;
			var clickContract1, clickContract2, clickResult1, clickResult2,
				clickImp1, clickImp2;

			if (isPresent(response.haveThirdResult)) {
				this.haveThirdResult = (response.haveThirdResult == 1);	
			    if (isPresent(response.haveFlippedOC))		
					this.haveflippedOC = (response.haveFlippedOC == 1);
			}
			
			if (isPresent(response.header)) {
			    html += "<tr class=scoreTabHead>"
						+ "<td class=scoreTabNr> </td>"
						+ "<td>" + response.header.contract[0] + "</td>"
						+ "<td>" + response.header.team[0] + "</td>"
						+ "<td>" + response.header.imps + "</td>"
						+ "<td class=scoreTabDealId>" + response.header.game + "</td>"
						+ "<td>" + response.header.contract[1] + "</td>"
						+ "<td>" + response.header.team[1] + "</td>"
						+ "<td>" + response.header.imps + "</td>"	
						+ "<td class=scoreTabNr> </td>"
						+ "</tr>";				
			}
			
			var lineNr = 0;
			for (var matchEntry of response.matchEntries) {
				// theULogger.log(1,'- matchEntry');				
				if (isPresent(matchEntry.contract)) {
					haveContract1 = matchEntry.contract.length >= 1;
					haveContract2 = matchEntry.contract.length >= 2;					
				}
			    contract1Str = ""; contract2Str = "";
				result1Str = ""; result2Str = "";
				imp1Str = ""; imp2Str = "";	
				clickContract1 = ""; clickContract2 = "";
				clickResult1 = ""; clickResult2 = "";
				clickImp1 = ""; clickImp2 = "";
				classTabNr1Str = "scoreTabNr"; classTabNr2Str = "scoreTabNr";
				if (haveContract1) {
					contract1Str = matchEntry.contract[0];
					for (var suit of Suits.allDenominations) {
						contract1Str = contract1Str.replace(RegExp("_"+suit.letter,"ig"),suit.html);
					}
					if (contract1Str.length > 0) {
					    clickContract1 = " onclick='QB.playWin.scoreTab.scoreTabDetails1.getContract1(" + lineNr.toString() + ")'";
					    result1Str = matchEntry.result[0];
					    clickResult1 = clickContract1;	
					}
					if (isPresent(matchEntry.Imps)) {
					    if (this.isPair) {
							imp1Str =   matchEntry.Imps[0].toString() + "/" 
									  + (2 * matchEntry.nrCompares[0]).toString() + " = "
								      + matchEntry.ranking[0].toString() + "." ;
							clickImp1 = " onclick='QB.playWin.scoreTab.scoreTabDetails2.getTables("
												  + lineNr.toString() + ")'";
						}
						if (this.isTeam) {
							imp1Str =   matchEntry.Imps[0].toString();
							clickImp1 = clickContract1;
						}
						if (contract1Str.length == 0) imp1Str = "";
						// clickImp1 remains 
					}
					if (matchEntry.currnumber[0] == response.lastNumber)
						classTabNr1Str = "scoreTabCurrNr";
				}
				if (haveContract2) {
					contract2Str = matchEntry.contract[1];
					for (var suit of Suits.allDenominations) {
						contract2Str = contract2Str.replace(RegExp("_"+suit.letter,"ig"),suit.html);
					}
					if (contract2Str.length > 0) {
					    clickContract2 = " onclick='QB.playWin.scoreTab.scoreTabDetails2.getContract2(" + lineNr.toString() + ")'";					
					    result2Str = matchEntry.result[1];
					    clickResult2 = clickContract2;
					}
					if (isPresent(matchEntry.Imps)) {
					    if (this.isPair) {
							imp2Str =   matchEntry.Imps[1].toString() + "/" 
									  + (2 * matchEntry.nrCompares[1]).toString() + " = "
									  + matchEntry.ranking[1].toString() + "." ;
							clickImp2 = " onclick='QB.playWin.scoreTab.scoreTabDetails2.getTables("
												  + lineNr.toString() + ")'";
									  
						}
						if (this.isTeam) {
						    imp2Str =   matchEntry.Imps[1].toString();
							clickImp2 = clickContract2;
						}
						if (contract2Str.length == 0) imp2Str = "";
					}
					if (matchEntry.currnumber[1] == response.lastNumber)
						classTabNr2Str = "scoreTabCurrNr";
				}
				if (imp1Str == "0" && imp2Str == "0") {
				    imp1Str = "-"; imp2Str = "-";
				}
				if (this.isTeam)	{
					if (result1Str == "") {
						// suppress second row if first is empty
						contract2Str = "";
						result2Str = "";
						imp2Str = "";
					}
				}
				html += "<tr>"
						+ "<td class=" + classTabNr1Str + ">" + (matchEntry.nr + 1) + "</td>"
						+ "<td" + clickContract1 + ">" + contract1Str + "</td>"
						+ "<td" + clickResult1   + ">" + result1Str + "</td>"
						+ "<td" + clickImp1      + ">" + imp1Str + "</td>"	
						+ "<td class=scoreTabDealId>" + matchEntry.dealId + "</td>"
						+ "<td" + clickContract2 + ">" + contract2Str + "</td>"
						+ "<td" + clickResult2   + ">" + result2Str + "</td>"
						+ "<td" + clickImp2      + ">" + imp2Str + "</td>"	
						+ "<td class=" + classTabNr2Str + ">" + (matchEntry.nr + 1) + "</td>"
						+ "</tr>";
				lineNr++;
			}
			if (isPresent(response.summary)) {
				var clickSum1 = "";
				var clickSum2 = "";			
				if (this.isPair) {
					clickSum1 = " onclick='QB.playWin.scoreTab.scoreTabDetails2.getAllPlayers()'";	
					clickSum2 = clickSum1;
				}
			    html += "<tr id=OVScoreTabSum class=scoreTabSum>"
						+ "<td class=scoreTabNr> </td>"
						+ "<td colspan=3" + clickSum1 + ">" + response.summary.result1 + "</td>"
						+ "<td class=scoreTabDealId>" + response.summary.nr_compares + "</td>"
						+ "<td colspan=3" + clickSum2 + ">" + response.summary.result2 + "</td>"
						+ "<td class=scoreTabNr> </td>"
						+ "</tr>";				
			}			
		}
		this.nrLines = lineNr;
		return html;
	}
	
	doUpdate() {
		if (QB.debugJSI > 0) theULogger.log(0,"===Info===> scoreTab");	
		var response = theEngine.infoScore("scoreTab","");
		this.isPair = false;
		this.isTeam = false;
		this.isRubber = false;
		this.haveThirdResult = false;
		this.haveflippedOC = false;	
		this.nrLines = 0;
		if (QB.debugJSO > 0) {
			theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
		}
		if (isPresent(response.scoring)) {
		    if (response.scoring == "MP") this.isPair = true;
		    if (response.scoring == "IMP") this.isTeam = true;	
		    if (response.scoring == "Rubber") this.isRubber = true;			
		}
		var html = "";
		this.ui.scoreTab.css({"display": "inline-block",
							  "border-collapse": "collapse",		
							  "margin": "5px",	
							  "max-height": this.tableHeight.toString()+"px",					  
							  "overflow-y": "scroll"
							 });	
		if (this.isRubber) 
			html = this.fillRubberTable(response);
		else
			html = this.fillMatchTable(response);
		if (html == "") {
			if (this.isRubber)
				this.ui.header.html(theLang.tr("L_NO_CURRENT_RUBBER"));			
			else
				this.ui.header.html(theLang.tr("L_NO_RESULTS"));
			this.ui.header.show();
			this.ui.scoreTab.hide();
			this.ui.footer.html("");
		}
		else {
			this.ui.header.hide();
			this.ui.scoreTab.html(html);
			this.ui.scoreTab.show();
			this.addButtons();
			if (!this.isRubber && this.nrLines > 5) {
			    setTimeout(function() {
				    QB.playWin.scoreTab.scoreTabOverview.runScrollIntoView();
			    },600);	
			}
		}
	}
	
	runScrollIntoView() {
		theULogger.log(1,'- scoreTab::runSrollIntoView');
		var lastTableRow = document.getElementById("OVScoreTabSum");
		if (lastTableRow == null) {
			theULogger.log(1,'- lastTableRow == null');	
		}
		else {
			lastTableRow.scrollIntoView();	
		}
	}	

	onTabBefore() {	
		QB.playWin.scoreTab.selectedId = "ScoreTabOverview";
		var wW = QB.playWin.PWwidth;  
		var hW = QB.playWin.PWheight;
		var bT = hW - this.footerSpace;
		this.SWwidth  = Math.floor($("#PlayAreaScore").width());
		this.SWheight = Math.floor($("#PlayAreaScore").height());
		theULogger.log(1,'- ScoreTabOverView::onTabBefore -'
						 + ' w:' + this.SWwidth + ' h:' + this.SWheight); 
		this.tableHeight = this.SWheight - this.footerSpace - 80;
		this.ui.footer.css({left:0,top:bT,width:wW,height:this.footerSpace});		
		
		this.doUpdate();
	}
	
	onChanged(what) {
		// receive results from the Model
		theULogger.log(1,'- ScoreTabOverview::onChanged ' + what.type);
	}
}

class ScoreTabDetails1 extends View {

	constructor(app) {
		super(app);
	}
	
	clear() {
		this.ui.main.html("<p>" + theLang.tr("filledByTable"));
	}	
	
	init() {
		this.ui = {
			main: $("#ScoreViewDetails1"),
		}
		this.clear();
	}
	
	getContract1(entryNr) {
		theULogger.log(1,'- ScoreTabDetails1::getContract1 ' + entryNr);
		if (QB.debugJSI > 0) theULogger.log(0,"===Info===> scoreEntryProt1");	
		var response = theEngine.infoScore("scoreEntryProt1",entryNr.toString());
		if (QB.debugJSO > 0) {
			theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
		}
		var html = "";
		if (isPresent(response.deal)) html = QB.playWin.scoreTab.scoreDeal2Html(response.deal);
		this.ui.main.html(html);
		var hP = QB.playWin.PWheight;	
		var hT = Math.floor(hP * 0.80);	
		this.ui.main.css({"height":hT.toString()+"px", "overflow-y":"auto"});			
		$("#PlayViewScore").easytabs("select","#ScoreTabDetails1");
	}

	onTabBefore() {	
		theULogger.log(1,'- ScoreTabDetails1::onTabBefore')	
		QB.playWin.scoreTab.selectedId = "ScoreTabDetails1";
	}
	
	onChanged(what) {
		// receive results from the Model
		// theULogger.log(1,'- ScoreTabDetails1::onChanged ' + what.type);	
    }	
}

class ScoreTabDetails2 extends View {

	constructor(app) {
		super(app);
	}
	
	clear() {
		this.ui.main.html("<p>" + theLang.tr("filledByTable"));
	}
	
	init() {
		this.ui = {
			main: $("#ScoreViewDetails2"),
		}
		this.clear();
	}
	
	getContract2(entryNr) {
		theULogger.log(1,'- ScoreTabDetails2::getContract2 ' + entryNr);	
		if (QB.debugJSI > 0) theULogger.log(0,"===Info===> scoreEntryProt2");	
		var response = theEngine.infoScore("scoreEntryProt2",entryNr.toString());
		if (QB.debugJSO > 0) {
			theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
		}	
		var html = "";
		if (isPresent(response.deal)) html = QB.playWin.scoreTab.scoreDeal2Html(response.deal);		
		this.ui.main.html(html);
		var hP = QB.playWin.PWheight;	
		var hT = Math.floor(hP * 0.85);	
		this.ui.main.css({"height":hT.toString()+"px", "overflow-y":"auto"});		
		$("#PlayViewScore").easytabs("select","#ScoreTabDetails2");
	}	

	getTables(entryNr) {
		theULogger.log(1,'- ScoreTabDetails2::getTables ' + entryNr);
		if (QB.debugJSI > 0) theULogger.log(0,"===Info===> scoreEntryPairs");	
		var response = theEngine.infoScore("scoreEntryPairs",entryNr.toString());
		if (QB.debugJSO > 0) {
			theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
		}	
		var html = "<center><p>" + theLang.tr("ScorePairResults") + " : ";
		if (isPresent(response.dealId)) html += response.dealId;
		else html += theLang.tr("L_DEAL") + " ?";
		if (isPresent(response.pairEntries)) {	
		    var hP = QB.playWin.PWheight;	
			var hT = Math.floor(hP * 0.75);	
			html += "<p><table id=QB_ScorePairResults style='height:" + hT.toString() + "px;"
				    + "display:inline-block;border-collapse:collapse;margin:5px;overflow-y:scroll;'"
				    + ">\n";
			if (isPresent(response.header)) {
				html +=   "<tr class=scoreTabHead>"
						+ "<td>" + response.header.players + "</td>"
						+ "<td>" + response.header.contract + "</td>"
						+ "<td>" + response.header.team + "</td>"
						+ "<td>" + response.header.mps + "</td>"	
						+ "</tr>";					
			}
			for (var pairEntry of response.pairEntries) {
				html +=   "<tr>"
						+ "<td>" + pairEntry.players + "</td>"
						+ "<td>" + pairEntry.contract + "</td>"
						+ "<td>" + pairEntry.result + "</td>"
						+ "<td>" + pairEntry.mps + "</td>"					
						+ "</tr>";		
			}	
			html += "</table>";	
		}
		else {
			html += "missing !?";		
		}
		html += "</center>";
		this.ui.main.html(html);
		$("#PlayViewScore").easytabs("select","#ScoreTabDetails2");
	}	
	
	getAllPlayers() {
		theULogger.log(1,'- ScoreTabDetails2::getAllPlayers');	
		if (QB.debugJSI > 0) theULogger.log(0,"===Info===> scoreSumPairs");	
		var response = theEngine.infoScore("scoreSumPairs","");
		if (QB.debugJSO > 0) {
			theULogger.log(0,htmlEscape(JSON.stringify(response,null,2)));
		}
		var html = "<center><p>" + theLang.tr("ScorePairResults") + " : " + theLang.tr("L_SUM");
		var trClass;
		if (isPresent(response.pairEntries)) {	
		    var hP = QB.playWin.PWheight;	
			var hT = Math.floor(hP * 0.70);	
			html += "<p><table id=QB_ScorePairSums style='height:" + hT.toString() + "px;"
				    + "display:inline-block;border-collapse:collapse;margin:5px;overflow-y:scroll;'"
				    + ">\n";
			if (isPresent(response.header)) {
				html +=   "<tr class=scoreTabHead>"
						+ "<td>" + response.header.pair + "</td>"
						+ "<td>" + response.header.totalMPs + "</td>"
						+ "<td> </td>"
						+ "</tr>";					
			}
			for (var pairEntry of response.pairEntries) {
				trClass = "";
				if (pairEntry.current > 0) trClass = " class=scoreCurrent";
				html +=   "<tr" + trClass + ">"
						+ "<td>" + pairEntry.pair + "</td>"
						+ "<td>" + pairEntry.mps + "</td>"
						+ "<td>" + pairEntry.percent + "</td>"					
						+ "</tr>";		
			}	
			html += "</table>";	
		}
		else {
			html += "missing !?";		
		}
		html += "</center>";
		this.ui.main.html(html);				
		$("#PlayViewScore").easytabs("select","#ScoreTabDetails2");
	}	

	onTabBefore() {	
		theULogger.log(1,'- ScoreTabDetails2::onTabBefore')	
		QB.playWin.scoreTab.selectedId = "ScoreTabDetails2";
	}	
	
	onChanged(what) {
		// receive results from the Model
		// theULogger.log(1,'- ScoreTabDetails2::onChanged ' + what.type);	
    }
}

