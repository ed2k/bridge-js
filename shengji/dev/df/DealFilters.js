
"use strict";

class DealFilters {
	
	// contains a number of filters which can be arranged in FilterSets.
	// a FilterSet has a name, a list of groups and a list of filters;
	// each filter belongs to exactly one group
	// a filter consists of conditions which are OR-connected
	
	constructor() {
		// CONVENTIONS     shall be put between single quotes in the filter.name
		//                 in that case they will be added to the des automatically
		// EMPHASIS        can be expressed by @text@ between at-signs in the de text
		//                 it will be translated to italics
		// ABBREVIATIONS   can be used in bids: of, uf, f, g
		// AUTO-FORMATTING takes place for de texts which contain ([tkcpf]|SA)([><]|=)
		//                 and for 
		this.allFilters = [];
		var f=this.allFilters;

		// =================================== 1 in UF Eröffnung =============================================

		f.push( {	group: "1MIN", name: "Eröffnung mit 1 Treff", ors: [
				{	type:"FD-U", bids: "^1c",  								de: "t>=3, keine OF>=5, <=20FL" },
		]});
		f.push( {	group: "1MIN", name: "Zweifärber-Gegenreizung nach 1 Treff 'Ghestem'", ors: [
				{	type:"FD-G", bids: "^1c (2c~|2nt)",	 					de: "Längen mind. 5:5, 2SA= die zwei niedrigen Farben, 2t= die beiden Oberfarben" },
		]});	
		f.push( {	group: "1MIN", name: "Eröffnung mit 1 Karo", ors: [
				{	type:"FD-U", bids: "^1d",  								de: "k>=3 (meistens k>=4), keine OF>=5, <=20FL" },
		]});	
		f.push( {	group: "1MIN", name: "Zweifärber-Gegenreizung nach 1 Karo 'Ghestem'", ors: [
				{	type:"FD-G", bids: "^1d (2d~|2nt)", 					de: "Längen mind. 5:5, 2SA=die zwei niedrigen Farben, 2k=die beiden Oberfarben" },
		]});	
		f.push( {	group: "1MIN", name: "Hebung in Unterfarbe", ors: [
				{	type:"FD-U", bids: "^1c - 2c",  						de: "inverted minors ?" },
				{	type:"FD-U", bids: "^1d - 2d", 							de: "inverted minors ?" },
		]});	
		f.push( {	group: "1MIN", name: "Antwort 1 OF nach Eröffnung in UF", ors: [
				{	type:"FD-U", bids: "^1min - 1maj", 						de: "OF>=4, unlimitiert, rundenforcierend" },
		]});
		f.push( {	group: "1MIN", name: "neue Unterfarbe im Sprung 'Inverted Minors'", ors: [
				{	type:"FD-U", bids: "^1c - 2d", 							de: "?" },
				{	type:"FD-U", bids: "^1d - 3c", 							de: "?" },
		]});

		
		// =================================== 1 in OF Eröffnung =============================================

		
		f.push( {	group: "1MAJ", name: "Eröffnung mit 1 in Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1h", 								de: "c>=5, <=20FL" },
				{	type:"FD-U", bids: "^1s", 								de: "p>=5, <=20FL" },
		]});
		f.push( {	group: "1MAJ", name: "einfache Hebung in Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1h - 2h", 							de: "?" },
				{	type:"FD-U", bids: "^1s - 2s", 							de: "?" },
		]});
		f.push( {	group: "1MAJ", name: "Zweifärber-Gegenreizung nach 1 Coeur 'Ghestem'", ors: [
				{	type:"FD-G", bids: "^1h (2h~|2nt|3c~)", 				de: "Längen mind. 5:5, 2SA=die niedrigen Farben, 3t=die hohen, Überruf = die anderen" },
		]});	
		f.push( {	group: "1MAJ", name: "Zweifärber-Gegenreizung nach 1 Pik 'Ghestem'", ors: [
				{	type:"FD-G", bids: "^1p (2s~|2nt|3c~)", 				de: "Längen mind. 5:5, 2SA=die niedrigen Farben, 3t=die hohen, Überruf = die anderen" },
		]});	

		
		// =================================== 1 SA Eröffnung =============================================
		

		f.push( {	group: "1NT", name: "Eröffnung mit 1 SA", ors: [
				{	type:"FD-U", bids: "^1nt", 								de: "15..17(18-) FL, max 1 Double, beide OF<=4, evtl. eine UF=5" },
		]});
		f.push( {	group: "1NT", name: "Eröffnung mit 1 SA trotz 5er Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1nt", minCS:{O:{h:5}},				de: "15..17 FL, mit c=5 und 5-3-3-2" },
				{	type:"FD-U", bids: "^1nt", minCS:{O:{s:5}},				de: "15..17 FL, mit p=5 und 5-3-3-2" },
		]});
		f.push( {	group: "1NT", name: "Gegenreizung nach 1 SA 'Multi Landy'", ors: [
				{	type:"FD-G", bids: "^1nt 2c~",							de: "beide OF>=5-4, idealerweise beide OF>=5" },
				{	type:"FD-G", bids: "^1nt 2d~", 							de: "eine OF>5 und eine UF" },
				{	type:"FD-G", bids: "^1nt 2maj",							de: "die genannte OF>5 und eine beliebige UF>=4" },
				{	type:"FD-G", bids: "^1nt 2nt~", 						de: "beide UF>=5-5" },
		]});
		f.push( {	group: "1NT", name: "Antwort auf 'Multi Landy'", ors: [
				{	type:"FD-G", bids: "^1nt 2c~ - 2d~",					de: "k>=3(4) und p>=3" },
				{	type:"FD-G", bids: "^1nt 2c~ - 2h",						de: "c>=3, evtl. auch p>=3" },
		]});
		
		// .................................. Stayman ..........................................................

		f.push( {	group: "1NT", name: "Ein billiges Farbspiel erzwingen nach 1 SA'Garbage Stayman'", ors: [
				{	type:"FD-U", bids: "^1nt - 2c",	maxHLP:{P:{t:7}},		de: "4-4-4-1 ab 0 FL; auf jede Antwort des Eröffners passen!"},
		]});
		f.push( {	group: "1NT", name: "Nach Oberfarben fragen 'Stayman'", ors: [
				{	type:"FD-U", bids: "^1nt - 2c",	minHLP:{P:{t:8}},		de: "mind. eine OF=4 und >=8FP"},
		]});
		f.push( {	group: "1NT", name: "'Stayman'-Antwort ohne Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2d",		 			de: "keine OF=4, @Absage@" },
		]});
		f.push( {	group: "1NT", name: "Fortsetzung nach 'Stayman'-Antwort ohne Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 2nt",				de: "zu schwach, um selbst 3SA anzusagen" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 3nt",				de: "es reicht für 3SA, 6 SA sind nicht drin" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 4nt",				de: ">=17 FL, quantitative @Einladung@ zu 6 SA" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 2h",				de: "c>=5,p>=4, Werte reichen nicht ganz für 3SA" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 2s",				de: "p>=5,c>=4, Werte reichen nicht ganz für 3SA" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 3h~",				de: "p>=5,c>=4 (verweist auf die andere OF), gemeinsame Stärke reicht für 3SA, bei Fit gerne 4p_ @Smolen@" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 3s~",				de: "c>=5,p>=4 (verweist auf die andere OF), gemeinsame Stärke reicht für 3SA, bei Fit gerne 4c_ @Smolen@" },
		]});
		f.push( {	group: "1NT", name: "Einladung annehmen nach 'Stayman' ohne Oberfarben", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 2nt - 3nt",		de: "ich bin aber an der Obergrenze" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 2h - 3h",			de: "wir haben 5:3 Fit in c_, ich bin nicht an der Untergrenze" },
				{	type:"FD-U", bids: "^1nt - 2c - 2d - 2s - 3s",			de: "wir haben 5:3 Fit in p_, ich bin nicht an der Untergrenze" },
		]});
		f.push( {	group: "1NT", name: "'Stayman'-Antwort mit einer einzelnen Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2maj",					de: "genannte OF=4, andere OF<=3, @eine Oberfarbe@" },
		]});
		f.push( {	group: "1NT", name: "Fortsetzung nach 'Stayman'-Antwort mit einzelner Oberfarbe", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2maj - 2nt",			de: "verneint den OF-Fit, zeigt 9..15 FL" },
				{	type:"FD-U", bids: "^1nt - 2c - 2maj - 3nt",			de: "verneint den OF-Fit, zeigt 16..17 FL" },
				{	type:"FD-U", bids: "^1nt - 2c - 2h - 3h",				de: "Fit in OF, @Einladung@ zum Vollspiel" },
				{	type:"FD-U", bids: "^1nt - 2c - 2s - 3s",				de: "Fit in OF, @Einladung@ zum Vollspiel" },
				{	type:"FD-U", bids: "^1nt - 2c - 2h - 4h",				de: "Vollspiel mit Fit in OF" },
				{	type:"FD-U", bids: "^1nt - 2c - 2s - 4s",				de: "Vollspiel mit Fit in OF" },
		]});
		f.push( {	group: "1NT", name: "'Stayman'-Antwort mit beiden Oberfarben", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2nt~",		 			de: "beide OF=4, @beide Oberfarben@" },
		]});
		f.push( {	group: "1NT", name: "Fortsetzung nach 'Stayman'-Antwort mit beiden Oberfarben", ors: [
				{	type:"FD-U", bids: "^1nt - 2c - 2nt~ - 3min~",			de: "9-10 FV, @Transfer@ zur passenden Oberfarbe t_->c_, k_->p_" },
				{	type:"FD-U", bids: "^1nt - 2c - 2nt~ - 3maj",			de: "Fit in der genannten OF, >15FV, Schlemminteresse, fragt nach Kontrollen" },
				{	type:"FD-U", bids: "^1nt - 2c - 2nt~ - 4maj",			de: "Fit in der genannten OF, 11-15 FV, Abschluss" },
		]});

		// .................................. Farb-Transfer ..........................................................

		f.push( {	group: "1NT", name: "'Oberfarb-Transfer' einleiten", ors: [
				{	type:"FD-U", bids: "^1nt - 2[dh]~",						de: "zeigt mind. 5 Karten in der nächst-höheren OF, ab 0 Punkte, bei OF=5-5 mit k_ beginnen, @Einleitung@" },
		]});
		f.push( {	group: "1NT", name: "'Unterfarb-Transfer' einleiten", ors: [
				{	type:"FD-U", bids: "^1nt - (2s|3c)~",					de: "zeigt mind. 6 Karten in der nächst-höheren UF, ab 0 Punkte, @Einleitung@" },
		]});
		f.push( {	group: "1NT", name: "'Oberfarb-Transfer' ausführen", ors: [
				{	type:"FD-U", bids: "^1nt - 2[dh]~ - 2maj",				de: "@Ausführung@" },
				{	type:"FD-U", bids: "^1nt - 2s~ - 2nt~",					de: "beide UF>=3" },
		]});
		f.push( {	group: "1NT", name: "'Unterfarb-Transfer' ausführen", ors: [
				{	type:"FD-U", bids: "^1nt - (2s|3c)~ - 3min",			de: "@Ausführung@" },
		]});
		f.push( {	group: "1NT", name: "Gegenreizung nach ausgeführtem 'Oberfarb-Transfer'", ors: [
				{	type:"FD-G", bids: "^1nt - 2d~ - 2h x",					de: "@Informationskontra@, fast sicher p=4" },
		]});
		f.push( {	group: "1NT", name: "Weiter nach ausgeführtem 'Oberfarb-Transfer'", ors: [
				{	type:"FD-U", bids: "^1nt - 2d~ - 2h - 2s",				de: "habe zusätzlich p>=4" },
				{	type:"FD-U", bids: "^1nt - 2[dh]~ - 2maj - 2nt",		de: "habe einladende Stärke für 3SA, bin abgesehen von meiner F=5 eher gleichmäßig verteilt" },
				{	type:"FD-U", bids: "^1nt - 2[dh]~ - 2maj - 3min",		de: "habe zusätzlich mind. 4 in der genannten UF, Farbspiel ist vermutlich besser als SA" },
				{	type:"FD-U", bids: "^1nt - 2[dh]~ - 2maj - 3nt",		de: "wir sind stark genug für 3SA, bin abgesehen von meiner F=5 eher gleichmäßig verteilt, ist dir 4 in OF lieber?" },
				{	type:"FD-U", bids: "^1nt - 2s~ - 2nt~ - 3maj~",			de: "benennt die lange UF: c_->t_, p_->k_" },
		]});

		// .................................. Quantitative Gebote ..........................................................

		f.push( {	group: "1NT", name: "Einladung mit 2SA zu 3 SA", ors: [
				{	type:"FD-U", bids: "^1nt - 2nt",						de: ">=8FP, keine OF=4, quantitative @Einladung@ zu 3 SA bei Werten des Eröffners an der Obergrenze" },
		]});
		f.push( {	group: "1NT", name: "Einladung mit 2SA zu 3 SA annehmen", ors: [
				{	type:"FD-U", bids: "^1nt - 2nt - 3nt",					de: "ja, ich habe Maximum (17FL)" },
		]});
		f.push( {	group: "1NT", name: "direkt nach 3SA, dem Gegner nicht zu viel verraten", ors: [
				{	type:"FD-U", bids: "^1nt - 3nt",						de: "keine OF=4, 10-15 FL, es reicht für 3 SA (aber 6SA sind nicht drin)" },
		]});
		f.push( {	group: "1NT", name: "zu 6 SA einladen", ors: [
				{	type:"FD-U", bids: "^1nt - 4nt",						de: "keine OF=4, 16-17 FL, quantitative @Einladung@ zu 6 SA bei Werten des Eröffners an der Obergrenze" },
		]});
		f.push( {	group: "1NT", name: "zu 6 oder 7 SA einladen", ors: [
				{	type:"FD-U", bids: "^1nt - 5nt",						de: "keine OF=4, 20-21 FL, quantitative @Einladung@ zu 7 SA bei Werten des Eröffners an der Obergrenze" },
		]});
		f.push( {	group: "1NT", name: "6 SA als Abschlussgebot", ors: [
				{	type:"FD-U", bids: "^1nt - 6nt",						de: "keine OF=4, 18-19 FL, wir spielen definitiv 6SA, (7 SA sind nicht drin)" },
		]});

		
		// =================================== 2 in OF Eröffnung =============================================
		
		
		f.push( {	group: "2MAJ", name: "mit langer OF als Eröffner sperren 'Weak Two'", ors: [
				{	type:"FD-U", bids: "^2maj",								de: "6-10 FP, gute OF=6 oder schwache OF=7, andere OF<=3, keine UF=5, kein chicane"	},
		]});
		f.push( {	group: "2MAJ", name: "Stärke zeigen nach Sperrung durch den Eröffner, 'Ogust' Frage stellen", ors: [
				{	type:"FD-U", bids: "^2maj - 2nt",						de: "Frage nach Verteilung und Stärke" },
		]});
		f.push( {	group: "2MAJ", name: "Blatt beschreiben mit 'Ogust' Antwort", ors: [
				{	type:"FD-U", bids: "^2maj - 2nt - 3c~",					de: "6-8FP, überwiegend außerhalb der gebotenen OF" },
				{	type:"FD-U", bids: "^2maj - 2nt - 3d~",					de: "6-8FP, überwiegend innerhalb der gebotenen OF" },
				{	type:"FD-U", bids: "^2maj - 2nt - 3h~",					de: "9-10FP, überwiegend außerhalb der gebotenen OF" },
				{	type:"FD-U", bids: "^2maj - 2nt - 3s~",					de: "9-10FP, überwiegend innerhalb der gebotenen OF" },
		]});

		f.push( {	group: "2MAJ", name: "mit langer, schwacher OF gegenreizen 'Weak Two'", ors: [
				{	type:"FD-G", bids: "^1min 2h", 							de: "?" },
				{	type:"FD-G", bids: "^1[cdh] 2s", 						de: "?" },
		]});
		f.push( {	group: "2MAJ", name: "als Gegner in letzter Hand im Sprung neue Farbe nennen", ors: [
				{	type:"FD-G", bids: "^2h - - 3s", 						de:"?" },
		]});

		
		// =================================== 2 SA Eröffnung =============================================
		
		f.push( {	group: "2NT", name: "Eröffnung mit 2SA", ors: [
				{	type:"FD-U", bids: "^2nt",								de: "20-21 FL, eine F=5 erlaubt" },
		]});
		f.push( {	group: "2NT", name: "nach Fit in OF fragen 'Puppet Stayman'", ors: [
				{	type:"FD-U", bids: "^2nt - 3c~",						de: "zeigt mindestens eine OF=3, @Frage@" },
		]});
		f.push( {	group: "2NT", name: "auf OF-Fitsuche antworten 'Puppet Stayman'", ors: [
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~", 					de: "mindestens eine OF=4, @Antwort@"},
				{	type:"FD-U", bids: "^2nt - 3c~ - 3maj",	 				de: "mindestens eine OF=5, @Antwort@" },
				{	type:"FD-U", bids: "^2nt - 3c~ - 3nt~", 				de: "OF<=3, @Entscheidung@" },
		]});
		f.push( {	group: "2NT", name: "Wiedergebot 'Puppet Stayman'", ors: [
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~ - 3maj~", 			de: "zeigt die jeweils _andere_ OF, @Wiedergebot@"		},
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~ - 3nt", 			de: "verneint eine eigene OF=4, @Wiedergebot@"		},
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~ - 4d~", 			de: "zeigt beide OF, mindestens 4-4, @Wiedergebot@"	},
				{	type:"FD-U", bids: "^2nt - 3c~ - 3maj - 3nt", 			de: "verneint einen 3er-Anschluss in der OF=5 des Eröffners, @Wiedergebot@"	},
		]});
		f.push( {	group: "2NT", name: "Entscheidung 'Puppet Stayman'", ors: [
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~ - 3maj~ - 3nt",	de: "leider ist es die falsche Farbe, @Entscheidung@" },
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~ - 3maj~ - 4maj",	de: "die Farbe passt, lass uns im 4-4-Fit spielen, @Entscheidung@"	},
				{	type:"FD-U", bids: "^2nt - 3c~ - 3d~ - 4d~ - 4maj", 	de: "mir gefällt die genannte Oberfarbe besser, @Entscheidung@"	},
		]});
		
		
		// =================================== 3 F Eröffnung =============================================
		
		
		f.push( {	group: "3", name: "auf 3er-Stufe mit schwacher 7er-Farbe eröffnen 'Weak Three'",	ors: [
				{	type:"FD-U", bids: "^3any",								de: "F>=7, 7..10 FP"  },
		]});
		f.push( {	group: "3", name: "auf 3er-Stufe mit schwacher 8er-Farbe eröffnen 'Weak Three'", ors: [
				{	type:"FD-U", bids: "^3any", minC: { O: [8], }, 			de: "F>=8, 6..10 FP"  },
		]});
		f.push( {	group: "3", name: "stehende Unterfarbe in der Eröffnung zeigen 'Gambling 3SA'", ors: [
				{	type:"FD-U", bids: "^3nt",  							de:"stehende UF=8" },
		]});


		// =================================== 4 F Eröffnung =============================================
		
		
		f.push( {	group: "4", name: "auf 4er-Stufe eröffnen mit schwacher Farbe 'Weak Four'", ors: [
				{	type:"FD-U", bids: "^4any",								de: "F>=8, 8..10 FP"  },
		]});

		
		// =================================== 5 F Eröffnung =============================================
		
		
		f.push( {	group: "5", name: "auf 5er-Stufe eröffnen 'Weak Five'", ors: [
				{	type:"FD-U", bids: "^5any",								de: "F>=9, ? FP"  },
		]});

		
		f.push( {	group: "DOUBLE-P", name: "erfolgreiches Strafkontra", ors: [
				{	type:"FD-G", bids: " x$", result: "-", declarer:"D",	de: "selbsbewusstes @Strafkontra@"  },
		]});
		f.push( {	group: "DOUBLE-P", name: "unberechtigtes Strafkontra", ors: [
				{	type:"FD-G", bids: " x$", result: "[+=]", declarer:"D",de: "problematisches @Strafkontra@"  },
		]});
		f.push( {	group: "DOUBLE-P", name: "erfolgreiches Rekontra", ors: [
				{	type:"FD-G", bids: " xx$", result: "[+=]",	 			de: "?"  },
		]});
		f.push( {	group: "DOUBLE-P", name: "unberechtigtes Rekontra", ors: [
				{	type:"FD-G", bids: " xx$", result: "-",  				de: "?"  },
		]});

		

		// =================================== sonstige =============================================
		
		f.push( {	group: "PLAY", name: "verlorene Schlemms", ors: [
				{	type:"P", contract: "^[67]", result: "[^-]+", 		de: "?"  },
		]});
		f.push( {	group: "PLAY", name: "versäumte Schlemms", ors: [
				{	type:"P", contract: "^4", result: "^[+][23]", 		de: "?"  },
				{	type:"P", contract: "^5", result: "^[+]", 			de: "?"  },
		]});
		f.push( {	group: "PLAY", name: "Wir spielen 3 SA (es wurde keine Farbe genannt)", ors: [
				{	type:"P", bids: "^1nt - 3nt", result: "^=", 	de: "Das sollte machbar sein."  },
				{	type:"P", bids: "^1nt - 3nt", result: "^-1", 	de: "Werden wir fallen?"  },
				{	type:"P", bids: "^1nt - 3nt", result: "^[+]", 	de: "Wieviele Überstiche sind drin?"  },
		]});
		
	
		this.prepare(this.allFilters,0);

		this.catchAllFilters = [
			{	group: "CATCHALL", name: "ohne Beschränkung", ors: [
			{	type:"CATCHALL", bids: "^bid", de: "CATCHALL"  },
		]}];
		this.prepare(this.catchAllFilters,-2);
	}
	
	prepare(filters,id) {
		// add some properties to the filters, create regular expressions etc.
		// assign numeric IDs to the filters starting at the given value

		for(var filter of filters) {

			// add unique numeric id to each filter 
			filter.id=id++;
			
			// extract convention name
			filter.conv= "";
			if (typeof filter.name != "undefined") {
				var match = filter.name.match(/'([^']+)'/);
				if (match) {
					filter.conv=match[1];
					filter.name=filter.name.replace(/'([^']+)'/,"<i>$1</i>");
				}
			}
			
			// add variants with initial pass-bids by one, two or three playerSeat
			// if a bid starts from the beginning (i.e. has a leading caret ^ character)
			// and not a pass (-) as second character
			
			var initPass=0;
			for (var o=0; o<filter.ors.length; o++) {
				var or = filter.ors[o];
				or.bid="g";
				if (typeof or.org == "undefined") or.org = true; // original rule

				or.hint="(missing explanation)";
				if (typeof or[theLang.lang] =="undefined") {
					if 		(typeof or.en !="undefined") or.hint = or.en;
					else if (typeof or.de !="undefined") or.hint = or.de;
				}
				else or.hint = or[theLang.lang];

				if (typeof or.bids != "undefined") {
					var bids=or.bids.split(" ");
					or.bid=bids[bids.length-1];
					if (or.bid[0]=="^") or.bid=or.bid.substr(1);

					if (typeof or.pos=="undefined") {
						or.pos=or.bids.split(" ").length;
						if (or.bids[0]=="^" && or.bids[1]!="-") {
							// add bid sequences with initial passes
							or.opener=1;
							initPass=3;
						}
						else {
							or.opener=0;
							if (or.bids[0]!="^") {
								or.pos=-1;	// position of match can only be calculated after match
							}
						}
					}
					if (initPass>0) {
						initPass--;
						var addOr = JSON.parse(JSON.stringify(or));
						addOr.org=false;  // derived rule
						addOr.pos	= or.pos+1;
						addOr.bids	= "^- "+or.bids.substr(1);
						addOr.opener = (4-initPass);
						filter.ors.splice(o+1,0,addOr);
					}
				}
				else {
					or.opener=0;
				}
				if (typeof or.contract!="undefined") {
					or.contract = or.contract
						.replace(/maj/g,"[hs]")
						.replace(/min/g,"[cd]")
					;
				}
			}
		}
	}
	
	getAllGroups() {
		// return a list of all available filter groups

		return {
			"1MIN"		: "Eröffnung 1 in Unterfarbe",
			"1MAJ"		: "Eröffnung 1 in Oberfarbe",
			"1NT"		: "Eröffnung 1 SA",
			"FORC" 		: "starke künstliche Eröffnungen",
			"2MAJ"		: "Eröffnung 2 in Oberfarbe",
			"2NT"		: "Eröffnung 2 SA",
			"3" 		: "Eröffnungen auf 3 er-Stufe",
			"4" 		: "Eröffnungen auf 4 er-Stufe",
			"5" 		: "Eröffnungen auf 5 er-Stufe",

			"RISK"		: "Riskieren oder nicht? - RISIKO",

			"DOUBLE-P"	: "Soll man Strafkontra geben? - KONTRA-S",
			
			"PLAY"		: "Typische Spiele",

			"USER"		: "Benutzer-definiertes Filter",

		}
	}
	
	getById(id) {
		for(var filter of this.allFilters) {
			if (filter.id==id) {
				return this.copyFilter(filter);
			}
		}
		return {};
	}

	copyFilter(filter) {
		var cFilter = JSON.parse(JSON.stringify(filter));
		for (var or of cFilter.ors) {
			// expand shorthands in the bids pattern and create regular expression
			if (typeof or.bids != "undefined") {
				or.bidsPat	= new RegExp( or.bids
					.replace(/maj/g,"[hs]")
					.replace(/min/g,"[cd]")
					.replace(/any/g,"[cdhs]")
					.replace(/bid/g,"[^- ]+")
					.replace(/~/g,"~?")
				);
			}
		}
		return cFilter;
	}
	
	getSet(type,name) {
		// create a set of grouped filters which match the given type and/or name
		
		if (type=="CATCHALL") {
			var selectedFilter= JSON.parse(JSON.stringify(this.catchAllFilters[0]));
			return { type:type, name:"CATCHALL", groups:{"CATCHALL":"CATCHALL"}, filters: [this.copyFilter(selectedFilter)] };			
		}
		
		var typeRE= (type!="") ? new RegExp(type) 		: null;
		var nameRE= (name!="") ? new RegExp(name,"i")	: null;
		
		var selectedFilters=[];
		var selectedGroups={};
		for (var filter of this.allFilters) {
			var matched=false;
			if (nameRE!=null && !filter.name.match(nameRE)) continue;
			for (var or of filter.ors) {
				if ( typeRE==null || or.type.match(typeRE) ) {
					matched=true;
					var matchingFilter = JSON.parse(JSON.stringify(filter));
					matchingFilter.ors = [];
					for (var or of filter.ors) {
						if ( typeRE==null || or.type.match(typeRE) ) matchingFilter.ors.push(or);
					}
					selectedFilters.push(this.copyFilter(matchingFilter));
					selectedGroups[matchingFilter.group] = this.getAllGroups()[matchingFilter.group];
					break;
				}
			}
		}
		
		return { type:type, name:name, groups:selectedGroups, filters: selectedFilters };
	
	}
	
}

var theFilters = new DealFilters();
