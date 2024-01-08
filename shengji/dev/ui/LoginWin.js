
class LoginWin extends View {

	constructor(app) {
		super(app);
	}

	GetWelcomeText() {
		var greetingLine2 = theEngine.getConfigParam("train.greeting2");
	    var totalGreeting = greetingLine2;
		var greetingLine3 = theEngine.getConfigParam("train.greeting3");
		if (totalGreeting.length > 0 && greetingLine3.length > 0) totalGreeting += "<br>";
		totalGreeting += greetingLine3;
		var greetingLine4 = theEngine.getConfigParam("train.greeting4");
		if (totalGreeting.length > 0 && greetingLine4.length > 0) totalGreeting += "<br>";
		totalGreeting += greetingLine4;
		var greetingLine5 = theEngine.getConfigParam("train.greeting5");
		if (totalGreeting.length > 0 && greetingLine5.length > 0) totalGreeting += "<br>";
		totalGreeting += greetingLine5;
        return totalGreeting;
	}

	init() {

		// symbols for translation

		theLang.add({
			LoginWin: {
				en: "Login",
			},
			ProgramList: {
				en: "program list",
				de: "Programm-Liste",
				fr: "Liste des logiciels",
			},
		});

		this.ui = {
			main: $("#LoginWin"),
		}

		var isFullVersion = theEngine.getConfigParam("licence.isFullVersion");		
		theULogger.log(1,"- LoginWin - fullVersion: " + isFullVersion);
		var html = "";
		if (QB.product.type=="tut") {
			var welcomeText = this.GetWelcomeText();
		    html += "<img style='border:5px #007fd1 solid;' src='products/" + QB.product.id + "/AUTHOR.PNG'>"
				  + "<div style='display:inline-block;margin-left:10px;vertical-align:top;'>"		
			      + "<h3><center>" + welcomeText + "</center></h3>";
		}
		else {
			html += "<img style='border:5px #007fd1 solid; max-width:90%; max-height:80%' src='products/" + QB.product.id + "/QPLUSB.PNG'>"
				  + "<div style='display:inline-block;margin-left:10px;vertical-align:top;'>";		
		}
		if (isFullVersion == "1") {
			QB.isFullMode = true;		
		    if (QB.product.type=="tut") {
		        html += "<h3><button onclick='QB.winManager.closeDialog(\"LoginWin\");QB.start2(\"full\");'>"
					  + theLang.tr("IDS_PLAY") + "</button></h3>"
				      + "<h3><button onclick='QB.winManager.closeDialog(\"LoginWin\");QB.start2(\"contents\");'>"
					  + theLang.tr("IDS_CONTENTS") + "</button></h3>";
			}
			else {
		        html += "<h3>" + theLang.tr("IDS_NO_KEY_REQUIRED") + " "
                      + "<button style='width:80px; margin-left:10px;' onclick='QB.winManager.closeDialog(\"LoginWin\");QB.start2(\"full\");'>"	
					  + " Ok " + "</button></h3>";
			}
		}
		else {
		    html +=  "<h3><button onclick='QB.winManager.closeDialog(\"LoginWin\");QB.start2(\"demo\");'>"
					+ theLang.tr("IDS_DEMO_VERSION") + "</button>";
			if (QB.product.type=="tut")
				html += "</h3><h3>"
			else 
				html += "&nbsp;&nbsp;&nbsp;&nbsp;";
			html +=   "<button onclick='QB.loginWin.fullVersion();'>"
					+ theLang.tr("IDS_FULL_VERSION") + "</button></h3>";
			if (QB.product.type=="tut") 					
				html +=   "<p>&nbsp;<h3><button onclick='QB.loginWin.loadConfig();'>"
					    + theLang.tr("IDS_LOAD_CONFIG") + "..." + "</button></h3>";					
		}
		if (QB.mode == "expert") {
			html += "<hr/><h4><a href=\"javascript:QB.menu.do('m_Product');\">"
				 + theLang.tr("ProgramList") + "</a></h4>";	
		}
		html += "</div>";
		this.ui.main.html(html);
	}

	fullVersion() {
		this.licenceWin = new LicenceWin(this.app);
		QB.winManager.openDialog("LicenceWin");
		this.licenceWin.init();
	}

	loadConfig() {
		this.loadConfigWin = new LoadConfigWin(this.app);
		QB.winManager.openDialog("LoadConfigWin");
		this.loadConfigWin.init();
	}	

	onChanged(what) {
	}

}

class LicenceWin extends View {

	constructor(app) {
		super(app);
		this.productKey = "";
		this.computerIdent = "";
	}

    getComputerName() {
		var rc = theConfig.getComputerName();
		return rc;
	}

