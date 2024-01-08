"use strict";

class BDL {
	
	constructor() {

		theLang.add({
			bdl_Deal: {
				en: "Deal",
				de: "Spiel",
				es: "Juego",
			},
			bdl_Dealer: {
				en: "Dealer",
				de: "Teiler",
				es: "Dador",
			},
			bdl_Vuln: {
				en: "Vuln",
				de: "Gefahr",
				es: "Peligro",
			},
			bdl_Cards: {
				en: "Cards",
				de: "Karten",
				es: "Cartas",
			},
			bdl_Bids: {
				en: "Bids",
				de: "Gebote",
				es: "Declaraciones",
			},
			bdl_Pass: {
				en: "p",
				de: "p",
				es: "p",
			},
			bdl_AnyBid: {
				en: "any-bid",
				de: "bel-gebot",
				es: "cualq-decl",
			},
			bdl_PassLong: {
				en: "pass",
				de: "passe",
				es: "passar",
			},
			bdl_Meaning: {
				en: "Meaning",
				de: "Bedeutung",
				es: "Significación",
			},
			bdl_Contract: {
				en: "Contract",
				de: "Kontrakt",
				es: "Contrato",
			},
			bdl_Tricks: {
				en: "Tricks",
				de: "Stiche",
				es: "Bazas",
			},
			bdl_Result: {
				en: "Result",
				de: "Ergebnis",
				es: "Resultado",
			},
		});
		
		this.name		= "";			// file name or reference name for the BDL text
		this.text		= "";			// the full BDL text with all deals
		this.ids		= [];			// the list of deal IDs in the text
		this.seqPolicy	= "ascending";	// "ascending" or "random"

		this.deal		= {};			// the currently selected deal
		this.cmd		= "";			// initial command to be performed (like making a certain number of bids)
	}

	setSeqPolicy(seqPolicy) {
		this.seqPolicy=seqPolicy;
		theConfig.set("bdlSeqPolicy",seqPolicy);
	}
	
	read(name,dealId,cmd, seqPolicy) {
		// read a BDL text file from the server
		
		var that=this;
		$.ajax({
			url:"bdl/"+name+".bdl",
			success: function(text) { 
				that.text = text;  // avoid to pass the text by value
				that.set(name,dealId,cmd,seqPolicy,null);
				QB.hideIntroScreen();
			},
			error: function(msg) {
				QB.hideIntroScreen();
				theULogger.error("could not open BDL '"+name+"'<br/>"+msg);
			}
			
		});
	}

	set(name,dealId,cmd,seqPolicy,text) {
		// store the BDL text, parse it and create a game for the requested dealId
		// advance the state of the game according to "cmd"
		// names starting with "_" are treated as initial parts of a bidding sequence

		this.name = name;
		
		if (text!=null) this.text = text;
		
		var nameHTML = "<i>"+name+"</i>";
		if (name[0]=="_") {
			// by default start with the fixed part of the bidding sequence
			if (cmd=="") cmd="Bids:"+(name.split("_").length-1);
			nameHTML="";
			for (var bidId of name.split("_")) {
				if (bidId=="") continue;
				nameHTML += new Bid(bidId).html + " &nbsp; ";
			}
		}
		this.cmd=cmd;			
	
		theULogger.log(0,"reading BDL '"+name+"'<hr/>");
		QBM.changed({type:"source",name:"BDL : "+nameHTML});

		// parse the relevant portion of the BDL file
		var oldSeqPolicy = this.seqPolicy;	// save seq policy for restore
		this.seqPolicy=seqPolicy;
		this.deal = this.parse(dealId);
		this.seqPolicy = seqPolicy=="fix" ? oldSeqPolicy : seqPolicy;	// restore seq policy

		QBM.changed({type:"BDL",count:this.ids.length-1});		
		QBM.game.loadFromBDL(this.deal,cmd);		
	}
	
	idToString(nr) {
		if (nr==0) return "000--000";
		return (""+Math.floor(nr/1000)).padStart(3,"0")+"-"+(""+nr%1000).padStart(3,"0");
	}
	
	idToNumber(str) {
		if (str=="") return -1;
		var major = parseInt(str) % 10000;
		var minor = (str.indexOf("-")<0) ? 1 : parseInt(str.replace(/^.*-/,'')) % 1000;
		return 1000*major+minor;
	}
	
