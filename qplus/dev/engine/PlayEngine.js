﻿
class Engine {
	/*
		Q-plus Bridge Engine -  interface to the C-code using WebAssembly

		The file "wasm/tutorial.wasm" contains Web Assembly code
		generated with wasm_src/make.bat using emcc from emscripten.

		For details see the API spec
	*/

	constructor() {
	}

	setup() {
		// reserve total memory area for the WASM module, 1024 pages per 64kB ~ 64 MB
		this.memory	   = new WebAssembly.Memory({initial:1024,maximum:1024});
		this.importObj = {

			// various functions and variables which are expected by the WASM code
			// should be reduced to the absolute minimum necessary
			// the magic numbers for the POINTERS have been taken from the (tutorial) js code generated by emscripten
			env: {
				_debugWASM : 			function() { theEngine.debugWASM('_debug'); 			},
				setTempRet0 :          	function() { theEngine.debugWASM('setTempRet0');		},
				getTempRet0 :          	function() { theEngine.debugWASM('getTempRet0');		},
				abort:		 			function() { theEngine.debugWASM('abort'); 			},
				_exit:		 			function() { theEngine.debugWASM('_exit'); 			},
				_time:		 			function() { return (Date.now()/1000)|0;			},
				// _clock: 				function() { theEngine.debugWASM('_clock');			},
				// ___lock:				function() { theEngine.debugWASM('___lock'); 		},		
				// ___unlock:			function() { theEngine.debugWASM('___unlock'); 		},			
				___setErrNo:			function() { theEngine.debugWASM('___setErrNo'); 		},
				// ___syscall140:		function() { theEngine.debugWASM('___syscall140'); 		},
				// ___syscall146:		function() { theEngine.debugWASM('___syscall146'); 		},
				// ___syscall54:		function() { theEngine.debugWASM('___syscall54'); 		},
				// ___syscall6:			function() { theEngine.debugWASM('___syscall6'); 		},		
				// these syscalls seem to be caused by calls to library functions in the C code
				_emscripten_memcpy_big:		function() { theEngine.debugWASM('_emscripten_memcpy_big'); 	},
				_emscripten_get_heap_size:	function() { theEngine.debugWASM('_emscripten_get_heap_size');	},
				_emscripten_resize_heap:	function() { theEngine.debugWASM('_emscripten_resize_heap'); 	},
				abortOnCannotGrowMemory:	function() { theEngine.debugWASM('abortOnCannotGrowMemory'); 	},				
				// ___buildEnvironment:		function() { theEngine.debugWASM('___buildEnvironment'); 	},
				tempDoublePtr : 		43665504, 
				STACK_BASE:				43665520, 
			    STACKTOP:				43665520, 
				STACK_MAX:				48908400, 
			    DYNAMIC_BASE:			48908400, 
			    DYNAMICTOP_PTR:			43665488, 
				abortStackOverflow: 	() => { throw new Error('overflow'); },
				table: 				new WebAssembly.Table({ initial: 268, maximum: 268, element: 'anyfunc' }),
				__table_base: 		0,
				memory: 			this.memory,
				__memory_base: 		this.workStart,		// this seems to be a built-in value by emscripten
		      },
		      global: {
		        NaN : 0,
		        Infinity : 100000,
		      }
		};

		// use the WASM module by default
		this.stub = null;
	}

	configure(ifaceOffset) {
		// configure arrays which serve as interface between JS and WASM

		this.ifaceOffset	= ifaceOffset;					// where the iface starts
		this.ifaceSize		= 1280*1024;					// ~1.3 MB (covers the size of any LKx file)
		this.debugSize		= 4 * 1024;						// the LAST 4096 bytes of IFACE are used for debug messages
		this.memoryBytes	= new Uint8Array(this.memory.buffer);			// a byte buffer which covers the whole memory
		this.workBytes		= new Uint8Array(this.memory.buffer,this.workStart,this.ifaceOffset-this.workStart);	// a byte buffer which covers the WASM working storage
		this.ifaceBytes		= new Uint8Array(this.memory.buffer,this.ifaceOffset,this.ifaceSize);		// a byte buffer which covers the interface memory
		this.ifaceInts		= new Int32Array(this.memory.buffer,this.ifaceOffset,this.ifaceSize/4);		// an int buffer which covers the first part (interface)
	}

