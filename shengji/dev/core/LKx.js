"use strict";

class LKx {
	// a class which can
	// (1) parse a String in LKx format
	// (2) produce a string in LKx format from a parsed object

	constructor() {
		this.defineSymbols();
	}

	defineSymbols() {
		// provide language specific translations for keywords used in LKx

		if (isPresent(LangDef.tr.tut_Collection)) return;

		theLang.add({
			tut_DocType: {
				en: "DOCTYPE",
			},
			tut_Collection: {
				en: "Collection",
				de: "Sammlung",
				es: "Colleción",
			},
			tut_Section: {
				en: "SECTION",
				de: "ABSCHNITT",
				es: "SECIÓN",
			},
			tut_DemoStep: {
				en: "DEMO-STEP",
				de: "DEMO-SCHRITT",
				es: "DEMO-PASO",
			},
			tut_Step: {
				en: "STEP",
				de: "SCHRITT",
				es: "PASO",
			},
			tut_Set: {
				en: "Set",
			},
			tut_Sound: {
				en: "Sound",
				de: "Ton",
				es: "Sonido",
			},
			tut_Text: {
				en: "Text",
				de: "Text",
				es: "Texto",
			},
			// ------------------
			tut_Subject: {
				en: "* Subject",
				de: "* Thema",
				es: "* Tema",
			},
			// ------------------
			tut_BidSeq: {
				en: "Bids",
				de: "Gebote",
				es: "Declaraciones",
			},
			tut_BidSeqNew: {
				en: "new",
				de: "neu",
				es: "nuevo",
			},
			tut_BidSeqAdd: {
				en: "add",
				de: "dazu",
				es: "añadir",
			},

			tut_Quiz: {
				en: "Quiz",
			},
			tut_QuizEnd: {
				en: "Quizend",
				de: "Quizende",
			},
			tut_SelectQuiz: {
				en: "Select-Quiz",
				de: "Auswahl-Quiz",
			},
			tut_InCaseOf: {
				en: "If",
				de: "Falls",
				es: "Si",
			},

			tut_Def: {
				en: "Def",
			},
			tut_Explanation: {
				en: "Explanation",
				de: "Erklaerung",
				es: "Explanación",
			},
			tut_Lead: {
				en: "Lead",
				de: "Ausspiel",
				es: "attaca",
			},
			tut_Target: {
				en: "Target",
				de: "Ziel",
				es: "objetivo",
			},

			tut_PlayMoves: {
				en: "PlayMoves",
				de: "Spielfolge",
				es: "PasosDeJuego",
			},
			tut_ProgPlay: {
				en: "ProgPlay",
				de: "ProgSpiel",
				es: "ProgJuega",
			},
			tut_ShowGame: {
				en: "ShowGame",
				de: "ZeigeSpiel",
				es: "MuestraJuego",
			},
		});
	}

	setLang(lang) {
		// define some term translations based on the language of the LKx file

		var appLang = theLang.lang;
		theLang.lang = lang;	// temporarily change language
		this.tr = {
			DocType:		theLang.tr("tut_DocType"),
			Collection:		theLang.tr("tut_Collection"),
			Section:		theLang.tr("tut_Section"),
			DemoStep:		theLang.tr("tut_DemoStep"),
			Step:			theLang.tr("tut_Step"),
			SoundPattern:	new RegExp("^ *"+theLang.tr("tut_Sound")+" *: *"),
			TextPattern:	new RegExp("^ *"+theLang.tr("tut_Text")+" *: *"),
			SetPattern:		new RegExp("^ *"+theLang.tr("tut_Set")+" *"),
			Quiz:			theLang.tr("tut_Quiz"),
			SelectQuiz:		theLang.tr("tut_SelectQuiz"),
			QuizEnd:		theLang.tr("tut_QuizEnd"),
			InCaseOf:		theLang.tr("tut_InCaseOf"),
			Def:			theLang.tr("tut_Def"),
			Explanation:	theLang.tr("tut_Explanation"),
			Lead:			theLang.tr("tut_Lead"),
			ShowGamePattern:new RegExp("^ *"+theLang.tr("tut_ShowGame")+" *"),
			PlayMoves:		theLang.tr("tut_PlayMoves"),
			Subject:		theLang.tr("tut_Subject"),
			Deal:			theLang.tr("bdl_Deal")+" ",
			Dealer:			theLang.tr("bdl_Dealer")+" ",
			Vuln:			theLang.tr("bdl_Vuln")+" ",
			Cards:			theLang.tr("bdl_Cards")+" ",
			BidSeq:			theLang.tr("tut_BidSeq")+" ",
			BidSeqNew:		theLang.tr("tut_BidSeqNew"),
			BidSeqAdd:		theLang.tr("tut_BidSeqAdd"),
			ProgPlay:		theLang.tr("tut_ProgPlay"),
			Target:			theLang.tr("tut_Target"),
			Result:			theLang.tr("bdl_Result")+" ",
		}
		theLang.lang = appLang;		// restore application language
	}

