
class DealsTab extends View {

	constructor(app) {
		super(app);
	    this.dealTabOwn = new DealTabOwn(app);
	    this.dealTabFiles = new DealTabFiles(app);
	    this.dealTabPairTF = new DealTabPairTF(app);
	    this.dealTabTeamTF = new DealTabTeamTF(app);
	}
	
	init() {
		// symbols for translation
		theLang.add({
			PlayTabDeals: {
				en: "Deals",
				de: "Blätter",
				fr: "Donnes",
				it: "Smazzate",
				dk: "Spil",
			},			
			DealTabOwn: {
				en: "Own deals",
				de: "Eigene Blätter",
				fr: "Donnes personnelles",
				it: "Smazzate personali",
				dk: "Egne spil",
			},	
			DealTabFiles: {
				en: "Deal files",
				de: "Blätter-Dateien",
				fr: "Fichiers d. donnes",
				it: "File smazzatte",
				dk: "Spil filer",				
			},						
			DealTabPairTF: {
				en: "Pair tournaments",
				de: "Paarturniere",
				fr: "Tournois p. paires",
				it: "Tornei a coppie",
				dk: "Par turneringer",	
			},	
			DealTabTeamTF: {
				en: "Team tournaments",
				de: "Teamturniere",
				fr: "Tournois p. quatre",
				it: "Tornei a squadre",
				dk: "Holdturneringer",		
			},
			filledByDealsOwn: {
				en: "- filled by 'Own deals'",
				de: "- gefüllt durch 'Eigene Blätter'",				
			    fr: "- remplie par 'Donnes personnelles'",
				it: "- riempita dai 'Smazzate personali'",				
				dk: "- udfyldt af 'Egne spil'",
			},					
		});
		
		this.ui = {
			main: $("#PlayViewDeals"),
		}		
		this.dealTabOwn.init();
		this.dealTabFiles.init();
		this.dealTabPairTF.init();	
		this.dealTabTeamTF.init();	
		this.selectedId = "xxx";
	}

	onTabBefore() {	
		theULogger.log(1,'- DealsTab::onTabBefore, selected: ' + this.selectedId);
		if (this.selectedId == "xxx") {
			$("#PlayViewDeals").easytabs("select","#DealTabPairTF");
		}
		if (this.selectedId == "DealTabTeamTF") this.dealTabTeamTF.onTabBefore();
		if (this.selectedId == "DealTabPairTF") this.dealTabPairTF.onTabBefore();
		if (this.selectedId == "DealTabFiles")  this.dealTabFiles.onTabBefore();
		if (this.selectedId == "DealTabOwn")    this.dealTabOwn.onTabBefore();		
	}	

	onFileLoaded(text,wasStored) {
	    this.fileData = text;
		this.fileLength = text.length;
		this.lastIndex = 0;
		var response = null;
		var doContinue  = true;
		theULogger.log(1,"- DealsTab:onFileLoaded len " + this.fileLength);
		if (!wasStored) {
			theMemory.storeDealFile(this.currFiletype,1,this.currFilename,text);
		}
		while (doContinue) {
			doContinue = false
		    var newLastIndex = this.lastIndex + 95000;
			if (newLastIndex > this.fileLength) newLastIndex = this.fileLength;				
	        var rc = theEngine.loadDealFile(this.fileData.slice(this.lastIndex,newLastIndex));
		    theULogger.log(1, "loadDealFile - rc: " + rc);
			this.lastIndex = newLastIndex;
			if (rc == 1) {
		        if (QB.debugJSI > 0) theULogger.log(0,"===FL===> IDS_NEXT_DEAL");		
		        response = theEngine.processAction("IDS_NEXT_DEAL","");	
			    if (    isPresent(response.needDealData)
					 && !response.needDealData.isNewFile) {
					doContinue = true;
				}
			}
		} 
		if (response != null)
		    QBM.dealControl.request("",response);
	}
	
