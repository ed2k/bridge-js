/*

	A program to play contract bridge, based on the engine of "Q-plus" (www.q-plus.com)

	Main features and architecture:
	-------------------------------

	The bidding and playing engine (written in C) is incorporated as a web assembly module.

	The UI is HTML / CSS / Jquery-UI, using a small framework for message passing (base/UI.js)
	with classes: Application, Model, Interaction, Notice, View, Dispatcher, Logger

	The user can switch between different sets of SVG card images (https://www.me.uk/cards/makeadeck.cgi)

	The playing table can be scaled; card sizes can be adjusted by the user

	Pre-played deals (BDL files with bidding and play) can be imported in a batch job;
	Based on these deals a filter can find deals with certain properties. The user can analyse these deals.

	LKx files are handed over to the QB engine, SOUNDS are played on request.

	Support for multiple languages (en, de, fr, es)

	Local Memory is used to store configuration data and UI-Layout settings. So the progranm will come up
	in its last state when it is freshly opened.

	help texts can be written in mark down syntax (commonmark.js)

	The source code is based on ~50 classes; a publishing mechanism creates a minified library
	for production from these files. It also creates the archive for download and local installation
*/

"use strict";

class QBApp extends Application {

	// Qplus Bridge Program Application

	constructor() {
		super(true);					// interactive app
		this.debugWASM = 0;
		this.debugJS = 0;
		this.debugJSI = 0;
		this.debugJSO = 0;
		this.isFullMode = false;
		theULogger.setTags("#LogWin");	// where to put log info
		// theULogger.log(0,'QBApp ctor');
	}

	hideIntroScreen() {
		// removes the intro screen which is displayed during the loading process
		$("#IntroScreen").hide();
	}
	showIntroScreen() {
		// is only needed after the intro screen has been hidden
		$("#IntroScreen").show();
	}

