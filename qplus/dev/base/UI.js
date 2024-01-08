
/* This is a very small User Interface (UI) framework.
   It defines parent classes for Application, Model and View
   It offers a a simple logging mechanism: the Logger.
   It offers a publish/subscribe service for the propagation
   of change events: the Dispatcher
   The existence of the Dispatcher is not directly visible
   in the source code of classes derived from Model or View
   The UI supports interactive mode and batch mode (Node.js)
*/
"use strict";

// global functions

function isPresent (item) 		{ return typeof item!="undefined"; }
function isMissing (item) 		{ return typeof item=="undefined"; }
function setDefault(item,value) { if (isMissing(item)) item=value; }
function htmlEscape(str) {
	// escape a string to be safely displayed in an html document
	if (!str.match(/[&<>'"]/)) return str;
	return str
		.replace(/&/g,'&amp;')
		.replace(/</g,'&lt;')
		.replace(/>/g,'&gt;')
		.replace(/'/g,'&apos;')
		.replace(/"/g,'&quot;')
	;
}


class Application {
	// abstract parent class for applications; creates Logger and Dispatcher
	// analyzes the URL query string and stores the result for later requests
	// derived classes must override the "getModel()" function.

	constructor(interactive) {
		// get invocation parameters ("arguments"), create Logger and Dispatcher

		if (this.constructor === Application) this.error('abstract class "Application" cannot be instantiated directly.');

		// store mode (true=graphical UI/browser, false=batch mode/Node.js)
		this.interactive= (typeof interactive == "undefined") ? true: interactive;

		// parameters can be given in the URL like this: "http://...../index.html?parm=value&.."
		// or in the command line like this: " arg1=value arg2"
		if (this.GUI())	this.args = this.getArgsFromURL(decodeURIComponent(window.location.search));
		else			this.args = this.getArgsFromCommandLine(process.argv);

		// create the Logger
		this.logger=new Logger(this);

		// create dispatcher
		this.dispatcher=new Dispatcher(this.logger);

	}

	getModel() {
		// must be overriden in derived class
		return null;
	}

	GUI() {
		return this.interactive;
	}

	getArgsFromURL(text) {
		// analyze the URL query string
		// expecting something like        ?arg1=value1&arg2=value2&arg3&arg4

		if (text.length<=1) return {};

		var args={};
		for(var parm of text.substr(1).split("&")) {
			var arg = parm.replace(/=.*/,'');
			var value=true;
			if (arg!=parm) {
				value=parm.replace(/[^=]*?=/,'');
				if (value.match(/^-?[0-9]+$/)) value= parseInt(value);
			}
			args[arg] = value;
		}
		return args;
	}

	getArgsFromCommandLine(parms) {
		// analyze the command line arguments
		// expecting something like        arg1=value arg2=value2 arg3 arg4

		var args={};
		for(var parm of parms) {
			var arg = parm.replace(/=.*/,'');
			var value=true;
			if (arg!=parm) {
				value=parm.replace(/[^=]*?=/,'');
				if (value.match(/^-?[0-9]+$/)) value= parseInt(value);
			}
			args[arg] = value;
		}
		return args;
	}

	prependArgs(args) {
		// add the given args to the sored set of args so that they have priority

		if (this.GUI()) {
			this.args = this.getArgsFromURL("?"+args+"&"+decodeURIComponent(window.location.search.substr(1)));
		}
		else {
			var newArgs = this.getArgsFromCommandLine(args);
			for (var name in newArgs) {
				this.args[name] = newArgs[name];
			}
		}
	}

	argValue(name,defaultValue) {
		// return an URL argument or its default value if it was not set
		if (typeof this.args[name] == "undefined") return defaultValue;
		return this.args[name];
	}

	init() {
		// initialize Logger
		this.logger.init();
	}

	error(exception) {
		// pass error call to the logger for handling
		this.logger.error(exception);
	}

	log(what) {
		// pass log message to the logger for handling
		this.logger.log(what);
	}
}

class Model {
	// abstract parent class for Models (= core functionality of applications)
	// Models contain data structures and algorithms without visual aspects
	// adds a changed(), log() and error() methods to models

	constructor(app) {
		// store a reference to the dispatcher and register

		if (this.constructor === Model) this.error('abstract class "Model" cannot be instantiated directly.');

		this.app		= app;
		this.logger 	= app.logger;
		this.dispatcher	= app.dispatcher;
		this.dispatcher.setModel(this);
	}

	getDispatcher() {
		return this.dispatcher;
	}

	getApp() {
		return this.app;
	}

	changed(what) {
		// ask the dispatcher to forward the change event
		this.dispatcher.changed(what);
	}

	enableChanges(value) {
		// enable/disable change propagation
		this.dispatcher.enableChanges(value);
	}

	error(exception) {
		// pass error call to the logger for handling
		this.logger.error(exception);
	}

	log(what) {
		// pass log message to the logger for handling
		this.logger.log(what);
	}

}

class Interaction {
	// this is the abstract parent class for View and Notice.
	// Interactions receive a reference to their Model
	// and then talk directly to the Model
	// Interactions do not calculate; they delegate all "business logic" to the Model
	// every Interaction must implement an "onChanged(what)" function

	constructor(app) {
		// hold a reference to the model and register at the Dispatcher

		if (typeof app == "undefined") {
			this.error('Interaction constructor needs app parameter');
			return;
		}


		if (this.constructor === Interaction) this.error('abstract class "Interaction" cannot be instantiated directly.');

		this.app		= app;
		this.getModel 	= app.getModel;	// import function to access the model
		this.logger		= app.logger;
		this.dispatcher	= app.dispatcher;
		this.dispatcher.register(this);
	}

	close() {
		// unregister on closing the interaction
		this.dispatcher.unregister(this);
	}

	changed(what) {
		// an interaction might also want to issue a change event itself
		this.dispatcher.changed(what);
	}

	onChanged(what) {
		// this default implementation will only be called if a class
		// derived from View or Notice does not implement the onChanged() method
		this.error(new Error("Interaction does not implement the onChanged() method"));
	}

	selectionSetOption(name,value) {
		// make sure the selection box identified by "name" contains the value and select it
		var found=false;
		$(name+" option").each(function() {
			found |= ($(this).val()==value);
		});
		var selection=$(name);
		if (!found) selection.prepend('<option selected>'+value+'</option>');
		selection.val(value);
	}

	error(exception) {
		// pass error call to the logger for handling
		if (typeof this.logger=="undefined") { alert(exception); return; }
		this.logger.error(exception);
	}

	log(what) {
		// pass log message to the logger for handling
		this.logger.log(what);
	}

	static toggleFullScreen(button,element) {
		if (typeof Interaction.isFullScreen == "undefined") Interaction.isFullScreen=false;
		if (Interaction.isFullScreen) {
			element=document;
			// exit from full screen mode
			if(element.exitFullscreen) {
				element.exitFullscreen();
			} else if(element.mozExitFullScreen) {
				element.mozExitFullScreen();
			} else if(element.msExitFullscreen) {
				element.msExitFullscreen();
			} else if(element.webkitExitFullscreen) {
				element.webkitExitFullscreen();
			}
			Interaction.isFullScreen=false;
			button.innerHTML="<b>❐</b>";
		}
		else {
			// enter full screen mode
			if(element.requestFullscreen) {
				element.requestFullscreen();
			} else if(element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if(element.msRequestFullscreen) {
				element.msRequestFullscreen();
			} else if(element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			}
			Interaction.isFullScreen=true;
			button.innerHTML="<b>⊠</b>";
		}
	}

}

class View extends Interaction {
	// this is the abstract parent class for interactive Views in a browser environment

	constructor(app) {
		super(app);
		if (this.constructor === View) this.error('abstract class "View" cannot be instantiated directly.');
	}

	selectionSetOption(name,value) {
		// make sure the selection box identified by "name" contains the value and select it
		var found=false;
		$(name+" option").each(function() {
			found |= ($(this).val()==value);
		});
		var selection=$(name);
		if (!found) selection.prepend('<option selected>'+value+'</option>');
		selection.val(value);
	}

}

class Notice extends Interaction {
	// this is the abstract parent class for batch interactions.
	// it provides a simple mechanism to print result messages to a file

	constructor(app) {
		super(app);
		if (this.constructor === Notice) this.error('abstract class "Notice" cannot be instantiated directly.');
		this.file=process.stdout;
		this.format= this.app.argValue("format","");
	}

	setFormat(format) {
		this.format=format;
	}

	print(line) {
		this.file.write(line);
	}

	printLine(line) {
		if (this.format=="CSV" && typeof line=="object") {
			for (var key in line) {
				var value=line[key];
				if (typeof value=="string")	this.file.write('"'+line[key]+'"');
				else						this.file.write(""+line[key]);
				this.file.write(";");
			}
			this.file.write("\n");
		}
		else {
			this.file.write(line);
			this.file.write("\n");
		}
	}
}

class Dispatcher {
	// propagate change events issued by a Model to all attached Interactions
	// holds references to the Model and all active Interactions

	constructor(logger) {
		this.logger	= logger;
		this.interactions = [];
		this.enableChanges(true);
	}

	setModel(model) {
		// store a reference to the Model
		this.model = model;
	}

	register(interaction) {
		// add an interaction to the list
		this.interactions.push(interaction);
	}

	unregister(interaction) {
		// remove an interaction from the list
		var n=0;
		for(var i of this.interactions) {
			if (i==interaction) {
				this.interactions.splice(n,1);
				break;
			}
			n++;
		}
	}

	changed(what) {
		// forward a change to all interactions
		// the event ("what") may carry information describing details of the change
		// the "type" field is obligatory.
		// Every Interaction must have a function called "onChanged(what)"
		if (!this.changesEnabled) return;
		for (var interaction of this.interactions) interaction.onChanged(what);
	}

	enableChanges(value) {
		// enable/disable change propagation
		this.changesEnabled=value;
	}

	error(exception) {
		// pass error call to the logger for handling
		this.logger.error(exception);
	}

	log(what) {
		this.logger.log(what);
	}
}

class Logger {
	// provides a basic logging mechanism
	// log messages are shown in a separate (pop up) window which can be resized
	// and moved by the user; note that pop up blockers in the user's browser
	// might block this functionality - so they must be disabled

	constructor(app) {
		this.app		= app;
		this.win		= null;
		this.winProps	= "width=600,height=400,status=yes,scrollbars=yes,resizable=yes";
	}

	init() {
		// check if the command line contains a request to open the LOG window
		if (typeof this.app.args["LOG"] !="undefined") this.open();
	}

	open() {
		// in GUI mode:
		//		open the LOG window if it is not yet visible
		// 		make sure that its properties will be stored when the user closes it
		// in batch mode:
		//		activate logging to console

		if (this.app.GUI()) {
			if (this.win==null) {
				this.win=window.open("","log",this.winProps);
				if (this.win==null) {
					alert("could not open LOG window. Did you install a popup blocker?");
					return;
				}
				this.win.onbeforeunload = function() {
					// store current position and size
					theApp.logger.storeWinProps();
					theApp.logger.win=null;
				};
				this.log("logging <b>started</b>");
			}
		}
		else {
			this.win=true;
		}
	}

	toggle() {
		// toggle (open/close) the LOG window
		if (this.win==null) this.open();
		else {
			if (this.app.GUI())	this.win.close();
			else				this.win=null;
		}
	}

	storeWinProps(win) {
		// save position and size of the LOG window
		this.winProps=
			"width="+this.win.innerWidth+
			",height="+this.win.innerHeight+
			",top="+this.win.screenY+
			",left="+this.win.screenX+
			",status=yes,scrollbars=yes,resizable=yes"
		;
	}

	log(what) {
		// append a text string or an object to the LOG window // write to console

		if (this.win==null) return;

		if (this.app.GUI()) {
			if (typeof what == "string") {
				this.win.document.body.innerHTML+="<pre style='margin:0'>"+what+"</pre>";
			}
			else {
				this.win.document.body.innerHTML+="<pre style='margin:0'>"+this.stringify(what)+"</pre>";
			}
		}
		else {
			if (typeof what == "string") {
				console.log(what);
			}
			else {
				console.log(this.stringify(what));
			}
		}
	}

	error(exception) {
		// default implementation for error handling - show alert box // write to console

		if (this.app.GUI()) {
			if (typeof exception == "string") alert(exception);
			else alert(exception.message+"\n\n"+exception.stack);
		}
		else {
			if (typeof exception == "string") console.log(exception);
			else console.log(exception.message+"\n\n"+exception.stack);
		}
	}

	stringify(val) {
		// protect against cyclic structures
		const cache = new Map();

		return JSON.stringify(val, function (key, value) {
			if (typeof value === 'object' && value !== null) {
				if (cache.has(value)) {
					// Circular reference found, discard key
					return;
				}
				// Store value in our map
				cache.set(value, true);
			}
			return value;
		},2);
	}


}

// export public classes (Node.js only)
if (typeof module != "undefined") {
	module.exports = {
		Application:	Application,
		Model:			Model,
		Notice:			Notice,
		Logger:			Logger,
	}
}
