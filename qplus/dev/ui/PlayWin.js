
class PlayWin extends View {

	constructor(app) {
		super(app);

		theLang.add({
			PlayTabHelp: {
				en: "?",
			},
			PlayTabFullScreen: {
				en: "❐",
			},
		});

		// the tabs
		this.tableTab	 = new TableTab(app);
		this.actionsTab   = new ActionsTab(app);
		this.configTab   = new ConfigTab(app);
		this.recordTab  = new RecordTab(app);	

		if (QB.product.type=="tut") {
			$("#PlayTabMenu")	.parent().removeClass("tab").addClass("notab");
			// $("#PlayTabMatch")	.parent().removeClass("tab").addClass("notab");
			// $("#PlayTabDeals")	.parent().removeClass("tab").addClass("notab");
			// $("#PlayTabScore")	.parent().removeClass("tab").addClass("notab");				
			// $("#PlayTabBDL")	.parent().removeClass("tab").addClass("notab");
			// $("#PlayTabFilter")	.parent().removeClass("tab").addClass("notab");
			// $("#PlayTabHands")	.parent().removeClass("tab").addClass("notab");
			$("#PlayTabHelp").hide();
			this.tutorialTab = new TutorialTab(app);
			this.conceptsTab = new ConceptsTab(app);			
			this.tabs		 = [this.tableTab,this.recordTab, this.actionsTab,
								this.tutorialTab,this.configTab,this.conceptsTab];
		}
		else {
			$("#PlayTabMenu")	.parent().removeClass("tab").addClass("notab");		
			// $("#PlayTabTutorial").parent().removeClass("tab").addClass("notab");
			$("#PlayTabHelp").hide();			
			// this.menuTab	 = new MenuTab(app);							
			this.matchTab 	 = new MatchTab(app);
			this.dealsTab 	 = new DealsTab(app);	
			this.scoreTab 	 = new ScoreTab(app);			
			// this.bdlTab 	 = new BDLTab(app);
			// this.filterTab 	 = new FilterTab(app);
			// this.handsTab 	 = new HandsTab(app);
			this.conceptsTab = new ConceptsTab(app);
			this.bidsysWin   = new BidsysWin(app);
			this.tabs		 = [this.tableTab,this.recordTab, /* this.protocolTab, */
								this.actionsTab,this.configTab, this.matchTab, this.dealsTab, 
								this.scoreTab, this.bidsysWin, this.conceptsTab];		
		}

		this.title		 = "";
		this.source		 = "";
		this.PWwidth  = 600; 
		this.PWheight = 400; 
	}