	setupAndStart() {
		// setup Logging, load WASM code for the bidding/playing engine (async!)
		// and kick off application after WASM load has completed
		// the browser must support "promises"

        QB.products = {

            // tutorials
			mib: {type:"tut", lang:"de", abbrev: "Mut-im-Bridge",      name : "Sabine Auken: Mut im Bridge" },
			al1: {type:"tut", lang:"de", abbrev: "Alleinspiel-1",      name : "Michael Gromöller: Richtiges Alleinspiel im Bridge" },
			fd1: {type:"tut", lang:"de", abbrev: "Forum-D-2012-T1",    name : "Bridgetraining mit Dr. Kaiser: Forum D 2012 - Teil 1" },
            fdf: {type:"tut", lang:"de", abbrev: "Forum-D-Sattelfest", name : "Bridgetraining mit Dr. Kaiser: Sattelfest mit Forum D" },
            fds: {type:"tut", lang:"de", abbrev: "Forum-D-2012-T2",    name : "Bridgetraining mit Dr. Kaiser: Forum D 2012 - Teil 2" },
            fpn: {type:"tut", lang:"de", abbrev: "FD-Plus-NeueKonv",   name : "Bridgetraining mit Dr. Kaiser: Forum D Plus 2015 - Neue Konventionen" },
			ti1: {type:"tut", lang:"de", abbrev: "Bridge-Tipps-1",     name : "Bridgetraining mit Dr. Kaiser: Tipps zum Bridge 1" },
            ti2: {type:"tut", lang:"de", abbrev: "Bridge-Tipps-2",     name : "Bridgetraining mit Dr. Kaiser: Tipps zum Bridge 2" },
			pap: {type:"tut", lang:"fr", abbrev: "Pas-a-Pas-1",        name : "Norbert Lebely: Pas à Pas en action - saison 1" },
			pa2: {type:"tut", lang:"fr", abbrev: "Pas-a-Pas-2",        name : "Norbert Lebely: Pas à Pas en action - saison 2" },
            pa3: {type:"tut", lang:"fr", abbrev: "Pas-a-Pas-3",        name : "Norbert Lebely: Pas à Pas en action - saison 3" },
            pa4: {type:"tut", lang:"fr", abbrev: "Pas-a-Pas-4",        name : "Norbert Lebely: Pas à Pas en action - saison 4" },			
			le1: {type:"tut", lang:"de", abbrev: "Bridge-Einstieg",    name : "Johannes Leber: Der Einstieg ins Bridge" },
			ls1: {type:"tut", lang:"de", abbrev: "GL-Spieltechnik",    name : "Johannes Leber: Grundlagen der Spieltechnik im Bridge" },
            acl: {type:"tut", lang:"en", abbrev: "Acol-Bidding",       name : "Bernard Magee: Acol Bidding" },
            bdp: {type:"tut", lang:"en", abbrev: "Declarer-Play",      name : "Bernard Magee: Declarer Play" },
            bdr: {type:"tut", lang:"en", abbrev: "Adv-Decl-Play",      name : "Bernard Magee: Advanced Declarer Play" },
            dfs: {type:"tut", lang:"en", abbrev: "Defence",            name : "Bernard Magee: Defence" },
            bgb: {type:"tut", lang:"en", abbrev: "Begin-Bridge",       name : "Bernard Magee: Begin Bridge" },			
            er1: {type:"tut", lang:"de", abbrev: "Erfolg-Reizen-1",    name : "Marc Schomann: Erfolgreich Reizen im Bridge [1]" },
            er2: {type:"tut", lang:"de", abbrev: "Erfolg-Reizen-2",    name : "Marc Schomann: Erfolgreich Reizen im Bridge [2]" },
			nme: {type:"tut", lang:"de", abbrev: "Noch-mehr-Erfolg",   name : "Marc Schomann: Noch mehr Erfolg im Bridge" },
			ptr: {type:"tut", lang:"de", abbrev: "Erfolg-Paarturnier", name : "Marc Schomann: Erfolg im Paarturnier" },

			// a hidden tutorial under development
			usr: {type:"tut", lang:"de", name : "usr: In Entwicklung" },

			// playing program
            q15: {type:"play", lang:"xx", name: "Johannes Leber: Q-plus Bridge 15.7" },

        }

		// first we need to identify the product ("er1", "ls1", ..)
        var productId = qbDefProductId;
		if (productId == "") productId = QB.argValue("product","");

		// product id empty/missing?
		if (productId == "") {
			// if it is not given in the URL args we take the last product used by the user
			if (theConfig.get("lastProductUsed") != "") {
			     productId=theConfig.get("lastProductUsed");
			}
			else {
				QB.abort(theLang.tr("L_SWITCH_PRODUCT"));
				return;
			}
		}

		if (productId == "bgg") {
			QB.product = QB.products["bgb"];
			QB.product.id = "bgb";
		}
		else {		
		    if (productId == "") {
			    QB.abort(theLang.tr("L_SWITCH_PRODUCT"));
			    return;
		    }
		    if (isMissing(QB.products[productId])) {
			    QB.abort("Unknown <i>product ID</i>: &nbsp; "+productId+"<br/>"+"Select a product!");
			    return;
		    }
			QB.product = QB.products[productId];
			QB.product.id = productId;
		}

		var debug	 = QB.argValue("debug",""); // debug at startup, can be: js, jsi, jso, wasm
		if ((debug+" ").indexOf("wasm ") >= 0) QB.debugWASM = 1;
		if ((debug+" ").indexOf("js "  ) >= 0) QB.debugJS = 1;
		if ((debug+" ").indexOf("jsi " ) >= 0) QB.debugJSI = 1;
		if ((debug+" ").indexOf("jso " ) >= 0) QB.debugJSO = 1;

	    if (QB.product.type=="tut") {
			// mark product as most recently used in the Config
			theConfig.set("lastProductUsed",productId);
			// set Language
		    QB.product.langLetter = {en:"E",de:"D",fr:"F",it:"I",dk:"A",pl:"P"}[QB.product.lang];			
			// theConfig.set("lang",QB.product.lang); -- obsolete	
		    // update Browser Title
		    var title = $("title").html();
		    title=title.replace(/:.*/,"")+": "+QB.product.name.replace(/^.*: */,'');
		    $("title").html(title);
		}

		// decide if we are going to use the real WASM or a JS stub
		var useStub = QB.argValue("stub","0");

		if (useStub == "1") {
			// the following call will execute "QB.start()" as its final action when successful
			theEngine.useStub(productId);
		}
		else {
			// load engine
			var engine = (QB.product.type=="play") ? "qplay" : "tutorial";
			// the following call will execute "QB.start()" as its final action when successful
			theEngine.useWASM("wasm/"+engine+".wasm",productId);
		}
	}

