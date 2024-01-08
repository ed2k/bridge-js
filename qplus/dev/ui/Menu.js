
class Menu {

	constructor() {
	}

	init() {
		// symbols for translation
		theLang.add({
			m_Product: {
				en: "Q-plus",
			},
			m_Reset: {
				en: "Reset",
				de: "Reset",
				fr: "Réinitialiser",
				es: "Reset",
			},
			m_Configuration: {
				en: "Configuration",
				de: "Konfiguration",
				fr: "Configuration",
				es: "Configuración",
			},
			m_TestWASM: {
				en: "Test WASM",
				de: "Test WASM",
				es: "Probar WASM",
			},
			m_TestAudio: {
				en: "Test Audio",
				de: "Test Audio",
				es: "Probar Audio",
			},
			m_ShowAllHands: {
				en: "all hands",
				de: "Alle Hände",
				fr: "Toutes les mains",
				es: "Todas manos",
			},
			m_Settings: {
				en: "Settings",
				de: "Einstellungen",
				fr: "Paramètres",
				es: "Ajustes",
			},
			m_CardStyle: {
				en: "Card Style",
				de: "Kartenstil",
				fr: "Style des cartes",
				es: "Estilo Cartas",
			},
			m_CardSize: {
				en: "card size",
				de: "Kartengröße",
				fr: "taille des cartes",
				es: "tamaño cartas",
			},
			/*
			m_Download: {
				en: "Download",
				de: "Download",
				es: "Descargar",
			},
			m_Download_Reject: {
				en: "Download is not possible in local version.",
				de: "Download ist in der lokalen Version nicht möglich.",
				es: "Download imposible en la version local.",
			},
			m_Download_Hint: {
				en: `
					UNPACK the ZIP file on your local machine. Just double clicking the ZIP archive will NOT DO!
					You must UNPACK and then execute 'qbwasm/install.bat'
					Afterwards your browser should open with 'localhost:13444'`,
				de: `
					Klicken Sie mit der *rechten* Maustaste auf das Symbol mit der heruntergeladenen Datei
					und wählen Sie "*im Ordner anzeigen*" (Chrome) oder "*Datei speichern*" (Firefox).
					Dann klicken Sie mit der rechten Maustaste auf *qbwasm.zip*
					und wählen Sie "*Alle extrahieren*".
					Anschließend wechseln Sie in das neu erstellte Verzeichnis *qbwasm*
					und führen dort das Kommando **install.bat** aus.
					Wenn alles geklappt hat, öffnet Ihr Browser die Adresse *localhost:13444*
					Unter diesem Namen können Sie die Anwendung in Zukunft auch dann aufrufen,
					wenn Sie gerade nicht mit dem Internet verbunden sind.`,
			},
			*/
			m_Hint: {
				en: "Hint",
				de: "Hinweis",
				fr: "Conseil",
				es: "Indicación",
			},
			m_Log: {
				en: "Log",
			},
			m_FullScreen: {
				en: "&#x2750;",
			},
			m_Help: {
				en: "?",
			},

		});
	}

	loadLabels() {
		// load label texts for the menu
		// must be called from the UI after it is clear which language is requested

		$("#menu a").each(function() {
			$(this).attr("href","javascript:QB.menu.do('"+this.id+"');").html(theLang.tr(this.id));
		});
	}

	do(cmd) {
		if 	(cmd == "m_Product") {
			QB.abort(theLang.tr("L_SWITCH_PRODUCT"));
		}
		else if (cmd == "m_Reset") {
			theConfig.reset(["userTutorial"]); // reset everything except the userTutorial
			window.location.reload();
		}
		else if (cmd == "m_Configuration") {
			theULogger.log(1,"CONFIG DATA SAVED:<br/><pre>"+JSON.stringify(theConfig.data,null,2)+"</pre>");
			theConfig.enableSaving(true);
			theConfig.save();
		}
		else if (cmd == "m_Settings") {
			QB.winManager.toggleDialog("SettingsWin");
		}
		else if (cmd == "m_Log") {
			// (re)open log window
			QB.winManager.toggleDialog("LogWin");
		}
		else if (cmd == "m_FullScreen") {
		}
		else if (cmd == "m_Help") {
			// (re)open Help window
			QB.winManager.toggleDialog("HelpWin");
		}
	}

}