	setLang(lang) {
		var appLang = theLang.lang;

		theLang.lang = lang;		// temporarily change language
		this.tr = {
			Deal:			theLang.tr("bdl_Deal")+" ",
			Dealer:			theLang.tr("bdl_Dealer")+" ",
			Vuln:			theLang.tr("bdl_Vuln")+" ",
			Cards:			theLang.tr("bdl_Cards")+" ",
			Bids:			theLang.tr("bdl_Bids")+" ",
			Meaning:		theLang.tr("bdl_Meaning")+" ",
			Contract:		theLang.tr("bdl_Contract")+" ",
			Tricks:			theLang.tr("bdl_Tricks")+" ",
			Result:			theLang.tr("bdl_Result")+" ",
			Bid_Pass:		theLang.tr("bdl_Pass"),
			Bid_PassLong:	theLang.tr("bdl_PassLong"),
			Bid_Any:		theLang.tr("bdl_AnyBid"),
		}
		this.tr[theLang.tr("suit_s")] 		= "s";
		this.tr[theLang.tr("suit_h")] 		= "h";
		this.tr[theLang.tr("suit_d")] 		= "d";
		this.tr[theLang.tr("suit_c")] 		= "c";
		this.tr[theLang.tr("suit_nt")] 		= "nt";
		this.tr[theLang.tr("suit_NT")] 		= "nt";
		this.tr[theLang.tr("value_A")] 		= "A";
		this.tr[theLang.tr("value_K")] 		= "K";
		this.tr[theLang.tr("value_Q")] 		= "Q";
		this.tr[theLang.tr("value_J")] 		= "J";
		this.tr[theLang.tr("value_T")] 		= "T";
		this.tr[theLang.tr("playerNameN")] 	= "N";
		this.tr[theLang.tr("playerNameE")] 	= "E";
		this.tr[theLang.tr("playerNameS")]	= "S";
		this.tr[theLang.tr("playerNameW")]	= "W";
		this.tr[theLang.tr("playerN")]		= "N";
		this.tr[theLang.tr("playerE")]		= "E";
		this.tr[theLang.tr("playerS")]		= "S";
		this.tr[theLang.tr("playerW")] 		= "W";
		this.tr[theLang.tr("vulnNS")]		= "N/S";
		this.tr[theLang.tr("vulnEW")]		= "E/W";
		this.tr[theLang.tr("vulnAll")]		= "all";
		this.tr[theLang.tr("vulnall")]		= "all";
		this.tr["--"] 						= "--";
		this.tr["---"] 						= "--";
		
		theLang.lang = appLang;		// restore application language
	}
	