	abort(msg) {
		// show a list of available products
		var args = window.location.search;
		args=args.replace(/product=[^&]*/,'');
		if (args!=""&&args[0]=="?") args=args.substr(1);

		var selection="<big>";
		var author, lastAuthor="";
		for (var productId in this.products) {
			author=this.products[productId].name.replace(/:.*/,'');
			if (author=="usr") continue;
			if (lastAuthor!=author) {
				if (lastAuthor!="") selection+="<hr/>";
				lastAuthor=author;
			}
			selection+=
				"&bull; <a title='product = "+productId+"' style='text-decoration:none' href='?product="
				+productId+args+"'>"+this.products[productId].name.replace(/:(.*)/,':<b>$1</b>')+"</a><br/>";
		}
		selection+="</big>";

		QB.hideIntroScreen();
		$(window.document.body)
			.css({backgroundColor:"#fdd",margin:"50px",overflow:"scroll"})
			.html("<a style='float:right' target='qplus' href='https://www.q-plus.com'><img src='img/logo.gif'/></a><h1>"+msg+"</h1>")
			.append(selection)
		;
	}

	start() {
		// get technical cmdline arguments and open login window via winManager
		var startWin = this.argValue("start","play");	 // window to start with, "play" (=default) or "deals"
		var reset 	 = this.argValue("reset","");		 // reset window layout if not empty
		var rc;
		var lang = "";
		QB.mode 	 = this.argValue("mode","");		 // empty or 'expert'

		if (reset!="")	theConfig.reset();
	
		// load the userConfiguration
		var userConfig = theMemory.retrieveUserConfig();
		if (this.product.type=="play") {
		    if ((userConfig == null || userConfig == "")) {
				lang = this.argValue("lang","");
				if (lang == "") lang = Utils.getBrowserLanguage();	
				if (lang == "dk") lang = "da";
		        userConfig = "language = " + lang + "\n";
				// two letters lang will be changed to three letters by engine
			}
		}
		rc = theEngine.loadUserConfig(userConfig);
		theULogger.log(0, "loadUserConfig - rc: " + rc);

		if (this.product.type=="tut") {
			lang = QB.product.lang;
		}
		if (this.product.type=="play") {
			lang = "en";
			var userLang = theEngine.getConfigParam("language");	
			theULogger.log(0, "userLang: " + userLang);	
			if (userLang != null && userLang.length >= 2) 
				lang = userLang.substr(0,2);
			if (lang == "da") lang = "dk";
		}		
		// load language texts
		theLang.load(lang);

		// load help contents
		this.loadHelp();

		if (this.product.type=="play") {		
		    // load language specific bid ids
		    this.loadBidIds2();
		}
		
		// create application model; for ease of access its instance is stored in a global variable "QBM"
		QBM = this._model = new QBModel(this);		

		// create (some) application windows
		this.loginWin    = new LoginWin(this);      this.loginWin.init();
		this.menu	 	 = new Menu();				this.menu.init();
		this.playWin	 = new PlayWin(this);		this.playWin.init();
		if (this.product.type=="tut") {
			this.explainWin	 = new ExplainWin(this);	this.explainWin.init();
		}
		// this.settingsWin = new SettingsWin(this);	this.settingsWin.init();
		// this.editWin 	 = new EditWin(this);		this.editWin.init();
		this.protocolWin = new ProtocolWin(this);	this.protocolWin.init();
		// this.helpWin	 = new HelpWin(this);		this.helpWin.init();
		
		// load bidding system
		if (this.product.type=="play") {
			QB.playWin.bidsysWin.loadBidsys(false);		
		}	

		// create BiddingBox
		this.bidBox = new BidBox(this);

		// start window manager, optionally close LoginWin automatically
		this.winManager = new WinManager();
		this.winManager.start(startWin,QB.argValue("go","") || QB.argValue("do","") );
		if (QB.debugJS == 0) this.winManager.closeDialog("LogWin");

		// set configured Language
		this.winManager.setLang(lang);

		// hide certain UI elements if we are not in expert mode
		if (QB.mode!="expert") $(".expert").hide();

		// init model
		QBM.init();
		QB.hideIntroScreen(); // hide, because wasm is loaded

		// if "go" was specified on the command line: start right now
		if (QB.argValue("go","") || QB.argValue("do","") ) {
			setTimeout(function() {
				QB.start2("current");
			},100);
		}
	}

