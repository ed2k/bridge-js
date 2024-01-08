"use strict";

/*
	class ULogger: WEB Browser ULogger; appends messages to a DOM element with a default id of "log"
 */

class ULogger {

	constructor() {
		this.logWin = $("#LogWin");
		this.logTag= "#log";
		this.indenting= "";
	}

	setTags(logTag) {
		this.logTag=logTag;
	}

	error(obj) {
		if (typeof QB != "undefined")	QB.hideIntroScreen();
		if ($(this.logTag).height()<200) $(this.logTag).height(200);
		if ($(this.logTag).width()<600) $(this.logTag).width(600);
		if (obj instanceof Error) {
			// this.log("<b>ERROR: </b>"+obj.message);
			return this.log(0,"<span style='color:red'><b>ERROR: </b>"+obj.stack.replace(/\\n/g,"<br/>")+"</span>");
		}
		if (typeof obj !="string") obj = JSON.stringify(obj,null,4);
		return this.log(0,"<span style='color:red'><b>ERROR: </b>"+obj+"</span>");
	}

	indent(indent) {
		this.indenting=indent;
		return this;
	}

	logFresh(channel,msg) {
		this.clear().log(channel,msg);
	}

	log(channel,msg) {
	    if (channel == 1 && QB.debugJS == 0) return;

		if (msg) this.logInline(msg);
		$(this.logTag).append("<br/>").scrollTop(100000);
		// bring dialog with messages to front
		// this.logWin.dialog("moveToTop"); // for some reason does not work ...
		return this;
	}

	logInline(msg) {
		if (typeof msg != "string") msg = JSON.stringify(msg,null,4);
		$(this.logTag).append(this.indenting+msg);
		return this;
	}

	clear() {
		$(this.logTag).html("");
		return this;
	}

}
var theULogger	= new ULogger();