	parse(dealId,direct,dir) {
		// analyse the stored BDL text and find the deal with the given id
		// return an object with members: id, major, minor, dealer, vuln, cards, bids, tricks
		
		if (typeof direct=="undefined") direct=false;
		if (typeof dir=="undefined") dir=+1;
		
		this.lang = this.text.match(/\n[.]description[.](..)/);
		if (this.lang!=null)	this.lang=this.lang[1];
		else					this.lang="en";
		
		this.setLang(this.lang);
		
		// add trailer to BDL (so we do not miss the last deal in the file), generate index and sorted index
		if (!this.text.substr(-30).match(/ +: +000--000/)) {
			this.text+= "\n"+this.tr["Deal"]+" : 000--000\n";
			pattern = new RegExp("\n"+this.tr.Deal+" +: +([-0-9]+)","g");
			var ids = this.text.match(pattern);
			this.ids=[];
			this.idsText=[];
			for (var id of ids) {
				var idText = id.replace(/^[^0-9]*/,"");
				this.idsText.push(idText);
				this.ids.push(this.idToNumber(idText));
			}
			this.idsSorted = this.ids.slice().sort(function (a, b) {  return a - b;  });
		}

		// find the deal to extract;
		var dealNr = this.idToNumber(dealId);
		if 		(dealNr<0) {
			if 		(this.seqPolicy=="fix") 		dealNr = this.ids[0];
			else if (this.seqPolicy=="physical") 	dealNr = this.ids[0];
			else if (this.seqPolicy=="ascending")	dealNr = this.idsSorted[1]; // first element in array is "000--000"
			else if (this.seqPolicy=="random") 		dealNr = this.ids[Random.get(this.ids.length-1)];
		}
		else {
			if 		(this.seqPolicy=="fix" || direct) {
				// extract the requested deal
			}
			else if (this.seqPolicy=="physical") {
				if (dir>0) {
					for (var i=0;i<this.ids.length-1;i++) {
						if (dealNr == this.ids[i]) 	{
							dealNr=this.ids[i+1];
							break;
						}
					}
				}
				else {
					for (var i=this.ids.length-1;i>=1;i--) {
						if (dealNr == this.ids[i]) 	{
							dealNr=this.ids[i-1];
							break;
						}
					}
				}
			}
			else if (this.seqPolicy=="ascending") {
				if (dir>0) {
					for (var i=0;i<this.idsSorted.length-1;i++) {
						if (dealNr == this.idsSorted[i]	) 	{ 
							dealNr=this.idsSorted[i+1];
							break;
						}
					}
				}
				else {
					for (var i=this.idsSorted.length-1;i>=1;i--) {
						if (dealNr == this.idsSorted[i]	) 	{ 
							dealNr=this.idsSorted[i-1];
							break;
						}
					}
				}
			}				
			else if (this.seqPolicy=="random") 		dealNr = this.ids[Random.get(this.ids.length-1)];
		}

		var major = Math.floor(dealNr/1000);
		var minor = dealNr%1000;
		var dealIdText = this.idToString(dealNr);

		var pattern = new RegExp("\n"+this.tr.Deal+" +: +"+dealIdText+"[\\S\\s]*?\n"+this.tr.Deal+" +: +[-0-9]+");
		var text = this.text.match(pattern);

		if (text==null) {
			// in case we have a BDL file where deal numbers are not in ascending order:
			if (QBM.game.nextIdBDL=="000--000") {
				theULogger.error("end of BDL reached");		
				return null;				
			}
			pattern = new RegExp("\n"+this.tr.Deal+" +: +"+QBM.game.nextIdBDL+"[\\S\\s]*?\n"+this.tr.Deal+" +: +[-0-9]+");
			text = this.text.match(pattern);
			if (text==null) {
				theULogger.error("could not find deal "+dealIdText+" in BDL file");		
				return null;
			}
		}

		this.source="BDL";
		// theULogger.log(1,"selected deal '"+dealId+"' from current BDL<hr/>");

		var deal = {
			id:			dealIdText,
			nextIdBDL: 	"000--000",
			major:		major,
			minor:		minor,
			cards:		{N:{s:"",h:"",d:"",c:""},E:{s:"",h:"",d:"",c:""},S:{s:"",h:"",d:"",c:""},W:{s:"",h:"",d:"",c:""} }, 
			bids:		[],
			meanings:	[],
			tricks: 	[],
		};
		var cardLine=0, trickLine=0;
		var cardLines=[];
		var bidLine = false, meaningLine = false;
		
		var n=0;
		var bids="";
		var val;
		for (var line of text[0].split(/\r?\n/)) {

			val = line.replace(/.* :/,"").trim();

			if (++n==1) continue;
			if (n==2) {
				deal.id=val;	// in case we have arbitrary deal numbers in the BDL file
				deal.major = parseInt(deal.id) % 10000;
				deal.minor = parseInt(deal.id.replace(/^[0-9]*[^0-9]+/,'')) % 10000;
				continue;
			}

			if (!line.indexOf(this.tr.Deal))	{
				// the next or the trailing "Deal" line
				deal.nextIdBDL = val; 
				break;
			}
			else if (!line.indexOf(this.tr.Dealer)) {
				deal.dealer=this.tr[val];
			}
			else if (!line.indexOf(this.tr.Vuln)) {
				deal.vuln=this.tr[val];
			}
			else if (!line.indexOf(this.tr.Bids)) {
				bidLine=true;
			}
			else if (!line.indexOf(this.tr.Meaning)) {
				meaningLine=true;
			}
			else if (!line.indexOf(this.tr.Contract)) {
				meaningLine=false;
			}
			else if (!line.indexOf(this.tr.Result))	{
			}
			else if (!line.indexOf(this.tr.Cards)) {
				cardLine=12;
				cardLines=[];
			}
			else if (!line.indexOf(this.tr.Tricks)) 	{
				trickLine=13;
				deal.tricks=[];
			}

			if (cardLine>0) {
				cardLines.push(val);
				if (--cardLine<=0) this.parseCardLines(deal,cardLines);
			}
			else if (trickLine>0) {
				var vals=val.split(/ +/);
				deal.tricks.push({lead:vals[1],cards:[vals[2],vals[3],vals[4],vals[5]]});
				if (vals.length<6) break;
				trickLine--;
			}
			else if (meaningLine) {
				if (val!="") {
					var vals=val.split(/ +/,2);
					var nr = parseInt(vals[0]);
					if (isNaN(nr)) {
						theULogger.error("bid meaning does not start with a number in BDL, line: "+n+" , text="+line);
					}
					else {
						deal.meanings[parseInt(vals[0])] = line.replace(/.*?: *[^ ]+ +/,'');
					}
				}
			}
			else if (bidLine) {
				if (val.match("====")) bidLine=false;
				else if (val.match("-----")) { }
				else if (val.match(/^[NEOWS] +[NEOSW]/)) { }
				else bids += (val+" ");
			}
		}
		
		this.translate(deal,bids);

		// theULogger.log(1,"<pre>"+JSON.stringify(deal,null,"  ")+"</pre>");
		
		return deal;
	}

