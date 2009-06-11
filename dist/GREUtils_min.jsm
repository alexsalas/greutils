/*
 * GREUtils - is simple and easy use APIs libraries for GRE (Gecko Runtime Environment).
 *
 * Copyright (c) 2007 Rack Lin (racklin@gmail.com)
 *
 * $Date: 2008-08-18 10:25:28 +0800 (星期一, 18 八月 2008) $
 * $Rev: 9 $
 */
// support firefox3 or xulrunner 1.9 's import
let EXPORTED_SYMBOLS  = ['GREUtils'];
var GREUtils=GREUtils||{version:"1.1.0"};GREUtils.context=this;GREUtils.global=(typeof window!="undefined")?window:this;GREUtils.extend=function(){var D=arguments[0]||{};var C=arguments[1]||{};var B=arguments[2]||{};for(var A in C){if(D==C[A]){continue;}if(C[A]!=undefined){D[A]=C[A];}}for(var A in B){if(D==B[A]){continue;}if(B[A]!=undefined){D[A]=B[A];}}return D;};GREUtils.singleton=function(B){GREUtils.extend(B,{__instance__:null,getInstance:function A(){if(this.__instance__==null){this.__instance__=new this();}return this.__instance__;}});};GREUtils.inherits=function(C,A){function B(){}B.prototype=A.prototype;C._super=A.prototype;C.prototype=new B();C.prototype.constructor=C;if(typeof A.getInstance=="function"){GREUtils.singleton(C);}};GREUtils.define=function(A,B){GREUtils.createNamespace(A,{},B);
};GREUtils.using=function(A,B){GREUtils.createNamespace(A,GREUtils.getObjectByNamespace(A,B));};GREUtils.createNamespace=function(C,B,D){var E=C.split(".");var F=D||GREUtils.global;var A;while((A=E.shift())){if(!E.length&&GREUtils.isDefined(B)){F[A]=B;}else{if(F[A]){F=F[A];}else{F=F[A]={};}}}};GREUtils.getObjectByNamespace=function(B,C){var D=B.split(".");var E=C||GREUtils.global;for(var A;A=D.shift();){if(E[A]){E=E[A];}else{E=null;break;}}return E;};GREUtils.isDefined=function(A){return typeof A!="undefined";};GREUtils.isFunction=function(A){return typeof A=="function";};GREUtils.isNull=function(A){return A===null;};GREUtils.isDefineAndNotNull=function(A){return GREUtils.isDefined(A)&&!GREUtils.isNull(A);};GREUtils.isArray=function(A){return typeof A=="array";};GREUtils.isString=function(A){return typeof A=="string";
};GREUtils.isBoolean=function(A){return typeof A=="boolean";};GREUtils.isNumber=function(A){return typeof A=="number";};GREUtils.isObject=function(A){var A=typeof A;return A=="object"||A=="array"||A=="function";};GREUtils.now=Date.now||(function(){return(new Date()).getTime();});GREUtils.define("GREUtils.XPCOM");try{var _CC=Components.classes;GREUtils.XPCOM._EnablePrivilege=true;}catch(ex){GREUtils.XPCOM._EnablePrivilege=false;}GREUtils.XPCOM.Cc=function(A){try{if(A in Components.classes){return Components.classes[A];}return null;}catch(B){GREUtils.log("[Error] GREUtils.XPCOM.Cc: "+B.message);return null;}};GREUtils.XPCOM.Ci=function(A){try{switch(typeof (A)){case"object":return A;break;case"string":return Components.interfaces[A];break;}}catch(B){GREUtils.log("[Error] GREUtils.XPCOM.Ci: "+B.message);
return null;}};GREUtils.XPCOM.Cr=function(){try{return Components.results;}catch(A){GREUtils.log("[Error] GREUtils.XPCOM.Cr: "+A.message);return[];}};GREUtils.XPCOM.getService=function(A,C){var B=GREUtils.XPCOM.Cc(A);var E=GREUtils.XPCOM.Ci(C);try{if(B&&E){return B.getService(E);}else{if(B){return B.getService();}}return null;}catch(D){GREUtils.log("[Error] GREUtils.XPCOM.getService: "+D.message);return null;}};GREUtils.XPCOM.createInstance=function(A,C){var B=GREUtils.XPCOM.Cc(A);var E=GREUtils.XPCOM.Ci(C);try{if(B&&E){return B.createInstance(E);}}catch(D){GREUtils.log("[Error] GREUtils.XPCOM.createInstance: "+D.message);return null;}};GREUtils.XPCOM.queryInterface=function(C,A){if(typeof (C)=="object"){var D=GREUtils.XPCOM.Ci(A);try{if(D){return C.QueryInterface(D);}}catch(B){GREUtils.log("[Error] GREUtils.XPCOM.queryInterface: "+B.message);
return null;}}return C;};GREUtils.XPCOM.getConstructor=function(B,D,A){try{if(A){return new Components.Constructor(B,D,A);}else{return new Components.Constructor(B,D);}}catch(C){GREUtils.log("[Error] GREUtils.XPCOM.getConstructor: "+C.message);return null;}};GREUtils.XPCOM._usefulServiceMap={"jssubscript-loader":["@mozilla.org/moz/jssubscript-loader;1","mozIJSSubScriptLoader"],"app-info":["@mozilla.org/xre/app-info;1","nsIXULAppInfo"],"runtime-info":["@mozilla.org/xre/app-info;1","nsIXULRuntime"],"app-startup":["@mozilla.org/toolkit/app-startup;1","nsIAppStartup"],sound:["@mozilla.org/sound;1","nsISound"],"observer-service":["@mozilla.org/observer-service;1","nsIObserverService"],consoleservice:["@mozilla.org/consoleservice;1","nsIConsoleService"],"prompt-service":["@mozilla.org/embedcomp/prompt-service;1","nsIPromptService"],"window-mediator":["@mozilla.org/appshell/window-mediator;1","nsIWindowMediator"],"window-watcher":["@mozilla.org/embedcomp/window-watcher;1","nsIWindowWatcher"],"thread-manager":["@mozilla.org/thread-manager;1","nsIThreadManager"],idleservice:["@mozilla.org/widget/idleservice;1","nsIIdleService"],json:["@mozilla.org/dom/json;1","nsIJSON"],unicodeconverter:["@mozilla.org/intl/scriptableunicodeconverter","nsIScriptableUnicodeConverter"],hash:["@mozilla.org/security/hash;1","nsICryptoHash"],xmlhttprequest:["@mozilla.org/xmlextras/xmlhttprequest;1","nsIXMLHttpRequest"]};
GREUtils.XPCOM._usefulServicePool={};GREUtils.XPCOM.getUsefulService=function(B){if(GREUtils.XPCOM._usefulServicePool[B]&&GREUtils.isXPCOM(GREUtils.XPCOM._usefulServicePool[B])){return GREUtils.XPCOM._usefulServicePool[B];}if(B in GREUtils.XPCOM._usefulServiceMap){var A=this.getService(GREUtils.XPCOM._usefulServiceMap[B][0],GREUtils.XPCOM._usefulServiceMap[B][1]);if(GREUtils.isXPCOM(A)){GREUtils.XPCOM._usefulServicePool[B]=A;return GREUtils.XPCOM._usefulServicePool[B];}else{return null;}}return null;};GREUtils.isXPCOM=function(B){var A=GREUtils.XPCOM.queryInterface(B,"nsISupports");return A!=null&&typeof A=="object";};GREUtils._data={};GREUtils.getAppInfo=function(){return GREUtils.XPCOM.getUsefulService("app-info");};GREUtils.getRuntimeInfo=function(){return GREUtils.XPCOM.getUsefulService("runtime-info");
};GREUtils.getOSInfo=function(){return GREUtils.getRuntimeInfo().OS;};GREUtils.isLinux=function(){if(GREUtils.getOSInfo().match(/Linux|SunOS|BSD/gi)){return true;}return false;};GREUtils.isWindow=function(){if(GREUtils.getOSInfo().match(/Winnt/gi)){return true;}return false;};GREUtils.isMac=function(){if(GREUtils.getOSInfo().match(/Mac|Darwin/gi)){return true;}return false;};GREUtils.include=function(B,C){var A=C||GREUtils.global;if(B.indexOf("://")==-1){B=document.location.href.substring(0,document.location.href.lastIndexOf("/")+1)+B;}var E;try{if(!GREUtils.XPCOM._EnablePrivilege){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");}GREUtils.XPCOM.getUsefulService("jssubscript-loader").loadSubScript(B,A);E=GREUtils.XPCOM.Cr().NS_OK;}catch(D){GREUtils.log("[Error] GREUtils.include: "+D.message+"("+B+")");
E=-GREUtils.XPCOM.Cr().NS_ERROR_INVALID_ARG;}return E;};GREUtils.include_once=function(A,B){var C=A.substring(A.lastIndexOf("/")+1,A.length);var E=encodeURIComponent(C)+"_LOADED";if(E in this._data){return GREUtils.XPCOM.Cr().NS_OK;}else{var D;D=this.include(A,B);if(D==GREUtils.XPCOM.Cr().NS_OK){this._data[E]=D;}return D;}};GREUtils.import_=function(A,B){if(arguments.length==1){Components.utils["import"](A);}else{if(arguments.length==2){Components.utils["import"](A,B);}}};GREUtils["import"]=GREUtils.import_;GREUtils.domXULString=function(B,E){var E=E||"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";var C='<box xmlns="'+E+'">'+B+"</box>";var D=new DOMParser();var A=D.parseFromString(C,"text/xml");if(A.documentElement.tagName=="parsererror"){return null;}else{if(A.documentElement.childNodes.length==1){return A.documentElement.firstChild;
}else{return A.documentElement;}}};GREUtils.domHTMLString=function(C,E){var E=E||"http://www.w3.org/1999/xhtml";var B='<div xmlns="'+E+'">'+C+"</div>";var D=new DOMParser();var A=D.parseFromString(B,"text/xml");if(A.documentElement.tagName=="parsererror"){return null;}else{if(A.documentElement.childNodes.length==1){return A.documentElement.firstChild;}else{return A.documentElement;}}};GREUtils.quitApplication=function(){var A=arguments[0]||Components.interfaces.nsIAppStartup.eAttemptQuit;GREUtils.XPCOM.getUsefulService("app-startup").quit(A);};GREUtils.restartApplication=function(){GREUtils.quitApplication((Components.interfaces.nsIAppStartup.eRestart|Components.interfaces.nsIAppStartup.eAttemptQuit));};GREUtils.gc=function(){var A=GREUtils.XPCOM.getUsefulService("observer-service");A.notifyObservers(null,"memory-pressure","heap-minimize");
A.notifyObservers(null,"memory-pressure","heap-minimize");A.notifyObservers(null,"memory-pressure","heap-minimize");if(typeof window!="undefined"){try{window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).garbageCollect();}catch(B){}}};GREUtils.ramback=function(){GREUtils.gc();};GREUtils.log=function(A){GREUtils.XPCOM.getUsefulService("consoleservice").logStringMessage(A);};GREUtils.uuid=function(){var A=GREUtils.XPCOM.getService("@mozilla.org/uuid-generator;1","nsIUUIDGenerator").generateUUID().number;A=A.replace(/^{|}$/g,"");return A;};GREUtils.getIdleTime=function(){return GREUtils.XPCOM.getUsefulService("idleservice").idleTime;};GREUtils.getIdleObserver=function(B,C){var A={time:C,observe:function(E,D,F){try{B(E,D,F);}catch(G){}},unregister:function(){GREUtils.XPCOM.getUsefulService("idleservice").removeIdleObserver(this,this.time);
},register:function(){GREUtils.XPCOM.getUsefulService("idleservice").addIdleObserver(this,this.time);}};return A;};GREUtils.base64Encode=function(A){return btoa(A);};GREUtils.base64Decode=function(A){return atob(A);};GREUtils.ucwords=function(A){return A.replace(/^(.)|\s(.)/g,function(B){return B.toUpperCase();});};GREUtils.ucfirst=function(B){var A=B.charAt(0).toUpperCase();return A+B.substr(1,B.length-1);};GREUtils.define("GREUtils.File");GREUtils.File={FILE_RDONLY:1,FILE_WRONLY:2,FILE_RDWR:4,FILE_CREATE_FILE:8,FILE_APPEND:16,FILE_TRUNCATE:32,FILE_SYNC:64,FILE_EXCL:128,FILE_READ_MODE:"r",FILE_WRITE_MODE:"w",FILE_APPEND_MODE:"a",FILE_BINARY_MODE:"b",NORMAL_FILE_TYPE:0,DIRECTORY_TYPE:1,FILE_CHUNK:1024,FILE_DEFAULT_PERMS:420,DIR_DEFAULT_PERMS:493};GREUtils.File.getFile=function(E){if(E instanceof Components.interfaces.nsIFile){return E;
}var C=arguments[1]||false;var B=arguments[2]||false;if(/^file:/.test(E)){E=E.replace("file://","");}var D=GREUtils.XPCOM.createInstance("@mozilla.org/file/local;1","nsILocalFile");D.initWithPath(E);if(D.exists()||B){return D;}else{if(C){try{D.create(GREUtils.File.NORMAL_FILE_TYPE,GREUtils.File.FILE_DEFAULT_PERMS);return D;}catch(A){return null;}}else{return null;}}};GREUtils.File.getURL=function(B){var A=null;if(!/^file:/.test(B)){A=GREUtils.XPCOM.createInstance("@mozilla.org/network/standard-url;1","nsIURL");A.spec=B;}else{A=GREUtils.XPCOM.getService("@mozilla.org/network/io-service;1","nsIIOService").newURI(B,"UTF-8",null);A=GREUtils.XPCOM.queryInterface(A,"nsIFileURL");}return A;};GREUtils.File.getOutputStream=function(E,H,F){var B=(typeof (E)=="string")?this.getFile(E):E;var G=(GREUtils.File.FILE_TRUNCATE|GREUtils.File.FILE_WRONLY);
if(typeof (H)=="string"&&H.indexOf("w")!=-1){G=(GREUtils.File.FILE_TRUNCATE|GREUtils.File.FILE_WRONLY);}if(typeof (H)=="string"&&H.indexOf("a")!=-1){G=(GREUtils.File.FILE_APPEND|GREUtils.File.FILE_RDWR);}var C=F||GREUtils.File.FILE_DEFAULT_PERMS;if(B==null){var B=GREUtils.XPCOM.createInstance("@mozilla.org/file/local;1","nsILocalFile");B.initWithPath(E);B.create(GREUtils.File.NORMAL_FILE_TYPE,C);}var A=GREUtils.XPCOM.createInstance("@mozilla.org/network/file-output-stream;1","nsIFileOutputStream");A.init(B,G,C,null);if(typeof (H)=="string"&&H.indexOf("b")!=-1){var D=GREUtils.XPCOM.createInstance("@mozilla.org/binaryoutputstream;1","nsIBinaryOutputStream");D.setOutputStream(A);return D;}else{return A;}};GREUtils.File.getInputStream=function(B,F,C){var D=(typeof (B)=="string")?this.getFile(B):B;
if(D==null){return null;}var I=GREUtils.File.FILE_RDONLY;if(typeof (F)=="string"&&F.indexOf("r")!=-1){I=GREUtils.File.FILE_RDONLY;}var E=C||GREUtils.File.FILE_DEFAULT_PERMS;var G=GREUtils.XPCOM.createInstance("@mozilla.org/network/file-input-stream;1","nsIFileInputStream");G.init(D,I,E,null);if(typeof (F)=="string"&&F.indexOf("b")!=-1){var A=GREUtils.XPCOM.createInstance("@mozilla.org/binaryinputstream;1","nsIBinaryInputStream");A.setInputStream(G);return A;}else{var H=GREUtils.XPCOM.createInstance("@mozilla.org/scriptableinputstream;1","nsIScriptableInputStream");H.init(G);return H;}};GREUtils.File.getLineInputStream=function(C){var B=(typeof (C)=="string")?this.getFile(C):C;if(B==null){return null;}var A=GREUtils.XPCOM.createInstance("@mozilla.org/network/file-input-stream;1","nsIFileInputStream");
A.init(B,GREUtils.File.FILE_RDONLY,GREUtils.File.FILE_DEFAULT_PERMS,null);return GREUtils.XPCOM.queryInterface(A,"nsILineInputStream");};GREUtils.File.readAllLine=function(D){var C=this.getLineInputStream(D);var A=[];var B={value:""};if(!C){return A;}do{var E=C.readLine(B);A.push(B.value);}while(E);C.close();return A;};GREUtils.File.readAllBytes=function(E){var B=(typeof (E)=="string")?this.getFile(E):E;var D=B.fileSize;var C=this.getInputStream(B,"rb",GREUtils.File.FILE_DEFAULT_PERMS);var A=C.readBytes(D);C.close();return A;};GREUtils.File.getURLContents=function(F){var E=GREUtils.XPCOM.getService("@mozilla.org/network/io-service;1","nsIIOService");var D=GREUtils.XPCOM.getService("@mozilla.org/scriptableinputstream;1","nsIScriptableInputStream");var H="";try{var C=E.newChannel(F,null,null);
var B=C.open();D.init(B);var A;while((A=B.available())>0){H+=D.read(A);}D.close();B.close();}catch(G){}return H;};GREUtils.File.writeAllLine=function(C,B){var A=this.getOutputStream(C,"w");if(!A){return ;}B.forEach(function(D){D=""+D;A.write(D+"\n",D.length+1);});A.close();};GREUtils.File.writeAllBytes=function(C,B){var A=this.getOutputStream(C,"wb");if(!A){return ;}A.write(B,B.length);A.close();};GREUtils.File.run=function(C,G,D){var B=(typeof (C)=="string")?this.getFile(C):C;if(B==null){return -1;}if(B.isDirectory()){return -2;}var D=D||false;try{var F=GREUtils.XPCOM.createInstance("@mozilla.org/process/util;1","nsIProcess");F.init(B);var A=0;if(G){A=G.length;}else{G=null;}rv=F.run(D,G,A);}catch(E){GREUtils.log("[Error] GREUtils.File.run: "+E.message);rv=-3;}return rv;};GREUtils.File.exec=function(){GREUtils.File.run.apply(this,arguments);
};GREUtils.File.chromeToURL=function(B){var D=GREUtils.File.getURL(B);var C=GREUtils.XPCOM.getService("@mozilla.org/chrome/chrome-registry;1","nsIChromeRegistry");var F=null;try{var A=C.convertChromeURL(D);if(!GREUtils.isString(A)){F=C.convertChromeURL(D).spec;}else{F=A;}}catch(E){GREUtils.log("[Error] GREUtils.File.chromeToURL: "+E.message);F=null;}return F;};GREUtils.File.chromeToPath=function(B){var D=GREUtils.File.getURL(B);var C=GREUtils.XPCOM.getService("@mozilla.org/chrome/chrome-registry;1","nsIChromeRegistry");var G=null;try{var A=C.convertChromeURL(D);if(!GREUtils.isString(A)){A=C.convertChromeURL(D).spec;}if(!/^file:/.test(A)){A="file://"+A;}var F=GREUtils.XPCOM.getService("@mozilla.org/network/protocol;1?name=file","nsIFileProtocolHandler");G=F.getFileFromURLSpec(A).path;}catch(E){GREUtils.log("[Error] GREUtils.File.chromeToPath: "+E.message);
G=null;}return G;};GREUtils.File.pathToURL=function(A){if(!A){return"";}var C;try{C=GREUtils.XPCOM.createInstance("@mozilla.org/network/protocol;1?name=file","nsIFileProtocolHandler").getURLSpecFromFile(GREUtils.File(A));}catch(B){C="";}return C;};GREUtils.File.urlToPath=function(A){if(!A||!/^file:/.test(aPath)){return"";}var C;try{C=GREUtils.XPCOM.createInstance("@mozilla.org/network/protocol;1?name=file","nsIFileProtocolHandler").getFileFromURLSpec(A).path;}catch(B){C="";}return C;};GREUtils.File.exists=function(A){if(!A){return false;}var C;try{if(typeof A=="string"){C=GREUtils.File.getFile(A,false,true).exists();}else{if(typeof A.exists=="function"){C=A.exists();}else{C=false;}}}catch(B){GREUtils.log("[Error] GREUtils.File.exists: "+B.message);C=false;}return C;};GREUtils.File.remove=function(A){if(!A){return false;
}var D;var B;try{B=GREUtils.File.getFile(A);if(B.isDirectory()){return false;}B.remove(false);return true;}catch(C){GREUtils.log("[Error] GREUtils.File.remove: "+C.message);D=false;}return D;};GREUtils.File.copy=function(D,G){if(!D||!G){return false;}if(!GREUtils.File.exists(D)){return false;}var F;try{var C=(typeof D=="string")?GREUtils.File.getFile(D):D;var B=(typeof G=="string")?GREUtils.File.getFile(G,false,true):G;var A=C.leafName;if(C.isDirectory()){return false;}if(!GREUtils.File.exists(G)||!B.isDirectory()){A=B.leafName;B=GREUtils.File.getFile(B.path.replace(A,""));if(!GREUtils.File.exists(B.path)){return false;}if(!B.isDirectory()){return false;}}if(GREUtils.File.exists(GREUtils.File.append(B.path,A))){return false;}C.copyTo(B,A);F=true;}catch(E){GREUtils.log("[Error] GREUtils.File.copy: "+E.message);
return false;}return F;};GREUtils.File.append=function(C,A){if(!C||!A){return"";}if(!GREUtils.File.exists(C)){return"";}var E;try{var B=GREUtils.File.getFile(C);if(B.exists()&&!B.isDirectory()){return"";}B.append(A);E=B.path;delete B;}catch(D){GREUtils.log("[Error] GREUtils.File.append: "+D.message);return"";}return E;};GREUtils.File.permissions=function(A){if(!A){return 0;}if(!GREUtils.File.exists(A)){return 0;}var C;try{C=(GREUtils.File.getFile(A)).permissions.toString(8);}catch(B){GREUtils.log("[Error] GREUtils.File.permissions: "+B.message);C=0;}return C;};GREUtils.File.dateModified=function(A){if(!A){return null;}if(!this.exists(A)){return null;}var C;try{C=new Date((GREUtils.File.getFile(A)).lastModifiedTime).toLocaleString();}catch(B){GREUtils.log("[Error] GREUtils.File.dateModified: "+B.message);
C=null;}return C;};GREUtils.File.size=function(A){if(!A){return -1;}if(!GREUtils.File.exists(A)){return -1;}var C=0;try{C=(GREUtils.File.getFile(A)).fileSize;}catch(B){GREUtils.log("[Error] GREUtils.File.size: "+B.message);C=-1;}return C;};GREUtils.File.ext=function(B){if(!B){return"";}if(!GREUtils.File.exists(B)){return"";}var E;try{var A=(GREUtils.File.getFile(B)).leafName;var C=A.lastIndexOf(".");E=(C>=0)?A.substring(C+1):"";}catch(D){GREUtils.log("[Error] GREUtils.File.ext: "+D.message);return"";}return E;};GREUtils.File.parent=function(B){if(!B){return"";}var D;try{var A=GREUtils.File.getFile(B);if(!A.exists()){return"";}if(A.isFile()){D=A.parent.path;}else{if(A.isDirectory()){D=A.path;}else{D="";}}}catch(C){GREUtils.log("[Error] GREUtils.File.parent: "+C.message);D="";}return D;};GREUtils.File.isDir=function(B){var D=false;
try{var A=GREUtils.File.getFile(B);D=A.isDirectory();}catch(C){GREUtils.log("[Error] GREUtils.File.isDir: "+C.message);D=false;}return D;};GREUtils.File.isFile=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isFile();}catch(C){GREUtils.log("[Error] GREUtils.File.isFile: "+C.message);D=false;}return D;};GREUtils.File.isExecutable=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isExecutable();}catch(C){GREUtils.log("[Error] GREUtils.File.isExecutable: "+C.message);D=false;}return D;};GREUtils.File.isSymlink=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isSymlink();}catch(C){GREUtils.log("[Error] GREUtils.File.isSymlink: "+C.message);D=false;}return D;};GREUtils.File.isWritable=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isWritable();
}catch(C){GREUtils.log("[Error] GREUtils.File.isWritable: "+C.message);D=false;}return D;};GREUtils.File.isHidden=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isHidden();}catch(C){GREUtils.log("[Error] GREUtils.File.isHidden: "+C.message);D=false;}return D;};GREUtils.File.isReadable=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isReadable();}catch(C){GREUtils.log("[Error] GREUtils.File.isReadable: "+C.message);D=false;}return D;};GREUtils.File.isSpecial=function(B){var D=false;try{var A=GREUtils.File.getFile(B);D=A.isSpecial();}catch(C){GREUtils.log("[Error] GREUtils.File.isSpecial: "+C.message);D=false;}return D;};GREUtils.File.normalize=function(B){var D;try{var A=GREUtils.File.getFile(B);D=A.normalize();}catch(C){GREUtils.log("[Error] GREUtils.File.normalize: "+C.message);
D=-1;}return D;};GREUtils.define("GREUtils.Dir");GREUtils.Dir.getFile=function(B){if(B instanceof Components.interfaces.nsIFile){return B;}var C=arguments[1]||false;if(/^file:/.test(B)){B=B.replace("file://","");}var D=GREUtils.XPCOM.createInstance("@mozilla.org/file/local;1","nsILocalFile");D.initWithPath(B);if(D.exists()){return D;}else{if(C){try{D.create(GREUtils.File.DIRECTORY_TYPE,GREUtils.File.DIR_DEFAULT_PERMS);return D;}catch(A){return null;}}else{return null;}}};GREUtils.Dir.create=function(A){return GREUtils.Dir.getFile(A,true);};GREUtils.Dir.remove=function(B,C){var A=GREUtils.Dir.getFile(B);if(A==null){return -1;}if(!A.isDirectory()){return -2;}try{return A.remove(C);}catch(D){GREUtils.log("[Error] GREUtils.Dir.remove: "+D.message);return -3;}};GREUtils.Dir.contains=function(D,A){var B=GREUtils.Dir.getFile(D);
var C=GREUtils.File.getFile(A);if(B==null||C==null){return false;}if(!B.isDirectory()){return false;}if(!B.isFile()){return false;}try{return B.contains(A,true);}catch(E){GREUtils.log("[Error] GREUtils.Dir.contains: "+E.message);return false;}};GREUtils.Dir.readDir=function(C,E){var A=GREUtils.Dir.getFile(C);E=E||false;var G=[];if(A==null){return G;}try{if(!A.exists()){return G;}if(!A.isDirectory()){return G;}var D=A.directoryEntries;var B;while(D.hasMoreElements()){B=D.getNext();B=GREUtils.XPCOM.queryInterface(B,"nsILocalFile");if(B.isDirectory()&&E){G.push(GREUtils.Dir.readDir(B));}else{if(B.isFile()||B.isDirectory()){G.push(B);}}}}catch(F){GREUtils.log("[Error] GREUtils.Dir.readDir: "+F.message);}return G;};GREUtils.define("GREUtils.CryptoHash");GREUtils.CryptoHash.crypt=function(F,B){var C=GREUtils.XPCOM.getUsefulService("unicodeconverter");
var G=GREUtils.XPCOM.getUsefulService("hash");C.charset="UTF-8";var A={};var D=C.convertToByteArray(F,A);G.init(G[B]);G.update(D,D.length);var E=G.finish(false);return GREUtils.CryptoHash.arrayToHexString(E);};GREUtils.CryptoHash.cryptFromStream=function(A,B){var F=GREUtils.XPCOM.getUsefulService("hash");var E=GREUtils.File.getInputStream(A);if(GREUtils.isNull(E)){return"";}F.init(F[B]);const C=4294967295;F.updateFromStream(E,C);var D=F.finish(false);return GREUtils.CryptoHash.arrayToHexString(D);};GREUtils.CryptoHash.md5=function(A){return GREUtils.CryptoHash.crypt(A,"MD5");};GREUtils.CryptoHash.md5FromFile=function(A){return GREUtils.CryptoHash.cryptFromStream(A,"MD5");};GREUtils.CryptoHash.md5sum=GREUtils.CryptoHash.md5FromFile;GREUtils.CryptoHash.sha1=function(A){return GREUtils.CryptoHash.crypt(A,"SHA1");
};GREUtils.CryptoHash.sha256=function(A){return GREUtils.CryptoHash.crypt(A,"SHA256");};GREUtils.CryptoHash.toHexString=function(A){return("0"+A.toString(16)).slice(-2);};GREUtils.CryptoHash.arrayToHexString=function(C){var B=[];for(var A in C){B.push(GREUtils.CryptoHash.toHexString(C.charCodeAt(A)));}return B.join("");};GREUtils.define("GREUtils.Charset");GREUtils.Charset.convertToUnicode=function(C,D){try{var B=GREUtils.XPCOM.getService("@mozilla.org/intl/scriptableunicodeconverter","nsIScriptableUnicodeConverter");B.charset=D?D:"UTF-8";return B.ConvertToUnicode(C);}catch(A){GREUtils.log("[Error] GREUtils.Charset.convertToUnicode: "+A.message);return C;}};GREUtils.Charset.convertFromUnicode=function(C,D){try{var B=GREUtils.XPCOM.getService("@mozilla.org/intl/scriptableunicodeconverter","nsIScriptableUnicodeConverter");
B.charset=D?D:"UTF-8";return B.ConvertFromUnicode(C);}catch(A){GREUtils.log("[Error] GREUtils.Charset.convertFromUnicode: "+A.message);return C;}};GREUtils.Charset.convertCharset=function(C,A,B){return this.convertFromUnicode(this.convertToUnicode(C,A),B);};GREUtils.define("GREUtils.JSON");GREUtils.JSON={_native:false,_jsonService:null};GREUtils.JSON.getJSONService=function(){if(this._jsonService==null){var A=GREUtils.XPCOM.getUsefulService("json");if(A){this._native=true;this._jsonService=A;}else{this._native=false;}}return this._jsonService;};GREUtils.JSON.decode=function(A){return GREUtils.JSON.getJSONService().decode(A);};GREUtils.JSON.encode=function(A){return GREUtils.JSON.getJSONService().encode(A);};GREUtils.JSON.decodeFromStream=function(B,A){return GREUtils.JSON.getJSONService().decodeFromStream(B,A);
};GREUtils.JSON.encodeToStream=function(B,A,D,C){D=D||"UTF-8";C=C||false;GREUtils.JSON.getJSONService().encodeToStream(B,D,C,A);};GREUtils.JSON.decodeFromFile=function(B){var C=GREUtils.File.getInputStream(B,"rb");if(C==null){return null;}var A=GREUtils.File.readAllBytes(B);A=GREUtils.Charset.convertToUnicode(A);return GREUtils.JSON.decode(A);};GREUtils.JSON.encodeToFile=function(B,D){var C=GREUtils.File.getOutputStream(B,"w");if(C==null){return ;}var A=GREUtils.JSON.encode(D);A=GREUtils.Charset.convertFromUnicode(A,"UTF-8");GREUtils.File.writeAllBytes(B,A);return ;};GREUtils.define("GREUtils.Sound");GREUtils.Sound.getSoundService=function(){return GREUtils.XPCOM.getUsefulService("sound");};GREUtils.Sound.play=function(B){mURL=GREUtils.File.getURL(B);var A=GREUtils.Sound.getSoundService();A.init();
return A.play(mURL);};GREUtils.Sound.beep=function(){return GREUtils.Sound.getSoundService().beep();};GREUtils.Sound.playSystemSound=function(B){mURL=GREUtils.File.getURL(B);var A=this.getSoundService();A.init();return A.playSystemSound(mURL);};GREUtils.define("GREUtils.Pref");GREUtils.Pref.getPrefService=function(){return GREUtils.XPCOM.getService("@mozilla.org/preferences-service;1","nsIPrefService").getBranch("");};GREUtils.Pref.getPref=function(){var A=arguments[0];var C=(arguments[1])?arguments[1]:GREUtils.Pref.getPrefService();var B=GREUtils.XPCOM.Ci("nsIPrefBranch");var D=C.getPrefType(A);if(D==B.PREF_STRING){return C.getComplexValue(A,Components.interfaces.nsISupportsString).data;}else{if(D==B.PREF_INT){return C.getIntPref(A);}else{if(D==B.PREF_BOOL){return C.getBoolPref(A);}else{return null;
}}}};GREUtils.Pref.setPref=function(){var A=arguments[0];var E=arguments[1];var C=(arguments[2])?arguments[2]:GREUtils.Pref.getPrefService();var B=GREUtils.XPCOM.Ci("nsIPrefBranch");var D=C.getPrefType(A);if(D==B.PREF_STRING){var F=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);F.data=E;C.setComplexValue(A,Components.interfaces.nsISupportsString,F);}else{if(D==B.PREF_INT){C.setIntPref(A,E);}else{if(D==B.PREF_BOOL){C.setBoolPref(A,E);}else{}}}};GREUtils.Pref.addPref=function(){var A=arguments[0];var D=arguments[1];var B=(arguments[2])?arguments[2]:GREUtils.Pref.getPrefService();var C=typeof D;if(C=="string"){var E=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);E.data=D;
B.setComplexValue(A,Components.interfaces.nsISupportsString,E);}else{if(C=="number"){B.setIntPref(A,D);}else{if(C=="boolean"){B.setBoolPref(A,D);}else{B.setCharPref(A,GREUtils.JSON.encode(D));}}}};GREUtils.define("GREUtils.Dialog");GREUtils.Dialog.openWindow=function(I,J,M,A,B){var K=I||null;var L=M||"_blank";var H=B||null;var C=A||"chrome,centerscreen";var G=Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);for(var F=4;F<arguments.length;F++){var D=Components.classes["@mozilla.org/variant;1"].createInstance(Components.interfaces.nsIWritableVariant);D.setFromVariant(arguments[F]);G.appendElement(D,false);}var E=GREUtils.XPCOM.getUsefulService("window-watcher");return E.openWindow(K,J,L,C,G);};GREUtils.Dialog.openDialog=function(G,F,J,C,B,A,D,I){var H=G||null;
var E="chrome,dialog,dependent=yes,resize=yes";if(arguments.length<=3){E+=",centerscreen";}else{if(B){E+=",screenX="+B;}if(A){E+=",screenY="+A;}if(D){E+=",width="+D;}if(I){E+=",height="+I;}}return GREUtils.Dialog.openWindow(H,F,J,E,C);};GREUtils.Dialog.openModalDialog=function(G,F,J,C,B,A,D,I){var H=G||null;var E="chrome,dialog,dependent=no,modal,resize=yes";if(arguments.length<=3){E+=",centerscreen";}else{if(B){E+=",screenX="+B;}if(A){E+=",screenY="+A;}if(D){E+=",width="+D;}if(I){E+=",height="+I;}}return GREUtils.Dialog.openWindow(H,F,J,E,C);};GREUtils.Dialog.openFullScreen=function(A,D,F,E){var C=A||null;var B="chrome,dialog=no,resize=no,titlebar=no,fullscreen=yes";B+=",x=0,y=0";B+=",screenX="+0;B+=",screenY="+0;return GREUtils.Dialog.openWindow(C,D,F,B,E);};GREUtils.Dialog.getFilePicker=function(){return GREUtils.XPCOM.createInstance("@mozilla.org/filepicker;1","nsIFilePicker");
};GREUtils.Dialog.openFilePicker=function(D,E){try{const C=Components.interfaces.nsIFilePicker;var A=this.getFilePicker();A.init(GREUtils.global,E,C.modeOpen);A.appendFilters(C.filterAll|C.filterText|C.filterImages|C.filterXML|C.filterHTML);if(D){if(typeof (D)=="object"&&GREUtils.XPCOM.queryInterface(D,"nsIFile")){A.displayDirectory=D;}if(typeof (D)=="string"){A.displayDirectory=GREUtils.File.getFile(D);}}if(A.show()==C.returnOK){return A.fileURL.spec;}else{return null;}}catch(B){}};GREUtils.Dialog.alert=function(C,A,B){var D=C||null;GREUtils.XPCOM.getUsefulService("prompt-service").alert(D,A,B);};GREUtils.Dialog.confirm=function(C,A,B){var D=C||null;return GREUtils.XPCOM.getUsefulService("prompt-service").confirm(D,A,B);};GREUtils.Dialog.prompt=function(G,A,B,H,D,F){var I=G||null;var E=D||null;
var C=F||{value:false};return GREUtils.XPCOM.getUsefulService("prompt-service").prompt(I,A,B,H,null,C);};GREUtils.Dialog.select=function(C,A,B,F,E){var D=C||null;return GREUtils.XPCOM.getUsefulService("prompt-service").select(D,A,B,F.length,F,E);};GREUtils.Dialog.getMostRecentWindow=function(A){return GREUtils.XPCOM.getUsefulService("window-mediator").getMostRecentWindow(A);};GREUtils.Dialog.getWindowArray=function(A){var C=GREUtils.XPCOM.getUsefulService("window-mediator").getEnumerator(A);var B=[];while(C.hasMoreElements()){B.push(C.getNext());}return B;};GREUtils.define("GREUtils.Thread");GREUtils.Thread={_threadManager:null,_mainThread:null,_workerThread:null,reportError:function(A){Components.utils.reportError(A);}};GREUtils.Thread.getThreadManager=function(){if(this._threadManager==null){this._threadManager=GREUtils.XPCOM.getUsefulService("thread-manager");
}return this._threadManager;};GREUtils.Thread.getMainThread=function(){if(this._mainThread==null){this._mainThread=GREUtils.Thread.getThreadManager().mainThread;}return this._mainThread;};GREUtils.Thread.dispatchMainThread=function(D,A){var C=GREUtils.Thread.getMainThread();var A=A||C.DISPATCH_NORMAL;try{C.dispatch(D,A);}catch(B){GREUtils.Thread.reportError(B);}};GREUtils.Thread.dispatchWorkerThread=function(D,C,A){var A=A||D.DISPATCH_NORMAL;try{D.dispatch(C,A);}catch(B){GREUtils.Thread.reportError(B);}};GREUtils.Thread.getWorkerThread=function(){if(this._workerThread==null){this._workerThread=GREUtils.Thread.getThreadManager().newThread(0);}return this._workerThread;};GREUtils.Thread.createWorkerThread=function(){var A=GREUtils.Thread.getThreadManager().newThread(0);return A;};GREUtils.Thread.CallbackRunnableAdapter=function(A,B){this._func=A;
this._data=B;};GREUtils.Thread.CallbackRunnableAdapter.prototype={get funcfunction(){return this._func;},set funcfunction(A){this._func=A||null;},get datafunction(){return this._data;},set datafunction(A){this._data=A||null;},run:function(){try{if(this.func){if(this.data){this.func(this.data);}else{this.func();}}}catch(A){Components.utils.reportError(A);}},QueryInterface:function(A){if(A.equals(Components.Interfaces.nsIRunnable)||A.equals(Components.Interfaces.nsISupports)){return this;}throw Components.results.NS_ERROR_NO_INTERFACE;}};GREUtils.Thread.WorkerRunnableAdapter=function(A,C,B){this._func=A;this._callback=C;this._data=B;if(arguments.length==2){this._data=C;this._callback=null;}};GREUtils.Thread.WorkerRunnableAdapter.prototype={get funcfunction(){return this._func;},set funcfunction(A){this._func=A||null;
},get callbackfunction(){return this._callback;},set callbackfunction(A){this._callback=A||null;},get datafunction(){return this._data;},set datafunction(A){this._data=A||null;},run:function(){try{var A=null;if(this.func){if(this.data){A=this.func(this.data);}else{A=this.func();}}if(this.callback){GREUtils.Thread.dispatchMainThread(new GREUtils.Thread.CallbackRunnableAdapter(this.callback,A));}}catch(B){Components.utils.reportError(B);}},QueryInterface:function(A){if(A.equals(Components.Interfaces.nsIRunnable)||A.equals(Components.Interfaces.nsISupports)){return this;}throw Components.results.NS_ERROR_NO_INTERFACE;}};GREUtils.Thread.createWorkerThreadAdapter=function(C,A,B){return new GREUtils.Thread.WorkerRunnableAdapter(C,A,B);};GREUtils.ControllerHelper=GREUtils.extend({},{appendController:function(A){if(A){window.controllers.appendController(A);
}var B=arguments[1]||window;if(typeof (A.init)=="function"){A.init(B);}},doCommand:function(D){try{var B=document.commandDispatcher||top.document.commandDispatcher||window.controllers;var A=B.getControllerForCommand(D);if(A){return A.doCommand(D);}A=window.controllers.getControllerForCommand(D);if(A&&A.isCommandEnabled(D)){return A.doCommand(D);}}catch(C){GREUtils.log("[Error] GREUtils.ControllerHelper.doCommand: "+C.message);}}});GREUtils.ControllerAdapter=GREUtils.extend({},{_app:null,_privateCommands:{_privateCommands:1,_app:1,init:1,supportsCommand:1,isCommandEnabled:1,doCommand:1,onEvent:1},init:function(A){this._app=A;},supportsCommand:function(A){if((!(A in this._privateCommands))&&(A in this)&&typeof (this[A])=="function"){return true;}return false;},isCommandEnabled:function(A){return true;
},doCommand:function(A){if((!(A in this._privateCommands))&&(A in this)&&typeof (this[A])=="function"){if(this.isCommandEnabled(A)){return this[A].call(this,arguments);}}},onEvent:function(A){if((A in this)&&typeof (this[A])=="function"){if(this.isCommandEnabled(A)){return this[A].call(this,arguments);}}}});