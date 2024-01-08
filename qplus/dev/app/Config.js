"use strict";

class Config {
/*
	Config.js : store/retrieve a memory object with configuration items
*/

	constructor() {
		// default Values
		this.applyDefaults();
		this.data=theMemory.get("config");
		this.enableSaving(true);
	}

	applyDefaults() {
		// if the app has never been used by a browser we need a minimal set of default settings
		var defaultData = {
			lang:"xx",						// not used any more
			faceType:3,						// card faces -- obsolet
			pictureCards:true,
			largeSymbols:true,
			englishSymbols:false,
			cardSize:1.5,
			showHiddenHands:true,
			bdlSeqPolicy:'physical',		// how to step through a BDL file
			rotateHands:true,				// rotate all hands by 180 degrees if North declares
			sequenceSHCD:false,				// clubs are displayed before diamonds
			playForcedCards:false,			// the program plays forced cards automatically 
			userTutorial:'',				// the text of a tutorial created by the user
			computerName:'',				// the generated computer name - the same for all products
		}
		this.data = JSON.parse(JSON.stringify(defaultData));
		theMemory.setDefault("config",this.data);
	}

	reset(exceptions) {
		// clear all individual settings (apart from explicit exceptions)
		// and prevent the configuration from being saved when exiting the program
		var keep={};
		for (var exc of exceptions) keep[exc]=this.get(exc);
		theMemory.set("config",{});
		this.applyDefaults();
		for (var exc of exceptions) this.set(exc,keep[exc]);
		this.save();
		this.enableSaving(false);
	}

	get(name,defaultValue) {
		// get a configuration item;
		// returns "undefined" if the item does not exist and no default value is given
		// if a default value is given, it will be assigned to the item and returned
		var value;
		var value=this.data;
		var parts = name.split(".");
		for (var p=0;p<parts.length;p++) {
			value = value[parts[p]];
			if (p+1>=parts.length || typeof value=="undefined") break;
		}
		if (isPresent(value)) return value;
		if (isPresent(defaultValue)) {
			this.set(name,defaultValue);
			return defaultValue;
		}
		return value; // undefined
	}
	
	getComputerName() {
		// currently just a formatted date
	    if (this.data.computerName == null || this.data.computerName == "") {
	        var d = new Date();
			var seconds = d.getSeconds();
			var hours = d.getHours();
			var hours30 = hours + 30;
			var date20 = d.getDate() + 20;
	        this.data.computerName = 
					  String.fromCharCode(65 + seconds / 3) 
					+ String.fromCharCode(75 + seconds / 5) 
					+ String.fromCharCode(67 + hours)
					+ date20.toString().padStart(2,"0") 
					+ hours30.toString().padStart(2,"0") 
		            + d.getMinutes().toString().padStart(2,"0") 
					+ seconds.toString().padStart(2,"0");					
	    }
		// this.data.computerName = ""; // -- line to reset computerName
	    return this.data.computerName;

	}

	set(name,obj) {
		// set a configuration item; "name" can be a path like "a.b.c"
		// the value can be a simple string, a number or an arbitrary struct (object)
		// if the item or some of its members does not yet exist it will be added
		// existing members will be modified
		// other members which already may exist as part of "name" are deleted.
		var item = this.data;
		var tokens = name.split(".");
		var bottom = tokens.length;
		for (var token of name.split(".")) {
			if (typeof item[token] == "undefined") item[token]={};	// add path from here onwards
			if (--bottom<=0) {
				// bottom reached, assign object as value
				item[token]=obj;
				break;	// done
			}
			// step down further
			item=item[token];
		}
		return obj;
	}

	enableSaving(val) {
		// allow the config to be saved (e.g. upon exiting the program)
		this.savingEnabled=val;
	}

	save() {
		// save current config to browser memory (if saving enabled)
		if (this.savingEnabled) theMemory.set("config",this.data);
	}
}

// global unique instance of Config
var theConfig = new Config();