	debugWASM(label) {
		// produce a debug output in the log window; "label" is a prefix used for display
		// data is taken from the reserved 4kB-area near the end of the interface memory
		// data must be a null terminated string

		var debugMemory = theEngine.ifaceBytes.subarray(theEngine.ifaceSize-theEngine.debugSize,theEngine.ifaceSize);
		var len=-1;
		while(debugMemory[++len]) if (len>= theEngine.debugSize) break;
		var msg = new TextDecoder("utf-8").decode(theEngine.ifaceBytes.subarray(theEngine.ifaceSize-theEngine.debugSize,theEngine.ifaceSize-theEngine.debugSize+len));
		theULogger.log(0, label + " : " + msg);
	}

	useWASM(wasmFile,productId) {
		theEngine.loadWasmAndGo(wasmFile,"");
	}

	loadWasmAndGoVar(wasmFile,configData) {
		// currently not used, to be adapted
	}

	loadWasmAndGo(wasmFile,configData) {
		// create JS entry points for functions exported by the WASM code

		var that=this;

		// use WASM module
		this.wasmFile=wasmFile;

		// fetch is async, so we need to return a promise
		return new Promise((ok,fail) => {
			var request = new XMLHttpRequest();
			request.open('GET', wasmFile);
			request.responseType = 'arraybuffer';
			request.send();

			request.onload = function() {
				var bytes = request.response;
				WebAssembly.instantiate(bytes, that.importObj).then(prog => {
					that._setupIface		= prog.instance.exports._setupIface;
					that._loadBidIds	    = prog.instance.exports._loadBidIds;
					that._loadBidConvs	    = prog.instance.exports._loadBidConvs;
					that._loadBidRules	    = prog.instance.exports._loadBidRules;
					that._loadBidSys	    = prog.instance.exports._loadBidSys;					
					that._loadUserConfig	= prog.instance.exports._loadUserConfig;
					that._getUserConfig		= prog.instance.exports._getUserConfig;
					that._loadMatchConfig	= prog.instance.exports._loadMatchConfig;
					that._getMatchConfig	= prog.instance.exports._getMatchConfig;	
					that._loadDealFile		= prog.instance.exports._loadDealFile;				
					that._setConfigParam	= prog.instance.exports._setConfigParam;
					that._getConfigParam	= prog.instance.exports._getConfigParam;
					that._infoScore		    = prog.instance.exports._infoScore;					
					that._processAction		= prog.instance.exports._processAction;

					// setup Interface Buffer and offset for work memory
					var ifaceOffset = that._setupIface();
					that.configure(ifaceOffset);
					if (QB.debugWASM > 0) {
						that.setConfigParam("Monitor.Debug","102");
					}
					that.loadInitialBidData();
					// kick off the appliciation
					QB.start();
					ok(prog);
				})
				.catch(function(err) {
					that.wasmObject = null;
					theULogger.error("WASM load failed for <i>" + that.wasmFile + "</i>");
					theULogger.error(err);
					fail();
				});
			};
		});
	}

	// ================================== Interface pack / unpack

	packIfaceString0(string0) {
		// pack a JS string into a byte array, encode with UTF-8
		// The JS string may contain \0 chars; in that case the WASM C code will see a group of null-terminated separate strings
		// the WASM code must know how many strings to receive and the JS code must provide the necessary number of null char separators
		// example: "abc\0def\0ghijk" will pass THREE separate strings

        var i;
		var ui8 = new TextEncoder("utf-8").encode(string0);
		for (i=0;i<ui8.length;i++) this.ifaceBytes[i]=ui8[i];
		this.ifaceBytes[i]=0; // add final terminating null char
	}

	unpackIfaceString0(rc,log,pos) {
		// returns the next zero-terminated string from the interface
		// pos must be [0] on the first call and will be incremented implicitly

		if (rc<0) {
			theULogger.error("WASM error, rc=" + rc);
			return null;
		}

		var p;
		for(p=pos[0];this.ifaceBytes[p]!=0;p++) {}
		var buf = new Uint8Array(this.memory.buffer,this.ifaceOffset+pos[0],p-pos[0]);
		var str = new TextDecoder("utf-8").decode(buf);
		pos[0] = p+1;

		// log
		if (log) theULogger.log(0,str);

		return str;
	}

