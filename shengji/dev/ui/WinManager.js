
"use strict";

class WinManager {

	// Windows Manager

	constructor() {
		theLang.add({
			// windows

			AudioWin: {
				en: "Audio",
			},
			LogWin: {
				en: "Program log",
				de: "Programm-Log",
				fr: "Journal du prog.",
				it: "Registro del prog.",
				es: "Registro del prog.",
				dk: "Program logfil",
			},
			ConfirmWin: {
				en: "Message",
				de: "Meldung",
				fr: "Message",
				it: "Messaggio",
				es: "Mensaje",	
				dk: "Besked",			
			},
			ClaimWin: {
				en: "CLAIM TRICKS",
			},
			EndPlayWin: {
				en: "END OF PLAY",
			},
			Licence: {
				en: "Activation",
				de: "Aktivierung",
			},
			LoadConfig: {
				en: "Restore the configuration",
				de: "Konfiguration wiederherstellen",
				fr: "Restaurer la configuration",				
			},			
		});

		this.lastToggledDialogId = "";
		this.isVertical = false;
		this.loginWinHeight = 1000; // will be overwritten
		this.loginWinWidth = 1000;		
	}

	start(startWin,skipLogin) {

		// set unloadHandler
		window.onbeforeunload = function() {
			QB.winManager.onClose();
			return null;
		}

		// set browser window resize end handler
		$(window).on('resize', function(evt) {
			if (evt.target instanceof Window) {
				if (isPresent(QB.winManager.browserResizeEndTimer)) clearTimeout(QB.winManager.browserResizeEndTimer);
				QB.winManager.browserResizeEndTimer=setTimeout(function() {
					delete QB.winManager.browserResizeEndTimer;
					QB.winManager.arrangeDialogs();
				},150);
			}
		});

		// EditWin
		this.defineDialog("Edit", { state: (QB.mode=="expert") ? "normal" : "closed" });

		// PlayWin
		this.defineDialogWithTabs('Play', { state: "closed", closable: false });

		// Make sure that BidBoxWin always stays on top of PLayWin
		$("#PlayWin").dialog({
			focus:function (event,ui) {
				if ($("#BidBoxWin").dialog("isOpen") && (!["biddingFinished","playing","finished"].includes(QBM.game.state))) {
					// when PlayWin gets focus: swap z-index of the two dialogs
					var zIndexBidBoxWin = $("#BidBoxWin").parent().css("z-index");
					var zIndexPlayWin 	= $("#PlayWin").parent().css("z-index");
					$("#BidBoxWin").parent().css("z-index",zIndexPlayWin);
					$("#PlayWin").parent().css("z-index",zIndexBidBoxWin);
				}
				else {
					QB.bidBox.resize();
				}
			}
		});

		// BidBoxWin
		this.defineDialog('BidBox', { state: "closed", closable: false });

		// ExplainWin
		if (QB.product.type=="tut")
			this.defineDialog("Explain", { state: "closed", closable: false });
		else
			this.defineDialog("ExplainP", { state: "closed", closable: true });

		// ConfirmWin (modal dialog)
		this.defineDialog("Confirm", { state: "closed" });
		$("#ConfirmWin").dialog({
			// title: theLang.tr("m_Hint"),
			// resizable: false,
			height: "auto",
			width: "auto",
			modal: true,
		});

		// ClaimWin (modal dialog)
		this.defineDialog("Claim", { state: "closed" });
		$("#ClaimWin").dialog({ modal: true, buttons:[
			{ text:"ok",	click: function() { QB.winManager.closeDialog("ClaimWin"); } }
		]});

		if (QB.product.type=="tut") {
		   // EndPlayWin (modal dialog)
		   this.defineDialog("EndPlay", { state: "closed" });
		   $("#EndPlayWin").dialog({ modal: true, buttons:[
			   { text:"ok",	click: function() { QB.winManager.closeDialog("EndPlayWin"); } }
		   ]});
		}

		// SettingsWin
		this.defineDialog("Settings", { state: "closed" });

		// HelpWin
		this.defineDialogWithTabs("Help", { state: "closed" });

		// AudioWin
		this.defineDialog("Audio", { state: "closed" });
		$(".QB #audioPlayer").audioPlayer();

		// LogWin
		this.defineDialog("Log", { state: "closed" });
	    // ProtocolWin
		this.defineDialog("Protocol", { state: "closed" });		

		this.loginWinHeight = 400;
		this.loginWinWidth = 700;
		if (QB.product.type=="play") {
			this.loginWinHeight = 420;
			this.loginWinWidth = 680;	
		}
		// LoginWin --- is open at startup
		this.defineDialog('Login', {
			    position:	{ my:"center", at:"center", of:window },
			    height:		this.loginWinHeight,
			    width:		this.loginWinWidth,
			    closable:	false,	
		 });	
		// LicenceWin
		this.defineDialog("Licence", { state: "closed" });
		// LoadConfigWin
		this.defineDialog("LoadConfig", { state: "closed" });		

		setTimeout(function() {
			QB.winManager.arrangeDialogs();
			if (skipLogin) QB.winManager.closeDialog("LoginWin");
		},500);

		// during startup the Play Tabs were hidden
		$(".PlayView").show();
		if (QB.product.type!="tut") {
		    $("#PlayViewDeals").easytabs();
		    $(".DealView").show();
		    $("#PlayViewScore").easytabs();	
			$(".ScoreView").show();		
		}

		if (startWin=="deals") this.extensions.doMenu("m_DealFinder");
	}

