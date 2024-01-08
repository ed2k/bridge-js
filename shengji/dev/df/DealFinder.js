
"use strict";

// =============================================================================================================


class DealFinder {
	//
	//  find deals which match certain filters.
	//
	//  for command line arguments see index.html
	//
	//  examples:
	//
	//			index.html?bids=^1sa - 2t&name=Stayman Frage beantworten&bidpos=1&player=N
	//			index.html?filter=Puppet
	//

	constructor(app) {
		this.app = app;
	}

	setup() {

		// get cmdline arguments

		// arg:		"DF_player" -> playerSeat
		this.playerSeat	= this.app.argValue("DF_player","*");
		if (!['N','E','S','W','*'].includes(this.playerSeat)) {
			this.error("Als Wert für 'player' sind erlaubt:   N  S  E  W  *");
			this.playerSeat="*";
			return false;
		}

		// arg:		"DF_pos" -> bidPos
 		this.bidPos = parseInt(this.app.argValue("DF_pos","0"));
		if (![0,1,2,3,4].includes(this.bidPos)) {
			// this.error("Als Wert für 'bidpos' ist zulässig:  0  1  2  3  4");
			// this.bidPos=0;
			// return false;
		}

		// arg:		"DF_filter" -> filterName
		this.filterName	 	= this.app.argValue("DF_filter","");

		// arg:		"DF_bidProcess" -> bidProcess
		this.bidProcess 	= this.app.argValue("DF_bidProcess","");

		// arg:		"DF_max" -> maxDeals
		this.maxDeals	 	= parseInt(this.app.argValue("DF_max","50"));

		// arg:		"DF_uniq" -> uniqHands
		this.uniqHands	 	= (this.app.argValue("DF_uniq","") != "");

		// arg:		"DF_deal" -> dealId
		this.dealId		 	= this.app.argValue("DF_deal","");

		// arg:		"DF_table" -> tablePos
		this.tablePos	 	= parseInt(this.app.argValue("DF_table","-1"));

		// arg:		"DF_query" -> userQuery
		this.userQuery 		= decodeURIComponent(this.app.argValue("DF_query","").replace(/_/g,' '));
		this.userQueryOr	= null;

		// arg:		"DF_rot" -> rotate
		this.rotate		 	= this.app.argValue("DF_rot","S");

		// load filters for a bidding system (Forum D in our case) and for categorization of typical games
		this.bidSystemFilterSet = theFilters.getSet("FD","");
		this.playFilterSet = theFilters.getSet("P","");

		// load and prepare all filters: add bidding position, convert to RegExp, apply player seat and bidding position
		this.allFilterSet = theFilters.getSet("","");

		// load a special CATCHALL filter
		this.catchAllFilterSet = theFilters.getSet("CATCHALL","");

		// update settings menu
		QBM.changed({
			type:"settings",
			maxDeals:this.maxDeals,
			uniqHands:this.uniqHands,
			bidProcess:this.bidProcess,
			rotate:this.rotate,
		});


		// execute initial query if appropriate

		if (this.userQuery!=="") {
				this.selectUserFilter(this.userQuery,"ui");
		}

		else if (this.filterName!="") {
			// apply filters with matching name
			this.selectFilterByName(this.filterName,false);
		}

		else {
			this.setBidSystemFilterSet();
			// apply all filters only if a specific deal was requested
			if (this.dealId!="") {
				this.start();
			}
		}

		return true;
	}

	updateSettings(settings) {
		this.maxDeals=settings.maxDeals;
		this.uniqHands=settings.uniqHands;
		this.bidProcess=settings.bidProcess;
		this.rotate=settings.rotate;
	}

	loadFilters(type) {
		var filterSet = theFilters.getSet(type,"");
		this.setFilters(filterSet.filters);
		QBM.changed({type:'filters',set:filterSet});
	}

