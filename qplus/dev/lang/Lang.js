"use strict";

class Lang {
/*

	Lang.js : minimalistic multi language support, based on LangDef.js
*/

	constructor(lang) {
		this.lang=lang;
	}

	load(lang) {
		// load the texts defined in LangDef.js

		// set currrent language (if supported)
		if (lang!="") {
			if (typeof LangDef.tr.player[lang]) this.lang=lang;
			else {
				theULogger.error("Language "+lang+" is not supported");
				return;
			}
		}

		$(".tr").each(function(index,elm) {
			var id=elm.id;
			if (id=="") {
				elm.title="error: cannot assign html text to this tag; missing 'id'";
			}
			else {
				id=elm.id;
				if (typeof LangDef.tr[id] == "undefined") {
					elm.title="no translation found for this tag; id='"+elm.id+"'";
				}
				else {
					var lang=theLang.lang;
					if (typeof LangDef.tr[id][lang] == "undefined") lang="en";		// fallback to English
					elm.innerHTML=LangDef.tr[id][lang];
				}
			}
		});

	}

	add(obj) {
		for (var key in obj) LangDef.tr[key]=obj[key];
	}

	letter(lang) {
		if (lang=="en") return "E";
		if (lang=="de") return "D";
		if (lang=="fr") return "F";
		if (lang=="it") return "I";
		if (lang=="dk") return "A";
		if (lang=="pl") return "P";
	}
	
	lowerLetter(lang) {
		if (lang=="en") return "e";
		if (lang=="de") return "d";
		if (lang=="fr") return "f";
		if (lang=="it") return "i";
		if (lang=="dk") return "a";
		if (lang=="pl") return "p";	
	}
	
	letter3(lang) {
		if (lang=="en") return "eng";
		if (lang=="de") return "deu";
		if (lang=="fr") return "fra";
		if (lang=="it") return "ita";
		if (lang=="dk") return "dan";
		if (lang=="pl") return "pol";
	}

	trTo(lang,id) {
		// translate to a certain language
		var curLang=this.lang;
		this.lang=lang;
		var tr = this.tr(id);
		this.lang=curLang;
		return tr;
	}

	tr(id,ignore) {
		// return the language specific text for an item

		if (typeof LangDef.tr[id] == "undefined") {
			return "translation ??? '" + id + "'\n";
		}
		else {
			var lang=this.lang;
			if (typeof LangDef.tr[id][lang] == "undefined") lang="en";		// fallback to English
			if (LangDef.tr[id][lang].trim()=="") {
				return "<small><span style='color:red'>For translation to ["+theLang.lang+
					"] you may want to use <a target='deepl' href='https://deepl.com'>deepl.com</a>"+
					"</span></small><br/>\n"+LangDef.tr[id].en.trim();
			}
			if (isMissing(ignore)) return LangDef.tr[id][lang].trim();
			return LangDef.tr[id][lang].trim().replace(ignore,'');
		}
	}

	trMD(id) {
		// translate MARKDOWN syntax and some proprietory SYNTAX EXTENSIONS into their HTML equivalent
		var markup =  this.tr(id).replace(/§/g,'`').replace(/^\t*/mg,"");
		var parsed = new commonmark.Parser().parse(markup); // parsed is a 'Node' tree
		var result =new commonmark.HtmlRenderer().render(parsed); // result is a String
		result=result.replace(/DEMO\[\[([^|]+)[|]([^\]]*)\]\]/g,'<button class="demo" onclick="theLessons.demo(\'$1\')">$2</button>');
		result=result.replace(/WP\[\[([^|]+)[|]([^\]]*)\]\]/g,'<a target="link" href="https://'+theLang.lang+'.wikipedia.org/wiki/$1">$2</a>');
		result=result.replace(/LINK\[\[([^|]+)[|]([^\]]*)\]\]/g,'<a target="link" href="$1">$2</a>');
		result=result.replace(/IMG\[\[([^|]+)[|]([^\]]*)\]\]/g,'<img src="$1" style="float:right;margin-left:20px;margin-bottom:10px;$2"/>');
		return result;
	}

}

var theLang = new Lang("de");