	arrangeDialogs(targetTab) {
		// arrange the dialogs according to available screen sizes
		// in expert mode and landscape orientation we add a window which shows the tutorial source code
		var width		= Math.floor($(window).width()  - 6);
		var height		= Math.floor($(window).height() - 6);
		var vertical	= height>width;
		this.isVertical	= vertical;
		var expert		= (QB.mode=="expert");

		theULogger.log(1,'WinManager:arrangeDialogs, state ' + QBM.game.state + ' w: ' + width + ' h: ' + height);

		var explainWidth	= vertical ? Math.max(Math.floor(width*0.49),260) : Math.max(Math.floor(width*0.31),270);
		if (explainWidth > 350) explainWidth = Math.floor((350 + explainWidth) / 2);
		var playWidth		= vertical ? width : expert ? (width-explainWidth-540)-6 : width-explainWidth-6;
		var bidBoxWidth		= explainWidth;
		var bidBoxMax  = 320;
		var bidBoxHeight	= vertical ?  Math.floor(Math.min(height*0.35,bidBoxMax))	
										: Math.floor(Math.min(height*0.41,bidBoxMax));
		if (!vertical && bidBoxHeight < 200) {
			bidBoxHeight = 200;
		}
		var explainHeight	= vertical ? bidBoxHeight
										: Math.max(200,height-bidBoxHeight);
		var playHeight		= vertical ? height-explainHeight-2 : height;
		if (vertical && QB.product.type=="play") {
			if (["playing","finished"].includes(QBM.game.state)) {
				playHeight = height;
			}		
		}
		if (["biddingFinished","playing","finished","none","dealt"].includes(QBM.game.state)) {
			if (vertical) {
				explainWidth = width - 4;			
			}
			else {
				explainHeight = height;
			}
		}

		var needResizeLogin = false;
		if (width < this.loginWinWidth) {
			this.loginWinWidth = width;
			needResizeLogin = true;
		}
		if (height < this.loginWinHeight) {
			this.loginWinHeight = height;
			needResizeLogin = true;
		}		
			
		if (needResizeLogin) {
			$("#LoginWin").dialog("option",{
				height:		this.loginWinHeight,
				width:		this.loginWinWidth,
			});
		}

		$("#EditWin").dialog("option",{
			position:	{ my:"left top", at:"left top", of:window },
			height:		playHeight,
			width:		width-playWidth-explainWidth-14,
		});
		$("#PlayWin").dialog("option",{
			position:	{ my:"left top",at:expert? "right top" : "left top", of:expert? $("#EditWin").parent()[0] : window},
			height:		playHeight,
			width:		playWidth,
		});
		$("#LogWin").dialog("option",{
			position:	{ my:"right top", at:"right-2 top-2",of:window },
			height:		height,
			width:		Math.min(500,width),
		});
		$("#ProtocolWin").dialog("option",{
			position:	{ my:"right top", at:"right-100 top-2",of:window },
			height:		height,
			width:		Math.min(600,width),
		});		
		$("#ConfirmWin").dialog("option",{
			position:	{ my:"center",at:"center+100 center", of:window },
			width:		Math.min(300,height),
			height:		140,
		});
		if (QB.product.type=="tut") {
		  $("#ClaimWin").dialog("option",{
			position:	{ my:"center",at:"center", of:$("#ExplainWin")[0] },
			width:		Math.min(explainWidth-60,500),
			height:		"auto",
		  });
		  $("#EndPlayWin").dialog("option",{
			position:	{ my:"center",at:"center", of:$("#ExplainWin")[0] },
			width:		Math.min(explainWidth-40,500),
			height:		"auto",
		   });
		  $("#ExplainWin").dialog("option",{
			position:	{ my:"right bottom", at:"right bottom-5", of:window },
			height:		explainHeight,
			width:		explainWidth,
		  });
		  $("#BidBoxWin").dialog("option",{
			position:	vertical ?
						{ my:"left bottom",at:"left bottom-5",of:window } :
						{ my:"right top",at:"right top",of:window },
			height:		bidBoxHeight,
			width:		bidBoxWidth,
		  });	  
		}
		else {
		  $("#ClaimWin").dialog("option",{
			position:	{ my:"center",at:"center" },
			width:		"auto",
			height:		"auto",	
		  });
	      $("#ExplainPWin").dialog("option",{
			position:	vertical ?
						{ my:"right bottom", at:"right bottom-5", of:window } :
						{ my:"right top",at:"right top",of:window },						
			height:		explainHeight,
			width:		explainWidth,
		  });
		  $("#BidBoxWin").dialog("option",{
			position:	vertical ?
						{ my:"left bottom",at:"left bottom-5",of:window } :
						{ my:"right bottom", at:"right bottom-5", of:window },						
			height:		bidBoxHeight,
			width:		bidBoxWidth,
		  });	  		  
		}
		$("#HelpWin").dialog("option",{
			position:	{ my:"left top",at:"left top+65",of:$("#PlayWin").parent()[0]},
			height:		height-60,
			width:		width-20,
		});
		$("#SettingsWin").dialog("option",{
			position:	{ my:"left top",at:"left+2 top+2",of:$("#PlayWin").parent()[0]},
			height:		playHeight-100,
			width:		playWidth,
		});
		$("#LicenceWin").dialog("option",{
			position:	{ my:"center", at:"center+100", of:window },
			height:		Math.min(400,height),
			width:		Math.min(700,width),
		});
		$("#LoadConfigWin").dialog("option",{
			position:	{ my:"center", at:"center+100", of:window },
			height:		Math.min(400,height),
			width:		Math.min(700,width),
		});		

		// PlayWin and BidBox must refresh their layout individually after they were resized
		QB.playWin.resize(true);
		if (isPresent(targetTab)) {
			setTimeout(function() { QB.playWin.selectTab(targetTab); }, 300 );
		}

		if (["biddingFinished","playing","finished"].includes(QBM.game.state)) {
			QB.winManager.moveDialogToTop("ExplainWin");
		}
		QB.bidBox.resize();
	}

