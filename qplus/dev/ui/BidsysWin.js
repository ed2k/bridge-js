
class BidsysWin extends View {
	
	constructor(app) {
		super(app);
	}
	
	init() {
		this.ui = {
			body: $("#QGeneralDialog"),
		};	
		this.bidsysFiles = [];
		this.activeI = -1;	
		this.currentBidsysNS = "";
		this.currentBidsysEW = "";
		this.selBidsysNS = "";
		this.selBidsysEW = "";
	}
	
	onBidsysLoaded(team,text,wasStored,fromDialog) {
		theULogger.log(0,"- BidsysWin onBidsysLoaded for: " + team);
		var rc;
		if (team == "NS") {
		    if (this.currentBidsysNS != "") {
				var userConfig = "conv.bidding.N/S = " + this.selBidsysNS.slice(0,-4) + "\n";
				// -4 cuts off the suffix ".RCE"
				rc = theEngine.loadUserConfig(userConfig);
				theULogger.log(0, "loadUserConfig - rc: " + rc);				
			}
			this.currentBidsysNS = this.selBidsysNS;
			if (!wasStored)
			    theMemory.storeBidsys(team,this.currentBidsysNS,text);
		}
		if (team == "EW") {
		    if (this.currentBidsysEW != "") {
				var userConfig = "conv.bidding.E/W = " + this.selBidsysEW.slice(0,-4) + "\n";
				rc = theEngine.loadUserConfig(userConfig);
				theULogger.log(0, "loadUserConfig - rc: " + rc);				
			}
			this.currentBidsysEW = this.selBidsysEW;
			if (!wasStored)
			    theMemory.storeBidsys(team,this.currentBidsysEW,text);			
		}		
		var bidSysConfig = team + "\n" + text;
		rc = theEngine.loadBidSys(bidSysConfig);
		theULogger.log(0, "- loadBidSys - rc: " + rc);
		if (fromDialog) {
			theMemory.storeUserConfig(theEngine.getUserConfig());
		}
	}
	
	onBidsysFailed(team) {
		theULogger.log(0,"- BidsysWin onBidsysFailed for: " + team);
		if (team == "NS") {
			if (this.currentBidsysNS == "") {
				theULogger.log(0," - substituted by SAYC-I");	
				this.currentBidsysNS = "F-SAYC-I.RCE";
				this.selBidsysNS = this.currentBidsysNS;
				this.onBidsysLoaded(team,qbBidSysSayc,false);
			}
			else {
				theULogger.log(0," - current sys: " + this.currentBidsysNS + " remains");
			}
		}
		if (team == "EW") {
			if (this.currentBidsysEW == "") {
				theULogger.log(0," - substituted by SAYC-I");	
				this.currentBidsysEW = "F-SAYC-I.RCE";
				this.selBidsysEW = this.currentBidsysNS;
				this.onBidsysLoaded(team,qbBidSysSayc,false);
			}
			else {
				theULogger.log(0," - current sys: " + this.currentBidsysEW + " remains");
			}
		}		
	}
	
	getBidsys(team,filename,fromDialog)
	{
	    var storedBidsys;
		var run;
		for (run = 1; run <= 2; run++) {
		    if (run == 1) storedBidsys = theMemory.retrieveBidsys("NS");
			if (run == 2) storedBidsys = theMemory.retrieveBidsys("EW");
			if (storedBidsys != null) {
				if (storedBidsys.filename == filename) {
					theULogger.log(0,"- taking " + filename + " from memory");
					this.onBidsysLoaded(team,storedBidsys.data,true,fromDialog);
					return;
				}
			}
		}
		// if not from the memory, it must be fetched from the server:
		var that = this;
		var fullpath = "products/" + QB.product.id + "/BIDRULE/config/" + filename; 
		$.ajax({
			url: fullpath,
			contentType: 'Content-type: text/plain; charset=iso-8859-1',
			beforeSend: function(jqXHR) { jqXHR.overrideMimeType('text/html;charset=iso-8859-1'); },
			success: function(text) {
				theULogger.log(0,"- read bidsysfile '" + fullpath + "'<br>");
				that.onBidsysLoaded(team,text,false,fromDialog);
			},
			error: function(msg) {
				theULogger.error("could not get bidsysfile '" + fullpath + "'<br>" + msg);
				that.onBidsysFailed(team);
			}
		  });		
	}
	