	loadDealFile(fullname) {
	    var that = this;
		var fullpath = "products/" + QB.product.id + "/" + fullname;
		$.ajax({
			url: fullpath,
			contentType: 'Content-type: text/plain; charset=iso-8859-1',
			beforeSend: function(jqXHR) { jqXHR.overrideMimeType('text/html;charset=iso-8859-1'); },
			success: function(text) {
				theULogger.log(1,"- read deal file '" + fullpath + "'<hr/>");
				that.onFileLoaded(text,false);
			},
			error: function(msg) {
				theULogger.error("could not open deal file '" + fullpath + "'<br/>" + msg);
			}
		  });
	}
	
	loadDealData(response) {
		theULogger.log(1,"- DealsTab:loadDealData");
		theULogger.log(1,  "- filename: " + response.needDealData.filename 
						 + " filetype: "  + response.needDealData.filetype
						 + " isNewFile: " + response.needDealData.isNewFile);
		this.currFilename = response.needDealData.filename;
		this.currFiletype = response.needDealData.filetype;		
						 
		if (response.needDealData.isNewFile) {
			var storedFile = theMemory.retrieveDealFile(this.currFiletype,1);
			if (storedFile != null) {
				if (storedFile.filename == this.currFilename) {
					theULogger.log(1,"- taking " + this.currFilename + " from memory");
					this.onFileLoaded(storedFile.data,true);
					return;
				}
			}		
		    var fullname = "";
		    if (response.needDealData.filetype == 'P')
		       fullname = "PAIR-TOURN/";
			if (response.needDealData.filetype == 'T')
		       fullname = "TEAM-TOURN/";			   
			fullname += response.needDealData.filename;
			this.loadDealFile(fullname);
		}
		else {
		    var newLastIndex = this.lastIndex + 95000;
			if (newLastIndex > this.fileLength) newLastIndex = this.fileLength;	
			var rc = theEngine.loadDealFile(this.fileData.slice(this.lastIndex,newLastIndex));
			theULogger.log(1, "loadDealFile - rc: " + rc);	
			this.lastIndex = newLastIndex;
			if (QB.debugJSI > 0) theULogger.log(0,"===FL===> IDS_NEXT_DEAL");		
			var response = theEngine.processAction("IDS_NEXT_DEAL","");	
			return response;
		}

		return null;
	}

	onChanged(what) {
		// receive results from the Model	
	}		
}

class DealTabOwn extends View {

	constructor(app) {
		super(app);
	}
	
	init() {
		theLang.add({
			inConstruction2024: {
				en: "in construction - will be realised by March 2024",
				de: "in Arbeit - wird bis März 2024 realisiert",
				fr: "en construction - sera réalisé d'ici mars 2024",
				it: "in costruzione - sarà realizzato entro marzo 2024",
				dk: "i konstruktion - vil blive realiseret i marts 2024",
			},	
		});				
		this.ui = {
			main: $("#DealViewOwn"),
		}
	}

	onTabBefore() {
		theULogger.log(1,'- DealTabOwn.onTabBefore ');
		this.ui.main.html("<p>&nbsp;" + theLang.tr("inConstruction2024"));		
		QB.playWin.dealsTab.selectedId = "DealTabOwn";
    }	

	onChanged(what) {
		// receive results from the Model	
	}		
}

class DealTabFiles extends View {

	constructor(app) {
		super(app);
	}
	
	init() {
		this.ui = {
			main: $("#DealViewFiles"),
		}
	}

	onTabBefore() {
		theULogger.log(1,'- DealTabFiles.onTabBefore ');
		this.ui.main.html("<p>&nbsp;" + theLang.tr("filledByDealsOwn"));
		QB.playWin.dealsTab.selectedId = "DealTabFiles";
    }	

	onChanged(what) {
		// receive results from the Model	
	}		
}

class DealTabPairTF extends View {

	constructor(app) {
		super(app);
	}
	