	setUserFilter(filterId) {
		// create a copy of the filter with the given id and offer the user to change it
		var filter;
		if (filterId<0)	filter= this.filters[0];
		else			filter= theFilters.getById(filterId);

		filter.ors.splice(1);
		delete filter.name;
		filter.group="USER";
		this.userQueryOr=filter.ors[0];
		var filters=[filter];

		QBM.changed({type:"edit"});
	}


	selectUserFilter(query,destination,dealId) {
		// if query is a simple integer a copy of the filter with that id will be used
		// else we evaluate the query text

		this.queryEdit = query; // save original query text

		// add quotes around member names
		query=query.replace(/"([A-Za-zäöüÄÖÜ0-9]+):/g,'"$1":');

		// evaluate the expression, create object
		try { eval("this.userQueryOr="+query); } catch (e) {
			QB.hideIntroScreen();
			QBM.error(this.userQueryOr+"\n"+"FEHLER: ungültige JSON Syntax\n\n"+e.message);
			return;
		}

		this.userQueryOr.bids = this.userQueryOr.bids.replace(/_/g,' ');

		var filters = [
			{
				name	: "Benutzer-Filter",
				group	: "USER",
				ors		: [ this.userQueryOr ],
			}
		];

		theFilters.prepare(filters,-1);
		filters=[theFilters.copyFilter(filters[0])];
		QBM.changed({type:"filters",set:{ filters:filters,groups:{ "USER"	: "individuelles Filter" }}});
		this.setFilters(filters);
		this.start(destination,dealId);
	}

	selectDefaultFilterSet() {
		this.setDefaultFilterSet();
		this.start();
	}

	selectFilterByName(filterName,exact) {

		// select matching filters
		var filterSet = theFilters.getSet("",filterName);
		if (filterSet.filters.length<=0) {
			this.error("Es gibt kein eingebautes Filter mit passendem oder ähnlichem Namen: "+filterName);
			return false;
		}
		this.setFilters(filterSet.filters);
		QBM.changed({type:"filters",set:filterSet});
		this.start();
	}

	selectFilterById(filterId,uniq) {
		// apply a filter, optionally we can specify that only one sample for each bid sequence type will
		// be added to the result set

		if 		(uniq==1 ) this.uniqHands=true;
		else if (uniq==-1) this.uniqHands=false;
		if (filterId>=-1) {
			if (filterId==-1 && typeof this.queryEdit != "undefined") {
				this.selectUserFilter(this.queryEdit,"ui");
			}
			else if (filterId>=0) {
				var filters = [ theFilters.getById(filterId) ];
				this.setFilters(filters);
				this.start();
				delete this.queryEdit; // allow subsequent queries to use the default set of filters
			}
		}
	}

	dealerForPos(p,pos) {
		// get the dealer for player p sitting on position pos
		if (p=="*" || pos==0) return "*";
		if (p=='N') return ['E','N','W','S'][pos%4];
		if (p=='E') return ['S','E','N','W'][pos%4];
		if (p=='S') return ['W','S','E','N'][pos%4];
		if (p=='W') return ['N','W','S','E'][pos%4];
	}

	playerForDealerPos(d,pos) {
		// get the player sitting on position pos (1,2,...,n) if dealer == d
		if (pos<=0) pos=1;
		pos=pos+3;
		if (d=="N") return ["N","E","S","W"][pos%4];
		if (d=="E") return ["E","S","W","N"][pos%4];
		if (d=="S") return ["S","W","N","E"][pos%4];
		if (d=="W") return ["W","N","E","S"][pos%4];
	}

	playerForOpenerPos(dealer,opener,bidder) {
		// get the player for a bidder of type (Opener, First opponent, Partner, Second opponent)
		if (bidder=="O") return this.playerForDealerPos(dealer,opener);
		if (bidder=="F") return this.playerForDealerPos(dealer,opener+1);
		if (bidder=="P") return this.playerForDealerPos(dealer,opener+2);
		if (bidder=="S") return this.playerForDealerPos(dealer,opener+3);
	}

	start(destination,dealId) {
		if (typeof Deals == "undefined") {
			$.getScript("df/js/Deals.js",
				function() {
					QBM.dealFinder.doStart(destination);
					QB.hideIntroScreen();
					QB.playWin.selectTab("Table");
					if (typeof dealId != "undefined") QB.playWin.loadDeal(dealId);
				},
				function() {
					QB.hideIntroScreen();
					QBM.error("could not load precompiled deals");
				}	
			);
		}
		else {
			this.doStart(destination);
		}
	}
	
	doStart(destination) {
		// load deals and match them against the current set of filters

		// load deals
		var allDeals= Deals.getAll();
		if (typeof this.dealIds == "undefined") {
			this.dealIds = {};
			for (var deal of allDeals) this.dealIds[deal.id]=deal;
		}

		QBM.changed({
			type:	"msg",
			clear:	true,
			msg:	(this.dealId=="") ?
				"durchsuche "+allDeals.length+" Hände"
				+(this.playerSeat=="*" ? "" : " für den Spieler auf "+this.playerSeat)
				+(this.bidPos!=0 ? " in Biet-Position "+this.bidPos : "")
				+((typeof this.bidsPattern=="undefined" || this.bidsPattern=="") ? "" : " mit der Bietfolge: '"+this.bidsPattern+"'")
				+(this.filterName=="" ? "" : " mit Filtern, deren Name '"+this.filterName+"' enthält'")
				: "wende alle Filter auf die Hand mit der ID "+this.dealId+" an"
		});

		this.filter(allDeals);

		this.showHands("bid","",destination);
	}

	analyse(deal,pos,withVariants) {
		// match a single deal against all filters
		// we assume that there has been a successful prior filter search
		// also find a list of alternate bids for the given bidding position
		// returns a list of matching filters sorted by ascending bidding position

		var analysis={filters:[],pos:pos,variants:{}};
		var bids = "";
		var n=pos;
		for (var bid of deal.bids.split(" ")) {
			if (--n<=0) break;
			bids+=bid+" ";
		}

		// find alternate bidding paths (regarding the decision at position pos)
		if (withVariants) {
			for (var anyDeal of Deals.getAll()) {
				if (anyDeal.bids.indexOf(bids)==0) {

					var cont = anyDeal.bids.substr(bids.length); // different continuation of the bidding sequence
					if(typeof analysis.variants[cont] == "undefined") {
						analysis.variants[cont]=anyDeal.id;
					}
				}
			}
		}

		// test the deal against all rules of the bidding system

		var bidPosSave = this.bidPos; this.bidPos=0; // temporarily disable bidPos checking in "matchCiriteria()"

		var match;
		for (var filter of this.bidSystemFilterSet.filters) {
			if ((match=this.matchCriteria(deal,filter))!==false) {
				analysis.filters.push({filter:this.getFilterWithId(this.bidSystemFilterSet.filters,filter.id),orNr:match.orNr,pos:match.pos});
			}
		}

		// Should we also check against the PLAY filters?
		/*
		for (var filter of this.playFilterSet.filters) {
			if ((match=this.matchCriteria(deal,filter))!==false) {
				analysis.filters.push({filter:this.getFilterWithId(this.playFilterSet.filters,filter.id),orNr:match.orNr,pos:98});
			}
		}
		*/
		
		this.bidPos=bidPosSave;

		// sort by bidding position
		analysis.filters.sort(function(o1,o2) { return o1.pos<o2.pos?-1:+1; });

		return analysis;
	}

	getFilterWithId(filters,id) {
		for (var f=0;f<filters.length;f++) if (filters[f].id==id) return filters[f];
		return null;
	}

	setBidSystemFilterSet() {
		this.setFilters(this.bidSystemFilterSet.filters);
		QBM.changed({type:"filters",set:this.bidSystemFilterSet});
	}

	setFilters(filters) {
		this.filters=filters;
	}

	filter(deals) {

		this.result={};

		// if a dealId was specified: simply put that deal into the result set
		if (this.dealId!="") {
			var deal = this.dealIds[this.dealId];
			var filter = this.catchAllFilterSet.filters[0];
			this.storeMatch(deal,filter,0,this.bidPos);
			return;
		}

		var match;
		for (var filter of this.filters) {
			var hits=0;
			var d=-1;
			for (var deal of deals) {
				d++;
				if (this.dealId!="" && deal.id!=this.dealId) continue;
				if ((match=this.matchCriteria(deal,filter))!==false) {
					if (this.rotate!="") {
						var playerOfInterest = this.playerForDealerPos(deal.dealer,match.pos);
						this.rotateDeal(deals[d],["S","E","N","W"].indexOf(playerOfInterest));
					}
					var stored = this.storeMatch(deal,filter,match.orNr,match.pos);
					if(stored && this.maxDeals>0&& ++hits>=this.maxDeals) break;
				}
			}
		}

	}

	matchCriteria(deal,filter) {
		// a filter has a name and contains a group of OR-conditions
		// each OR-condition is a set of AND-criteria

		// a group of OR conditions
		var match=false;
		var andCritMatch=true;
		var orNr = -1;
		var pos=0;
		for (var or of filter.ors) {
			orNr++;
			pos=or.pos;	// the real matching position; taken from the filter as a default

			andCritMatch=true;

			// bid sequence pattern =============================================
			if (typeof or.bidsPat!="undefined") {
				var bidMatch = deal.bids.match(or.bidsPat);
				if (bidMatch==null) {
					andCritMatch=false;
					continue;
				}
				else if (or.pos<0) {
					// calculate real position of match if the filter cannot define that position statically
					pos=deal.bids.substr(0,bidMatch.index).trim().split(" ").length + 1;
				}
			}

			// bidding process =============================================
			if (typeof or.bidProcess!="undefined" && or.bidProcess!=deal.bproc) {
				andCritMatch=false;
				continue;
			}

			// undisturbed (global switch) =================================
			if (this.bidProcess!="" && deal.bproc!=this.bidProcess) {
				andCritMatch=false;
				continue;
			}

			// check player =============================================
			var player = this.playerForDealerPos(deal.dealer,pos);
			if (this.bidPos!=0 && this.bidPos!=pos) continue;

			// check dealer
			if (typeof or.dealer!="undefined" && deal.dealer!=or.dealer) continue;

			// declarer party =============================================

			if (typeof or.declarer!="undefined") {

				if (or.declarer=="O") {
					// check if bidding opener won the contract
					var decl = deal.contract.substr(-1);
					var opener = deal.opener;
					if ((opener=="N" || opener=="S") && (decl=="E" || decl=="W")) {
						andCritMatch=false;
						continue;
					}
					else if ((opener=="E" || opener=="W") && (decl=="N" || decl=="S")) {
						andCritMatch=false;
						continue;
					}
				}
				else if (or.declarer=="F") {
					// check if opponents won the contract
					var decl = deal.contract.substr(-1);
					var opener = deal.opener;
					if ((opener=="N" || opener=="S") && (decl=="N" || decl=="S")) {
						andCritMatch=false;
						continue;
					}
					else if ((opener=="E" || opener=="W") && (decl=="E" || decl=="W")) {
						andCritMatch=false;
						continue;
					}
				}
			}

			// contract =============================================
			if (typeof or.contract!="undefined" && !deal.contract.match(new RegExp(or.contract))) {
				andCritMatch=false;
				continue;
			}

			// contract NOT =============================================
			if (typeof or.contractNot!="undefined" && deal.contract.match(new RegExp(or.contractNot))) {
				andCritMatch=false;
				continue;
			}

			// contract level =============================================
			if (typeof or.contractLevel!="undefined" && deal.cl!=or.contractLevel) {
				andCritMatch=false;
				continue;
			}

			// contract type =============================================
			if (typeof or.contractType!="undefined" && deal.ct!=or.contractType) {
				andCritMatch=false;
				continue;
			}

			// result =============================================
			if (typeof or.result!="undefined" && typeof deal.result!="undefined" && !deal.result.match(new RegExp(or.result))) {
				andCritMatch=false;
				continue;
			}

			// minimum suit length =============================================
			if (typeof or.minCS != "undefined") {
				for (var b in or.minCS) {
					var bidder= or.minCS[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s in bidder) {
						if (bidder[s] > deal.ls[player][s]) { andCritMatch=false; break; }
					}
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// maximum suit length =============================================
			if (typeof or.maxCS != "undefined") {
				for (var b in or.maxCS) {
					var bidder= or.maxCS[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s in bidder) if (bidder[s] < deal.ls[player][s]) { andCritMatch=false; break; }
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// minimum lengths of longest/shortest suits =============================================
			if (typeof or.minC != "undefined") {
				for (var b in or.minC) {
					var lens= or.minC[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s=0;s<lens.length;s++) {
						if (lens[s] > 0 && lens[s]  > deal.l[player][s  ]) { andCritMatch=false; break; }
						if (lens[s] <=0 && -lens[s] > deal.l[player][3-s]) { andCritMatch=false; break; }
					}
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// maximum lengths of longest/shortest suits =============================================
			if (typeof or.maxC != "undefined") {
				for (var b in or.maxC) {
					var lens= or.maxC[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s=0;s<lens.length;s++) {
						if (lens[s] > 0 && lens[s]  < deal.l[player][s  ]) { andCritMatch=false; break; }
						if (lens[s] <=0 && -lens[s] < deal.l[player][3-s]) { andCritMatch=false; break; }
					}
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// minimum high card points =============================================
			if (typeof or.minHP != "undefined") {
				for (var b in or.minHP) {
					var bidder= or.minHP[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s in bidder) if (bidder[s] > deal.hp[player][s]) { andCritMatch=false; break; }
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// maximum high card points =============================================
			if (typeof or.maxHP != "undefined") {
				for (var b in or.maxHP) {
					var bidder= or.maxFP[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s in bidder) if (bidder[s] < deal.hp[player][s]) { andCritMatch=false; break; }
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// minimum high card and length points =============================================
			if (typeof or.minHLP != "undefined") {
				for (var b in or.minHLP) {
					var bidder= or.minHLP[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s in bidder) if (bidder[s] > deal.hlp[player][s]) { andCritMatch=false; break; }
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// maximum high card and length points =============================================
			if (typeof or.maxHLP != "undefined") {
				for (var b in or.maxHLP) {
					var bidder= or.maxHLP[b];
					var player=this.playerForOpenerPos(deal.dealer,or.opener,b);
					for (var s in bidder) if (bidder[s] < deal.hlp[player][s]) { andCritMatch=false; break; }
					if (!andCritMatch) break;
				}
				if (!andCritMatch) continue;
			}

			// ===========================

			if (andCritMatch) {
				// accept first OR condition (matching set of AND-criteria)
				match=true;
				break;
			}

		}
		if (match) {
			return {orNr: orNr, pos:pos};
		}
		return false;
	}

	storeMatch(deal,filter,orNr,pos) {
		if (typeof deal=="undefined") return false;
		// console.log(JSON.stringify(deal,null,"  "));
		// console.log(filter.name.padEnd(30)+"// "+deal.id.padStart(7)+"   bids = "+deal.bids+"  contract="+deal.contract);

		if (typeof this.result[filter.name] == "undefined") this.result[filter.name]=[];

		if (this.uniqHands) {
			// if (deal.bids[0]=="-") return false; // only accept first hand openings
			for (var result of this.result[filter.name]) {
				if (result.bidsKey.replace(/^[- ]+/g,'')==deal.bids.replace(/^[- ]+/g,'')) {
					result.freq++;
					if (typeof deal.result!="undefined") {
						// try to find a deal which produces exactly the amount of promised tricks
						if (result.deal.result[0]!="=") {
							var repl= (deal.result[0]=="=");
							if (!repl) {
								var rTricks=parseInt(result.deal.result);
								var dTricks=parseInt(deal.result);
								if (Math.abs(dTricks)<Math.abs(rTricks)) repl=true;
							}
							if (repl) {
								result.deal=deal;
								result.orNr=orNr;
								result.pos=pos;
							}
						}
					}
					return false;
				}
			}
			this.result[filter.name].push({deal:deal,filter:filter,orNr:orNr,pos:pos,bidsKey:deal.bids,freq:1});
			return true;
		}

		this.result[filter.name].push({deal:deal,filter:filter,orNr:orNr,pos:pos});
		return true;
	}

	rotateDeal(deal,steps) {
		// rotate a deal by some steps clockwise
		if (steps%4==0) return;

		// rotate cards, points and lengths
		for (var item of ["cards","hp","hlp","ls","l"]) {
			if (steps%4==1) {
				var tmpE=JSON.parse(JSON.stringify(deal[item].E));
				deal[item].E=deal[item].N;
				deal[item].N=deal[item].W;
				deal[item].W=deal[item].S;
				deal[item].S=tmpE;
			}
			else if	(steps%4==3) {
				var tmpE=JSON.parse(JSON.stringify(deal[item].E));
				deal[item].E=deal[item].S;
				deal[item].S=deal[item].W;
				deal[item].W=deal[item].N;
				deal[item].N=tmpE;
			}
			else {
				var tmpE=JSON.parse(JSON.stringify(deal[item].E)); deal[item].E=deal[item].W; deal[item].W=tmpE;
				var tmpN=JSON.parse(JSON.stringify(deal[item].N)); deal[item].N=deal[item].S; deal[item].S=tmpN;
			}
		}

		// calculate rotated player name
		var 			rot = {N:'E',E:'S',S:'W',W:'N'};
		if (steps%4==2) rot = {N:'S',E:'W',S:'N',W:'E'};
		if (steps%4==3) rot = {N:'W',E:'N',S:'E',W:'S'};

		// rotate licit
		var lics=[];
		for (var l of deal.licit[0].split(/ +/)) lics.push(rot[l]);
		deal.licit[0]=lics.join("    ");

		// rotate opener, dealer, vulneravility, contract and declarer
		deal.opener=rot[deal.opener];
		deal.dealer=rot[deal.dealer];
		if 		(deal.vuln=="E/W" && steps%2==1) deal.vuln="N/S";
		else if (deal.vuln=="N/S" && steps%2==1) deal.vuln="E/W";
		deal.contract=deal.contract.replace(deal.decl,rot[deal.decl]);
		deal.decl=rot[deal.decl];

		// rotate tricks
		for(var t=0;t<13;t++) deal.tricks[t].lead=rot[deal.tricks[t].lead];
	}


	showBidRules() {
		// show the bid rule text fragments in a systematic way

		QBM.changed({type:"clear"});
		for (var name in this.result) {
			// filter name
			var filterId=-1;
			if (this.result[name].length>0) filterId=this.result[name][0].filter.id;
			else if (this.dealId!="") continue; // do not show empty groups for a single deal search
			QBM.changed({type:"group",
				group:name+"  ("+this.result[name].length+(this.maxDeals>0 && this.result[name].length>=this.maxDeals ? " .. ":"")+")",
				id:filterId,
				filterGroup:filterId<0 ? "USER" : theFilters.getById(filterId).group,
				sortedBy:"bid",
			});

			// perform an analysis for each deal
			for (var result of this.result[name]) {
				result.anly = this.analyse(result.deal,0,false);
			}
			QBM.changed({type:"bidrules",group:this.result[name],sortedBy:"bid"});
		}
	}

	showHands(sortBy,sortId,destination) {

		var hits=0;
		for (var name in this.result) {
			hits += this.result[name].length;
		}
		var msg = ""+hits+ ((hits>1)?" passende Hände ":" passende Hand ")+"gefunden.";
		if (this.maxDeals>0 && hits>=this.maxDeals) msg += " -- Limit erreicht, ändern über 'max=...'";

		QBM.changed({type:"msg",msg:msg,clear:true});
		QBM.changed({type:"clear"});

		var result="";
		for (var name in this.result) {
			// filter name
			var filterId=-1;
			if (this.result[name].length>0) filterId=this.result[name][0].filter.id;
			else if (this.dealId!="") continue; // do not show empty groups for a single deal search
			QBM.changed({type:"group",
				group:name+"  ("+this.result[name].length+(this.maxDeals>0 && this.result[name].length>=this.maxDeals ? " .. ":"")+")",
				id:filterId,
				filterGroup:filterId<0 ? "USER" : theFilters.getById(filterId).group,
				sortedBy:sortBy,
			});

			if (sortId=="" || sortId==filterId) {
				if (sortBy=="bid"  && (destination!="bdld" || this.uniqHands)) {
					// sort by bidsequence ascending
					// use German suit symbols in ascending order t - k - c - p - s(a)
					// place deals with initial passes to bottom
					var uniq=this.uniqHands;
					this.result[name].sort(
						function(m1,m2) {
							if (
								m1.deal.bids.replace(/~/g,'').replace(/^[- ]*/,'') < m2.deal.bids.replace(/~/g,'').replace(/^[- ]*/,'')
							) return -1;
							return +1;
						}
					);
				}
				else if (sortBy=="id" || (destination=="bdl" && !this.uniqHands) ) {
					// sort by deal id ascending
					this.result[name].sort(
						function(m1,m2) {
							return (m1.deal.id<m2.deal.id) ? -1 : +1;
						}
					);
				}
				else if (sortBy=="freq") {
					// sort by deal id ascending
					this.result[name].sort(
						function(m1,m2) {
							return (m1.freq>m2.freq) ? -1 : +1;
						}
					);
				}
			}

			QBM.changed({type:"hands",group:this.result[name],sortedBy:sortBy});
		}
	}

	getFilter(id) {
		if (this.filterName!="" || this.userQueryOr!=null || this.userQuery!="" || (id==0 && this.filters[0].name=="alle Hände")) {
			return this.filters[0];
		}
		return this.defaultFilters[id];
	}

	showTable(dealId,filterId,orNr,pos) {
		var filter;
		if 		(filterId==-2)	filter=this.catchAllFilterSet.filters[0];
		else if (filterId<0)	filter=this.filters[0];
		else			filter=theFilters.getById(filterId);

		var matches = this.result[filter.name];
		var matchNr=0;
		for (var m=0;m<matches.length;m++) {
			if (matches[m].deal.id == dealId) {
				matchNr=m;
				break;
			}
		}

		QBM.changed({
			type:		"table",
			matches:	matches,
			matchNr:	matchNr,
			filter:		filter,
			analysis:	this.analyse(matches[matchNr].deal,pos,true),
			orNr:		orNr,
			pos:		pos,
		});
	}

	calculateBidFrequencies(range) {

		var bidKeys = [];
		var bidSums = [];
		var total=0;
		for (var deal of Deals.getAll()) {
			var bids = deal.bids.replace(/^[- ]*/,'').split(" ");
			if (bids.length<range) continue;
			var key = "";
			for(var r=0;r<range;r++) {
				key+=bids[r]+" ";
			}
			key=key.trim();
			if (key=="") key="---";
			if (typeof bidSums[key] == "undefined") {
				bidKeys.push(key);
				bidSums[key]=0;
			}
			bidSums[key]++;
			total++;
		}
		bidKeys.sort();
		var bidFreqs={};
		for (var key of bidKeys) {
			bidFreqs[key] = { group: key.replace(/ .*/,''), bids:key, abs:bidSums[key], rel: bidSums[key]/total };
		}		
		return bidFreqs;
	}

}

//(#) sourceURL=DF_Model.js