	loadBidsys(fromDialog) {
		var needNS = true, needEW = true;
		theULogger.log(0,'- BidsysWin.loadBidsys');	
		if (this.currentBidsysNS == "") {
			this.selBidsysNS = theEngine.getConfigParam("conv.bidding.N/S") + ".RCE";
		}
		else {
			if (this.currentBidsysNS == this.selBidsysNS) needNS = false;
		}
		if (this.currentBidsysEW == "") {		
			this.selBidsysEW = theEngine.getConfigParam("conv.bidding.E/W") + ".RCE";	
		}
		else {
			if (this.currentBidsysEW == this.selBidsysEW) needEW = false;
		}
		theULogger.log(0,"- sysNS: " + this.selBidsysNS + " n(" + needNS + ") "
					   + "- sysEW: " + this.selBidsysEW + " n(" + needEW + ")");	
		if (needNS) this.getBidsys("NS",this.selBidsysNS,fromDialog);	
		if (needEW) this.getBidsys("EW",this.selBidsysEW,fromDialog);	
	}

    runScrollIntoView()
    {
	    if (this.activeI >= 0) {	
		    var activeId = 'QBBIDSYSR' + this.activeI;	
	        var activeRow = document.getElementById(activeId);
		    activeRow.scrollIntoView();		
		}
	}
	
    selectFile(i)
    {
		theULogger.log(1,'- BidsysWin.selectFile: newI=' + i + ' oldI=' + this.activeI);
		var newActive = document.getElementById('QBBIDSYSR' + i);
		newActive.style.backgroundColor = "#ffa";
		if (this.activeI >= 0) {
		    var oldActive = document.getElementById('QBBIDSYSR' + this.activeI);
		    oldActive.style.backgroundColor = "#eee";		
		}
		if (i == this.activeI) this.activeI = -1;
		else this.activeI = i;
	}
	
	onListLoaded(text) {
		theULogger.log(1,"- BidsysWin onListLoaded ");
		var lines = text.split("\n");
		var i,posComma;
		var line,filename,rest,descript;
		var bidsysEntry;
		this.bidsysFiles = [];		
		for (i=0; i < lines.length; i++) {
			line = lines[i];
			theULogger.log(1,"- line:" + i + " = " + line);				
			if (line.length < 5) continue;
			posComma = line.indexOf('"');
			filename = line.slice(0,posComma-1);
			rest = line.slice(posComma+1);
			posComma = rest.indexOf('"');
			descript = rest.slice(0,posComma);
			theULogger.log(1,"- filename:" + filename + ": descript:" + descript + ":");
			bidsysEntry = { filename: filename, descript: descript };
			this.bidsysFiles.push(bidsysEntry);
		}
		this.fillList(true);
	}
	
	getList() {
		var that = this;
		var fullpath = "products/" + QB.product.id + "/BIDRULE/config/BIDSYS-" 
					   + theLang.letter(theLang.lang) + ".TXT";
		$.ajax({
			url: fullpath,
			contentType: 'Content-type: text/plain; charset=iso-8859-1',
			beforeSend: function(jqXHR) { jqXHR.overrideMimeType('text/html;charset=iso-8859-1'); },
			success: function(text) {
				theULogger.log(1,"- read bidsys list '" + fullpath + "'<hr/>");
				that.onListLoaded(text);
			},
			error: function(msg) {
				theULogger.error("could not get bidsys list '" + fullpath + "'<br/>" + msg);
			}
		  });	
	}
	