	minTop(val) {
		// return Math.max(val,$("#menu").outerHeight()+4);
		return val;
	}

	defineDialogWithTabs(id,defaultSettings) {
		var win = id+"Win";
		this.defineDialog(id,defaultSettings);
		$('#'+id+'Area').easytabs({animate:false});
		// $("#"+win).dialog({resizeStop: function() {QB.winManager.onResizeStop(win);}});
	}

	defineDialog(id,settings) {
		settings.title      = theLang.tr(id);
		settings.close      = settings.close || function() { $( this ).dialog( "close" ); };
		settings.resizeStop = function() { QB.winManager.onResizeStop(id); };
		settings.dragStop   = QB.winManager.onDragStop;
		settings.position   = settings.position || { my:"center",at:"center"};
		settings.width      = settings.width || 300;
		settings.height     = settings.height || 200;

		id+="Win";
		var dialogWin = $("#"+id);
		dialogWin
			.dialog(settings)
			.on('keydown', function(evt) {
				if (evt.keyCode === $.ui.keyCode.ESCAPE) evt.stopPropagation();
			})
			.dialogExtend({
				"minimizable":	true,
				"maximizable":	true,
				"dblclick":		"maximize",
				"closable":		isMissing(settings.closable) || settings.closable,
			})
		;

		window.setTimeout(
			function() {
				switch(isMissing(settings.state) ? "normal" : settings.state) {
					case "minimized": 	dialogWin.dialogExtend("minimize"); break;
					case "maximized": 	dialogWin.dialogExtend("maximize"); break;
					case "closed":	 	if (id!="LogWin" || $("#LogWin").text().trim() =="") dialogWin.dialog("close"); break;
					default:			QB.winManager.openDialog(id);
				}
			},10
		);
	}

	openDialog(id) {
		// reopen a dialog and bring to the top of the visible window stack
		var dialogWin = $("#"+id);
		dialogWin.dialog("open");
		dialogWin.dialogExtend("restore");
		dialogWin.dialog("moveToTop");
	}

	closeDialog(id) {
		// close a dialog
		$("#"+id).dialog("close");
	}