	init() {

		// symbols for translation
		theLang.add({

			PlayWin: {
				en: "Play",
				de: "Spiel",
				fr: "Donne",
				it: "Gioco",
				es: "Juego",
				dk: "Spil",				
			},
			PlayTabToDo: {
				en: "To Do",
			},
			StepKind_G: {
				en: "guided play",
				de: "geführtes Spiel",
				fr: "Donne",
			},
			StepKindPlural_G: {
				en: "Guided plays",
				de: "geführte Spiele",
				fr: "Donnes Pas à Pas",
			},			
			StepKind_Q: {
				en: "Quiz",
				de: "Übung",
				fr: "Quiz",
			},
			StepKindPlural_Q: {
				en: "Quizzes",
				de: "Übungen",
				fr: "Quizzes",
			},			
			StepKind_P: {
				en: "Play",
				de: "Spiel",
				fr: "Exercice",
			},
			StepKindPlural_P: {
				en: "Plays",
				de: "Spiele",
				fr: "Exercices",
			},			
			StepKind_T: {
				en: "Tutorial",
				de: "Grundlage",
				fr: "Introduction",
			},			
			StepKindPlural_T: {
				en: "Tutorials",
				de: "Grundlagen",
				fr: "Introductions",
			},					
		});

		// event hook on resize
		$("#PlayWin").bind("dialogextendmaximize",function(){QB.playWin.resize(true);});
		$("#PlayWin").bind("dialogextendrestore",function(){setTimeout(function(){QB.playWin.resize(true);},150);});

		// initialize tabs
		for (var tab of this.tabs) tab.init();

		$("#PlayArea").bind('easytabs:before', function(evt,tab) {
			var id=tab[0].id.replace("PlayTab","");
			theULogger.log(1,"- PlayWin:easytabs:before " + id);			
			if (id == "Actions") QB.playWin.actionsTab.onTabBefore();
			if (id == "Config")  QB.playWin.configTab.onTabBefore();			
			if (id == "Tutorial") QB.playWin.tutorialTab.onTabBefore();						
			if (id == "Table") QB.playWin.tableTab.onTabBefore();	
			if (id == "Match") QB.playWin.matchTab.onTabBefore();			
			if (id == "Score") QB.playWin.scoreTab.onTabBefore();
			if (id == "ScoreTabOverview") QB.playWin.scoreTab.scoreTabOverview.onTabBefore();
			if (id == "ScoreTabDetails1") QB.playWin.scoreTab.scoreTabDetails1.onTabBefore();
			if (id == "ScoreTabDetails2") QB.playWin.scoreTab.scoreTabDetails2.onTabBefore();			
			if (id == "Deals") QB.playWin.dealsTab.onTabBefore();	
			if (id == "DealTabPairTF") QB.playWin.dealsTab.dealTabPairTF.onTabBefore();	
			if (id == "DealTabTeamTF") QB.playWin.dealsTab.dealTabTeamTF.onTabBefore();	
			if (id == "DealTabOwn")    QB.playWin.dealsTab.dealTabOwn.onTabBefore();	
			if (id == "DealTabFiles")  QB.playWin.dealsTab.dealTabFiles.onTabBefore();			
		});
		// on small vertical screens (when the available height for the table is < 400 px):
		// maximize all PlayTabs (except the TableTab) when they become active		
		$("#PlayArea").bind('easytabs:after', function(evt,tab) {
			var id=tab[0].id.replace("PlayTab","");
			theULogger.log(1,"- PlayWin:easytabs:after " + id);			
			QB.playWin.lastSelectedTab=id;
			if (id=="Table") {
				$("#PlayWin").dialogExtend("restore");
				// $(".QB #table").focus();
			}
			else {
				if ($("#PlayWin").height()<400 && $(window).width()<$(window).height()) {
					$("#PlayWin").dialogExtend("maximize");
				}
			}
			QB.winManager.onResizeStop("PlayWin");
		});
	}

	resize(isLast) {
		this.PWwidth  = Math.floor($("#PlayWin").width());
		this.PWheight = Math.floor($("#PlayWin").height());
		theULogger.log(1,"- PlayWin::resize w:" + this.PWwidth + " h:" + this.PWheight);	
		// forward resize event to tableTab
		this.tableTab.resize(isLast);
	}

	selectTab(tab) {
		// select one of the tabs
		// if tab=="" select the previous tab
		if (tab=="") tab=this.lastSelectedTab;
		this.lastSelectedTab = tab;
		$("#PlayArea").easytabs("select","#PlayTab"+tab);
	}

	setTitle() {
		// set the title text of the dialog window
		var gameId = QBM.game.id;
		var contract="";
		if (QBM.game.contract!=null) {
			contract = "<span style='margin-left:30px;padding-left:10px;padding-right:10px;background-color:yellow'>";
			if (this.tableTab && this.tableTab.displayTrumpOnly) {
				contract +=   QBM.game.contract.declarer.letter + " " + theLang.tr("plays")
						    + " " + QBM.game.contract.toHtmlTrumpOnly();	
			}
			else {
			    contract += QBM.game.contract.toHtml();
			}
			contract += "</span>";			
		}
		var productLabel = "";
		if (QB.mode == "expert") 
			productLabel = "<i><small>" + QB.product.id + "</small></i> &nbsp; ";
		var gameKindText = "";
		var gameIdText = "";
		var gameSource = "";		
		if (QB.product.type == "tut") {
			if (   QB.product.id != "pa2" && QB.product.id != "pa3" && QB.product.id != "pa4"
				&& QB.product.id != "ti1" && QB.product.id != "ti2"
				&& (   QBM.game.gameKind == "P" 
					|| QBM.game.gameKind == "G" && QB.product.id == "pap") ) {
				gameKindText = " : " + theLang.tr("StepKind_" + QBM.game.gameKind);
				gameIdText = " " + gameId;
			}		
		}
		else {
			if (this.PWwidth > 400) { 
				gameSource = "<span style='margin-right:10px'><small>" + this.source + "</small></span>";
				// else not enough space for that on small screens
			} 
			gameKindText = "<span style='margin-left:10px'><small>" + QBM.game.gameSequence + "</small></span>";
		}
		var miniBridge = "";
		if (QBM.game.isMini) miniBridge = "<span style='margin-left:30px'><small>(MiniBridge)</small></span>";
		QB.winManager.setDialogTitle("PlayWin",
			  productLabel + gameSource + QBM.game.gameText + gameKindText + gameIdText
			+ " " + contract + miniBridge
			);
	}
	