	fillList(withScroll) {
	    var i;	
		var html = "<table id='QB_BidsysList'"
					+ " style='border:2px dotted #448; display:inline-block"
					+ " padding:2px; overflow-y:scroll'>";
		var idr;
		var bgColor;
		var usage;
		theULogger.log(1,"- bidsysWin fillList: " + this.bidsysFiles.length);		
		for (i=0; i < this.bidsysFiles.length; i++) {
		    bgColor = "#eee";
			usage = " --";
			if (this.bidsysFiles[i].filename == this.selBidsysNS) {
			    this.activeI = i;
				bgColor = "#ffa";
				usage = theLang.tr("vulnNS");
				if (this.selBidsysNS == this.selBidsysEW)
					usage = theLang.tr("vulnall");
			}	
		    else {
				if (this.bidsysFiles[i].filename == this.selBidsysEW) 
					usage = theLang.tr("vulnEW");
			}
			idr = "QBBIDSYSR" + i;
		    html += "<tr id='" + idr + "' style='background-color:" + bgColor 
				  + "; margin:4px; padding:2px;'"
				  + " onclick='QB.playWin.bidsysWin.selectFile(" + i + ")'>"
				  + "<td>" + usage + " </td>"
			      + "<td style='padding:2px;'>" + this.bidsysFiles[i].filename + "</td>"
			      + "<td>" + this.bidsysFiles[i].descript + "</td></tr>\n";
		}
		html += '</table>';
		this.ui.body.html(html);
		if (withScroll) {
		    setTimeout(function() {
			   QB.playWin.bidsysWin.runScrollIntoView();												
		    },600);		
		}
	}
	
	open() {
        this.selBidsysNS = this.currentBidsysNS;
	    this.selBidsysEW = this.currentBidsysEW;	
	    $("#QGeneralDialog").dialog({
			position: {my:'left top', at:'left+60' + ' top+80'},
			width: 620,
			height: 420,
			title: theLang.tr("IDS_BIDDING_SYSTEMS"),
			buttons:[
				{
					text: theLang.tr("L_FOR") + " " + theLang.tr("vulnall"),					
					disabled: QBM.game.state=="bidding" || QBM.game.state=="biddingFinished",
					click: function() {
						if (QB.playWin.bidsysWin.activeI >= 0) {
						      QB.playWin.bidsysWin.selBidsysNS 
							= QB.playWin.bidsysWin.bidsysFiles[QB.playWin.bidsysWin.activeI].filename;
							QB.playWin.bidsysWin.selBidsysEW = QB.playWin.bidsysWin.selBidsysNS;
							QB.playWin.bidsysWin.fillList(false);
						}
					}
				},
				{
					text:  theLang.tr("L_FOR") + " " + theLang.tr("vulnNS"),					
					disabled: QBM.game.state=="bidding" || QBM.game.state=="biddingFinished",
					click: function() {
						if (QB.playWin.bidsysWin.activeI >= 0) {
						      QB.playWin.bidsysWin.selBidsysNS
							= QB.playWin.bidsysWin.bidsysFiles[QB.playWin.bidsysWin.activeI].filename;
							QB.playWin.bidsysWin.fillList(false);
						}
					}
				},		
				{
					text: theLang.tr("L_FOR") + " " + theLang.tr("vulnEW"),	
					class: 'uiButtonFirst',				
					disabled: QBM.game.state=="bidding" || QBM.game.state=="biddingFinished",
					click: function() {
						if (QB.playWin.bidsysWin.activeI >= 0) {
						      QB.playWin.bidsysWin.selBidsysEW
							= QB.playWin.bidsysWin.bidsysFiles[QB.playWin.bidsysWin.activeI].filename;
							QB.playWin.bidsysWin.fillList(false);
						}
					}
				},	
				{
					text: theLang.tr("L_OK"),
					disabled: QBM.game.state=="bidding" || QBM.game.state=="biddingFinished",					
					click: function() {
						QB.playWin.bidsysWin.loadBidsys(true);
						$("#QGeneralDialog").dialog("close");
						QB.playWin.selectTab("Table");
					}
				},			
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},
				{
					text: theLang.tr("IDS_HELP",/&/g),
					click: function() {
						QB.showHelpText("bidding-sys-o");
					}
				},				
			],
		});
		this.getList();	
	}

	onChanged(what) {
	}

}


