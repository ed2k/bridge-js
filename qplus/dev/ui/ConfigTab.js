
class ConfigTab extends View {

	constructor(app) {
		super(app);
	}

	openLeadConvsDialog() {
		this.trainLeadconv = "7";
		if (QB.product.type=="tut") {
			this.trainLeadconv = theEngine.getConfigParam("screen.train_leadconv");
			theULogger.log(1,"- configTab:trainLeadconv: " + this.trainLeadconv);
			if (this.trainLeadconv != "2") {
				QB.showHelpText("lead-conv");
				return;
			}
		}
		var dialogbuttons = 
			[
				{
					text: theLang.tr("L_OK"),
					class: 'uiButtonFirst',					
					disabled: QBM.game.state=="playing" || QBM.game.state=="finished",
					click: function() {
					    var anyChange = false;
						if (QB.playWin.configTab.trainLeadconv == "2") {
							var newIs4Highest = "0";
							var newIs35Highest = "0";
							var newIs24Highest = "0";
							if ($("#is4Highest").is(':checked')) newIs4Highest = "1";
							if (newIs4Highest != QB.playWin.configTab.is4Highest) {
								theEngine.setConfigParam("convention.lead.N/S.is_4_highest",newIs4Highest);
								anyChange = true;
							}
							if ($("#is35Highest").is(':checked')) newIs35Highest = "1";
							if (newIs35Highest != QB.playWin.configTab.is35Highest) {
								theEngine.setConfigParam("convention.lead.N/S.is_3_5_highest",newIs35Highest);
								anyChange = true;
							}		
							if ($("#is24Highest").is(':checked')) newIs24Highest = "1";
							if (newIs24Highest != QB.playWin.configTab.is24Highest) {
								theEngine.setConfigParam("convention.lead.N/S.is_2_4_highest",newIs24Highest);
								anyChange = true;
							}
						}
						if (QB.playWin.configTab.trainLeadconv == "7") {
							var convLSns = "convention.leadSuit.N/S";
							var convLSew = "convention.leadSuit.E/W";
							var convLNns = "convention.leadNT.N/S";
							var convLNew = "convention.leadNT.E/W";						
							var newIsNsSuitAcefromAK = "0";
							var newIsNsNTAcefromAK   = "0";
							var newIsEwSuitAcefromAK = "0";
							var newIsEwNTAcefromAK   = "0";
							var newIsNsSuitKingfromAK = "0";
							var newIsNsNTKingfromAK   = "0";
							var newIsEwSuitKingfromAK = "0";
							var newIsEwNTKingfromAK   = "0";
							if ($("#isNsSuitAcefromAK").is(':checked')) newIsNsSuitAcefromAK = "1";
							if (newIsNsSuitAcefromAK != QB.playWin.configTab.isNsSuitAcefromAK) {
								theEngine.setConfigParam(convLSns + ".is_ace_of_AK",newIsNsSuitAcefromAK);
								anyChange = true;							
							}
							if ($("#isNsNTAcefromAK").is(':checked')) newIsNsNTAcefromAK = "1";
							if (newIsNsNTAcefromAK != QB.playWin.configTab.isNsNTAcefromAK) {
								theEngine.setConfigParam(convLNns + ".is_ace_of_AK",newIsNsNTAcefromAK);
								anyChange = true;							
							}
							if ($("#isEwSuitAcefromAK").is(':checked')) newIsEwSuitAcefromAK = "1";							
							if (newIsEwSuitAcefromAK != QB.playWin.configTab.isEwSuitAcefromAK) {
								theEngine.setConfigParam(convLSew + ".is_ace_of_AK",newIsNsSuitAcefromAK);
								anyChange = true;							
							}
							if ($("#isEwNTAcefromAK").is(':checked')) newIsEwNTAcefromAK = "1";
							if (newIsEwNTAcefromAK != QB.playWin.configTab.isEwNTAcefromAK) {
								theEngine.setConfigParam(convLNew + ".is_ace_of_AK",newIsEwNTAcefromAK);
								anyChange = true;							
							}
							if ($("#isNsSuitKingfromAK").is(':checked')) newIsNsSuitKingfromAK = "1";
							if (newIsNsSuitKingfromAK != QB.playWin.configTab.isNsSuitKingfromAK) {
								theEngine.setConfigParam(convLSns + ".is_king_of_AK",newIsNsSuitKingfromAK);
								anyChange = true;							
							}
							if ($("#isNsNTKingfromAK").is(':checked')) newIsNsNTKingfromAK = "1";
							if (newIsNsNTKingfromAK != QB.playWin.configTab.isNsNTKingfromAK) {
								theEngine.setConfigParam(convLNns + ".is_king_of_AK",newIsNsNTKingfromAK);
								anyChange = true;							
							}
							if ($("#isEwSuitKingfromAK").is(':checked')) newIsEwSuitKingfromAK = "1";							
							if (newIsEwSuitKingfromAK != QB.playWin.configTab.isEwSuitKingfromAK) {
								theEngine.setConfigParam(convLSew + ".is_king_of_AK",newIsNsSuitKingfromAK);
								anyChange = true;							
							}
							if ($("#isEwNTKingfromAK").is(':checked')) newIsEwNTKingfromAK = "1";
							if (newIsEwNTKingfromAK != QB.playWin.configTab.isEwNTKingfromAK) {
								theEngine.setConfigParam(convLNew + ".is_king_of_AK",newIsEwNTKingfromAK);
								anyChange = true;							
							}
							var newIsNsSuit4Highest  = "0";
							var newIsNsNT4Highest    = "0";
							var newIsEwSuit4Highest  = "0";
							var newIsEwNT4Highest    = "0";
							var newIsNsSuit35Highest = "0";
							var newIsNsNT35Highest   = "0";
							var newIsEwSuit35Highest = "0";
							var newIsEwNT35Highest   = "0";	
							if ($("#isNsSuit4Highest").is(':checked')) newIsNsSuit4Highest = "1";
							if (newIsNsSuit4Highest != QB.playWin.configTab.isNsSuit4Highest) {
								theEngine.setConfigParam(convLSns + ".is_4_highest",newIsNsSuit4Highest);
								anyChange = true;							
							}
							if ($("#isNsNT4Highest").is(':checked')) newIsNsNT4Highest = "1";	
							if (newIsNsNT4Highest != QB.playWin.configTab.isNsNT4Highest) {
								theEngine.setConfigParam(convLNns + ".is_4_highest",newIsNsNT4Highest);
								anyChange = true;							
							}									
							if ($("#isEwSuit4Highest").is(':checked')) newIsEwSuit4Highest = "1";
							if (newIsEwSuit4Highest != QB.playWin.configTab.isEwSuit4Highest) {
								theEngine.setConfigParam(convLSew + ".is_4_highest",newIsEwSuit4Highest);
								anyChange = true;							
							}
							if ($("#isEwNT4Highest").is(':checked')) newIsEwNT4Highest = "1";	
							if (newIsEwNT4Highest != QB.playWin.configTab.isEwNT4Highest) {
								theEngine.setConfigParam(convLNew + ".is_4_highest",newIsEwNT4Highest);
								anyChange = true;							
							}	
							if ($("#isNsSuit35Highest").is(':checked')) newIsNsSuit35Highest = "1";
							if (newIsNsSuit35Highest != QB.playWin.configTab.isNsSuit35Highest) {
								theEngine.setConfigParam(convLSns + ".is_3_5_highest",newIsNsSuit35Highest);
								anyChange = true;							
							}
							if ($("#isNsNT35Highest").is(':checked')) newIsNsNT35Highest = "1";	
							if (newIsNsNT35Highest != QB.playWin.configTab.isNsNT35Highest) {
								theEngine.setConfigParam(convLNns + ".is_3_5_highest",newIsNsNT35Highest);
								anyChange = true;							
							}									
							if ($("#isEwSuit35Highest").is(':checked')) newIsEwSuit35Highest = "1";
							if (newIsEwSuit35Highest != QB.playWin.configTab.isEwSuit35Highest) {
								theEngine.setConfigParam(convLSew + ".is_3_5_highest",newIsEwSuit35Highest);
								anyChange = true;							
							}
							if ($("#isEwNT35Highest").is(':checked')) newIsEwNT35Highest = "1";	
							if (newIsEwNT35Highest != QB.playWin.configTab.isEwNT35Highest) {
								theEngine.setConfigParam(convLNew + ".is_3_5_highest",newIsEwNT35Highest);
								anyChange = true;							
							}
							var newIsNsSuitHighOf3 = "0";
							var newIsNsNTHighOf3   = "0";
							var newIsEwSuitHighOf3 = "0";
							var newIsEwNTHighOf3   = "0";
							var newIsNsSuitMidOf3  = "0";
							var newIsNsNTMidOf3    = "0";
							var newIsEwSuitMidOf3  = "0";
							var newIsEwNTMidOf3    = "0";
							var newIsNsSuitLowOf3  = "0";
							var newIsNsNTLowOf3    = "0";
							var newIsEwSuitLowOf3  = "0";
							var newIsEwNTLowOf3    = "0";
							if ($("#isNsSuitHighOf3").is(':checked')) newIsNsSuitHighOf3 = "1";
							if (newIsNsSuitHighOf3 != QB.playWin.configTab.isNsSuitHighOf3) {
								theEngine.setConfigParam(convLSns + ".is_highest_of_3",newIsNsSuitHighOf3);
								anyChange = true;							
							}
							if ($("#isNsNTHighOf3").is(':checked')) newIsNsNTHighOf3 = "1";							
							if (newIsNsNTHighOf3 != QB.playWin.configTab.isNsNTHighOf3) {
								theEngine.setConfigParam(convLNns + ".is_highest_of_3",newIsNsNTHighOf3);
								anyChange = true;							
							}
							if ($("#isEwSuitHighOf3").is(':checked')) newIsEwSuitHighOf3 = "1";							
							if (newIsEwSuitHighOf3 != QB.playWin.configTab.isEwSuitHighOf3) {
								theEngine.setConfigParam(convLSew + ".is_highest_of_3",newIsEwSuitHighOf3);
								anyChange = true;							
							}
							if ($("#isEwNTHighOf3").is(':checked')) newIsEwNTHighOf3 = "1";								
							if (newIsEwNTHighOf3 != QB.playWin.configTab.isEwNTHighOf3) {
								theEngine.setConfigParam(convLNew + ".is_highest_of_3",newIsEwNTHighOf3);
								anyChange = true;							
							}
							if ($("#isNsSuitMidOf3").is(':checked')) newIsNsSuitMidOf3 = "1";		
							if (newIsNsSuitMidOf3 != QB.playWin.configTab.isNsSuitMidOf3) {
								theEngine.setConfigParam(convLSns + ".is_middle_of_3",newIsNsSuitMidOf3);
								anyChange = true;							
							}
							if ($("#isNsNTMidOf3").is(':checked')) newIsNsNTMidOf3 = "1";								
							if (newIsNsNTMidOf3 != QB.playWin.configTab.isNsNTMidOf3) {
								theEngine.setConfigParam(convLNns + ".is_middle_of_3",newIsNsNTMidOf3);
								anyChange = true;							
							}
							if ($("#isEwSuitMidOf3").is(':checked')) newIsEwSuitMidOf3 = "1";								
							if (newIsEwSuitMidOf3 != QB.playWin.configTab.isEwSuitMidOf3) {
								theEngine.setConfigParam(convLSew + ".is_middle_of_3",newIsEwSuitMidOf3);
								anyChange = true;							
							}
							if ($("#isEwNTMidOf3").is(':checked')) newIsEwNTMidOf3 = "1";								
							if (newIsEwNTMidOf3 != QB.playWin.configTab.isEwNTMidOf3) {
								theEngine.setConfigParam(convLNew + ".is_middle_of_3",newIsEwNTMidOf3);
								anyChange = true;							
							}
							if ($("#isNsSuitLowOf3").is(':checked')) newIsNsSuitLowOf3 = "1";							
							if (newIsNsSuitLowOf3 != QB.playWin.configTab.isNsSuitLowOf3) {
								theEngine.setConfigParam(convLSns + ".is_lowest_of_3",newIsNsSuitLowOf3);
								anyChange = true;							
							}
							if ($("#isNsNTLowOf3").is(':checked')) newIsNsNTLowOf3 = "1";							
							if (newIsNsNTLowOf3 != QB.playWin.configTab.isNsNTLowOf3) {
								theEngine.setConfigParam(convLNns + ".is_lowest_of_3",newIsNsNTLowOf3);
								anyChange = true;							
							}
							if ($("#isEwSuitLowOf3").is(':checked')) newIsEwSuitLowOf3 = "1";								
							if (newIsEwSuitLowOf3 != QB.playWin.configTab.isEwSuitLowOf3) {
								theEngine.setConfigParam(convLSew + ".is_lowest_of_3",newIsEwSuitLowOf3);
								anyChange = true;							
							}
							if ($("#isEwNTLowOf3").is(':checked')) newIsEwNTLowOf3 = "1";								
							if (newIsEwNTLowOf3 != QB.playWin.configTab.isEwNTLowOf3) {
								theEngine.setConfigParam(convLNew + ".is_lowest_of_3",newIsEwNTLowOf3);
								anyChange = true;							
							}	
						}
						if (anyChange)
							theMemory.storeUserConfig(theEngine.getUserConfig());
						$("#QGeneralDialog").dialog("close");	
					}
				},
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},
			];	
		var helpbutton =
				{
					text: theLang.tr("IDS_HELP",/&/g),
					click: function() {
						QB.showHelpText("lead-conv");
					}
				};
		if (QB.product.type=="tut") dialogbuttons.push(helpbutton);
		
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+10' + ' top+' + QB.playWin.PWheight / 4 },
			width: QB.product.type=="tut" ? 300 : Math.floor(Math.min(550,QB.playWin.PWwidth-20)),
			title: theLang.tr("IDS_LEAD_CONVENTIONS",/&/g),
			buttons: dialogbuttons,
		});
		var html = "";
		if (this.trainLeadconv == "2") {
			html += "<table id=QB_LeadConvTable border=0 cellpadding=4 cellspacing=8>";		
			this.is4Highest = theEngine.getConfigParam("convention.lead.N/S.is_4_highest");
			this.is35Highest = theEngine.getConfigParam("convention.lead.N/S.is_3_5_highest");
			this.is24Highest = theEngine.getConfigParam("convention.lead.N/S.is_2_4_highest");
			var is4HighestChecked = "";
			var is35HighestChecked = "";
			var is24HighestChecked = "";
			if (this.is4Highest == "1") is4HighestChecked = "checked";
			if (this.is35Highest == "1") is35HighestChecked = "checked";
			if (this.is24Highest == "1") is24HighestChecked = "checked";
			html += "<tr><td colspan=2><center><b>" + "(Farbspiel)" + "</b></center></td></tr>"
			html += "<tr><td><input id='is4Highest' type='radio' name='valueToLead' "
					+ is4HighestChecked + ">" + "4. höchste" + "</input></td></tr>";
			html += "<tr><td><input id='is35Highest' type='radio' name='valueToLead' "
					+ is35HighestChecked + ">" + "3. und 5." + "</input></td></tr>";
			html += "<tr><td><input id='is24Highest' type='radio' name='valueToLead' "
					+ is24HighestChecked + ">" + "2. und 4." + "</input></td></tr>";
			html += "</table>";
		}
		if (this.trainLeadconv == "7") {
			html += "<table id=QB_LeadConvTable border=0 cellpadding=0 cellspacing=0>";			
			var convLSns = "convention.leadSuit.N/S";
			var convLSew = "convention.leadSuit.E/W";
			var convLNns = "convention.leadNT.N/S";
			var convLNew = "convention.leadNT.E/W";
			this.isNsSuitAcefromAK = theEngine.getConfigParam(convLSns + ".is_ace_of_AK");
			this.isNsNTAcefromAK   = theEngine.getConfigParam(convLNns + ".is_ace_of_AK");
			this.isEwSuitAcefromAK = theEngine.getConfigParam(convLSew + ".is_ace_of_AK");
			this.isEwNTAcefromAK   = theEngine.getConfigParam(convLNew + ".is_ace_of_AK");
			this.isNsSuitKingfromAK = theEngine.getConfigParam(convLSns + ".is_king_of_AK");
			this.isNsNTKingfromAK   = theEngine.getConfigParam(convLNns + ".is_king_of_AK");
			this.isEwSuitKingfromAK = theEngine.getConfigParam(convLSew + ".is_king_of_AK");
			this.isEwNTKingfromAK   = theEngine.getConfigParam(convLNew + ".is_king_of_AK");
			var nsSuitAcefromAKChecked = "";
			var nsNTAcefromAKChecked = "";
			var ewSuitAcefromAKChecked = "";
			var ewNTAcefromAKChecked = "";
			var nsSuitKingfromAKChecked = "";
			var nsNTKingfromAKChecked = "";
			var ewSuitKingfromAKChecked = "";
			var ewNTKingfromAKChecked = "";
			if (this.isNsSuitAcefromAK == "1") nsSuitAcefromAKChecked = "checked";
			if (this.isNsNTAcefromAK == "1")   nsNTAcefromAKChecked = "checked";
			if (this.isEwSuitAcefromAK == "1") ewSuitAcefromAKChecked = "checked";
			if (this.isEwNTAcefromAK == "1")   ewNTAcefromAKChecked = "checked";
			if (this.isNsSuitKingfromAK == "1") nsSuitKingfromAKChecked = "checked";
			if (this.isNsNTKingfromAK == "1")   nsNTKingfromAKChecked = "checked";
			if (this.isEwSuitKingfromAK == "1") ewSuitKingfromAKChecked = "checked";
			if (this.isEwNTKingfromAK == "1")   ewNTKingfromAKChecked = "checked";
			
			this.isNsSuit4Highest  = theEngine.getConfigParam(convLSns + ".is_4_highest");
			this.isNsNT4Highest    = theEngine.getConfigParam(convLNns + ".is_4_highest");
			this.isEwSuit4Highest  = theEngine.getConfigParam(convLSew + ".is_4_highest");
			this.isEwNT4Highest    = theEngine.getConfigParam(convLNew + ".is_4_highest");
			this.isNsSuit35Highest = theEngine.getConfigParam(convLSns + ".is_3_5_highest");
			this.isNsNT35Highest   = theEngine.getConfigParam(convLNns + ".is_3_5_highest");
			this.isEwSuit35Highest = theEngine.getConfigParam(convLSew + ".is_3_5_highest");
			this.isEwNT35Highest   = theEngine.getConfigParam(convLNew + ".is_3_5_highest");
			var nsSuit4HighestChecked = "";
			var nsNT4HighestChecked = "";
			var ewSuit4HighestChecked = "";
			var ewNT4HighestChecked = "";
			var nsSuit35HighestChecked = "";
			var nsNT35HighestChecked = "";
			var ewSuit35HighestChecked = "";
			var ewNT35HighestChecked = "";
			if (this.isNsSuit4Highest == "1")  nsSuit4HighestChecked = "checked";
			if (this.isNsNT4Highest == "1")    nsNT4HighestChecked = "checked";
			if (this.isEwSuit4Highest == "1")  ewSuit4HighestChecked = "checked";
			if (this.isEwNT4Highest == "1")    ewNT4HighestChecked = "checked";
			if (this.isNsSuit35Highest == "1") nsSuit35HighestChecked = "checked";
			if (this.isNsNT35Highest == "1")   nsNT35HighestChecked = "checked";
			if (this.isEwSuit35Highest == "1") ewSuit35HighestChecked = "checked";
			if (this.isEwNT35Highest == "1")   ewNT35HighestChecked = "checked";

			this.isNsSuitHighOf3 = theEngine.getConfigParam(convLSns + ".is_highest_of_3");
			this.isNsNTHighOf3   = theEngine.getConfigParam(convLNns + ".is_highest_of_3");
			this.isEwSuitHighOf3 = theEngine.getConfigParam(convLSew + ".is_highest_of_3");
			this.isEwNTHighOf3   = theEngine.getConfigParam(convLNew + ".is_highest_of_3");
			this.isNsSuitMidOf3  = theEngine.getConfigParam(convLSns + ".is_middle_of_3");
			this.isNsNTMidOf3    = theEngine.getConfigParam(convLNns + ".is_middle_of_3");
			this.isEwSuitMidOf3  = theEngine.getConfigParam(convLSew + ".is_middle_of_3");
			this.isEwNTMidOf3    = theEngine.getConfigParam(convLNew + ".is_middle_of_3");
			this.isNsSuitLowOf3  = theEngine.getConfigParam(convLSns + ".is_lowest_of_3");
			this.isNsNTLowOf3    = theEngine.getConfigParam(convLNns + ".is_lowest_of_3");
			this.isEwSuitLowOf3  = theEngine.getConfigParam(convLSew + ".is_lowest_of_3");
			this.isEwNTLowOf3    = theEngine.getConfigParam(convLNew + ".is_lowest_of_3");
			var nsSuitHighOf3Checked = "";
			var nsNTHighOf3Checked   = "";
			var ewSuitHighOf3Checked = "";
			var ewNTHighOf3Checked   = "";			
			var nsSuitMidOf3Checked  = "";
			var nsNTMidOf3Checked    = "";
			var ewSuitMidOf3Checked  = "";
			var ewNTMidOf3Checked    = "";		
			var nsSuitLowOf3Checked  = "";
			var nsNTLowOf3Checked    = "";
			var ewSuitLowOf3Checked  = "";
			var ewNTLowOf3Checked    = "";
			if (this.isNsSuitHighOf3 == "1") nsSuitHighOf3Checked = "checked";
			if (this.isNsNTHighOf3 == "1")   nsNTHighOf3Checked = "checked";
			if (this.isEwSuitHighOf3 == "1") ewSuitHighOf3Checked = "checked";
			if (this.isEwNTHighOf3 == "1")   ewNTHighOf3Checked = "checked";
			if (this.isNsSuitMidOf3 == "1") nsSuitMidOf3Checked = "checked";
			if (this.isNsNTMidOf3 == "1")   nsNTMidOf3Checked = "checked";
			if (this.isEwSuitMidOf3 == "1") ewSuitMidOf3Checked = "checked";
			if (this.isEwNTMidOf3 == "1")   ewNTMidOf3Checked = "checked";
			if (this.isNsSuitLowOf3 == "1") nsSuitLowOf3Checked = "checked";
			if (this.isNsNTLowOf3 == "1")   nsNTLowOf3Checked = "checked";
			if (this.isEwSuitLowOf3 == "1") ewSuitLowOf3Checked = "checked";
			if (this.isEwNTLowOf3 == "1")   ewNTLowOf3Checked = "checked";
				
			html +=   "<tr id=QBLcHead1>"
					+ "<td colspan=2>" + "<b>" + theLang.tr("vulnNS") + "</b>" + "</td><td>" + " "
					+ "</td><td colspan=2>" + "<b>" + theLang.tr("vulnEW") + "</b>" + "</td></tr>";
			html +=   "<tr id=QBLcHead2>"
					+ "<td>"  + theLang.tr("L_L_TRUMP") + "</td><td>" + theLang.tr("L_L_SANS") + "</td><td>" + " "
					+ "</td><td>" + theLang.tr("L_L_TRUMP") + "</td><td>" + theLang.tr("L_L_SANS") + "</td></tr>";
			html += "<tr id=QBLcAceFromAK>"
					+ "<td><input id='isNsSuitAcefromAK' type='radio' name='NsSuitfromAK' "
					   + nsSuitAcefromAKChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNTAcefromAK' type='radio' name='NsNTfromAK' "
					   + nsNTAcefromAKChecked + ">" + " " + "</input></td>"
					+ "<td>" + theLang.tr("L_ACE") + " " + theLang.tr("L_FROM_AK") + "</td>"
					+ "<td><input id='isEwSuitAcefromAK' type='radio' name='EwSuitfromAK' "
					   + ewSuitAcefromAKChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNTAcefromAK' type='radio' name='EwNTfromAK' "
					   + ewNTAcefromAKChecked + ">" + " " + "</input></td></tr>";
			html += "<tr id=QBLcKingFromAK>"
					+ "<td><input id='isNsSuitKingfromAK' type='radio' name='NsSuitfromAK' "
					   + nsSuitKingfromAKChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNTKingfromAK' type='radio' name='NsNTfromAK' "
					   + nsNTKingfromAKChecked + ">" + " " + "</input></td>"
					+ "<td>" + theLang.tr("L_KING") + " " + theLang.tr("L_FROM_AK") + "</td>"
					+ "<td><input id='isEwSuitKingfromAK' type='radio' name='EwSuitfromAK' "
					   + ewSuitKingfromAKChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNTKingfromAK' type='radio' name='EwNTfromAK' "
					   + ewNTKingfromAKChecked + ">" + " " + "</input></td></tr>"; 
			html += "<tr id=QBLc4FromLength>"
					+ "<td><input id='isNsSuit4Highest' type='radio' name='NsSuitfromLength' "
					   + nsSuit4HighestChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNT4Highest' type='radio' name='NsNTfromLength' "
					   + nsNT4HighestChecked + ">" + " " + "</input></td>"
					+ "<td>" + theLang.tr("L_FOURTH_HIGHEST") + "</td>"
					+ "<td><input id='isEwSuit4Highest' type='radio' name='EwSuitfromLength' "
					   + ewSuit4HighestChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNT4Highest' type='radio' name='EwNTfromLength' "
					   + ewNT4HighestChecked + ">" + " " + "</input></td></tr>";					   
			html += "<tr id=QBLc35FromLength>"
					+ "<td><input id='isNsSuit35Highest' type='radio' name='NsSuitfromLength' "
					   + nsSuit35HighestChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNT35Highest' type='radio' name='NsNTfromLength' "
					   + nsNT35HighestChecked + ">" + " " + "</input></td>"
					+ "<td>" + "3. " + theLang.tr("L_AND") + " 5." + "</td>"
					+ "<td><input id='isEwSuit35Highest' type='radio' name='EwSuitfromLength' "
					   + ewSuit35HighestChecked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNT35Highest' type='radio' name='EwNTfromLength' "
					   + ewNT35HighestChecked + ">" + " " + "</input></td></tr>";		
			html += "<tr id=QBLcHighFrom3>"
					+ "<td><input id='isNsSuitHighOf3' type='radio' name='NsSuitfrom3' "
					   + nsSuitHighOf3Checked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNTHighOf3' type='radio' name='NsNTfrom3' "
					   + nsNTHighOf3Checked + ">" + " " + "</input></td>"
					+ "<td>" + theLang.tr("L_HIGHEST_FROM_3") + "</td>"
					+ "<td><input id='isEwSuitHighOf3' type='radio' name='EwSuitfrom3' "
					   + ewSuitHighOf3Checked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNTHighOf3' type='radio' name='EwNTfrom3' "
					   + ewNTHighOf3Checked + ">" + " " + "</input></td></tr>";		
			html += "<tr id=QBLcMidFrom3>"
					+ "<td><input id='isNsSuitMidOf3' type='radio' name='NsSuitfrom3' "
					   + nsSuitMidOf3Checked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNTMidOf3' type='radio' name='NsNTfrom3' "
					   + nsNTMidOf3Checked + ">" + " " + "</input></td>"
					+ "<td>" + theLang.tr("L_MIDDLE_FROM_3") + "</td>"
					+ "<td><input id='isEwSuitMidOf3' type='radio' name='EwSuitfrom3' "
					   + ewSuitMidOf3Checked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNTMidOf3' type='radio' name='EwNTfrom3' "
					   + ewNTMidOf3Checked + ">" + " " + "</input></td></tr>";		
			html += "<tr id=QBLcLowFrom3>"
					+ "<td><input id='isNsSuitLowOf3' type='radio' name='NsSuitfrom3' "
					   + nsSuitLowOf3Checked + ">" + " " + "</input></td>"
					+ "<td><input id='isNsNTLowOf3' type='radio' name='NsNTfrom3' "
					   + nsNTLowOf3Checked + ">" + " " + "</input></td>"
					+ "<td>" + theLang.tr("L_LOWEST_FROM_3") + "</td>"
					+ "<td><input id='isEwSuitLowOf3' type='radio' name='EwSuitfrom3' "
					   + ewSuitLowOf3Checked + ">" + " " + "</input></td>"
					+ "<td><input id='isEwNTLowOf3' type='radio' name='EwNTfrom3' "
					   + ewNTLowOf3Checked + ">" + " " + "</input></td></tr>";	
			html += "</table>";
		}
		$("#QGeneralDialog").html(html);
	}

	openSignallingConvsDialog() {
		this.trainSignalling = "7";
		if (QB.product.type=="tut") {		
			this.trainSignalling = theEngine.getConfigParam("screen.train_signalling");
		}
		theULogger.log(1,"- configTab:trainSignalling: " + this.trainSignalling);	
		if (this.trainSignalling == "9") {
			// without Ok-button
			$("#QSignallingConvs").dialog({
			  position: {my:'left top',at:'left+250' + ' top+' + QB.playWin.PWheight/3},
			  width: 350,
			  title: theLang.tr("IDS_SIGNALLING_CONVENTIONS",/&/g),
			  buttons:[
				{
					text: theLang.tr("IDS_CLOSE",/&/g),
					class: 'uiButtonFirst',						
					click: function() {
						$("#QSignallingConvs").dialog("close");
					}
				},
				{			
					text: theLang.tr("IDS_HELP",/&/g),				
					click: function() {
						QB.showHelpText("signal-conv");
					}
				},					
			    ],
			});
		}
		else {
		    var dialogbuttons = 
			[
				{
					text: theLang.tr("L_OK"),
					disabled: QBM.game.state=="playing" || QBM.game.state=="finished",	
					class: 'uiButtonFirst',						
					click: function() {
					    var anyChange = false;
						if (QB.playWin.configTab.trainSignalling == "2") {
							var newIsHighLow = "0";
							var newIsSuitLavinthal = "0";
							var newIsNotrumpLavinthal = "0";							
							if ($("#bedienenHoch").is(':checked')) newIsHighLow = "1";
							if (newIsHighLow != QB.playWin.configTab.isHighLow) {
								theEngine.setConfigParam("convention.signals.N/S.is_high_low",newIsHighLow);
								anyChange = true;
							}
							if ($("#abwStLavinthal").is(':checked')) newIsSuitLavinthal = "1";
							if (newIsSuitLavinthal != QB.playWin.configTab.isSuitLavinthal) {
								theEngine.setConfigParam("convention.signals.N/S.is_suit_Lavinthal",newIsSuitLavinthal);
								anyChange = true;
							}		
							if ($("#abwNtLavinthal").is(':checked')) newIsNotrumpLavinthal = "1";
							if (newIsNotrumpLavinthal != QB.playWin.configTab.isNotrumpLavinthal) {
								theEngine.setConfigParam("convention.signals.N/S.is_notrump_Lavinthal",newIsNotrumpLavinthal);
								anyChange = true;
							}		
						}
						else {
							var newIsNSHighLow = "0";
							var newIsEWHighLow = "0";
							if ($("#nsHigh").is(':checked')) newIsNSHighLow = "1";	
							if ($("#ewHigh").is(':checked')) newIsEWHighLow = "1";	
							if (newIsNSHighLow != QB.playWin.configTab.isNSHighLow) {
								theEngine.setConfigParam("convention.signals.N/S.is_high_low",newIsNSHighLow);
								anyChange = true;
							}		
							if (newIsEWHighLow != QB.playWin.configTab.isEWHighLow) {
								theEngine.setConfigParam("convention.signals.E/W.is_high_low",newIsEWHighLow);
								anyChange = true;
							}									
						}
						if (anyChange)
							theMemory.storeUserConfig(theEngine.getUserConfig());
						$("#QSignallingConvs").dialog("close");
					}
				},
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						$("#QSignallingConvs").dialog("close");
					}
				},			
			];
			var helpbutton = 
				{
					text: theLang.tr("IDS_HELP",/&/g),
					disabled: QB.product.type != "tut", // temp						
					click: function() {
						QB.showHelpText("signal-conv");
					}
				};
		    if (QB.product.type=="tut") dialogbuttons.push(helpbutton);				
	        $("#QSignallingConvs").dialog({
			  position: {my:'left top',at:'left+250' + ' top+' + QB.playWin.PWheight/3},
			  width: 350,
			  title: theLang.tr("IDS_SIGNALLING_CONVENTIONS",/&/g),
			  buttons: dialogbuttons,
		    });
		}
		var html = "<table border=0 cellpadding=4 cellspacing=8>";
		if (this.trainSignalling == "2") {
			this.isHighLow = theEngine.getConfigParam("convention.signals.N/S.is_high_low");	
			this.isSuitLavinthal = theEngine.getConfigParam("convention.signals.N/S.is_suit_Lavinthal");	
			this.isNotrumpLavinthal = theEngine.getConfigParam("convention.signals.N/S.is_notrump_Lavinthal");		
	        var bedienenHochChecked = "";	
	        var bedienenNiedrigChecked = "";
			if (this.isHighLow == "1") bedienenHochChecked = "checked";
			else					   bedienenNiedrigChecked = "checked";
		    var abwStwieBedienenChecked = "";
		    var abwStLavinthalChecked = "";
			if (this.isSuitLavinthal == "1") abwStLavinthalChecked = "checked";
			else							 abwStwieBedienenChecked = "checked";
		    var abwNtwieBedienenChecked = "";
		    var abwNtLavinthalChecked = "";
			if (this.isNotrumpLavinthal == "1") abwNtLavinthalChecked = "checked";
			else							    abwNtwieBedienenChecked = "checked";				
		    html += "<tr><td colspan=2><center><b>" + "Beim Bedienen" + "</b></center></td></tr>"
		    html += "<tr><td><input id='bedienenHoch' type='radio' name='bedienen' "
			        + bedienenHochChecked + ">" + theLang.tr("SignalHighLow") + "</input></td>";
		    html += "<td><input id='bedienenNiedrig' type='radio' name='bedienen' "
			        + bedienenNiedrigChecked + ">" + theLang.tr("SignalLowHigh") + "</input></td></tr>";	
		    html += "<tr><td colspan=2><center><b>" + "1. Abwurf - Farbspiel" + "</b></center></td></tr>"
		    html += "<tr><td><input id='abwStwieBedienen' type='radio' name='abwSuit' "
			        + abwStwieBedienenChecked + ">" + "wie beim Bedienen" + "</input></td>";
		    html += "<td><input id='abwStLavinthal' type='radio' name='abwSuit' "
			        + abwStLavinthalChecked + ">" + "Lavinthal" + "</input></td></tr>";				
		    html += "<tr><td colspan=2><center><b>" + "1. Abwurf - Sans-Atout" + "</b></center></td></tr>"
		    html += "<tr><td><input id='abwNtwieBedienen' type='radio' name='abwNotrump' "
			        + abwNtwieBedienenChecked + ">" + "wie beim Bedienen" + "</input></td>";
		    html += "<td><input id='abwNtLavinthal' type='radio' name='abwNotrump' "
			        + abwNtLavinthalChecked + ">" + "Lavinthal" + "</input></td></tr>";
		}	
		else {
			this.isNSHighLow = theEngine.getConfigParam("convention.signals.N/S.is_high_low");
			this.isEWHighLow = theEngine.getConfigParam("convention.signals.E/W.is_high_low");
		    var nsHighChecked = "";
			var nsLowChecked = "";
			var ewHighChecked = "";
			var ewLowChecked = "";
			if (this.isNSHighLow == "1") nsHighChecked = "checked";
			else						 nsLowChecked  = "checked";	
			if (this.isEWHighLow == "1") {
				ewHighChecked = "checked";
				if (this.trainSignalling == "3") ewLowChecked = "disabled";
			}
			else {
				ewLowChecked  = "checked";
				if (this.trainSignalling == "3") ewHighChecked = "disabled";				
			}
		    html += "<tr><td><center>" + theLang.tr("vulnNS") + "</center></td>"
					   + "<td><center>" + theLang.tr("vulnEW") + "</center></td></tr>";
		    html += "<tr><td><input id='nsHigh' type='radio' name='nsSignal' "
			        + nsHighChecked + ">" + theLang.tr("SignalHighLow") + "</input></td>";
		    html += "<td><input id='ewHigh' type='radio' name='ewSignal' "
			        + ewHighChecked + ">" + theLang.tr("SignalHighLow") + "</input></td></tr>";		
		    html += "<tr><td><input id='nsLow' type='radio' name='nsSignal' "
			        + nsLowChecked + ">" + theLang.tr("SignalLowHigh") + "</input></td>";
		    html += "<td><input id='ewLow' type='radio' name='ewSignal' "
			        + ewLowChecked + ">" + theLang.tr("SignalLowHigh") + "</input></td></tr>";
		}
		html += "</table>";
		$("#QSignallingConvs").html(html);
	}	

	pictureCardsClicked() {
	    var checked = $("#pictureCards").is(':checked');
		theULogger.log(1,"- PictureCardsClicked: " + checked);	
		theConfig.data.pictureCards	= checked;
		Cards.setFaceType();		
		QB.playWin.tableTab.refresh();		
	}
	largeSymbolsClicked() {
	    var checked = $("#largeSymbols").is(':checked');
		theULogger.log(1,"- largeSymbols: " + checked);
		theConfig.data.largeSymbols = checked;
		Cards.setFaceType();
		QB.playWin.tableTab.refresh();				
	}
	englishSymbolsClicked() {
	    var checked = $("#englishSymbols").is(':checked');
		theULogger.log(1,"- englishSymbols: " + checked);	
		theConfig.data.englishSymbols = checked;
		Cards.setFaceType();		
		QB.playWin.tableTab.refresh();		
	}
    hiddenHandsClicked() {
	    var checked = $("#hiddenHands").is(':checked');
		theULogger.log(1,"- hiddenHands: " + checked);	
		theConfig.data.showHiddenHands = checked;		
		Players.showHands();		
	}

	openPreferencesDialog() {
		this.prevRotateHands = theConfig.data.rotateHands;
		this.prevSequenceSHCD = theConfig.data.sequenceSHCD;
		this.prevPictureCards = theConfig.data.pictureCards;
		this.prevLargeSymbols = theConfig.data.largeSymbols;
		this.prevEnglishSymbols = theConfig.data.englishSymbols;		
		this.prevCardSize = theConfig.data.cardSize;
		this.prevShowHiddenHands = theConfig.data.showHiddenHands;		
		QB.playWin.selectTab("Table");
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+' + $("#PlayWin").width() + ' top+' + 60},
			width: 350,
			title: theLang.tr("IDS_PREF_DLGNAME"),
			buttons:[
				{
					text: theLang.tr("L_OK"),
					class: 'uiButtonFirst',						
					click: function() {
						theConfig.data.rotateHands  = $("#Rotate").is(':checked');
						theConfig.data.playForcedCards = $("#PlayForced").is(':checked');
						theConfig.data.sequenceSHCD = $("#SequenceSHCD").is(':checked');
						if (   theConfig.data.rotateHands  != QB.playWin.configTab.prevRotateHands
							|| theConfig.data.sequenceSHCD != QB.playWin.configTab.prevSequenceSHCD
							// repaint is not necessary when playForcedCards is changed
							) {
							Players.setSuitSeq(theConfig.data.sequenceSHCD ? {s:4,h:3,d:1,c:2} : {s:4,h:3,d:2,c:1});
							QB.playWin.tableTab.resize(true);
						}
						theConfig.save();
						$("#QGeneralDialog").dialog("close");
					}
				},
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						if (   theConfig.data.pictureCards != QB.playWin.configTab.prevPictureCards						
							|| theConfig.data.largeSymbols != QB.playWin.configTab.prevLargeSymbols							
							|| theConfig.data.englishSymbols != QB.playWin.configTab.prevEnglishSymbols		
						    || theConfig.data.cardSize != QB.playWin.configTab.prevCardSize) {
							theConfig.data.pictureCards = QB.playWin.configTab.prevPictureCards;						
							theConfig.data.largeSymbols = QB.playWin.configTab.prevLargeSymbols;
							theConfig.data.englishSymbols = QB.playWin.configTab.prevEnglishSymbols;							
							theConfig.data.cardSize = QB.playWin.configTab.prevCardSize;
							QB.playWin.tableTab.resetCardSize();
							Cards.setFaceType();
							QB.playWin.tableTab.refresh();
						}
						if (theConfig.data.showHiddenHands != QB.playWin.configTab.prevShowHiddenHands) {
							theConfig.data.showHiddenHands = QB.playWin.configTab.prevShowHiddenHands;
							QB.playWin.tableTab.refresh();							
							Players.showHands();	
						}						
						$("#QGeneralDialog").dialog("close");
					}
				},
			],
		});
		var rotateHandsChecked = this.prevRotateHands ? "checked" : "";
		var playForcedCardsChecked = theConfig.data.playForcedCards ? "checked" : "";
		var sequenceSHCDChecked = this.prevSequenceSHCD ? "checked" : "";
		var pictureCardsChecked = this.prevPictureCards ? "checked" : "";	
		var largeSymbolsChecked  = this.prevLargeSymbols  ? "checked" : "";	
		var englishSymbolsChecked = this.prevEnglishSymbols ? "checked" : "";	
		var showHiddenHandsChecked = this.prevShowHiddenHands ? "checked" : "";			
		var html = "";
		html += "<p><input id='Rotate' type='checkbox' name='Rotate' "
			    + rotateHandsChecked + ">" + theLang.tr("IDS_SWITCH_NS_HANDS") + "</input>";
		html += "<p><input id='PlayForced' type='checkbox' name='PlayForced' "
			    + playForcedCardsChecked + ">" + theLang.tr("IDS_PLAY_FORCED_CARDS") + "</input>";
		html += "<p><input id='hiddenHands' type='checkbox' name='hiddenHands' onclick='QB.playWin.configTab.hiddenHandsClicked();'"
			    + showHiddenHandsChecked + ">" + theLang.tr("IDS_SHOW_HIDDEN_HANDS") + "</input>";				
		html += "<p><input id='SequenceSHCD' type='checkbox' name='SequenceSHCD' "
			    + sequenceSHCDChecked + ">" + theLang.tr("IDS_SUIT_SEQUENCE") + " "
				+ "&spades;-<span style='color:red'>&hearts;</span>-&clubs;-<span style='color:red'>&diams;</span>"
				+ "</input>";
		html += "<p><input id='pictureCards' type='checkbox' onclick='QB.playWin.configTab.pictureCardsClicked();'"
			    + pictureCardsChecked + ">" + theLang.tr("IDS_PICTURE_CARDS") + "</input>";
		html += "<p><input id='largeSymbols' type='checkbox' onclick='QB.playWin.configTab.largeSymbolsClicked();'"
			    + largeSymbolsChecked + ">" + theLang.tr("IDS_LARGER_SYMBOLS") + "</input>";	
		if (theConfig.data.lang == "de" || theConfig.data.lang == "fr") {			
		    html += "&nbsp;&nbsp;&nbsp;&nbsp;<input id='englishSymbols' type='checkbox' onclick='QB.playWin.configTab.englishSymbolsClicked();'"
			        + englishSymbolsChecked + ">" + theLang.tr("IDS_ENGLISH_SYMBOLS") + "</input>";	
		}
		html += "<p>" + theLang.tr("m_CardSize") + " &nbsp; ";
		html += "<button onclick='QB.playWin.tableTab.nextCardSize(+1);QB.playWin.tableTab.refresh();'>+</button> &nbsp;";
		html += "<button onclick='QB.playWin.tableTab.nextCardSize(-1);QB.playWin.tableTab.refresh();'>-</button>";

		$("#QGeneralDialog").html(html);
	}
	
	openBidsInfoOptionsDialog() {	
		this.isBidinfoAll  = theEngine.getConfigParam("preference.bidinfo_all");
		this.isBidinfoOpps = theEngine.getConfigParam("preference.bidinfo_opps");
		this.isBidinfoPassAlso = theEngine.getConfigParam("preference.bidinfo_pass_also");		
		theULogger.log(1, "- configTab:isBidInfoAll: " + this.isBidinfoAll
						 + " Opps: " + this.isBidinfoOpps + " PassAlso: " + this.isBidinfoPassAlso);
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+' + '100 top+' + QB.playWin.PWheight / 3 },
			width: 350,
			title: theLang.tr("IDS_BIDS_EXPLANATION",/&/g),
			buttons:[
				{
					text: theLang.tr("L_OK"),
					click: function() {
					    var anyChange = false;
						var newIsBidinfoAll = "0";	
						var newIsBidinfoOpps = "0";	
						var newIsBidinfoPassAlso = "0";												
						if ($("#isBidinfoAll").is(':checked')) newIsBidinfoAll = "1";
						if (newIsBidinfoAll != QB.playWin.configTab.isBidinfoAll) {
							theEngine.setConfigParam("preference.bidinfo_all",newIsBidinfoAll);
							anyChange = true;
						}
						if ($("#isBidinfoOpps").is(':checked')) newIsBidinfoOpps = "1";
						if (newIsBidinfoOpps != QB.playWin.configTab.isBidinfoOpps) {
							theEngine.setConfigParam("preference.bidinfo_opps",newIsBidinfoOpps);
							anyChange = true;
						}		
						if ($("#isBidinfoPassAlso").is(':checked')) newIsBidinfoPassAlso = "1";
						if (newIsBidinfoPassAlso != QB.playWin.configTab.isBidinfoPassAlso) {
							theEngine.setConfigParam("preference.bidinfo_pass_also",newIsBidinfoPassAlso);
							anyChange = true;
						}		
						if (anyChange)
							theMemory.storeUserConfig(theEngine.getUserConfig());
						$("#QGeneralDialog").dialog("close");
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
						QB.showHelpText("bidinfo-o");
					}
				},					
			],
		});
		var html = "<table border=0 cellpadding=4 cellspacing=8>";
		var isBidinfoAllChecked = "";	
	    var isBidinfoOppsChecked = "";
	    var isBidinfoPassAlsoChecked = "";			
		if (this.isBidinfoAll == "1") isBidinfoAllChecked = "checked";
		if (this.isBidinfoOpps == "1") isBidinfoOppsChecked = "checked";
		if (this.isBidinfoPassAlso == "1") isBidinfoPassAlsoChecked = "checked";			
		html += "<tr><td><input id='isBidinfoAll' type='checkbox' name='isBidinfoAll' "
			        + isBidinfoAllChecked + ">" + theLang.tr("IDS_BI_ALL") + "</input></td>";
		html += "<td><input id='isBidinfoOpps' type='checkbox' name='isBidinfoOpps' "
			        + isBidinfoOppsChecked + ">" + theLang.tr("IDS_BI_OPPS") + "</input></td>";	
		html += "<td><input id='isBidinfoPassAlso' type='checkbox' name='isBidinfoPassAlso' "
			        + isBidinfoPassAlsoChecked + ">" + theLang.tr("IDS_BI_PASS_ALSO") + "</input></td></tr>";	
		html += "</table>";
		$("#QGeneralDialog").html(html);	
	}
	
	selectLanguage(lang) {
		theULogger.log(1,"- ConfigTab:selectLanguage: " + lang);
		if (lang == theLang.lang) {
			QB.playWin.configTab.newLanguage = "";
			$("#noteNewLanguage").html("");
		}
		else {
			QB.playWin.configTab.newLanguage = lang;
			$("#noteNewLanguage").html(theLang.tr("IDS_LANGUAGE_CHANGE_HINT"));
		}
	}

    openLanguageDialog() {
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+150' + ' top+' + QB.playWin.PWheight/4},			
			width: 500,
			title: theLang.tr("IDS_LANGUAGE"),
			buttons:[
				{
					text: theLang.tr("L_OK"),
					click: function() {	
						if (   QB.playWin.configTab.newLanguage != ""
							&& QB.playWin.configTab.newLanguage != theLang.lang) {
							theEngine.setConfigParam("language",theLang.letter3(QB.playWin.configTab.newLanguage));
							var newUserConfig = theEngine.getUserConfig();
							theULogger.log(1,"- ConfigTab:newUserConfig: " + newUserConfig);
							theMemory.storeUserConfig(theEngine.getUserConfig());
						    $("#PlayWin").html(  "<p><div style='color:#c33; font-size:125%'>"
											   + theLang.tr("IDS_RESTART_HINT") + "</div>");
						}
						$("#QGeneralDialog").dialog("close");
					}
				},
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},
			],	
		});		
		QB.playWin.configTab.newLanguage = "";
		var html = "<div style='font-size:125%'>";
		
		for (var lang of ["en","de","fr","it","dk"]) {
			var checkedStr = (lang == theLang.lang) ? "checked" : "";
		    html +=    "<br><input type='radio' name='languageChoice' " + checkedStr
					 + " onclick=QB.playWin.configTab.selectLanguage('" + lang + "')>"
			         + theLang.tr("IDS_LANG_" + theLang.letter3(lang).toUpperCase()) + "</input>";
		}
		html += "<p><div id='noteNewLanguage' style='color:#c33'></div>";
		html += "</div>";
		$("#QGeneralDialog").html(html);
	}

	openPlayersDialog() {
		$("#ContextMenuPlayers").dialog({
			position:{my:'left top',at:'left+' + $("#PlayWin").width() + ' top+' + QB.playWin.PWheight/3 - 100},
			width:500,
			title: theLang.tr("IDS_PLAYERS_CONFIG"),			
			buttons:[
				{
					text: theLang.tr("L_OK"),
					disabled: QB.product.type=="tut",	
					click: function() {
						Players.N.setVisible($("#NVis").is(':checked')?true:false);
						Players.N.setType	($("#NHum").is(':checked')?"human":"computer");
						Players.E.setVisible($("#EVis").is(':checked')?true:false);
						Players.E.setType	($("#EHum").is(':checked')?"human":"computer");
						Players.S.setVisible($("#SVis").is(':checked')?true:false);
						Players.S.setType	($("#SHum").is(':checked')?"human":"computer");
						Players.W.setVisible($("#WVis").is(':checked')?true:false);
						Players.W.setType	($("#WHum").is(':checked')?"human":"computer");
						var configStr = "";
						for (var player of Players.all) {
							if (player.isHuman())
								configStr += "general.role." + player.id + " = Human\n";
							else
								configStr += "general.role." + player.id + " = Computer\n";
							if (player.isVisible())
								configStr += "general.view." + player.id + " = visible\n";
							else
								configStr += "general.view." + player.id + " = invisible\n";								
						}
						var rc = theEngine.loadUserConfig(configStr);
						theULogger.log(0, "loadUserConfig - rc: " + rc);
						theMemory.storeUserConfig(theEngine.getUserConfig());						
						$("#ContextMenuPlayers").dialog("close");
						QB.playWin.tableTab.resize(true);
					}
				},
				{
					text: theLang.tr("IDS_CLOSE",/&/g),
					click: function() {
						$("#ContextMenuPlayers").dialog("close");
					}
				},
				{
					text: theLang.tr("IDS_HELP",/&/g),
					click: function() {
						QB.showHelpText("cfg-players-w");
					}
				},			
			],
		});
		var html=""
		for (var player of [Players.N,Players.S,Players.E,Players.W]) {
			html+= "<span style='display:inline-block;width:50px'>"+player.name+"</span>";
			html+= "<input id='"+player.id+"Vis' type='radio' name='"+player.id+"Vis' value='visible' "+
					(player.isVisible()?"checked":"")+">"+theLang.tr("IDS_VISIBLE")+"</input>";
			html+= "<input type='radio' name='"+player.id+"Vis' value='hidden' "+
					(player.isVisible()?"":"checked")+">"+theLang.tr("IDS_INVISIBLE")+"</input> &nbsp; &nbsp; ";
			html+= "<input id='"+player.id+"Hum'  type='radio' name='"+player.id+"Type' value='human' "+
					(player.isHuman()?"checked":"")+">"+theLang.tr("IDS_HUMAN")+"</input>";
			html+= "<input type='radio' name='"+player.id+"Type' value='computer' "+
					(player.isHuman()?"":"checked")+">"+theLang.tr("IDS_COMPUTER")+"</input>";
			html+= "<br/>";
			if (player==Players.S) html+="&nbsp;<br/>";
		}
		$("#ContextMenuPlayers").html(html);	
	}

	openBiddingConvsDialog(nrBiddingConvs) {
		this.nrBiddingConvs = nrBiddingConvs;
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+' + $("#PlayWin").width() + ' top+' + 200},
			width: 350,
			title: theLang.tr("IDS_BIDDING_SYSTEM"),
			buttons:[
				{
					text: theLang.tr("L_OK"),
					class: 'uiButtonFirst',					
					disabled: QBM.game.state=="bidding" || QBM.game.state=="biddingFinished",
					click: function() {
						var convId;
						var checked;
						for (var nr = 0; nr < QB.playWin.configTab.nrBiddingConvs; nr++) {
							convId = "#conv" + nr;
							checked = $(convId).is(':checked');	
							if (checked) {
								theULogger.log(1,"- conv " + nr + " is checked");	
								theEngine.setConfigParam("convention.bidding.val." + nr,"1");
							}
							else {
								theULogger.log(1,"- conv " + nr + " not checked");
								theEngine.setConfigParam("convention.bidding.val." + nr,"0");								
							}
						}
						theMemory.storeUserConfig(theEngine.getUserConfig());						
						$("#QGeneralDialog").dialog("close");
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
						QB.showHelpText("bidconv");
					}
				},				
			],
		});
		var html = "";
		var convName;
		var convVal;
		var convId;
		var checked;
		var boxType = "radio";
		if (QB.product.id == "fd1" || QB.product.id == "fds" || QB.product.id == "acl")
			boxType = "checkbox";
		for (var nr = 0; nr < nrBiddingConvs; nr++) {
			convName = theEngine.getConfigParam("convention.bidding.name." + nr);
			convVal = theEngine.getConfigParam("convention.bidding.val." + nr);
			if (convVal == "1") checked = "checked";
			else                checked = "";
			convId = "conv" + nr;
			html += "<p><input id='" + convId + "' type='" + boxType + "' name='conv' "
			        + checked + ">" + convName + "</input>";
		}
		$("#QGeneralDialog").html(html);
	}

	openActivationDialog() {
		    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+' + $("#PlayWin").width() + ' top+' + 60},
			width: 400,
			title: theLang.tr("IDS_ACTIVATION"),
			buttons:[
				{
					text: theLang.tr("IDS_CLOSE",/&/g),
					class: 'uiButtonFirst',						
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},
				{
					text: theLang.tr("IDS_HELP",/&/g),
					click: function() {
						QB.showHelpText("product-activ-r");
					}
				},
			],
		});
		var productKey = theEngine.getConfigParam("licence.productKey");
		var computerIdent = "";
		var activationKey = "";
		var activationTime = "";
		if (productKey.length > 0) {
		    computerIdent = theEngine.getConfigParam("licence.computerId");
			activationKey = theEngine.getConfigParam("licence.activKey");
			activationTime = theEngine.getConfigParam("licence.activTime");
		}
		var html = "<p>";
		if (productKey.length > 0) {
		    html += theLang.tr("L_PRODUCT_KEY") + " : " + productKey + "<br>";
		}
		if (computerIdent.length > 0) {
			html += theLang.tr("L_COMPUTER_IDENT") + " : " + computerIdent + "<br>";
		}
		if (activationKey.length > 0) {
			html += theLang.tr("L_ACTIVATION_KEY") + " : " + activationKey + "<br>";
			var activDate = new Date(parseInt(activationTime * 1000));
			html += theLang.tr("L_ACTIVATION_TIME") + " : " + activDate.toLocaleDateString() + "<br>";
		}
		else {
			if (QB.isFullMode) {
				html += theLang.tr("IDS_FULL_MODE") + "<br>";
				if (productKey.length == 0) 
				    html += "(" + theLang.tr("IDS_NO_PRODUCT_KEY_NEEDED") + ")<br>";
			}
			else {
			    html += theLang.tr("IDS_DEMO_MODE") + "<br>";
			}
		}
		$("#QGeneralDialog").html(html);
	}
	
	openSaveConfigDialog() {
			$("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+' + $("#PlayWin").width() + ' top+' + 60},
			width: 450,
			title: theLang.tr("IDS_SAVE_CONFIG"),
			buttons:[
				{
					text: theLang.tr("IDS_SAVE",/&/g),
					class: 'uiButtonAlignLeft',
					click: function() {
						var link = document.createElement("a");
						link.setAttribute("target","_blank");
						link.setAttribute("href","data:text/plain," + encodeURIComponent(theEngine.getUserConfig()));
						link.setAttribute("download","Config-" + QB.products[QB.product.id].abbrev + ".txt");
						// theULogger.log(1,'link S: ' + link.toString());					
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						// oder: html = '<a target="_blank" href="data:text/plain,';
						// html += encodeURIComponent("my text");
						// html += '" download="myfilename.txt"> do download</a>';
						// theULogger.log(1,'html: ' + html);							
						// $("#QGeneralDialog").append(html);
					}
				},
				{
					text: theLang.tr("IDS_CLOSE",/&/g),
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},					
			],
		});
		var html =  "<p>" + theLang.tr("IDS_SAVE_CONFIG_LINE1_A") + " <b>" + theLang.tr("IDS_SAVE",/&/g) + "</b> " 
						  + theLang.tr("IDS_SAVE_CONFIG_LINE1_B") + "<br>"
				   + theLang.tr("IDS_SAVE_CONFIG_LINE2") + "<br>"
				   +    theLang.tr("IDS_SAVE_CONFIG_LINE3") 
				      + " <b>" + "Config-" + QB.products[QB.product.id].abbrev + ".txt</b> ."
				   + "<p>" + theLang.tr("IDS_SAVE_CONFIG_LINE4") + "<br>"
				   + theLang.tr("IDS_SAVE_CONFIG_LINE5")
				   + "<p><a href=\"./help/" + theLang.lang + "/ConfigSave.htm\" target=\"_blank\">"
				   + theLang.tr("IDS_CLICK_DETAILS") + " </a>";
		$("#QGeneralDialog").html(html);
	}	

	getChannelVisibleName(number)
	{
	    if (number == 0) return "PlayCheck";
	    if (number == 1) return "PlayGener";
	    if (number == 2) return "PlayBase";
	    if (number == 3) return "PlayKnow";
	    if (number == 4) {
			if (QB.product.type == "tut") return "T-Play";
			return "BidExpl";
		}
	    if (number == 5) {
			if (QB.product.type == "tut") return "T-Scan";
			return "BidProt";
		}
	    if (number == 6) return "BidKnow";
	    if (number == 7) return "E-Debug";
	    if (number == 8) return "JS-Debug";
		if (number == 9)  return "JSI-Debug";
		if (number == 10) return "JSO-Debug";
	}
	getChannelTechnicalName(number)
	{
	    if (number == 0) return "Play.Check";
	    if (number == 1) return "Play.Gener";
	    if (number == 2) return "Play.Base";
	    if (number == 3) return "Play.Know";
	    if (number == 4) {
			if (QB.product.type == "tut") return "Bid.Play";
			return "Bid.Expl";
		}
	    if (number == 5) {
			if (QB.product.type == "tut") return "Bid.Scan";
			return "Bid.Prot";
		}
	    if (number == 6) return "Bid.Know";
	    if (number == 7) return "Debug";
	}

	openProtocolDialog() {
	    $("#QGeneralDialog").dialog({
			position: {my:'left top',at:'left+' + 100 + ' top+' + 60},
			width: 480,
			title: theLang.tr("IDS_PROTOCOL"),
			buttons:[
				{
					text: theLang.tr("L_OK"),
					click: function() {
						var channel;
						var amountId;
						var amount = 0;
					    var logCheckedId;
						var totalProt = 0;
						for (channel = 0; channel <= 10; channel++) {
						    amountId = "#Amount-" + channel;
							amount = parseInt($(amountId).val());
							totalProt = amount;
							logCheckedId = "#Log-" + channel;
						    if ($(logCheckedId).is(':checked')) {
								totalProt += 100;
							}
							// Screen settings are ignored as currently no function is associated
							if (channel <= 7) {
								theEngine.setConfigParam("Monitor." + QB.playWin.configTab.getChannelTechnicalName(channel),
														  totalProt.toString());
							}
							else {
								if (channel == 8) {
									if (totalProt >= 100) {
										if (amount == 0) QB.debugJS = 1;
										else			 QB.debugJS = amount;
									}
									else {
										QB.debugJS = 0;
									}
								}
								if (channel == 9) {
									if (totalProt >= 100) {
										if (amount == 0) QB.debugJSI = 1;
										else			 QB.debugJSI = amount;
									}
									else {
										QB.debugJSI = 0;
									}
								}
								if (channel == 10) {
									if (totalProt >= 100) {
										if (amount == 0) QB.debugJSO = 1;
										else			 QB.debugJSO = amount;
									}
									else {
										QB.debugJSO = 0;
									}
								}
							}
						}

						$("#QGeneralDialog").dialog("close");
						QB.playWin.tableTab.resize(true);
					}
				},
				{
					text: theLang.tr("L_CANCEL"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
					}
				},
				{
					text: theLang.tr("IDS_SHOW_LOGFILE"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
						QB.winManager.toggleDialog("LogWin");
					}
				},
				{
					text: theLang.tr("IDS_SHOW_DEAL_PROT"),
					click: function() {
						$("#QGeneralDialog").dialog("close");
						QB.winManager.toggleDialog("ProtocolWin");
					}
				},				
			],
		});

		var html = theLang.tr("IDS_SUPPORT_ONLY") + "<p>";
		var channel;
		var channelName;
		var totalProt;
		var amount;
		var logChecked;
		var screenChecked;
		for (channel = 0; channel <= 10; channel++) {
		    channelName = this.getChannelVisibleName(channel);
			logChecked = "";
			screenChecked = "";
			amount = 1;
			if (channel <= 7) {
			    totalProt = theEngine.getConfigParam("Monitor." + this.getChannelTechnicalName(channel));
				amount = totalProt % 100;
				totalProt -= amount;
				if (totalProt == 100 || totalProt == 300) logChecked = "checked";
				if (totalProt == 200 || totalProt == 300) screenChecked = "checked";
			}
			else {
			    if (channel == 8)  amount = QB.debugJS;
				if (channel == 9)  amount = QB.debugJSI;
				if (channel == 10) amount = QB.debugJSO;
	 		    if (amount > 0) {
				    logChecked = "checked";
			    }
			}

			html+= "<span style='display:inline-block;width:100px'>" + channelName + "</span>";
			html+= "&nbsp;";
			html+= "<input id='Amount-" + channel + "' type='text'" + "value='" + amount + "' style='width:40px'</input>";
			html+= "&nbsp;";
			html+= "<input id='Log-"    + channel + "' type='checkbox' name='N" + channel + "' "
			        + logChecked  + ">" + "Log" + "</input>";
			html+= "&nbsp;";
			html+= "<input id='Screen-" + channel + "' type='checkbox' name='N" + channel + "' "
			        + screenChecked + ">" + "Screen" + "</input>";
			html+= "<br/>";
		}
		$("#QGeneralDialog").html(html);
	}

	selectTextSound() {
		theULogger.log(1,"- configTab:selectTextSound");
		if ($(textAndSound).is(':checked')) {
			theULogger.log(1,"- textAndSound");
			theEngine.setConfigParam("train.explain_mode","B");
		}
		if ($(textOnly).is(':checked')) {
			theULogger.log(1,"- textOnly");
			theEngine.setConfigParam("train.explain_mode","T");
		}
		theMemory.storeUserConfig(theEngine.getUserConfig());
		QB.playWin.selectTab("Table");
	}

	init() {
		// symbols for translation

		if (QB.product.type=="play") {
		  theLang.add({
			PlayTabConfig: {
				en: `&nbsp; <svg width="12px" height="12px" viewBox="0 0 24 24">
						<path d="M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7
							L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7
							l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9
							c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7
							C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z">
						</path>
					</svg> &nbsp;`,
			  },
			});
		}
		else {
	      theLang.add({
			PlayTabConfig: {
				en: "Options",
				de: "Optionen",
				fr: "Options",				
			  },
			});
		}

		theLang.add({
			/*
			PlayTabConfigTitle: {
				en: "Settings",
				de: "Einstellungen",
				fr: "Paramètres",
			},
			*/
			SignalHighLow: {
				en: "high-low",
				de: "hoch-niedrig",
				fr: "gros-petit",
				it: "alta-bassa",
			},		
			SignalLowHigh: {
				en: "low-high",
				de: "niedrig-hoch",
				fr: "petit-gros",
				it: "bassa-alta",
			},
			IDS_LARGER_SYMBOLS: {
				en: "larger symbols",
				de: "größere Symbole",
				fr: "symboles plus grands",
				it: "simboli più grandi",
			},
			IDS_ENGLISH_SYMBOLS: {
				en: "English symbols",
				de: "englische Symbole",
				fr: "... anglais",
				it: "... inglesi",
			},
			IDS_SAVE_CONFIG_LINE1_A: {
				en: "When you click on",
				de: "Wenn Sie unten auf",
				fr: "Lorsque vous cliquez sur",
			},
			IDS_SAVE_CONFIG_LINE1_B: {
				en: "below",
				de: "klicken,",
				fr: "ci-dessous,",
			},
			IDS_SAVE_CONFIG_LINE2: {
				en: "the configuration including the product key",
				de: "wird die Konfiguration mit dem Produktschlüssel",
				fr: "la configuration comprenant la clé de produit sera",
			},
			IDS_SAVE_CONFIG_LINE3: {
				en: "will be saved to the file:",
				de: "gespeichert auf die Datei:",
				fr: "enregistrée dans le fichier :",
			},
			IDS_SAVE_CONFIG_LINE4: {
				en: "This is useful when you need to enter",
				de: "Dies ist nützlich, wenn Sie bei jedem Programmstart",
				fr: "Cette action est utile, car elle vous évitera de saisir",				
			},
			IDS_SAVE_CONFIG_LINE5: {
				en: "the product key at each start of the program.",
				de: "den Produktschlüssel eingeben müssen.",
				fr: "la clé de produit à chaque démarrage du programme.",
			},
			IDS_LANG_ENG: {
				en: "English",
				de: "Englisch",
				fr: "Anglais",
				it: "Inglese",
				es: "Inglés",
				dk: "Engelsk",
			},
			IDS_LANG_DEU: {
				en: "German",
				de: "Deutsch",
				fr: "Allemand",
				it: "Tedesco",
				es: "Aleman",
				dk: "Tysk",
			},
			IDS_LANG_FRA: {
				en: "French",
				de: "Französisch",
				fr: "Français",
				it: "Francese",
				es: "Francés",
				dk: "Fransk",
			},
			IDS_LANG_ITA: {
				en: "Italian",
				de: "Italienisch",
				fr: "Italien",
				it: "Italiano",
				es: "Italiano",
				dk: "Italiensk",
			},
			IDS_LANG_DAN: {
				en: "Danish",
				de: "Dänisch",
				fr: "Danois",
				it: "Danese",
				es: "Danés",
				dk: "Dansk",
			},
			IDS_LANGUAGE: {
				en: "Language",
				de: "Sprache",
				fr: "Langue",
				it: "Lingua",
				dk: "Sprog",
			},			
			IDS_LANGUAGE_CHANGE_HINT: {
				en: "If you click on Ok the language change will become<br>effective with the next start of Q-plus Bridge",
				de: "Wenn Sie auf Ok klicken, wird der Sprachwechsel<br>mit dem nächsten Start von Q-plus Bridge gültig.",
				fr: "Si vous clickez sur OK, le changement de langue<br>deviendra valid avec le prochain démarrage du Q-plus Bridge.",
				it: "Se fai clic u Ok, il cambio di lingua diventerà<br>effettivo al prossimo avvio del Q-plus Bridge.",
				dk: "Hvis du klikker på O.k., sprogændringen bliver<br>effektiv med den næste start af Q-plus Bridge.",
			},	
			IDS_RESTART_HINT: {
				en: "Please close the page and restart Q-plus Bridge!",
				de: "Bitte schließen Sie die Seite und starten Q-plus Bridge neu!",
				fr: "Veuillez fermer la page et redémarrer Q-plus Bridge !",
				it: "Per favore chiudi la pagina e riavvia Q-plus Bridge!",
				es: "¡Cierre la página y reinicie Q-plus Bridge!",
				dk: "Luk venligst siden og genstart Q-plus Bridge!",
			},	
			IDS_BI_ALL: {
				en: "all",
				de: "alle",
				fr: "tous",
				it: "tutte",
				es: "todos",
				dk: "alle",			
			},
			IDS_BI_OPPS: {
				en: "opponents",
				de: "Gegner",
				fr: "adversaires",
				it: "avversari",
				es: "adversario",
				dk: "modstanderne",
			},
			IDS_BI_PASS_ALSO: {
				en: "pass also",
				de: "auch Passe",
				fr: "passe aussi",
				it: "anche passo",
				es: "también passo",
				dk: "også pas",	
			},
		});

		this.ui = {
			main: 	$("#PlayViewConfig"),
		}
		this.ui.main.html("<h4>Config Tab</h4>");
	}

	onTabBefore() {
	    var width150 = " style='width:150px;'";
		var width80  = " style='width:80px;'";	
	    var html = "<p>"; 
	    var nrBiddingConvs = 0;	
		if (QB.product.type == "play") {
			nrBiddingConvs = 12;
		}
		else {
		    var explainMode = theEngine.getConfigParam("train.explain_mode");
		    var strNrBiddingConvs = theEngine.getConfigParam("convention.bidding.nr");
		    if (strNrBiddingConvs != "") nrBiddingConvs = parseInt(strNrBiddingConvs);
		    theULogger.log(1,"- configTab:onTabBefore, explainMode: " + explainMode 
		                     + " nrBiddingConvs: " + nrBiddingConvs);
		    var textAndSoundChecked = "";
		    var textOnlyChecked = "";
		    if (explainMode == "B") textAndSoundChecked = "checked";
		    else                    textOnlyChecked = "checked";
	        html += theLang.tr("IDS_EXPLANATIONS_AS") + " : ";
		    html +=   "<input id='textAndSound' type='radio' name='textSound' value='textAndSound'"
				    + textAndSoundChecked + ">" + theLang.tr("IDS_TEXT_AND_SOUND") + "</input>" + " "
				    + "<input id='textOnly' type='radio' name='textSound' value='textOnly'"
				    + textOnlyChecked + ">" + theLang.tr("IDS_TEXT_ONLY") + "</input>"+ "&nbsp;&nbsp;&nbsp;"
				    + "<button onclick='QB.playWin.configTab.selectTextSound();'" + width80 + ">"
				    + theLang.tr("L_OK") + "</button>"
				    ;
		}
	    html += "<p><button onclick='QB.playWin.configTab.openPreferencesDialog();'"
				 + width150 + ">" + theLang.tr("IDS_PREF_DLGNAME") + "..." + " </button>";
	    html += "<p><button onclick='QB.playWin.configTab.openPlayersDialog();'"
				 + width150 + ">" + theLang.tr("L_PLAYERS") + "..." + "</button>";
		if (nrBiddingConvs > 0) {
		    html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			if (QB.product.type == "play") {
			    html += "<button onclick='QB.playWin.bidsysWin.open();'"
					  + width150 + ">" + theLang.tr("IDS_BIDDING_SYSTEMS") + "..." + "</button>";
				html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
					  + "<button onclick='QB.playWin.configTab.openBidsInfoOptionsDialog();'"
					  + width150 + ">" + theLang.tr("IDS_BIDS_EXPLANATION") + "..." + "</button>";				
			}
			else {
			    html += "<button onclick='QB.playWin.configTab.openBiddingConvsDialog(" + nrBiddingConvs + ");'"
					  + width150 + ">" + theLang.tr("IDS_BIDDING_SYSTEM") + "..." + "</button>";
			}
		}
	    html += "<p><button onclick='QB.playWin.configTab.openLeadConvsDialog();'"
				 + width150 + ">" + theLang.tr("IDS_LEAD_CONVS") + "..." + "</button>";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		html += "<button onclick='QB.playWin.configTab.openSignallingConvsDialog();'"
				 + width150 + ">" + theLang.tr("IDS_SIGNALLING_CONVS") + "..." + "</button>"
	    if (QB.product.type == "play") {
		    html += "<p><button onclick='QB.playWin.configTab.openLanguageDialog();'"
				     + width150 + ">" + theLang.tr("IDS_LANGUAGE") + "..." + "</button>"
		}
		html += "<p><button onclick='QB.playWin.configTab.openActivationDialog();'"
				 + width150 + ">" + theLang.tr("IDS_ACTIVATION") + "..." + "</button>";
		html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	    html += "<button onclick='QB.playWin.configTab.openProtocolDialog();'"
				 + "> &nbsp;&nbsp;" + theLang.tr("IDS_TECH_PROTOCOL") + "... &nbsp;&nbsp;" + "</button>";
		if (QB.product.type == "tut") {				 
			if (QB.isFullMode) {
				var productKey = theEngine.getConfigParam("licence.productKey");	
				if (productKey.length > 0) {
					html += "<p><button onclick='QB.playWin.configTab.openSaveConfigDialog();'"
						  + "> &nbsp;&nbsp;" + theLang.tr("IDS_SAVE_CONFIG") + "... &nbsp;&nbsp;" + "</button>";
				}
			}
		}
		this.ui.main.html(html);
	}

	onChanged(what) {
		// receive results from the Model
	}
}
