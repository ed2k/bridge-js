
var qbBrowserGood = 5; // 0 = not good, 5 = unclear, 10 = ok
var qbNeedOtherBrowser = 0;
var qbBrowserName = "unknown";
var qbBrowserVersion = 0;
var qbAndroidVersion = 0;
var qbLinuxVersion = 0;
var qbWindowsVersion = 0;
var qbMacVersion = 0;
var qbIOSVersion = 0;

/* test code with browser list in variable "browsers"
var browser;
for (var i=0; i < browsers.length; i++) {
    browser = browsers[i];
    console.log('Browser: ' + browser);
	qbBrowserGood = 5;
	qbNeedOtherBrowser = 0;
	qbBrowserName = "unknown";
	qbBrowserVersion = 0;
	qbAndroidVersion = 0;
	qbLinuxVersion = 0;
	qbWindowsVersion = 0;
	qbMacVersion = 0;
	qbIOSVersion = 0;
	qbDetectBrowser(browser);
	console.log('  Good: ' + qbBrowserGood + ' Other:' + qbNeedOtherBrowser + ' Name:' + qbBrowserName
				 + ' Version:' + qbBrowserVersion + ' A:' + qbAndroidVersion + ' L:' + qbLinuxVersion
				 + ' W:' + qbWindowsVersion + ' M:' + qbMacVersion + ' I:' + qbIOSVersion);
	if (qbBrowserGood != 10) {
		var btext = qbReportBrowser(browser);
		console.log(btext);
	}
}
*/

// productive code
var qbUserAgent = window.navigator.userAgent;
var qbPlatform = window.navigator.platform;
var qbServerMode = "online"; // can be also "offline" and "file"
var qbDefProductId = "";
qbDetectBrowser(qbUserAgent);
if (qbBrowserGood != 10) {
    var btext = qbReportBrowser(qbUserAgent);
	alert(btext);
}

function qbReportBrowser(qbUA) {
	var btext = "";
	if (qbBrowserGood == 0) {
		btext += "You seem to be using " + qbBrowserName + " (version " + qbBrowserVersion + ") as browser.\n";
		if (qbNeedOtherBrowser > 0) {
			btext +=    "Q-plus bridge programs cannot work with " + qbBrowserName + ".\n"
			          + "Please use the latest version of Chrome or Firefox !";
		}
		else {
			btext +=    "Q-plus bridge programs cannot work with this version.\n"		
			          + "Please update the browser";
			if (qbBrowserName != "Chrome" && qbBrowserName != "Firefox") {
			    btext += "\nor use the latest version of Chrome or Firefox !";
			}
			else {
				btext += " !";			
			}
		}
	}
	if (qbBrowserGood == 5) {
		btext +=    "The Q-plus bridge program cannot identify your browser !\n\n"
		          + "If the program does not work please either update the browser\n"
		          + "or use the latest version of Chrome or Firefox !\n\n"
		          + "If the program does work please e-mail the browser identification:\n"	
		          + "   " + qbUA + "\n"		
		          + "to support@q-plus.com";		
	}
	return btext;
}

function qbCheckCHorFF(chrome,chromeVersion,firefox,firefoxVersion)
{
	if (chromeVersion >= 72) {
		qbBrowserGood = 10;
		qbBrowserVersion = chromeVersion;
		qbBrowserName = "Chrome";	
		return;
	}
	if (firefoxVersion >= 60) {
		qbBrowserGood = 10;
		qbBrowserVersion = firefoxVersion; 	
		qbBrowserName = "Firefox";
		return;		
	}
	if (firefoxVersion > 0 || chromeVersion > 0) {
		qbBrowserGood = 0;
		if (firefox > chrome) { // later text entry
			qbBrowserVersion = firefoxVersion; 
			qbBrowserName = "Firefox";
		}
		else {
			qbBrowserVersion = chromeVersion;
			qbBrowserName = "Chrome";				
		}
	}
}

function qbDetectBrowser(ua) {

  var chromeVersion = 0;
  var firefoxVersion = 0;
  var chrome = ua.indexOf('Chrome/');
  if (chrome > 0) {
	 chromeVersion = parseInt(ua.substring(chrome + 7, ua.indexOf('.', chrome)), 10);
	 // decision later
  }
  var firefox = ua.indexOf('Firefox/');
  if (firefox > 0) {
	 firefoxVersion = parseInt(ua.substring(firefox + 8, ua.indexOf('.', firefox)), 10);
	 // decision later
  }  
  var android = ua.indexOf('Android ');
  if (android > 0) {
	qbAndroidVersion = parseInt(ua.substring(android + 8, android + 10), 10);
	if (qbAndroidVersion >= 8) {  // we assume this is always ok 
		qbBrowserGood = 10;
		if (firefoxVersion > 0) {
			qbBrowserVersion = firefoxVersion;
			qbBrowserName = "Firefox";
		}
		if (chromeVersion > 0) {
		    qbBrowserVersion = chromeVersion; // sometimes it is actually the Samsung browser
			qbBrowserName = "Chrome";
		}
	    return;
	}
	qbCheckCHorFF(chrome,chromeVersion,firefox,firefoxVersion);
  }
  
  var windows = ua.indexOf('Windows NT ');
  if (windows > 0) { 
	qbWindowsVersion = parseInt(ua.substring(windows + 11, windows + 13), 10); 
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older
		qbBrowserName = "Internet Explorer";
		qbBrowserVersion = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		qbBrowserGood = 0;
		qbNeedOtherBrowser = 1;
		return;
	}
	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11
		var rv = ua.indexOf('rv:');
		qbBrowserName = "Internet Explorer";
		qbBrowserVersion = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		qbBrowserGood = 0;
		qbNeedOtherBrowser = 1;	
		return;	
	}
	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+)
		qbBrowserName = "Edge";
		qbBrowserVersion = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		qbBrowserGood = 0;
		qbNeedOtherBrowser = 1;		
		return;	
	}
	qbCheckCHorFF(chrome,chromeVersion,firefox,firefoxVersion);
	return;
  }
  
  var macosx = ua.indexOf('Mac OS X');
  if (macosx > 0) { 
	qbMacVersion = 10; // assumption - but could be iOS also!
	var safari = ua.indexOf('Safari/');
	if (safari > 0) {
		qbBrowserVersion = parseInt(ua.substring(safari + 7, ua.indexOf('.', safari)), 10);	
		if (qbBrowserVersion >= 600) {
			qbBrowserName = "Safari";
			if (qbBrowserVersion >= 604) {
				qbBrowserGood = 10;			
			}
			else {
				qbBrowserGood = 0;				
			}
			return;
		}
	}
	qbCheckCHorFF(chrome,chromeVersion,firefox,firefoxVersion);
	return;
  }  
  var linux = ua.indexOf('Linux ');
  if (linux > 0) { 
	qbLinuxVersion = 5; // guess
	// no return, check for Chrome or Firefox:
  }
  qbCheckCHorFF(chrome,chromeVersion,firefox,firefoxVersion);
}