	init() {
		this.ui = {
			header:	$("#QB_PairTFHeader"),
			filelist: $("#QB_PairTFList"),
			footer:	$("#QB_PairTFFooter"),
		};			
		this.dealfiles = [ 
		{ filename: "EU07MP.PBN",  descript: "Euro 2007, Mixed Pairs" },
		{ filename: "EU07OP.PBN",  descript: "Euro 2007, Open Pairs" },
		{ filename: "EU07SP.PBN",  descript: "Euro 2007, Senior Pairs" },
		{ filename: "EU07WP.PBN",  descript: "Euro 2007, Woman Pairs" },
		{ filename: "ICE2006OPEN.PBN",  descript: "Icelandair 2006, Open Pairs" },
		{ filename: "ICE2006STARS.PBN", descript: "Icelandair 2006, Star Pairs" },	
		{ filename: "ICE2007OPEN.PBN",  descript: "Icelandair 2007, Open Pairs" },
		{ filename: "ICE2007STARS.PBN", descript: "Icelandair 2007, Star Pairs" },	
	    { filename: "MARRAK23.PBN",  descript: "Marrakech 2023, Open Qualif." },	
	    { filename: "OEREBRO10.PBN", descript: "Örebro Festival 2010" },		
		{ filename: "OEREBRO11.PBN", descript: "Örebro Festival 2011" },
		{ filename: "OEREBRO12.PBN", descript: "Örebro Festival 2012" },
		{ filename: "OEREBRO13.PBN", descript: "Örebro Festival 2013" },
		{ filename: "OEREBRO14.PBN", descript: "Örebro Festival 2014" },
		{ filename: "OEREBRO15.PBN", descript: "Örebro Festival 2015" },
		{ filename: "OEREBRO16.PBN", descript: "Örebro Festival 2016" },		
		{ filename: "OEREBRO17.PBN", descript: "Örebro Festival 2017" },
		{ filename: "OEREBRO18.PBN", descript: "Örebro Festival 2018" },
		{ filename: "OEREBRO19.PBN", descript: "Örebro Festival 2019" },
		{ filename: "ORLANDO18.PBN", descript: "Orlando 2018, Mixed" },	
		{ filename: "WM06FIN.PBN", descript: "Verona 2006, Open Pairs Final" },			
		{ filename: "WM06MP.PBN",  descript: "WM 2006, Mixed Pairs" },	
		{ filename: "WM06SP.PBN",  descript: "WM 2006, Senior Pairs" },
		{ filename: "WM06WP.PBN",  descript: "WM 2006, Women Pairs" },
		{ filename: "WROC22M.PBN", descript: "Wroclaw 2022, Mixed" },	
		{ filename: "WROC22O.PBN", descript: "Wroclaw 2022, Open" },	
		];
		
		// this.ui.header.html("Source: Q-plus Pair Tournament Files");	
		this.isTabFirst = true;
		this.activeI = -1;	
		this.lastHT = 0;	
	}

    runScrollIntoView()
    {
		theULogger.log(1,'- DealTabPairTF.runSrollIntoView: activeI=' + this.activeI);	
	    if (this.activeI >= 0) {	
		    var activeId = 'QBPTFR' + this.activeI;	
	        var activeRow = document.getElementById(activeId);
		    activeRow.scrollIntoView();		
		}
	}
	
    selectFile(i)
    {
		theULogger.log(1,'- DealTabPairTF.selectFile: newI=' + i + ' oldI=' + this.activeI);
		var newActive = document.getElementById('QBPTFR' + i);
		newActive.style.backgroundColor = "#ffa";
		if (this.activeI >= 0) {
		    var oldActive = document.getElementById('QBPTFR' + this.activeI);
		    oldActive.style.backgroundColor = "#eee";		
		}
		if (i == this.activeI) this.activeI = -1;
		else this.activeI = i;
		$("#startNumberPT").val(0);
	}
	