	start2(mode) {
		// second step, called from login window
		// get contents cmdline arguments and start the application
		var tutStep = this.argValue("pos","");			// chapter and step number of a tutorial
		var bids    = this.argValue("bids","");			// bidding sequence to be used for filtering
		var query	= this.argValue("query","");		// query to be used for filtering
		var dealId 	= this.argValue("deal","");			// deal number to start with; can be "major" or "major-minor", e.g. "1533" or "1533-123"
		var bdlName = this.argValue("bdl","");			// _name_ of a file with BDL text (./bdl/_name_.bdl)
		var bdlSeq	= this.argValue("seq","fix");		// sequence to go through a BDL file, "physical", "ascending", "random", "fix"
		var cmd		= this.argValue("cmd","");			// cmd to execute after a deal is loaded "", "bid:[nr]", "play:[nr]"
		var doActions = this.argValue("do","");		    // initial actions in tutorial
		var actions	= "";
		if (doActions.length > 0) actions = doActions.split(",");
		
		if (mode == "current") {
			var isFullVersion = theEngine.getConfigParam("licence.isFullVersion");		
			if (isFullVersion == "1") this.isFullMode = true;
			var forHackers =   "Hackers, please note: it does not help to set isFullMode "
							 + "when the engine remains in demo mode!";
		}

		QB.winManager.openDialog("PlayWin");
		// protocol the browser
		theULogger.log(0,  "<br>- browser: "   + qbUserAgent
						 + "<br>- platform: "  + qbPlatform	 + ' N:' + qbBrowserName 
						 + ' V:' + qbBrowserVersion + ' A:' + qbAndroidVersion + ' L:' + qbLinuxVersion
						 + ' W:' + qbWindowsVersion + ' M:' + qbMacVersion + ' I:' + qbIOSVersion);						 

		if (this.product.type=="tut") {
			QB.winManager.openDialog("ExplainWin");		
			if (tutStep=="") {
				// tutStep=theConfig.get("product."+this.product.id+".lastStepUsed","");
			}
			else if (tutStep.split(".").length==2) {
				// change x.y zu C.x.S.y
				tutStep="C."+Math.floor(tutStep)+".S."+tutStep.replace(/.*[.]/,'');
			}		
			QBM.tutorial.readLKx(tutStep,mode,actions);
		}
		else if (bids!="") {		// look for deals that match a given bidding sequence
			QBM.dealFinder.selectUserFilter('{bids:"'+bids+'"}','bdl',dealId);
		}
		else if (query!="") {		// look for deals that match a given query
			QBM.dealFinder.selectUserFilter('{'+query+'}','bdl',dealId);
		}
		else if (bdlName!="") {		// load a BDL file with deals
			QBM.bdl.read(bdlName, dealId, cmd, bdlSeq);
		}
		else {		
			// make sure that the windows are established before the change messages are sent by QBM
			setTimeout(function() {
				// QBM.createDeal(dealId,cmd);
				QB.hideIntroScreen();
				QBM.dealControl.startup();
			},200);
		}

		// initial arrangement of windows
		setTimeout(
			QB.winManager.arrangeDialogs,
			1500);	// initial arrange

	}

	getModel() {
		return QB._model;
	}

	makeUrl(obj) {
		var url="index.html?";
		for (var parm in obj) {
			url+="&"+parm+"="+obj[parm];
		}
		return url;
	}

	onBidIds2Loaded(text,wasStored) {
		theULogger.log(0,"- onBidIds2Loaded");
		theEngine.packIfaceString0("2\n" + text);
		var rc = theEngine._loadBidIds();
		theULogger.log(0, "loadBidIds - rc: " + rc);
		if (!wasStored) 
			theMemory.storeBidIds2("bas.id" + theLang.lowerLetter(theLang.lang),text);	
    }	
	