	moveDialogToTop(id) {
		if (! $("#"+id).dialog("isOpen")) return;
		$("#"+id).dialog("moveToTop");
	}

	toggleDialog(id) {
		var isOpen = $("#"+id).dialog("isOpen");
		var state = $("#"+id).dialogExtend("state");
		if (isOpen && state=="normal") {
			if (this.lastToggledDialogId == id) this.closeDialog(id);
			else $("#"+id).dialog("moveToTop");
		}
		else {
			this.openDialog(id);
		}
		this.lastToggledDialogId = id;
	}

	setDialogTitle(win,title) {
		// set the title text of the dialog window
		$("#"+win).parent().find("span.ui-dialog-title").html(title);
	}

	onResizeStop(id) {
		var name = id.replace(/Win$/,'');
		var height = $("#"+id).innerHeight()-($("#"+name+"Tabs").outerHeight()+30); // spaceS for margin, border etc.
		if (id=="HelpWin") height-=25;
		$("."+name+"Area").map( function() { $(this).height(height+30); });
		$("."+name+"View").map( function() { $(this).height(height+30); });
		// if (id=="PlayWin" && typeof QB.playWin != "undefined") QB.playWin.resize(true);
		// if (id=="BidBoxWin") QB.bidBox.resize(true);
	}

	onDragStop(event) {
		var dialogId = event.target.id;
		var top=QB.winManager.minTop($("#"+dialogId).parent().position().top);
		$("#"+dialogId).parent().css({top:top});
		setTimeout( function() {
			QB.winManager.storeDialogLayout(dialogId);
		},100);
	}

	onClose() {
		// if the user closes the application we save the current configuration settings
		theConfig.save();
	}

	storeDialogLayout(id) {
	}

	setLang(lang) {
		theULogger.log(0, "WinManager::setLang " + lang);
		theLang.load(lang);
		$(".QBWin").each(function () {
			theULogger.log(1, "- checking id " + this.id);		
			if (this.id=="DealFinderWin") return; 	// DealFinder is GERMAN only at the moment
			if (typeof LangDef.tr[this.id] != "undefined") {
				$(this).dialog("option","title",theLang.tr(this.id));
			}
			if ($(this).dialogExtend("state")=="minimized") {
				$(this).dialogExtend("restore");
				$(this).dialogExtend("minimize");
			}
		});

		// add "clear" button to LogWin and ProtocolWin
		this.setDialogTitle("LogWin",theLang.tr("LogWin")
			+"<button style='margin-left:40px' onclick='theULogger.clear();'>"+theLang.tr("IDS_DELETE",/&/g)+"</button>");
		this.setDialogTitle("ProtocolWin",theLang.tr("Protocol")
			+"<button style='margin-left:40px' onclick='QB.protocolWin.clear()'>"+theLang.tr("IDS_DELETE",/&/g)+"</button>");

		$(".QBWin .tab a").each(function () {
			var label=this.id;
			label = theLang.tr(label);
			$(this).html(label);
		});
		$(".QBWin .HelpHtml").each(function () {
			var label=this.id;
			var url = $(this).attr("src");
			url = url.replace(/\/[a-z][a-z]\//,"/"+lang+"/");
			$(this).attr("src",url);
		});

		Cards.setLang();
		Players.setLang();
		QB.menu.loadLabels();
		QB.playWin.loadLabels();
		// update (and implicitly save) Config
		theConfig.data.lang=lang;
		this.convertMarkDown();
	}

	convertMarkDown() {
		// take the current HTML contents for each element of class "QB_MD"
		// eliminate leading tabs and interpret the text as MarkDown syntax
		// replace the element content by the translated MD
		$('.QB_MD').each(function(inx, elm) {
			var indent="";
			var md = elm.innerHTML;
			if (md.substr(0,2)=="\n\t") md = md.replace(/\n\t+/g,"\n");
			var parsed = new commonmark.Parser().parse(md); // parsed is a 'Node' tree
			var result = new commonmark.HtmlRenderer().render(parsed); // result is a String
			elm.innerHTML=result;
		});
	}
	
	closeConfirm() {
		this.closeDialog("ConfirmWin");	
	}

	confirm(msg) {
		this.openDialog("ConfirmWin");
		var width150  = " style='width:150px;'";
		var html = "<div style='color:#606; margin-top:10px'>" + msg + "</div>";
		html += "<p>";
		html +=  "<button id='confirmButton' onclick='QB.winManager.closeConfirm();'"
			    + width150 + ">" + theLang.tr("IDS_CLOSE",/&/g) + "</button>";		
		$("#ConfirmWin").html(html);
	}
}

// ============================================================================