	clearTitle() {
		QB.winManager.setDialogTitle("PlayWin",theLang.tr("PlayWin"));
	}

	showTab(name,show) {
		$("#PlayTab"+name).show(show);
	}
	
	loadLabels() {
		QB.playWin.tableTab.loadLabels();	
		$("#PlayTabRecord").attr("title",theLang.tr("PlayTabRecordTitle"));			
		$("#PlayTabTutorial").attr("title",theLang.tr("PlayTabTutorialTitle"));	
		// $("#PlayTabConfig").attr("title",theLang.tr("PlayTabConfigTitle"));
		$("#PlayTabConcepts").attr("title",theLang.tr("PlayTabConceptsTitle"));	
	}

	onChanged(what) {
		// receive results from the Model
		theULogger.log(1,'PlayWin:onChanged ' + what.type);
		if 		(what.type=="source") {
			this.source=what.name;
			this.setTitle();
		}
		else if (what.type=="new game") {
			this.setTitle();
		}
	}

	coloring(text) {
		var ttext = text
			.replace(/♦/g,"<span	style='color:red'>♦</span>")
			.replace(/♥/g,"<span	style='color:red'>♥</span>")
			.replace(/_/g,'') // underscore is used to mark simple letters as suits
		;
		if (theLang.lang=="de") {
			return ttext.replace(/NT/g,"<span	style='color:green'>SA</span>")
		}
		else {
			return ttext.replace(/NT/g,"<span	style='color:green'>NT</span>")
		}
	}

	bidToSymbol(text) {
		if (text=="no contract" || text=="passed out") return text;
		return text
			.replace(/d/g ,"&diamS;")
			.replace(/s/g ,"&spades;")
			.replace(/c/g ,"&clubs;")
			.replace(/h/g ,"&hearts;")
			.replace(/diamS/g ,"diams")
			.replace(/nt/g,"<span	style='color:darkgreen'>"+theLang.tr('suit_NT')+"</span>")
			.replace(/&hearts;/g,"<span	style='color:red'>&hearts;</span>")
			.replace(/&diams;/g,"<span	style='color:red'>&diams;</span>")
		;
	}

	formatHint(hint,conv) {

		if (theLang.lang=="de") {
			hint= hint
				.replace(/OF/g,"♥♠")
				.replace(/UF/g,"♣♦")
				.replace(/f([<>_=])/g,"♣♦♥♠$1")
				.replace(/p([<>_=])/g,"♠$1")
				.replace(/c([<>_=])/g,"♥$1")
				.replace(/k([<>_=])/g,"♦$1")
				.replace(/t([<>_=])/g,"♣$1")
			;
		}
		else {
			hint= hint
				.replace(/MAJ/g,"♥♠")
				.replace(/MIN/g,"♣♦")
				.replace(/any([<>_=])/g,"♣♦♥♠$1")
				.replace(/s([<>_=])/g,"♠$1")
				.replace(/h([<>_=])/g,"♥$1")
				.replace(/d([<>_=])/g,"♦$1")
				.replace(/c([<>_=])/g,"♣$1")
			;
		}
		hint=htmlEscape(hint);
		if (hint.substr(-1)=="@") {
			hint= hint.replace(/@([^@]+)@/g,"<i>$1</i>");
			if (conv!="") hint=hint+"<i>"+conv+"</i>";
		}
		else {
			hint= hint.replace(/@([^@]+)@/g,"<i>$1</i>");
			if (conv!="") hint=hint+" &nbsp; <i>"+conv+"</i>";
		}
		return this.coloring(hint);
	}

	loadDeal(id) {
		// load a deal from BDL and select the table tab
		QBM.game.loadFromBDL(QBM.bdl.parse(id,true),"fix");
		QB.playWin.selectTab("Table");
	}

}