	unpackIfaceJSON(rc,log) {
		// returns a JS object created form a single zero-terminated string in the ifaceSize
		// which must contain valid JSON code

		if (rc<0) {
			theULogger.error("WASM error, rc="+rc+", expecting JSON message");
			return null;
		}

		var json = '';
		var len=-1;
		while(this.ifaceBytes[++len]) {}

		var json = new TextDecoder("utf-8")
			.decode(this.ifaceBytes.subarray(0,len));

		if (json.indexOf("\t")>=0) {
			json=json.replace(/\t/g,"&nbsp; &nbsp; &nbsp; &nbsp; ");
			theULogger.error("WASM error, unescaped TABULATOR symbol");
		}

		// log
		if (log) theULogger.log(0,"&nbsp; &lArr; "+(rc!=0?rc+" ":"")+json.substr(0,1000));

		// create JS object (we should check for valid JSON syntax here!)
		try {
			if (json=="") return {};
			return JSON.parse(json);
		}
		catch(e) {
			theULogger.error("WASM error, rc="+rc+", invalid JSON received: "+json.substr(0,1000));
			var n = e.message.indexOf("in JSON at position ");
			var pos=-1;
			if (n>0) pos=parseInt(e.message.substr(n+19));
			theULogger.error(e);
			theULogger.error("critical part of message: "+htmlEscape(json.substr(pos,10)));
			return null;
		}

	}

	// ================ the API functions, handle parameters, call WASM (or STUB), check rc

	loadInitialBidData() {
		this.packIfaceString0("1\n" + qbBidIds);
		var rc = this._loadBidIds();
		theULogger.log(0, "loadBidIds - rc: " + rc);
		this.packIfaceString0(qbBidConvs);		
		rc = this._loadBidConvs();
		theULogger.log(0, "loadBidConvs - rc: " + rc);	
		this.packIfaceString0(qbBidRules);	
		rc = this._loadBidRules();
		theULogger.log(0, "loadBidRules - rc: " + rc);				
	}

	loadUserConfig(config) {
		// transfer the local user config data to the WASM module
		if (config==null || config == "") return 0;
		this.packIfaceString0(config);
		return this._loadUserConfig();
	}

	getUserConfig() {
		// gets the local user config data from the WASM module
		var next = [0];
		return this.unpackIfaceString0(this._getUserConfig(),false,next);
	}
	
	loadBidSys(bidsys) {
		this.packIfaceString0(bidsys);
		return this._loadBidSys();
	}

	loadMatchConfig(matchConfig) {
		this.packIfaceString0(matchConfig);
		return this._loadMatchConfig();
	}

	getMatchConfig(asJason) {
		// gets the match config data from the WASM module
		if (asJason) {
		    this.packIfaceString0("1");		
		    var response = this.unpackIfaceJSON(this._getMatchConfig(),false);
		    if (response == null) return null;
		    return response;		
		}
		else {
		    this.packIfaceString0("0");			
		    var next = [0];
		    return this.unpackIfaceString0(this._getMatchConfig(),false,next);
		}
	}	
	
	loadDealFile(dealFile) {
		this.packIfaceString0(dealFile);
		return this._loadDealFile();
	}

	setConfigParam(param,val) {
		// sets a single parameter
		this.packIfaceString0(param + "\0" + val);
		return this._setConfigParam();
	}

	getConfigParam(param) {
		// gets a single parameter
		var next = [0];
		this.packIfaceString0(param);
		return this.unpackIfaceString0(this._getConfigParam(),false,next);
	}
	
	infoScore(param1,param2) {
		// communicates with the scoring of the engine 
		if (typeof param2=="undefined") param2="";
		this.packIfaceString0(param1 + "\0" + param2);
		var response = this.unpackIfaceJSON(this._infoScore(),false);
		return response;
	}	

	processAction(action,contents) {
		// assume that the user has performed the given "action",
		// sometimes complemented by additional contents like a bidId or a cardId
		// return an object describing what shall happen next
		if (typeof contents=="undefined") contents="";
		this.packIfaceString0(action + "\0" + contents);
		var response=this.unpackIfaceJSON(this._processAction(),false);
		if (response==null) return null;
		return response;
	}

}

// create unique global instance of the Engine
var theEngine = new Engine();
theEngine.setup();
