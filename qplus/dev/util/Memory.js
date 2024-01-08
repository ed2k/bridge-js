"use strict";

class Memory {
/*
	Memory.js : store  / Retrieve memory objects (stringified JSON)
*/

	setDefault(name,obj) {
		var data = this.get(name);
		if (data==null) {
			// insert complete object
			this.set(name,obj);
			return;
		}
		// insert missing keys
		for (var key in obj) {
			if (typeof data[key] == "undefined") data[key]=obj[key];
		}
		this.set(name,data);
	}
	
	get(name) {
		var item = localStorage.getItem(name);
		if (item==null) return null;
		return JSON.parse(item);
	}
	
	set(name,obj) {
		localStorage.setItem(name,JSON.stringify(obj));
	}

	// UserConfig is the summary config of the engine
	retrieveUserConfig() {
        var name = "euconfig." + QB.product.id;
        return localStorage.getItem(name);
	}	
	storeUserConfig(data) {
        var name = "euconfig." + QB.product.id;
		localStorage.setItem(name,data);
	}
	
	retrieveStatistics() {
        var name = "statistics." + QB.product.id;
        return localStorage.getItem(name);
	}	
	storeStatistics(data) {
        var name = "statistics." + QB.product.id;
		localStorage.setItem(name,data);
	}
	
	retrieveMatchConfig() {
        var name = "matchConfig." + QB.product.id;
        return localStorage.getItem(name);
	}	
	storeMatchConfig(data) {
        var name = "matchConfig." + QB.product.id;
		localStorage.setItem(name,data);
	}	

	retrieveBidIds2() {
        var name = "bidId2." + QB.product.id;
        var alldata = localStorage.getItem(name);
		if (alldata == null || alldata == "") return null;
		var posNL = alldata.indexOf("\n");
		if (posNL < 0) return null;
		var filename = alldata.slice(0,posNL);			
		var data = alldata.slice(posNL+1);
		return {filename:filename, data:data};		
	}	
	storeBidIds2(filename,data) {
        var name = "bidId2." + QB.product.id;
		localStorage.setItem(name,filename + "\n" + data);
	}

	storeDealFile(filetype,nr,filename,data) {
	    var name = "dealfile-" + filetype + "-" + nr.toString().padStart(2,'0');
		localStorage.setItem(name,filename + "\n" + data);
	}	

	retrieveDealFile(filetype,nr) {
	    var name = "dealfile-" + filetype + "-" + nr.toString().padStart(2,'0');
		var alldata = localStorage.getItem(name);
		if (alldata == null || alldata == "") return null;
		var posNL = alldata.indexOf("\n");
		if (posNL < 0) return null;
		var filename = alldata.slice(0,posNL);			
		var data = alldata.slice(posNL+1);
		return {filename:filename, data:data};		
	}		

	retrieveBidsys(team) {
        var name = "bidsys-" + team + "." + QB.product.id;
		// theULogger.log(0, "- retrieveBidsys, name: " + name);
        var alldata = localStorage.getItem(name);
		if (alldata == null || alldata == "") return null;
		var posNL = alldata.indexOf("\n");
		// theULogger.log(0, "- alldata, posNL: " + posNL);	
		if (posNL < 0) return null;
		var filename = alldata.slice(0,posNL);
		// theULogger.log(0, "- filename: " + filename);			
		var data = alldata.slice(posNL+1);
		return {filename:filename, data:data};
	}	
	storeBidsys(team,filename,data) {
	    var name = "bidsys-" + team + "." + QB.product.id;
		localStorage.setItem(name,filename + "\n" + data);
	}	
}

var theMemory = new Memory();