	parseCardLines(deal,cardLines) {
		var l=-1;
		var val;
		for (var line of cardLines) {
			l++;
			val=line.replace(/-/g," "); // eliminate "-" for chicane
			if 		(l== 0) 		deal.cards.N.s = val;
			else if (l== 1) 		deal.cards.N.h = val;
			else if (l== 2) 		deal.cards.N.d = val;
			else if (l== 3) 		deal.cards.N.c = val;
			else if (l== 4) { 	deal.cards.W.s = val.replace(/  .*/,"");  deal.cards.E.s = val.replace(/.*  /,""); }
			else if (l== 5) { 	deal.cards.W.h = val.replace(/  .*/,"");  deal.cards.E.h = val.replace(/.*  /,""); }
			else if (l== 6) { 	deal.cards.W.d = val.replace(/  .*/,"");  deal.cards.E.d = val.replace(/.*  /,""); }
			else if (l== 7) { 	deal.cards.W.c = val.replace(/  .*/,"");  deal.cards.E.c = val.replace(/.*  /,""); }
			else if (l== 8) 		deal.cards.S.s = val;
			else if (l== 9) 		deal.cards.S.h = val;
			else if (l==10) 		deal.cards.S.d = val;
			else if (l==11) 		deal.cards.S.c = val;
		}
	}
	
	translate(deal,bids) {
		// translate bids
		deal.bids=this.translateBids(bids);

		// translate cards
		if (typeof deal.cards!="undefined") {
			var vals;
			for (var player of Players.all) {
				for (var suit of Suits.all) {
					vals=[];
					for (var val of deal.cards[player.id][suit.id].split(/ +/)) {
						if (val=="") continue;
						if (val >="2" && val <="9") vals.push(val);
						else vals.push(this.tr[val]);
					}
					deal.cards[player.id][suit.id]=vals;
				}
			}
		}
		
		// translate tricks
		if (typeof deal.tricks!="undefined") {
			var cards;
			for (var trick of deal.tricks) {
				trick.lead=this.tr[trick.lead];
				cards=[];
				for (var card of trick.cards) cards.push(this.translateCard(card));
				trick.cards=cards;
			}
		}
	}
	
	translateCard(card) {
		// return English text
		var result= this.tr[card[0].toLowerCase()];
		for (var p=1;p<card.length;p++) {
			var c=card.charAt(p).toUpperCase();
			var cc = this.tr[c];
			result += (typeof cc == "undefined") ? c : cc;
		}
		return result;
	}

	translateBids(bids)	{
		var bidList = [];
		// info suffix is part of the bid
		bids = bids.replace(/ +«/g,"«");
		for (var bid of bids.split(/ +/)) {
			if (bid=="") continue;
			var bidNetto = bid.replace(/[~«].*/,"");
			var suffix = bid.replace(/^[^~«]+/,"");
			if (bid[0]>="1"&&bid[0]<="7") bidList.push(bid[0]+ this.tr[bidNetto.substr(1)]+suffix);
			else if (bidNetto==this.tr.Bid_Pass) bidList.push("-"+suffix);
			else if (bidNetto==this.tr.Bid_PassLong) bidList.push("-"+suffix);
			else if (bidNetto==this.tr.Bid_Any) bidList.push("any"+suffix);
			else bidList.push(bid);
		}
		return bidList;		
	}

}