	getComputerIdent() {
	    var rc = theEngine.getConfigParam("licence.computerId");
		if (rc.length == 0) {
		    rc = this.getComputerName();
			theEngine.setConfigParam("licence.computerName",rc); // defines also computerId
			rc = theEngine.getConfigParam("licence.computerId");
		}
		return rc;
	}

	init() {

		// symbols for translation

		this.ui = {
			main: $("#LicenceWin"),
		}
		this.productKey = theEngine.getConfigParam("licence.productKey");
		// theULogger.log(1,'ProductKey = ' + this.productKey);
		// a valid product key could have been entered but not activated yet
		this.computerIdent = this.getComputerIdent();
		var productCaption = "";
		if (QB.product.type=="tut") 
			productCaption = theEngine.getConfigParam("train.caption");
		else
			productCaption = "Q-plus Bridge 15";
		var activationName = theLang.tr("IDS_ACTIVATION");
		var userToDo =  theLang.tr("IDS_ENTRY_1_PRODUCT_KEY") + " '" + productCaption + "'<br>"
					  + theLang.tr("IDS_ENTRY_2_PRODUCT_KEY") + " '" + activationName + "' !";
		if (this.productKey.length > 0) {
		   userToDo = theLang.tr("IDS_CLICK_ON") + " '" + activationName + "' !";
		}

		this.ui.main.html(
			  "<div style='display:inline-block;margin-left:10px;vertical-align:top;'>\n"
			+ "<h4>" + userToDo + "</h4>\n"
			+ "<h4>" + theLang.tr("L_PRODUCT_KEY") + " : "
			         + "<input id=\"productKey\" value=\"" + this.productKey + "\""
						+ "style=\"width:240px\"></input></h4>\n"
			+ "<h4>" + theLang.tr("L_COMPUTER_IDENT") + " : " + this.computerIdent + "</h4>\n"
			+ "<h3><button onclick='QB.loginWin.licenceWin.doActivation();'>"
					 + activationName + "</button></h3>\n"
			+ "<div id='extraActivationNeeded'></div> </div>"
		);

	}

	checkProductKey(pKey) {
	    if (pKey.length < 4) {
		    $('#extraActivationNeeded').html(theLang.tr("IDS_EMPTY_PRODUCT_KEY"));
		    return 2;
		}
	    var rc = theEngine.setConfigParam("licence.productKey",pKey)
	    // theULogger.log(1,'checkProductKey ' + pKey + ' rc = ' + rc);
        if (rc != 1) {
			var errorMessage = "general product key error for " + pKey + " error = " + rc;
		    if (rc == 2) {
				errorMessage = theLang.tr("IDS_PRODUCT_KEY_4_GROUPS");
			}
			if (rc == 3 || rc == 4) {
				errorMessage = theLang.tr("IDS_PRODUCT_KEY_WRONG_CHAR");
			}
			if (rc == 51) {
				errorMessage = theLang.tr("IDS_PRODUCT_KEY_NOT_FIT");
			}
			/* other errors should not happen */
			$('#extraActivationNeeded').html(errorMessage);
		}
		if (rc == 1) {
			// store the user config because of the product key
			theMemory.storeUserConfig(theEngine.getUserConfig());
		}
	    return rc;
	}

	processActivKey(activKey) {
		// theULogger.log(1,'processActivKey ' + activKey);
		var errorMessage = "";
		var rc = 99;
	    if (activKey == this.productKey) {
			errorMessage = theLang.tr("IDS_ACTIV_KEY_NOT_SAME");
		}
		else {
		    rc = theEngine.setConfigParam("licence.activKey",activKey);
			errorMessage = "general activation key error: " + rc;
		}
        if (rc != 1) {
		    if (rc == 2) {
				errorMessage = theLang.tr("IDS_ACTIV_KEY_4_GROUPS");
			}
			if (rc == 3) {
				errorMessage = theLang.tr("IDS_ACTIV_KEY_NOT_FIT");
			}
			if (rc == 4) {
				errorMessage = theLang.tr("IDS_ACTIV_KEY_WRONG_CHAR");
			}
			$('#extraActivationNeeded').html(
					 "<h4>" + theLang.tr("L_ACTIVATION_KEY") + " : "
					        + "<input id=\"activKey\" value=\"" + activKey + "\""
					        + "style=\"width:240px\"></input></h4>\n"
					 + "<p>" + errorMessage);
			return;
		}
		var dnow = new Date();
		var seconds = dnow.getTime() / 1000;
		theEngine.setConfigParam("licence.activTime",seconds.toString());
		theMemory.storeUserConfig(theEngine.getUserConfig());
		QB.winManager.closeDialog("LicenceWin");
		QB.winManager.closeDialog("LoginWin");
		QB.start2("full");
	}