	loadBidIds2() {
		var filename = "bas.id" + theLang.lowerLetter(theLang.lang);
		var storedBidIds2 = theMemory.retrieveBidIds2();
		if (storedBidIds2 != null) {
			if (storedBidIds2.filename == filename) {
				theULogger.log(0,"- taking bidIds2 (" + filename + ") from memory");
				this.onBidIds2Loaded(storedBidIds2.data,true);			
				return;
			}
		}
		var that = this;
		var fullpath = "products/" + QB.product.id + "/BIDRULE/cmp/" + filename;
		$.ajax({
			url: fullpath,
			contentType: 'Content-type: text/plain; charset=iso-8859-1',
			beforeSend: function(jqXHR) { jqXHR.overrideMimeType('text/html;charset=iso-8859-1'); },
			success: function(text) {
				theULogger.log(0,"- read bidIds2 '" + fullpath + "'<br>");
				that.onBidIds2Loaded(text,false);
			},
			error: function(msg) {
				theULogger.error("could not get bidIds2 '" + fullpath + "'<br>" + msg);
			}
		  });			
	}

	loadHelp() {
		// load key/value pairs from a HELP file (UTF-8 encoded)
		this.helpItemTitles={};
		this.helpItemTexts={};
		if (qbServerMode == "file") {
            for(var line of qbHelpData.split("\n")) {
				if (line && line[0]==".") {
					if (line[1]!="=") {
						var id = line.substr(1).replace(/ *=.*/,'',line).trim();
						QB.helpItemTitles[id] = line.replace(/^.*?= */,'',line);
						QB.helpItemTexts[id] = "";
					}
				}
				else {
				    QB.helpItemTexts[id] += (line+"<br/>");
				}
			}		
		}
		else {
		  var path = "products/" + this.product.id;
		  if (this.product.type == "play") 
			 path += "/MANUAL/" + theLang.letter3(theLang.lang).toUpperCase();
		  path += "/BRIDGE.HLQ";
		  $.ajax({
			url:	path,
			success:function(data) {
				for(var line of data.split("\n")) {
					if (line && line[0]==".") {
						if (line[1]!="=") {
							var id = line.substr(1).replace(/ *=.*/,'',line).trim();
							QB.helpItemTitles[id] = line.replace(/^.*?= */,'',line);
							QB.helpItemTexts[id] = "";
						}
					}
					else {
					    QB.helpItemTexts[id] += (line+"<br/>");
					}
				}
			},
			error:	function(XMLHttpRequest, textStatus, errorThrown) {
				theULogger.error('could not read BRIDGE:HLQ, status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
			}
		  });
		}
	}

	showHelpText(id) {
		var helpTitle = this.helpItemTitles[id];
		var notFound = false;
		if (!helpTitle || helpTitle == "")  {
		    helpTitle = "<b>no help found for " + id + "</b";
		    notFound = true;
		}
	    $("#QHelpWindow").dialog({
			position: {my:'left top',at:'left+' + $("#PlayWin").width() + ' top+' + 10},
			width: 380,
			title: helpTitle, // debug only: + " (" + id + ")",
		});
		var html = "<p>";
		if (!notFound) {
			html += this.helpItemTexts[id]
				.replace(/\\cb(.*?)\\cn/g,"<span style=color:#04c>$1</span>")
				.replace(/\\cr(.*?)\\cn/g,"<span style=color:#c40>$1</span>")	
				.replace(/\\cg(.*?)\\cn/g,"<span style=color:#0c4>$1</span>")
				.replace(/\\cy(.*?)\\cn/g,"<span style=color:#cc0>$1</span>")
				.replace(/\t/g,"&nbsp;&nbsp;")
				.replace(/\ \ /g,"&nbsp;")
				;
			// html += this.helpItemTexts[id].replace(/\\cb(.*?)\\cn/g,"<b>$1</b>");
		}
		$("#QHelpWindow").html(html);
	}
}

// ======================================================= MAIN ENTRY POINT

var QB	= new QBApp();	// global application instance
var QBM = null;			// global instance for model (application core)

$(window).on('load',QB.setupAndStart);	// let jquery kick off the whole application after the load has completed
