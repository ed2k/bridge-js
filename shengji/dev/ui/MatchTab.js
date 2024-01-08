
class MatchTab extends View {
	
	// could be extended to show the result of a complete match (16 games)

	constructor(app) {
		super(app);
	}
	
	init() {
		// symbols for translation
		theLang.add({
			PlayTabMatch: {
				en: "Match",
				de: "Match",
				fr: "Match",
				it: "Partita",
				es: "Partido",
				dk: "Kamp",	
			},
		});
		
		this.ui = {
			main: $("#PlayViewMatch"),
		}
	}
	
	initMatchConfig()
	{
		var matchConfig = theMemory.retrieveMatchConfig();
		if (matchConfig == null || matchConfig == "") {
			matchConfig =   'general.deal_number = 0.0\n'
						  + 'general.deal_pair = 0."WROC22M.PBN"\n'
					      + 'general.deal_team = 0."MARRAK2023.PBN"\n'
						  + 'general.deal_source = "F P 0 WROC22M.PBN"\n'
						  + 'general.scoring = Pair\n'
						  + 'general.comparison = File.24';
		}
	    var rc = theEngine.loadMatchConfig(matchConfig);
		theULogger.log(0, "loadMatchConfig - rc: " + rc);
	}

    doPreviousDealNumber()
	{
		theULogger.log(1,"- matchTab:doPreviousDealNumber");
		var newMatchConfig =    'general.deal_number = ' + this.matchConfig.deal_number_major 
													  + '.' + this.matchConfig.deal_number_minor + '\n'
						      + 'general.deal_source = "N ' + this.matchConfig.deal_number_minor 
													     + ' ' + this.matchConfig.deal_number_major + '"\n'
							  + 'general.scoring = IMP\n';
		theULogger.log(1, "newMatchConfig: " + newMatchConfig);
	    var rc = theEngine.loadMatchConfig(newMatchConfig);
		theULogger.log(1, "loadMatchConfig - rc: " + rc);
		var storeMatchConfig = theEngine.getMatchConfig(false);	
		theULogger.log(1, "gotMatchConfig: " + storeMatchConfig);
		theMemory.storeMatchConfig(storeMatchConfig);
		QB.playWin.selectTab("Table");
	    QBM.dealControl.request("IDS_CONTINUE");
	}
    doPreviousPairTourn()
	{
		theULogger.log(1,"- matchTab:doPreviousPairTourn");
        var updateMatchConfig =  'general.deal_source = "F P ' 
								+ this.matchConfig.deal_pair_nr + ' ' 
								+ this.matchConfig.deal_pair_name + '"\n';
		theULogger.log(1, "updateMatchConfig: " + updateMatchConfig);	
	    var rc = theEngine.loadMatchConfig(updateMatchConfig);
		theULogger.log(1, "loadMatchConfig - rc: " + rc);	
		var storeMatchConfig = theEngine.getMatchConfig(false);
		theULogger.log(1, "newMatchConfig: " + storeMatchConfig);
		theMemory.storeMatchConfig(storeMatchConfig);
		QB.playWin.selectTab("Table");
	    QBM.dealControl.request("IDS_CONTINUE");
	}
    doPreviousTeamTourn()
	{
		theULogger.log(1,"- matchTab:doPreviousTeamTourn");
        var updateMatchConfig =  'general.deal_source = "F T ' 
								+ this.matchConfig.deal_team_nr + ' ' 
								+ this.matchConfig.deal_team_name + '"\n';
		theULogger.log(1, "updateMatchConfig: " + updateMatchConfig);
	    var rc = theEngine.loadMatchConfig(updateMatchConfig);
		theULogger.log(1, "loadMatchConfig - rc: " + rc);
		var storeMatchConfig = theEngine.getMatchConfig(false);
		theULogger.log(1, "newMatchConfig: " + storeMatchConfig);
		theMemory.storeMatchConfig(storeMatchConfig);
		QB.playWin.selectTab("Table");
	    QBM.dealControl.request("IDS_CONTINUE");
	}
    doPreviousDealFile()
	{
		theULogger.log(1,"- matchTab:doPreviousDealFile");
	}
    doOk()
	{
		var newMajor = $('#major_number').val();
		var newMinor = $('#minor_number').val();
		var newScoring = "Team";
		if ($("#isScoringRubber").is(':checked')) newScoring = "Rubber";
		if ($("#isScoringPair").is(':checked')) newScoring = "Pair";
		theULogger.log(1,"- matchTab:doOk - newMajor:" + newMajor 
					      + " newMinor:" + newMinor + " newScoring:" + newScoring);
		var matchConfig =    'general.deal_number = ' + newMajor + '.' + newMinor + '\n'
						   + 'general.deal_source = "N ' + newMinor + ' ' + newMajor + '"\n'
						   + 'general.scoring = ' + newScoring + '\n';
		theULogger.log(1, "newMatchConfig: " + matchConfig);
	    var rc = theEngine.loadMatchConfig(matchConfig);
		theULogger.log(1, "loadMatchConfig - rc: " + rc);
		var storeMatchConfig = theEngine.getMatchConfig(false);
		theULogger.log(1, "gotMatchConfig: " + storeMatchConfig);
		theMemory.storeMatchConfig(storeMatchConfig);
		QB.playWin.selectTab("Table");
	    QBM.dealControl.request("IDS_CONTINUE");
	}
    doHelp()
	{
		theULogger.log(1,"- matchTab:doHelp");
		var helpKey = "match-control-o";
		if (!QB.isFullMode) helpKey = "match-control-od";
		QB.showHelpText(helpKey);			
	}
	