	doActivation() {
	    this.productKey = $('#productKey').val();
	    theULogger.log(1,'doActivation PK: ' + this.productKey + ' CI: ' + this.computerIdent);
		if (this.checkProductKey(this.productKey) > 1) return;
		// the product key is ok
		this.productKey = theEngine.getConfigParam("licence.productKey");
		if ($('#activKey') != null) {
		    var activKey = $('#activKey').val();
		    if (activKey != null && activKey.length > 0) {
			    // manually entered activation key
			    this.processActivKey(activKey);
			    return;
		    }
		}
		var that=this;
		var activateUrl =	
			// "http://milano/qactivate.php?productkey=" 
			  "https://www.q-plus.com/qactivate.php?productkey=" 
			+ this.productKey + "&pckey=" + this.computerIdent + "&brow=1";
		$.ajax({
			url: activateUrl + "&lang=0" + theLang.letter3(theLang.lang),
			success: function(text) {
				theULogger.log(1,text);
				if (text.indexOf("#situation = 100") > 0) {
					var indexActivKey = text.indexOf("#activkey = ");
					var activKey = text.substr(indexActivKey + 12,19);
					theULogger.log(1,"- Gutfall - activKey::" + activKey + "::");
					theEngine.setConfigParam("licence.activKey",activKey);					
					var dnow = new Date();
					var seconds = dnow.getTime() / 1000;					
					theEngine.setConfigParam("licence.activTime",seconds.toString());
					theMemory.storeUserConfig(theEngine.getUserConfig());
					QB.winManager.closeDialog("LicenceWin");
					QB.winManager.closeDialog("LoginWin");
					QB.start2("full");
				}
				else {
					// Aktivierungs-Problem
					/* if (text.indexOf("#situation = 2") > 0) {
						// nachdem der Produkt-Schlüssel syntaktisch geprüft ist
						// gibt es aktuell keine lokal behandelbaren Probleme
						// theULogger.log(1,"- Aktivierungs-Problem, lokal behandelbar");
						$('#extraActivationNeeded').html("please correct the product key");
					}
					else {
					*/
						theULogger.log(1,"- activation problem");
						$('#extraActivationNeeded').html(
							   theLang.tr("IDS_ACTIVATION_FAILED")
							+ "<h4>" + theLang.tr("L_ACTIVATION_KEY") + " : " + "<input id=\"activKey\""
							         + "style=\"width:240px\"></input></h4>\n"
							+ "<a target='activation2' href='" + activateUrl + "&lang=" + theLang.letter3(theLang.lang) + "'"
							+ ">" + theLang.tr("IDS_ACTIVATION_MANUAL") + "</a>"
							+ "<p>" + theLang.tr("IDS_ACTIVATION_ENTER") );
					// }
				}
			},
			error: function(msg) {
				theULogger.error("could not connect to qactivate ",msg);
				$('#extraActivationNeeded').html(
						   theLang.tr("IDS_ACTIVATION_FAILED")
						+ "<h4>" + theLang.tr("L_ACTIVATION_KEY") + " : " + "<input id=\"activKey\""
						         + "style=\"width:240px\"></input></h4>\n"
						+ "<a target='activation2' href='" + activateUrl + "&lang=" + theLang.letter3(theLang.lang) + "'"
						+ ">" + theLang.tr("IDS_ACTIVATION_MANUAL") + "</a>"
						+ "<p>" + theLang.tr("IDS_ACTIVATION_ENTER") );
			}
		});
	}

	onChanged(what) {
	}
}

class LoadConfigWin extends View {

	constructor(app) {
		super(app);
	}