	doOk()
	{
		// var readMode = $("#readModePT").val(); 
		// read Mode is not relevant for pair tournaments
		var startNum = 0 + $("#startNumberPT").val();
		var fileName = "";
		if (this.activeI >= 0) fileName = this.dealfiles[this.activeI].filename;
		theULogger.log(1,"- DealTabPairTF:doOk - activeI:" + this.activeI +  " fileName:" + fileName
				         + " startNum:" + startNum);
        var updateMatchConfig = 'general.deal_source = "F P ' + startNum + ' ' +  fileName + '"\n';
		theULogger.log(1, "updateMatchConfig: " + updateMatchConfig);	
	    var rc = theEngine.loadMatchConfig(updateMatchConfig);
		theULogger.log(1, "loadMatchConfig - rc: " + rc);	
		var storeMatchConfig = theEngine.getMatchConfig(false);
		theULogger.log(1, "newMatchConfig: " + storeMatchConfig);
		theMemory.storeMatchConfig(storeMatchConfig);			
		QB.playWin.selectTab("Table");
	    QBM.dealControl.request("IDS_CONTINUE");		
	}
	
    doHelp()
	{
		theULogger.log(1,"- DealTabPairTF:doHelp");	
		var helpKey = "bdlfile-o-p";
		if (!QB.isFullMode) helpKey = "bdlfile-o-d";
		QB.showHelpText(helpKey);		
	}	

	fillList() {
	    var i;	
		var html = "";
		var idr;
		var bgColor;
		var activeFile = this.matchConfig.deal_pair_name;
		for (i=0; i < this.dealfiles.length; i++) {
		    bgColor = "#eee";
			if (this.dealfiles[i].filename == activeFile) {
			    this.activeI = i;
				bgColor = "#ffa";
			}		
			idr = "QBPTFR" + i;
		    html += "<tr id='" + idr + "' style='background-color:" + bgColor + "; margin:4px;'"
				  + " onclick='QB.playWin.dealsTab.dealTabPairTF.selectFile(" + i + ")'>"
			      + "<td>" + this.dealfiles[i].filename + "</td>"
			      + "<td>" + this.dealfiles[i].descript + "</td></tr>\n";
		}
		this.ui.filelist.html(html);
	}
	
	onTabBefore() {
		var hP = QB.playWin.PWheight;
		var hT = Math.floor(hP * 0.70);
		theULogger.log(1,'- DealTabPairTF.onTabBefore: hP:' + hP + ' hT:' + hT);
		QB.playWin.dealsTab.selectedId = "DealTabPairTF";	
		if (hT < 200) hT = 200;	
		if (hT != this.lastHT) {
		    this.ui.filelist.css({"border":"1px dotted blue",
						      "display":"inline-block",
							  "padding":"4px",
							  "height": "" + hT + "px",
							  "overflow-y":"scroll"
							  });
			this.lastHT = hT;
		}
		this.matchConfig = theEngine.getMatchConfig(true);		
		this.fillList();
		var width100 = " style='width:100px; margin-left:10px;'";
		var okDisabled = "";
		if (!QB.isFullMode) okDisabled = " disabled";
		var html = theLang.tr("IDS_START") + ": <input type='text' id='startNumberPT' value=" 
					 + this.matchConfig.deal_pair_nr
					 + " style='width:40px; margin-right:10px'>"
					 /*
					 + "Mode" + ": <select id='readModePT' style='margin-right:10px'>"
					 + "<option selected value='readAuto'>" + "Auto" + "</option>"
					 + "<option value='readCards'>" + "Cards" + "</option>"  
					 + "<option value='readBids'>" + "Bids" + "</option>" 
					 + "<option value='readLead'>" + "Lead" + "</option>"
					 + "<option value='readTricks'>" + "Tricks" + "</option>"  					
					 + "</select>"	
					 */
					 + "<button onclick='QB.playWin.dealsTab.dealTabPairTF.doOk();'"
					 + okDisabled + width100 + ">" + theLang.tr("L_OK") + " </button>"
					 + " <button onclick='QB.playWin.dealsTab.dealTabPairTF.doHelp();'"
					 + width100 + ">" + theLang.tr("IDS_HELP") + " </button>";	
		this.ui.footer.html(html);			  		
		setTimeout(function() {
			QB.playWin.dealsTab.dealTabPairTF.runScrollIntoView();												
		},600);						
	}