	parse(text) {
		// analyse the LKx text; store and return {head{},sections[]}

		/*
		this.head
			docType
			collection
			demoSteps[
				stepNumber							"C.3.S.3"
				keyA								"xxxx-xxxx-xxxx"
				keyB								"yyyy-yyyy-yyyy"
			]
			macros{
				<name> : <value>					$xxx : yyy
			}
		this.sections[]
			id										"CHANCEN"
			name									".."
			longName								".. .. .."
			steps[]
				number								"8.1"
				name								"Wahrscheinlichkeiten"
				sets[]
					cmd								"zeige-Default-Namen 1"
					texts[]							"some text" , "some other text"
				quiz								optional quiz (as string)
				deal
					id								2
					major							1
					minor							2
					subject							"Expass vs 3-3 Verteilung"
					vuln							"E/W"
					dealer							"S"
					cards
						N
							s[]						"A","Q","8","2"
							..
						..
					biddings[]
						bids						" - 1nt -"
						quiz[]
							bid						"1d"
							quality					"ok" or "F"
							number					0
							text					"..."
							sound					"filename"
					bids[]							[ "-", "1d", "-", "1s", .. ]
					meanings[]						[]
					def
						assumptions					"HP_Range,S,125,135,145 & .."
						set							"hervor 1nt 3nt"
						sound						"filename"
						text						"..."
					progPlays
						userCards[]					[ "h4", "h6", .. ]
						value						20
						x							"l"
						ys[]
							y						"h"
							cards[]					[ "dJ", "d7", d6", .. ]
					playMoves[]
						userCards[]					[ "dK", "d[23]", "d[4-9]", .. ]
						card						"dA"
					tricks[]						[]
					lead							"hJ"
					target
						tricks						0 (corresponds to "=")
						sound						"filename"
						text						"..."
					result
						tricks						">= 0"
						sound						"filename"
						text						"..."
					explanations[]
						show						"neu W: hJ"
						sound						"ErklS2"
						text						"Sie zählen 7 Sofortstiche:\n.."
		*/

		// We want to re-use some functions from the BDL parser
		// so we must make sure it knows about the language of our LKx file

		this.setLang	(QB.product.lang);
		QBM.bdl.setLang	(QB.product.lang);

		// loop over the text lines
		// parse the content of the LKx file and build a (huge) object

		this.head={ demoSteps:[], macros:{} };
		this.sections=[];	// the RESULT := ARRAY OF SECTIONS

		var section, step, set, deal, bidding, quizCase, explanation;
		var sectionNr=0;
		var stepNr;

		var cardLines=[];
		var bids="";		// string seq of bids
		var allSounds = {};	// a map of all sounds of the section
		var target;

		var state = "LKx";

		var lines = text.split("\n");
		var l=-1;

		for(var l=0;l<lines.length;l++) {
			var line = lines[l].trim();
			var words = line.split(/\s+/);
			var body = line.replace(/^ *[^ :]+ *:? */,'').trim();

			// ignore empty lines
			if (line.trim()=="") continue;

			// ignore ----- cardLines
			if (line.trim().replace(/-/g,'')=="") continue;

			// DocType
			if (line.indexOf(this.tr.DocType+" ")==0) {
				this.head.docType = body;
				continue;
			}

			// DemoStep
			if (line.indexOf(this.tr.DemoStep+" ")==0) {
				this.head.demoSteps.push({stepNumber:words[1],keyA:words[2],keyB:words[3]});
				continue;
			}

			// Macro
			if (line.indexOf("$")==0) {
				this.head.macros[words[0]] = line.replace(/^.*?: */,'');
				if (l<lines.length-1) {
					for(l++;l<lines.length;l++) {
						if (lines[l].match(/^ +"/)) {
							this.head.macros[words[0]]+= "\n"+lines[l].replace(/^ +" */,'');
						}
						else {
							l--;
							break;
						}
					}
				}
				continue;
			}

			// Collection
			if (line.indexOf(this.tr.Collection+" ")==0) {
				this.head.collection = {
					name: body.replace(/.*=\s*"/,"").replace(/"\s*/,""),
				}
				continue;
			}

			// SECTION
			if (line.indexOf(this.tr.Section+" ")==0) {
				if (words[2]==1) sectionNr++;
				section = {
					id:"C."+sectionNr+(words[2]=="1" ? "" : "."+words[2])+".",
					nr:sectionNr+(words[2]=="1" ? "" : "."+words[2]),
					name:words[3].replace(/"/g,""),
					longName: body.replace(/.* = *"/,"").replace(/" */,""),
					steps:[],
				}
				stepNr=-1;
				step=null;
				this.sections.push(section);
				state="section";
			}

			// TEXT
			else if (line.match(this.tr.TextPattern)) {
				var text=body.replace(/"/g,'');
				if (l<lines.length-1) {
					for(l++;l<lines.length;l++) {
						if (lines[l].match(/^ +"/)) {
							text+="\n"+lines[l].replace(/^ +"/,'');
						}
						else {
							l--;
							break;
						}
					}
				}
				if 		(state=="step") {
					if (set==null) {
						var x=1;
					}
					else set.texts.push(text);
				}
				else if (state=="quiz") quizCase.text=text;
				else if (state=="selectQuiz") quizCase.text=text;
				else if (state=="explanation") explanation.text=text;
				else if (state=="target") step.deal.target.text=text;
				else if (state=="result") step.deal.result.text=text;
				else if (state=="def") step.deal.def.text=text;
			}

			// STEP
			else if (line.indexOf(this.tr.Step+" ")==0) {

				// finish previous step
				if (step && step.deal) this.finishStep(step.deal,bids);
				bids="";
				set=null;
				deal=null;
				var name="";
				if (words.length>3) {
					name=words.slice(3,words.length-1).join(" ").replace(/"/g,'');
				}
				step = {
					nr: ++stepNr,
					number: section.id+"S."+words[1],
					name:	name,
					kind:	(words.length>=3) ? words[2].substr(1) : "P",
					sets:	[],
					deal:	null,
				};
				section.steps.push(step);
				state="step";
			}

			// Deal
			else if (!line.indexOf(this.tr.Deal))	{
				deal= {
					id:			step.number,
					major:		step.number.replace(/[.].*/,""),
					minor:		(step.number.indexOf(".")>0) ? step.number.replace(/.*[.]/,"") : 1,
					subject:	"",
					vuln:		"---",
					dealer:		"",
					bids:		[],
					cards:		{N:{s:"",h:"",d:"",c:""},E:{s:"",h:"",d:"",c:""},S:{s:"",h:"",d:"",c:""},W:{s:"",h:"",d:"",c:""} },
					biddings:	[],
					progPlays:	[],
					meanings:	[],
					lead:		"",
					tricks: 	[],
				}
				step.deal=deal;
				bids="";
				state="deal";
			}

			// Subject
			else if (!line.indexOf(this.tr.Subject)) {
				deal.subject=line.replace(/^.*?: */,'');
			}

			// Dealer
			else if (!line.indexOf(this.tr.Dealer)) {
				deal.dealer=QBM.bdl.tr[body];
			}

			// Vulnerability
			else if (!line.indexOf(this.tr.Vuln)) {
				deal.vuln=QBM.bdl.tr[body];
			}

			// Cards
			else if (!line.indexOf(this.tr.Cards)) {
				if (body.indexOf(":") >= 0) {
					// one hand is given in one line
					var cardsPlayer,cardsSuit;
					var cardState="player";
					var skipSpace=false;
					for (var c of body.split('')) {
						if (c==' ' || c=="\t") {
							if (skipSpace) continue;
							if (cardState=="values")	cardState="suit";
						}
						else if (c==":") {
							if 		(cardState=="player") 	cardState="suit";
							else if (cardState=="suit") 	cardState="values";
						}
						else if (cardState=="player") {
							cardsPlayer=c.toUpperCase();
						}
						else if (cardState=="suit") {
							cardsSuit=QBM.bdl.tr[c.toLowerCase()];
							skipSpace=true;
						}
						else if (cardState=="values") {
							deal.cards[cardsPlayer][cardsSuit]+=c+" ";
							skipSpace=false;
						}
					}

				}
				else {
					cardLines=[body];
					for(var n=0;n<11;n++) {
						cardLines.push(lines[++l].replace(/^ *: */,'').trim());
					}
					QBM.bdl.parseCardLines(deal,cardLines);
				}
			}

			// Bid Sequence
			else if (!line.indexOf(this.tr.BidSeq)) {
				state="bidding";
				if (body.toLowerCase().replace(/ .*/,'')==this.tr.BidSeqNew) {
					bidding={bids:"",quiz:[]};
					deal.biddings.push(bidding);
				}
				else if (body.toLowerCase().replace(/ .*/,'')==this.tr.BidSeqAdd) {
					bidding={bids:"",quiz:[]};
					deal.biddings.push(bidding);
				}
			}

			// Quiz
			else if (!line.indexOf(this.tr.Quiz)) {
				state="quiz";
			}

			// SelectQuiz
			else if (!line.indexOf(this.tr.SelectQuiz)) {
				step.quiz=line;
				while(++l<lines.length) {
					step.quiz+="\n"+lines[l];
					if (lines[l].trim().indexOf(this.tr.QuizEnd)==0) break;
				}
			}

			// In Case Of (Quiz / SelectQuiz)
			else if (!line.indexOf(this.tr.InCaseOf)) {
				var bid=QBM.bdl.translateBids(words[1].toLowerCase())[0];
				var quality = body.replace(/.*\<([^>]+)\>.*/,"$1");
				quizCase = {bid:bid,quality:quality};
				if (words.length>=4) quizCase.number=parseInt(words[3]);
				if (state=="selectQuiz") step.quiz.push(quizCase);
				if (typeof bidding!="undefined") bidding.quiz.push(quizCase);
				if (quality=="ok") {
					// the correct (expected) bid
					bids+= " "+body.replace(/ .*/,'');
				}
			}

			// QuizEnd
			else if (!line.indexOf(this.tr.QuizEnd)) {
				state="bidding";
			}

			// Def
			else if (!line.indexOf(this.tr.Def)) {
				state="assumptions";
				deal.def={assumptions:body};
			}
			else if (state=="assumptions" && !line.trim().indexOf("&")) {
				deal.def.assumptions+=line.replace(/^ *[&] */,'');
			}

			// Explanation
			else if (!line.indexOf(this.tr.Explanation)) {
				if (state=="assumptions") {
					state="def";
				}
				else {
					deal.explanations=[explanation={}];
					state="explanation";
				}
			}

			// ShowGame
			else if (line.match(this.tr.ShowGamePattern)) {
				state="explanation";
				explanation= {show:body};
				// ignore the very last "ZeigeSpiel klar"
				if (deal!=null) deal.explanations.push(explanation);
			}

			// PlayMoves
			else if (!line.indexOf(this.tr.PlayMoves)) {
				deal.playMoves=[this.translatePlayMove(body)];
				state="playMoves";
			}

			// Program Play
			else if (!line.indexOf(this.tr.ProgPlay)) {
				deal.progPlays=[this.translateProgPlay(words)];
				state="playing";
			}

			// Lead
			else if (!line.indexOf(this.tr.Lead)) {
				deal.lead=QBM.bdl.translateCard(body.trim().toLowerCase());
				state="lead";
			}

			// Target
			else if (!line.indexOf(this.tr.Target)) {
				var nr = body;
				if (nr=="=") nr=0;
				else nr=parseInt(nr)
				deal.target={tricks:nr};
				state="target";
			}

			// Result
			else if (!line.indexOf(this.tr.Result)) {
				deal.result={tricks:body};
				state="result";
			}


			// DATA
			else if (!line.indexOf(">")) {
				if (state=="bidding") {
					body = line.substr(1).trim().replace(/\[a\]/g,'~').toLowerCase();
					bids += " "+body;
					var bidseq = QBM.bdl.translateBids(body).join(" ");
					bidding.bids += " "+bidseq;
				}
				else if (state=="playing") {
					deal.progPlays.push(this.translateProgPlay(words));
				}
				else if (state=="playMoves") {
					deal.playMoves.push(this.translatePlayMove(body));
				}
			}

			// SET
			else if (line.match(this.tr.SetPattern)) {
				if 		(state=="step") 		{ set = {cmd:body,texts:[]}; step.sets.push(set); }
				else if (state=="def")			set = step.deal.def.set=body;
				else if (state=="explanation")	set = explanation.set=body;
			}

			// SOUND
			else if (line.match(this.tr.SoundPattern)) {
				allSounds[step.number+":"+body]=true;	 // add to prefetch candidates
				if 		(state=="quiz") quizCase.sound=body;
				else if (state=="explanation") explanation.sound=body;
				else if (state=="target") step.deal.target.sound=body;
				else if (state=="result") step.deal.result.sound=body;
				else if (state=="def") step.deal.def.sound=body;
			}

			else if (line.match(/^ *[*]/)) {
				// console.log("LKX parse: comment ignored: "+line);
			}
			else {
				console.log("LKX parse: ?? "+line);
			}
		}

		// finish last step
		if (section.steps.length>0) this.finishStep(deal,bids);

		return { head:this.head, sections:this.sections };
	}

	translatePlayMove(body) {
		// convert PlayMove chapter to internal (English) notation

		var parts = body.split(/ *-> */);
		var userCards=[];
		for (var userC of parts[0].replace(/ .*/,'').split(/,/)) {
			if (userC=="") continue;
			userCards.push(QBM.bdl.translateCard(userC));
		}
		return {userCards:userCards, card: parts.length>1 ? QBM.bdl.translateCard(parts[1]) : null};
	}

	translateProgPlay(words) {
		// convert ProgPlay chapter to internal (English) notation

		var userCards=[];
		for (var userC of words[1].split(",")) {
			userCards.push(QBM.bdl.translateCard(userC));
		}
		var progPlay = {userCards:userCards, value: parseInt(words[2]), x:words[3]};
		if (words.length>4 && words[4]!="") {
			progPlay.ys=[];
			for (var w=4;w<words.length;w++) {
				progPlay.ys.push({y:words[w].replace(/:.*/,''),cards:[]});
				for (var userC of words[w].replace(/^.*:/,'').split("|")) {
					if (userC=="") continue;
					progPlay.ys[progPlay.ys.length-1].cards.push(QBM.bdl.translateCard(userC));
				}
			}
		}
		return progPlay;
	}

	finishStep(deal,bids) {
		// convert cards and bids to internal (English) notation
		QBM.bdl.translate((deal==null ? {} : deal),bids.toLowerCase());
	}

	stringify(tut) {
		var text=QBM.tutorial.step.number+"\n";
		for (var section of tut.sections) {
			text+= "---------------------------------------------------------------\n";
			text += this.tr.Section + ' ['+section.name+'] '+section.nr+' "'+section.name+'" = "'+section.longName+'"\n';
			text+= "---------------------------------------------------------------\n";

			for (var step of section.steps) {
				text+= "\n"+this.tr.Step.padEnd(7)+" "+(step.nr+1) + "\n";
				text+= this.tr.Deal.padEnd(8)+": "+this.tr.BidSeqNew+"\n";
				if (step.deal && typeof step.deal.cards.N.s != "string") {
					text+= this.tr.Dealer.padEnd(8)+": "+step.deal.dealer+"\n";
					text+= this.tr.Vuln.padEnd(8)+": "+step.deal.vuln+"\n";
					text+= this.tr.Cards.padEnd(8)+":              "+this.vals(step.deal.cards.N.s)+"\n";
					text+=                 "        :              "+this.vals(step.deal.cards.N.h)+"\n";
					text+=                 "        :              "+this.vals(step.deal.cards.N.d)+"\n";
					text+=                 "        :              "+this.vals(step.deal.cards.N.c)+"\n";
				}

				text+= "\n---------------------------------------------------------------\n";
			}
		}

		text += "\n---------------------------------------------------------------\n";

		return text;
	}

	vals(values) {
		var text=values.join(" ");
		if (text=="") text="-";
		return text.padEnd(26);
	}

}