	onTabBefore() {
		this.matchConfig = theEngine.getMatchConfig(true);
		theULogger.log(1,"- matchConfig" + JSON.stringify(this.matchConfig,null,2));
	    var width250 = " style='width:250px;'";
		var width100 = " style='width:100px;'";	
		
		var dealSourceKey = this.matchConfig.deal_source.slice(0,1);
		var dealSourceText = this.matchConfig.deal_source_text;
		for (var word of ["IDS_OWN_DEAL_FILE", "IDS_IMPORTED_FILE", 
						  "IDS_PAIR_TOURN", "IDS_TEAM_TOURN",
						  "IDS_DEAL_NUMBER", "IDS_DEAL_SELF_ENTERED"] ) {
	        dealSourceText = dealSourceText.replace(word,theLang.tr(word));
		}

		var previousDealNumberDisabled = "";
		if (dealSourceKey == "N") previousDealNumberDisabled = "disabled";
		var previousPairTournDisabled = "";
		var previousTeamTournDisabled = "";
		if (dealSourceKey == "F") {
			var dealFileType = this.matchConfig.deal_source.slice(2,3);
			if (dealFileType == "P") previousPairTournDisabled = "disabled";
			if (dealFileType == "T") previousTeamTournDisabled = "disabled";
		}
		var previousDealFileDisabled = "disabled";
		
	    var html = "<p>"; 
		html += "<div id=currentDealSource style='border:1px dotted grey; padding:8px;'>"
			    + theLang.tr("L_CURRENT") + " : " + dealSourceText + "</div>";
		html += "<table><tr><td style='border:1px dotted grey; padding:8px;'>"
			  + "<button " + previousDealNumberDisabled
			    + " onclick='QB.playWin.matchTab.doPreviousDealNumber();'"
			    + width250 + ">" + theLang.tr("IDS_PREVIOUS_DEAL_NUMBER") + "</button>"
			  + "<br><button " + previousPairTournDisabled
			    + " onclick='QB.playWin.matchTab.doPreviousPairTourn();'"
			    + width250 + ">" + theLang.tr("IDS_PREVIOUS_PAIR_TOURN") + " </button>"	
		      + "<br><button " + previousTeamTournDisabled
				+ " onclick='QB.playWin.matchTab.doPreviousTeamTourn();'"
			    + width250 + ">" + theLang.tr("IDS_PREVIOUS_TEAM_TOURN") + " </button>"	
		      + "<br><button " + previousDealFileDisabled
				+ " onclick='QB.playWin.matchTab.doPreviousDealFile();'"
			    + width250 + ">" + theLang.tr("IDS_PREVIOUS_OWN_DEALS") + " </button>"
			  + "</td>";
	    var isRubberChecked = "";
	    var isTeamChecked = "checked";
	    var isPairChecked = "";	
		if (isPresent(this.matchConfig.scoring)) {
		    if (this.matchConfig.scoring == "Rubber") {
	            isTeamChecked = "";
	            isRubberChecked = "checked";
		    }		
		    if (this.matchConfig.scoring == "MP") {
	            isTeamChecked = "";
	            isPairChecked = "checked";	
			}
		}
		var majorVal = "---";
		var minorVal = "---";
		if (dealSourceKey == "N") {
		    majorVal = this.matchConfig.deal_number_major;
			minorVal = this.matchConfig.deal_number_minor;
		}
		var htmlScoring = "<p><table style='border:1px dotted grey;'><tr style='margin:8px;'><td style='padding:4px;'>" 
					+ theLang.tr("IDS_SCORING_METHOD") + ": </td>";
		htmlScoring += "<td><input id='isScoringRubber' type='radio' name='scoringMethod' "
				     + isRubberChecked + ">" + theLang.tr("L_RUBBER") + "</input></td></tr>"
					 + "<tr style='margin-bottom:10px;'><td><input id='isScoringTeam' type='radio' name='scoringMethod' "
					 + isTeamChecked + ">" + theLang.tr("L_TEAM") + "</input></td>"
				     + "<td><input id='isScoringPair' type='radio' name='scoringMethod' "
					 + isPairChecked + ">" + theLang.tr("L_PAIR") + "</input></td></tr>"
					 + "</table>";		  
		html +=	"<td style='border:1px dotted grey; padding:16px;'>"
			  + "<table cellspacing=2 cellpadding=2><tr>"
			    + "<td>" + theLang.tr("IDS_DEAL_NUMBER") + ": </td>"
			    + "<td>" + theLang.tr("IDS_NUMBER_MAJOR") 
					     + "<br>" 
						 + theLang.tr("IDS_NUMBER_MINOR")
			    + "</td><td>"
					     + "<input type='text' id='major_number' value=" + majorVal + " style='width:80px;'>"
					     + "<br>" 
						 + "<input type='text' id='minor_number' value=" + minorVal + " style='width:80px;'>"
			  + "</td></tr></table>"
			  + htmlScoring
			  + "<p><center>"
			  + "<button onclick='QB.playWin.matchTab.doOk();'"
			  + width100 + ">" + theLang.tr("L_OK") + " </button>"
			  + " <button onclick='QB.playWin.matchTab.doHelp();'"
			  + width100 + ">" + theLang.tr("IDS_HELP",/&/g) + " </button>"
			  + "</center></p>"
			  + "</td>";
		html += "</tr></table>";
			  
		this.ui.main.html(html);
	}

	onChanged(what) {
	}

}