	onChanged(what) {
		// receive results from the Model	
	}		
}

class DealTabTeamTF extends View {

	constructor(app) {
		super(app);
	}
	
	init() {
		this.ui = {
			header:	$("#QB_TeamTFHeader"),
			filelist: $("#QB_TeamTFList"),
			footer:	$("#QB_TeamTFFooter"),
		};			
		this.dealfiles = [ 
		{ filename: "EURO2010.PBN",   descript: "European Team 2010" },
		{ filename: "EURO2016.PBN",   descript: "European Team 2016" },
		{ filename: "GERTT2016.PBN",  descript: "German Team Trophy 2016" },
		{ filename: "ISTANBUL19.PBN", descript: "9th European Open" },
		{ filename: "MARRAK2023.PBN", descript: "World Team Championships 2023" },		
		{ filename: "ORLANDO18.PBN",  descript: "Orlando Open 2018" },
		{ filename: "WB2011.PBN",   descript: "World Bridge Teams 2011" },
		{ filename: "WB2012.PBN",   descript: "World Bridge Teams 2012" },	
		{ filename: "WB2013.PBN",   descript: "World Bridge Teams 2013" },	
		{ filename: "WB2014.PBN",   descript: "World Bridge Teams 2014" },
		{ filename: "WB2015-A.PBN", descript: "World Bridge Teams 2015, Qualif" },	
		{ filename: "WB2015-B.PBN", descript: "World Bridge Teams 2015, Finals" },	
		{ filename: "WB2016-A.PBN", descript: "World Bridge Teams 2016, Qualif" },	
		{ filename: "WB2016-B.PBN", descript: "World Bridge Teams 2016, Finals" },
		{ filename: "WROC2022.PBN", descript: "World Bridge Series 2022, Open" },		
		];
		
		// this.ui.header.html("Source: Q-plus Team Tournament Files");	
		this.isTabFirst = true;
		this.activeI = -1;	
		this.lastHT = 0;	
	}

    runScrollIntoView()
    {	
	    if (this.activeI >= 0) {	
		    var activeId = 'QBTTFR' + this.activeI;	
	        var activeRow = document.getElementById(activeId);
		    activeRow.scrollIntoView();		
		}
	}
	
    selectFile(i)
    {
		theULogger.log(1,'- DealTabTeamTF.selectFile: newI=' + i + ' oldI=' + this.activeI);
		var newActive = document.getElementById('QBTTFR' + i);
		newActive.style.backgroundColor = "#ffa";
		if (this.activeI >= 0) {
		    var oldActive = document.getElementById('QBTTFR' + this.activeI);
		    oldActive.style.backgroundColor = "#eee";		
		}
		if (i == this.activeI) this.activeI = -1;
		else this.activeI = i;
		$("#startNumberTT").val(0);
	}
	
	doOk()
	{
		var readMode = $("#readModeTT").val(); 
		// read Mode is not relevant for team tournaments
		var startNum = 0 + $("#startNumberTT").val();
		var fileName = "";
		if (this.activeI >= 0) fileName = this.dealfiles[this.activeI].filename;
		theULogger.log(1,"- DealTabTeamTF:doOk - activeI:" + this.activeI +  " fileName:" + fileName
				         + " startNum:" + startNum);
        var updateMatchConfig = 'general.deal_source = "F T ' + startNum + ' ' +  fileName + '"\n';
		theULogger.log(1, "updateMatchConfig: " + updateMatchConfig);	
	    var rc = theEngine.loadMatchConfig(updateMatchConfig);
		theULogger.log(1, "loadMatchConfig - rc: " + rc);
		var storeMatchConfig = theEngine.getMatchConfig(false);
		theULogger.log(1, "newMatchConfig: " + storeMatchConfig);
		theMemory.storeMatchConfig(storeMatchConfig);
		QB.playWin.selectTab("Table");
	    QBM.dealControl.request("IDS_CONTINUE");		
	}
	
