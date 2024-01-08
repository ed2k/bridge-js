
class ActionsTab extends View {
	
	constructor(app) {
		super(app);
	}

	openRepeatDialog() {
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left' + ' top+' + QB.playWin.PWheight / 3 },
			width: 300,
			title: theLang.tr("IDS_REPEAT_L",/&/g),
			buttons:[
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},
				/*
				{
					text: theLang.tr("IDS_HELP",/&/g),
					click: function() {
						QB.showHelpText("xxx");
					}
				},	
				*/
			],
		});
		var disabled = "";
		var buttonStyle1 = "style='padding:5px;margin:5px;font-weight:600;'";
		var buttonStyle2 = "style='padding:5px;margin:5px;margin-bottom:10px;font-weight:600;'";		
		var html = "<p style='font-size:110%;'><center>";
		if (QBM.game.state == "none" || QBM.game.state == "clean" || QBM.game.state == "dealt") disabled = "disabled";		
		html +=   "<button " + disabled + " onclick='QB.playWin.actionsTab.doRepeatDeal(\"U\");' "
				+ buttonStyle1 + ">"
				+ theLang.tr("IDS_REPEAT_DEAL",/&/g) + " " 
				+ theLang.tr("IDS_REPEAT_BY_USER") + "</button>";	
		html +=   "<br><button " + disabled + " onclick='QB.playWin.actionsTab.doRepeatDeal(\"C\");' "
				+ buttonStyle2 + ">"
				+ theLang.tr("IDS_REPEAT_DEAL",/&/g) + " " 
				+ theLang.tr("IDS_REPEAT_BY_COMPUTER") + "</button>";
		html += "<br>" + theLang.tr("IDS_REPEAT_DEAL",/&/g) + " = " 
					   + theLang.tr("IDS_REPEAT_WITH_AUCTION"); 
		if (QBM.game.state == "bidding" || QBM.game.state == "biddingFinished") disabled = "disabled";					   
		html +=   "<br>&nbsp;<br><button " + disabled + " onclick='QB.playWin.actionsTab.doRepeatPlay(\"U\");' "
				+ buttonStyle1 + ">"
				+ theLang.tr("IDS_REPEAT_PLAY",/&/g) + " " 
				+ theLang.tr("IDS_REPEAT_BY_USER") + "</button>";	
		html +=   "<br><button " + disabled + " onclick='QB.playWin.actionsTab.doRepeatPlay(\"C\");' "
				+ buttonStyle2 + ">"
				+ theLang.tr("IDS_REPEAT_PLAY",/&/g) + " " 
				+ theLang.tr("IDS_REPEAT_BY_COMPUTER") + "</button>";
		html += "<br>" + theLang.tr("IDS_REPEAT_PLAY",/&/g) + " = " 
					   + theLang.tr("IDS_REPEAT_SAME_AUCTION"); 				
		html += "</center></p>";
		$("#QGeneralDialog").html(html);	
	}
	
	doNextDeal() {
		if (QB.product.type=="tut")	
			QBM.tutorial.request("IDS_NEXT_DEAL");
		if (QB.product.type=="play")	
			QBM.dealControl.request("IDS_NEXT_DEAL");		
	}
	doPrevDeal() {
		if (QB.product.type=="tut")		
			QBM.tutorial.request("IDS_PREV_DEAL");	
		if (QB.product.type=="play")	
			QBM.dealControl.request("IDS_PREV_DEAL");					
	}
	doRepeatDeal(byWhom) {
		if (QB.product.type=="tut")	
			QBM.tutorial.request("IDS_REPEAT_DEAL");
		if (QB.product.type=="play") {	
			$("#QGeneralDialog").dialog("close");
			QBM.dealControl.request("IDS_REPEAT_DEAL",byWhom);	
			QB.playWin.selectTab("Table");				
		}
	}
	doRepeatPlay(byWhom) {	
		QB.playWin.tableTab.collectTrick();	
		if (QB.product.type=="tut")
			QBM.tutorial.request("IDS_REPEAT_PLAY");
		if (QB.product.type=="play") {
			$("#QGeneralDialog").dialog("close");		
			QBM.dealControl.request("IDS_REPEAT_PLAY",byWhom);
		}
		QB.playWin.tableTab.refresh();		
		QB.playWin.selectTab("Table");	
	}
	doOpenAll() {
		Players.toggleAllVisible(false);	
		QB.playWin.selectTab("Table");	
	}
	
	init() {
		// symbols for translation

		theLang.add({			
			PlayTabActions: {
				en: "Actions",
				de: "Aktionen",	
				fr: "Actions",	
				it: "Azioni",
				es: "Acciones",
				dk: "Handlinger",			
			},
		});

		this.ui = {
			main: 	$("#PlayViewActions"),
		}
		this.ui.main.html("<h4>Actions Tab</h4>");
	}

	onTabBefore() {
		theULogger.log(1,"- actionsTab:onTabBefore");
		var plusOrMinus = "+";
		var disabled = "";
		if (Players.getAllVisible()) plusOrMinus = "-";
		var html = "<p>" + "<button onclick='QB.playWin.actionsTab.doNextDeal();'>"
					     + theLang.tr("IDS_NEXT_DEAL",/&/g) + "</button>"
						 + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						 + "<button onclick='QB.playWin.actionsTab.doOpenAll();'>"
					     + theLang.tr("IDS_OPEN_ALL",/&/g) + " " + plusOrMinus + "</button>"
						 + "<p>" + "<button onclick='QB.playWin.actionsTab.doPrevDeal();'>"
					     + theLang.tr("IDS_PREV_DEAL",/&/g) + "</button>";
		if (QBM.game.state == "clean" || QBM.game.state == "dealt") disabled = "disabled";
		if (QB.product.type=="play") {	
			html += "<p>" + "<button " + disabled + " onclick='QB.playWin.actionsTab.openRepeatDialog();'>"
						  + theLang.tr("IDS_REPEAT_DEAL",/&/g) + "</button>";
		}
		if (QB.product.type=="tut")	{
			html += "<p>" + "<button " + disabled + " onclick='QB.playWin.actionsTab.doRepeatDeal();'>"
						  + theLang.tr("IDS_REPEAT_DEAL",/&/g) + "</button>";		
		    if (QBM.game.state == "bidding" || QBM.game.state == "biddingFinished") disabled = "disabled";					  
		    html += "<p>" +	"<button " + disabled + " onclick='QB.playWin.actionsTab.doRepeatPlay();'>"
					      + theLang.tr("IDS_REPEAT_PLAY",/&/g) + "</button>";
		}
		this.ui.main.html(html);
	}

	onChanged(what) {
		// receive results from the Model
		// theULogger.log(1,"- actionsTab:onChanged " + what.type);		
	}
}