	init() {

		theLang.add({
			IDS_RESTORE_1: {
				en: "You can restore the configuration including the product key",
				de: "Sie können die Konfigurations samt dem Produktschlüssel",
				fr: "Vous pouvez restaurer la configuration, y compris la clé",
			},
			IDS_RESTORE_2: {
				en: "if you have previously saved it.",
				de: "wiederherstellen, wenn Sie diese vorher gesichert haben.",
				fr: "de produit, si vous l'avez précédemment sauvegardée.",
			},
			IDS_RESTORE_3: {
				en: "This is useful instead of entering the product key.",
				de: "Das ist nützlich anstatt der Eingabe des Produktschlüssels.",
				fr: "Cela vous évite de saisir la clé de produit.",
			},		
			IDS_SELECT_FILE: {
				en: "Please select the file",
				de: "Bitte wählen Sie die Datei",
				fr: "Veuillez sélectionner le fichier",
			},
			IDS_CONFIG_GENERAL_ERROR: {	
				en: "general error in the configuration file",
				de: "allgemeiner Fehler in der Konfigurationsdatei",
				fr: "erreur générale dans le fichier de configuration",
			},
			IDS_CONFIG_NOT_VALID: {	
				en: "not a valid configuration file",
				de: "keine gültige Konfigurationsdatei",
				fr: "pas un fichier de configuration valide",
			},
			IDS_CONFIG_NO_PRODUCT_KEY: {	
				en: "no product key in configuration file",
				de: "kein Produktschlüssel in der Konfigurationsdatei",
				fr: "pas de clé de produit dans le fichier de configuration",
			},			
			IDS_CONFIG_NOT_FIT: {	
				en: "the configuration file does not fit to this program",
				de: "die Konfigurationsdatei passt nicht zu diesem Programm",
				fr: "le fichier de configuration ne correspond pas à ce programme",
			},						
		});		

		this.ui = {
			main: $("#LoadConfigWin"),
		}
	
		var html =   "<p>" + theLang.tr("IDS_RESTORE_1") + "<br>" + theLang.tr("IDS_RESTORE_2")
		           + "<br>" + theLang.tr("IDS_RESTORE_3");
		html  +=     "<p><a href=\"./help/" + theLang.lang + "/ConfigSave.htm\" target=\"_blank\">"
		           + theLang.tr("IDS_CLICK_DETAILS") + " </a>\n";
		html +=      '<p>' + theLang.tr("IDS_SELECT_FILE") + ' : '
				   + '<b>Config-' + QB.products[QB.product.id].abbrev + '.txt</b> .'
	               + '<h3> <input type="file" id="loadconfigfile" name="loadconfigname"'
                   +       ' style="width:80%;"> </input></h3>\n';
		html  +=    "<h3> <button onclick='QB.loginWin.loadConfigWin.doCancel();'>"
				  + theLang.tr("L_CANCEL") + "</button></h3>\n";
		html  += "<p><div id='loadConfigMessage'></div>";
		this.ui.main.html(html);
		document.getElementById('loadconfigfile').addEventListener(
				'change', QB.loginWin.loadConfigWin.handleLoadConfig,false);
	}

    doCancel() {
		QB.winManager.closeDialog("LoadConfigWin");	
	}

    handleLoadConfig(event) {
		theULogger.log(1,'- handleLoadfile');
		var file1 = event.target.files[0];
		theULogger.log(1,'- file name: ' + file1.name);
		var reader = new FileReader();
		reader.onload = (event) => {
		    var filetext = reader.result;
			// theULogger.log(1,'text: ' + filetext);
			var linenr = 0;
			var isConfigFile = 0;
			var rcProductKey = 0;
			var isFullVersion = "0";
			for (var line of filetext.split("\n")) {
			    // checking that the configuration line is there
				// and a product key which fits to the product
			    linenr++;
				// theULogger.log(1,'line: ' + line);				
				if (line) {	
				    if (linenr == 1) {
				        if (line.substr(0,31) == "# Bridge Tutorial configuration") {
					        isConfigFile = 1;
						}
					}
					else {
					    if (line.substr(0,18) == "licence.productKey") {
							rcProductKey = theEngine.setConfigParam("licence.productKey",line.substr(21,19));			
						}
					}
				}
				if (isConfigFile == 0) break;
			}
		    theULogger.log(1,  '- isConfigFile: ' + isConfigFile + ' rcProductKey: ' + rcProductKey);			
			if (isConfigFile == 1 && rcProductKey == 1) {
			    theEngine.loadUserConfig(filetext);
			    isFullVersion = theEngine.getConfigParam("licence.isFullVersion");
				if (isFullVersion == "1") {
			        QB.winManager.closeDialog("LoadConfigWin");
			        QB.winManager.closeDialog("LoginWin");
				    theMemory.storeUserConfig(theEngine.getUserConfig());				
			        QB.start2("contents");	
				}
			}
			if (isFullVersion == "0") {
			    var errormessage = theLang.tr("IDS_CONFIG_GENERAL_ERROR");
				if (isConfigFile == 0) {
					errormessage = theLang.tr("IDS_CONFIG_NOT_VALID");
				}
				else {
				    if (rcProductKey == 0)
				        errormessage = theLang.tr("IDS_CONFIG_NO_PRODUCT_KEY");
				    if (rcProductKey == 51)
					    errormessage = theLang.tr("IDS_CONFIG_NOT_FIT");
				}
				$('#loadConfigMessage').html("<b>" + errormessage + " !</b>");			
			}
 		};
        reader.readAsText(file1);		
	}

	onChanged(what) {
	}
}