    doHelp()
	{
		theULogger.log(1,"- DealTabTeamTF:doHelp");
		var helpKey = "bdlfile-o-t";
		if (!QB.isFullMode) helpKey = "bdlfile-o-d";		
		QB.showHelpText(helpKey);		
	}	

	fillList() {
	    var i;	
		var html = "";
		var idr;
		var bgColor;
		var activeFile = this.matchConfig.deal_team_name;
		for (i=0; i < this.dealfiles.length; i++) {
		    bgColor = "#eee";
			if (this.dealfiles[i].filename == activeFile) {
			    this.activeI = i;
				bgColor = "#ffa";
			}		
			idr = "QBTTFR" + i;
		    html += "<tr id='" + idr + "' style='background-color:" + bgColor + "; margin:4px;'"
				  + " onclick='QB.playWin.dealsTab.dealTabTeamTF.selectFile(" + i + ")'>"
			      + "<td>" + this.dealfiles[i].filename + "</td>"
			      + "<td>" + this.dealfiles[i].descript + "</td></tr>\n";
		}
		this.ui.filelist.html(html);
	}
	
	onTabBefore() {
		var hP = QB.playWin.PWheight; // Math.floor($("#PlayWin").height());
		var hT = Math.floor(hP * 0.70);
		theULogger.log(1,'- DealTabTeamTF.onTabBefore: hP:' + hP + ' hT:' + hT);	
		QB.playWin.dealsTab.selectedId = "DealTabTeamTF";		
		if (hT < 200) hT = 200;	
		if (hT != this.lastHT) {
		    this.ui.filelist.css({"border":"1px dotted blue",
						      "display":"inline-block",
							  "padding":"4px",
							  "height": "" + hT + "px",
							  "overflow-y":"scroll"
							  });
			this.lastHT = hT;
		}
		this.matchConfig = theEngine.getMatchConfig(true);		
		this.fillList();
		var width100 = " style='width:100px; margin-left:10px;'";	
		var okDisabled = "";
		if (!QB.isFullMode) okDisabled = " disabled";			
		var html = theLang.tr("IDS_START") + ": <input type='text' id='startNumberTT' value=" 
					 + this.matchConfig.deal_team_nr
					 + " style='width:40px; margin-right:10px'>"
					 /*
					 + "Mode" + ": <select id='readModeTT' style='margin-right:10px'>"
					 + "<option selected value='readAuto'>" + "Auto" + "</option>"
					 + "<option value='readCards'>" + "Cards" + "</option>"  
					 + "<option value='readBids'>" + "Bids" + "</option>" 
					 + "<option value='readLead'>" + "Lead" + "</option>"
					 + "<option value='readTricks'>" + "Tricks" + "</option>"  					
					 + "</select>"	
					 */
					 + "<button onclick='QB.playWin.dealsTab.dealTabTeamTF.doOk();'"
					 + okDisabled + width100 + ">" + theLang.tr("L_OK") + " </button>"
					 + " <button onclick='QB.playWin.dealsTab.dealTabTeamTF.doHelp();'"
					 + width100 + ">" + theLang.tr("IDS_HELP") + " </button>";	
		this.ui.footer.html(html);			  		
		setTimeout(function() {
			QB.playWin.dealsTab.dealTabTeamTF.runScrollIntoView();												
		},600);						
	}

	onChanged(what) {
		// receive results from the Model	
	}		
}


