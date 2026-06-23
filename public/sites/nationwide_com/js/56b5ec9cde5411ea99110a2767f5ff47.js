if (typeof tiMonitor == "undefined"){ var tiMonitor = tiMonitor || {};
(function(){Function.prototype.bind=Function.prototype.bind||function(b){var l=this;return function(){return l.apply(b,arguments)}}})();var EMPTY_FUN=function(){},UNDEF;
(function(){function b(){}var l=null;try{l=function(){return this}()}catch(a){}b.global=function(){return l};b.namespace=function(a,c,d,f){a=a.split(".");var e=b.NAMESPACE_BASE||b.global(),h=null,m=null,e=d||e;for(d=0;d<a.length-1;d+=1)m=a[d],e[m]=e[m]||{},e=e[m];h=e;m=a[a.length-1];l.TAGSDK_NS_OVERRIDE&&(f=!1);void 0!==c?void 0!==h[m]&&f||(h[m]=c):h[m]=h[m]||{};return h[m]};b.clazz=function(a,c,d,f,e){b.namespace(a,c,f,!0);"function"===typeof d&&(c.superclass=d,c.prototype=new c.superclass(e));c.prototype&&
(a=a.split("."),c.prototype.CLASS_NAME=a[a.length-1],a.splice(a.length-1,1),c.prototype.PACKAGE_NAME=a.join("."));return c};b.clazz("taginspector.Define",b)})();
(function(){function b(a){}for(var l={},a=0;93>a;a++)l["abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*!-#$&+()@'%./:<>?[\"]^_`{|}~\\;=".charAt(a)]=a;taginspector.Define.clazz("taginspector.Cookie",b);b.cookieAlphabet="abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*!-#$&+()@'%./:<>?[\"]^_`{|}~\\;=";b.cookieAlphabetMap=l;b.decode=function(a){return decodeURIComponent(a)};b.encode=function(a){return encodeURIComponent(a)};b.set=function(a,c,d,f,e){if(d){var h=new Date;
h.setTime(h.getTime()+864E5*d);d="; expires="+h.toGMTString()}else d="";e&&(a=b.encode(a),c=b.encode(c));a=a+"="+c+d+"; path=/;";f&&(a+=" domain="+f);document.cookie=a};b.get=function(a,c){for(var d=a+"=",f=document.cookie.split(";"),e=0;e<f.length;e++){for(var h=f[e];" "===h.charAt(0);)h=h.substring(1,h.length);if(0===h.indexOf(d))return d=h.substring(d.length,h.length),c&&(d=b.decode(d)),d}return null};b.getAll=function(a,c){for(var d=a+"=",f=document.cookie.split(";"),e=[],h=0;h<f.length;h++){for(var m=
f[h];" "===m.charAt(0);)m=m.substring(1,m.length);0===m.indexOf(d)&&(m=m.substring(d.length,m.length),c&&(m=b.decode(m)),e.push(m))}return e};b.rm=function(a,c){b.set(a,"",-1,c)}})();
(function(){function b(b){if(b)if(b.alphabet)for(this.alphabet=b.alphabet,this.dict={},b=0;b<this.alphabet.length;b++)this.dict[this.alphabet[b]]=b;else this.alphabet=a,this.dict=d}function l(a,b){for(var c in b)if(a===b[c])return c;return null}for(var a=[],g=Math.pow(2,8),c=0;c<g;c++)a.push(String.fromCharCode(c));for(var d={},g=0;g<a.length;g++)d[a[g]]=g;taginspector.Define.clazz("taginspector.compression.LZW",b);b.prototype.encode=function(a){for(var b=this.alphabet.length,c={},d=[],g=0,n=a.charAt(g++),
p,k=this.dict;p=a.charAt(g++);){var s=n+p;if(k.hasOwnProperty(s)||c.hasOwnProperty(s))n=s;else{var u=k.hasOwnProperty(n)?k[n]:c[n];if(void 0===u)throw"Dictionary base is to small for those contents: "+n;d.push(u);c[s]=b++;n=p}}""!==n&&d.push(c.hasOwnProperty(n)?c[n]:k[n]);return d};b.prototype.decode=function(a){for(var b=this.dict,c=this.alphabet.length,d,g={},n=l(a[0],b),p=n,k=[n],s=1;s<a.length;s++){var u=a[s];d=l(u,b);null===d&&(g.hasOwnProperty(u)&&(d=g[u]),null===d&&(d=p+n));k.push(d);n=d.charAt(0);
g[c++]=p+n;p=d}return k.join("")}})();
(function(){function b(a){}for(var l={},a=0;45>a;a++)l["abcdefghijklmnopqrstuvwxyz0123456789'%./:<>?[".charAt(a)]=a;for(var g={},a=0;45>a;a++)g['ABCDEFGHIJKLMNOPQRSTUVWXYZ*!-+()@{|}"]^_`~$&#'.charAt(a)]=a;for(var c={},a=0;45>a;a++)c["abcdefghijklmnopqrstuvwxyz0123456789'%./:<>?[".charAt(a)]='ABCDEFGHIJKLMNOPQRSTUVWXYZ*!-+()@{|}"]^_`~$&#'.charAt(a);var d="abcdefghijklmnopqrstuvwxyz0123456789'%./:<>?[".split(""),f=d.length,e=new taginspector.compression.LZW({});taginspector.Define.clazz("taginspector.compression.Compressor",
b);b.prototype.compress=function(a,b){for(var d=(b||e).encode(a),n=[],p=0;p<d.length;p++)n.push(String.fromCharCode(d[p]));return n.join("")};b.prototype.compressAnsi=function(a,b){for(var g=(b||e).encode(a),n=[],p=0;p<g.length;p++){var k;k=g[p];var s=0,u=0>k;u&&(k=-k);var v="",l=!0;do s=k%f,l?(v=c[d[s]],l=!1):v=d[s]+v,k=(k-s)/f;while(0<k);k=u?"-"+v:v;n.push(k)}return n.join("")};b.prototype.decompressAnsi=function(a,b){for(var d=[],n="",p=0;p<a.length;p++){var k=a.charAt(p);if(g.hasOwnProperty(k)){for(var k=
n+k,n="",s=0,c=0,v=!0,x=0;x<k.length;x++){var q=k.charAt(k.length-1-x);v&&(v=!1,q="abcdefghijklmnopqrstuvwxyz0123456789'%./:<>?[".charAt(g[q]));s+=l[q]*Math.pow(f,c++)}k=s;d.push(k)}else n+=k}return(b||e).decode(d)};b.prototype.decompress=function(a,b){for(var d=[],n=0;n<a.length;n++)d.push(a.charCodeAt(n));return(b||e).decode(d)}})();
(function(){function b(){}function l(a,b){for(var k=f.length,d=0;d<k;d++)if(a===f[d][0])return f[d][1];f[f.length]=[a,b];return!1}function a(b,p,k,c,g){var e=!1,m=!1,q=!1,h=!1,r=!1,r=!1;p&&(e=(r=!!p.all)||p.nodes,h=r||p.win,m=r,q=p.noFunctions&&!r,void 0!==p.noOwn&&(m=!!p.noOwn),void 0!==p.noFunctions&&(q=!!p.noFunctions),void 0!==p.win&&(h=!!p.win),void 0!==p.nodes&&(e=!!p.nodes),r=!!p.copyReference);if(void 0===k||k){void 0!==k&&k--;if(!(b&&b instanceof Object))return b;if(!e){try{if(b instanceof
Node)return b}catch(y){if(b instanceof ActiveXObject&&void 0!==b.nodeType)return b}if(b===document)return b}if(!h&&b===d)return b;e=b instanceof Array?[]:{};b instanceof Date&&(e=new Date(b));!q&&b instanceof Function&&(q=String(b).replace(/\s+/g,""),e=q.indexOf("{[nativecode]}")+14===q.length?function(){return b.apply(g||this,arguments)}:function(){return b.apply(this,arguments)});void 0===c&&(f=[],c=0);if(q=l(b,e))return q;if(e instanceof Array)for(q=0;q<b.length;q++)e[e.length]=b[q]===b[q]?a(b[q],
p,k,c+1,b):b[q];else{var q=0,w;for(w in b){if(m||b.hasOwnProperty(w))e[w]=b[w]===b[w]?a(b[w],p,k,c+1,b):b[w];q++}}p.proto&&(e.prototype=a(b.prototype,p,k,c+1,b));r&&(e.___copy_ref=b);return e}}function g(a,b,k,c,u,f,m){k=k||{};void 0===k.hasOwn&&(k.hasOwn=!0);if(!k.objectsOnly||a instanceof Object)if(void 0===k.maxDeep||k.maxDeep){void 0!==k.maxDeep&&k.maxDeep--;if(!k||!k.nodes)try{if(a instanceof Node)return}catch(l){if(a instanceof ActiveXObject&&void 0!==a.nodeType)return}if(a!==d){void 0===c&&
(e=[],c=0);var h;a:{for(h=0;h<c&&h<e.length;h++)if(a===e[h]){h=!0;break a}h=!1}if(!(h||(e[c]=a,u=u||a,u&&f&&u[f]!==u[f]||b(a,u,f,m)))){f=0;h="";for(var r in a){if(!k.hasOwn||a.hasOwnProperty(r))try{var y=a[r];k.track&&(h=m?m+"."+r:r);g(y,b,k,c+1,u,r,h)}catch(w){}f++}}}}}var c=taginspector.Define,d=c.global();c.clazz("taginspector.datapulse.Utils",b);b.global=c.global;b.namespace=c.namespace;b.clazz=c.clazz;b.getObjectUsingPath=function(a,b){b=b||d;for(var k=a.split("."),c=0;c<k.length;c++)b&&k[c]&&
(b=b[k[c]]);return b};b.variableExists=function(a){return void 0!==a&&null!==a&&""!==a};b.ANON_VARS=[];b.getAnonymousAcessor=function(a){var c=b.indexInArray(a,b.ANON_VARS);-1===c&&(c=b.addToArrayIfNotExist(b.ANON_VARS,a));return"taginspector.datapulse.Utils.ANON_VARS["+c+"]"};b.replaceAll=function(a,b,k){return a.replace(new RegExp(b.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),"g"),k)};b.isInt=function(a){if(isNaN(a))return!1;a=parseFloat(a);return(a|0)===a};b.secureText=function(a){"string"!==
typeof a&&(a+="");a=a.replace(/</g,"&lt;");return a=a.replace(/>/g,"&gt;")};b.getUrl=function(){return document.location.href};b.getQueryParam=function(a){var c,k,d,g;c=b.getUrl();if(0<c.indexOf("?"))for(g=c.substring(c.indexOf("?")+1).split("&"),c=0,k=g.length;c<k;c+=1)if(d=g[c],0<d.indexOf("=")&&(d=d.split("="),2===d.length&&d[0]===a))return d[1];return null};b.getElementValue=function(a){return(a=document.getElementById(a))?a.textContent||a.innerText:null};var f=[];b.objectCopy=function(b,c){c=
c||{};var k=a(b,c,c.maxDeep);f=[];return k};var e=[];b.traverse=function(a,b,k){g(a,b,k)};b.prepareQuotedString=function(a){return"string"===typeof a?'"'+a.replace(/\"/g,'\\"')+'"':a};b.expressionToFunction=function(a,c){return b.gevalAndReturn("function ("+(c||"")+") {"+a+"}").result};b.defineClass=function(a,c,k){var d=a.split("."),d=b.gevalAndReturn("(function "+d[d.length-1]+"() {  if ("+a+"._CONSTRUCTOR) {    return "+a+"._CONSTRUCTOR.apply(this, arguments);  } else {    if ("+a+".superclass) {      return "+
a+".superclass.apply(this, arguments);    }  }})").result;d._CONSTRUCTOR=k.CONSTRUCTOR;d.superclass=c;b.clazz(a,d,c);for(var g in k)k.hasOwnProperty(g)&&"CONSTRUCTOR"!==g&&(d.prototype[g]=k[g]);return d};b.keys=function(a){if(a instanceof Object){if(Object.keys)return Object.keys(a);var b=[],c;for(c in a)a.hasOwnProperty(c)&&(b[b.length]=c);return b}throw"keys() called on non-object!";};b.getSrcElement=function(a){var b;a=a||window.event;a.srcElement?b=a.srcElement:a.target&&(b=a.target);return b};
b.addToArrayIfNotExist=function(a,b){for(var c=0,d=!1;c<a.length;c+=1)if(a[c]===b){d=!0;break}d||(a[a.length]=b,c=-1);return c};b.indexInArray=function(a,b){for(var c=0,d=!1;c<a.length;c++)if(a[c]===b){d=!0;break}return d?c:-1};b.removeFromArray=function(a,b){for(var c=0;c<a.length;c+=1)a[c]===b&&a.splice(c,1)};b.addClass=function(a,c){var d;try{a.classList.add(c)}catch(g){null===a.className?a.className=c:(d=a.className.split(" "),b.addToArrayIfNotExist(d,c),a.className=d.join(" "))}};b.removeClass=
function(a,c){var d;try{a.classList.remove(c)}catch(g){null===a.className?a.className="":(d=a.className.split(" "),b.removeFromArray(d,c),a.className=d.join(" "))}};b.gevalAndReturn=function(a){b.gevalAndReturn.___var_test___=void 0;b.gevalAndReturn.___var_test___error=void 0;b.geval("try{taginspector.datapulse.Utils.gevalAndReturn.___var_test___=("+a+");}catch(ex){taginspector.datapulse.Utils.gevalAndReturn.___var_test___error = ex;}");return{result:b.gevalAndReturn.___var_test___,error:b.gevalAndReturn.___var_test___error}};
b.trim=function(a){try{return String(a).trim()}catch(b){return String(a).replace(/^\s+|\s+$/g,"")}};b.setIfUnset=function(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&!a.hasOwnProperty(c)&&(a[c]=b[c])};b.geval=function(a){window&&window.execScript?window.execScript(a):d.eval.call(d,a)};var h=[],m=!1;b.bodyReady=function(a){if(m)return a&&a(),!0;if(m=!(!document.body||"complete"!==document.readyState)){for(var b=0;b<h.length;b++)try{h[b]()}catch(c){}a&&a()}else a&&h.push(a);return m};var r=d.onload;
d.onload=function(a){b.bodyReady();r&&r(a)}})();
(function(){function b(a){this.config={order:0,include:!0,name:"Filter-"+l++,uniqueId:"Filter-"+l++,script:void 0,session:void 0};this.session=null;if(a){for(var b in a)a.hasOwnProperty(b)&&(this.config[b]=a[b]);a.session&&this.setSession(a.session)}this.uniqueId=this.config.uniqueId}var l=0;taginspector.datapulse.Utils.clazz("taginspector.datapulse.filter.BaseFilter",b);b.state={DISABLED:-3,SESSION:-2,PASS:-1,FAIL:0};b.prototype.reset=function(){this.enable()};b.prototype.disable=function(){this.config.disabled=
!0};b.prototype.enable=function(){this.config.disabled=!1};b.prototype.match=function(){return!0};b.prototype.setSession=function(a){this.session=a};b.prototype.getSession=function(){return this.session};b.prototype.getState=function(){var a=b.state.PASS;if(this.config.disabled)return b.state.DISABLED;this.config.script&&(a=this.config.script.call(this,a));isNaN(+a)&&(a=b.state.FAIL);this.lastState=+a;return a}})();
(function(){function b(a){this.config={};this.parameters=null;this.reportValue=!1;if(a){this.uniqueId=a.uniqueId;this.reportValue=a.reportValue;b.ALL_VARIABLES[this.uniqueId]=this;for(var g in a)this.config[g]=a[g];void 0!==a.value&&(this.value=a.value);void 0!==a.defaultValue&&(this.defaultValue=a.defaultValue);return b.register(this)}}var l=taginspector.datapulse.Utils;l.clazz("taginspector.datapulse.pagevariable.BaseVariable",b);b.ALL_VARIABLES={};b.pageVariables=[];b.clearCache=function(){pageVars=
b.pageVariables;for(i=0;i<pageVars.length;i++)t=pageVars[i],t.isCachedValueSet=!1};b.register=function(a){return a instanceof b?(b.pageVariables.push(a),a):null};b.prototype.getValue=function(){return this.value};b.prototype.setValue=function(a){this.value=a};b.prototype.getDefaultValue=function(){return this.defaultValue};b.prototype.setDefaultValue=function(a){this.defaultValue=a};b.prototype.exists=function(a){var b=l.variableExists(this.getValue());a&&(b=b||l.variableExists(this.getDefaultValue()));
return b};b.prototype.getRelativeValue=function(a,b){var c=this.getValue();l.variableExists(c)||(c=b);var d;a&&!l.variableExists(c)&&(d=this.getDefaultValue(),l.variableExists(d)&&(c=d));return c};b.prototype.replaceToken=function(a,b,c,d){var f=this.exists();c=f?this.getValue():c;a="\\$\\{"+a+"\\}";return d||c instanceof Array?(d=f?this.getValueAccessorString():l.getAnonymousAcessor(c),b.replace(new RegExp(a,"g"),d)):b.replace(new RegExp(a,"g"),c)};b.prototype.getAccessorString=function(){return"taginspector.datapulse.pagevariable.BaseVariable.ALL_VARIABLES."+
this.uniqueId};b.prototype.getValueAccessorString=function(){return this.getAccessorString()+".getValue()"}})();
(function(){function b(a){this.config={name:"Trigger-"+l++,uniqueId:"Trigger-"+l++,triggerScript:void 0,rules:[]};this.currentState=b.state.WAITING;if(a){for(var g in a)a.hasOwnProperty(g)&&(this.config[g]=a[g]);this.uniqueId=this.config.uniqueId;a.session&&this.setSession(a.session);return b.register(this)}}var l=0;taginspector.datapulse.Utils.clazz("taginspector.datapulse.trigger.BaseTrigger",b);b.pageTriggers=[];b.resetFiredTriggers=function(){pageTriggers=b.pageTriggers;for(i=0;i<pageTriggers.length;i++){t=
pageTriggers[i];t.config.triggerFired=!1;t.currentState=b.state.WAITING;for(var a=0;a<t.config.rules.length;a++)rule=t.config.rules[a],rule.hitSent=!1}};b.register=function(a){return a instanceof b?(b.pageTriggers.push(a),a):null};b.state={WAITING:0,FIRED:1};b.prototype.checkRules=function(){for(var a=0;a<this.config.rules.length;a++)rule=this.config.rules[a],rule.checkFiltersIfTriggersFired()};b.prototype.triggerCallback=function(){this.currentState=b.state.FIRED;this.checkRules()};b.prototype.initTrigger=
function(a){cb=this.triggerCallback;cb=cb.bind(this);triggerFired=this.config.triggerFired;!1==triggerFired&&this.config.triggerScript(cb,triggerFired);this.config.triggerFired=!0;a(this.config.triggerFired)};b.prototype.getState=function(){return this.currentState};b.prototype.addRule=function(a){this.config.rules.push(a)};b.prototype.setTriggerScript=function(a){this.config.triggerScript=a}})();
(function(){function b(a){this.config={};this.uniqueId="BR"+c++;this.ruleVersion=1;this.triggerTiming="";if(a){this.uniqueId=a.uniqueId;this.ruleVersion=a.ruleVersion;this.triggerTiming=a.triggerTiming;this.dataCollector=a.dataCollector;for(var b in a)this.config[b]=a[b]}this.filters=[];this.session=void 0;this.triggers=[];this.hitSent=!1}var l=taginspector.datapulse.filter.BaseFilter,a=taginspector.datapulse.trigger.BaseTrigger,g=taginspector.datapulse.pagevariable.BaseVariable,c=0;taginspector.datapulse.Utils.clazz("taginspector.datapulse.BaseRule",
b);b.prototype.getFilters=function(){return this.filters};b.prototype.addFilter=function(a){this.filters.push(a)};b.prototype.addTrigger=function(a){this.triggers.push(a)};b.prototype.hasHitBeenSent=function(){return this.hitSent};var d=a.state.WAITING,f=a.state.FIRED,e=l.state.PASS,h=l.state.FAIL;b.prototype.getFailedFilters=function(){filters=this.filters;failedFilters=[];for(var a=0;a<filters.length;a++)filter=filters[a],filter.match()||failedFilters.push(filter.uniqueId+"|"+filter.config.sourceVariable.uniqueId);
return failedFilters};b.prototype.checkFiltersIfTriggersFired=function(a){a=tiMonitor.dataCollector.timeOnPage();triggersRun=this.triggersState();if(triggersRun==f&&!1==this.hitSent)if(this.hitSent=!0,validationResults=this.filtersState(),validationResults==h){failedFilters=this.getFailedFilters();qsPageVariables=[];pageVariables=g.pageVariables;for(i=0;i<pageVariables.length;i++)try{pageVariable=pageVariables[i],pageVariable instanceof g&&!0==pageVariable.reportValue&&(variableId=pageVariable.uniqueId,
(variableValue=pageVariable.getValue())?1E3<variableValue.length&&(variableValue=variableValue.substring(0,1E3)):variableValue="*undefined*",combinedVariableValue=encodeURIComponent(variableId)+"="+encodeURIComponent(variableValue),qsPageVariables.push(combinedVariableValue))}catch(b){errMessage="Error with variable "+variableId+": "+b.message,console.log(errMessage),jeErrorObj={message:errMessage},tiMonitor.dataCollector.queueRequest(jeErrorObj,"jserror")}failedRuleObject={failedConditions:failedFilters.toString(),
pageMacros:qsPageVariables.toString(),failedRule:this.uniqueId,validationTime:a,ruleVersion:this.ruleVersion,triggerTiming:this.triggerTiming};this.dataCollector.queueRequest(failedRuleObject,"validationerror")}else passedRuleObject={passedRule:this.uniqueId,ruleVersion:this.ruleVersion,validationTime:a,triggerTiming:this.triggerTiming},this.dataCollector.queueRequest(passedRuleObject,"validationsuccess")};b.prototype.triggersState=function(){for(var a=f,b=0;b<this.triggers.length;b++)if(trigger=
this.triggers[b],trigger.getState()==d){a=d;break}return a};b.prototype.filtersState=function(){filters=this.filters;session=this.session;filters=filters.sort(function(a,b){try{return b.config.order-a.config.order}catch(c){return 0}});var a=e;if(!filters||0===filters.length)return a;for(var b,c=0;c<filters.length;c++)if(b=filters[c],b.setSession(session),!1==b.match()){a=h;break}return a}})();
(function(){function b(a){this.config={siteID:"",pixelHost:"",tagDefinitions:[]};this.session=null;if(a)for(var b in a)a.hasOwnProperty(b)&&(this.config[b]=a[b]);this.pixelHost=this.config.pixelHost;this.siteID=this.config.siteID;this.tagDefinitions=this.config.tagDefinitions;this.startTime=Date.now();this.resourceCounter=this.offsetTime=0;this.pageId="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0;return("x"==a?b:b&3|8).toString(16)});this.pendingRequests=
[];this.currentlySendingData=!1;this.identifiedRequests={}}taginspector.datapulse.Utils.clazz("taginspector.datapulse.DataCollector",b);b.prototype.timeOnPage=function(){return performance.now()-this.offsetTime};b.prototype.adjustTimeForOffset=function(a){return!1==isNaN(a)?(fts=parseFloat(a).toFixed(2),fts=parseFloat(a),fts-=this.offsetTime,0>fts&&(fts=0),fts.toString()):a};b.prototype.getPageCurrentTime=function(){return Date.now()};b.prototype.getPageStartTime=function(){return this.startTime};
b.prototype.isBeaconSupported=function(){return"sendBeacon"in navigator?!0:!1};b.prototype.getMaxBodySize=function(){isSendBeaconRequest=this.isBeaconSupported();return 5E3};b.prototype.createRequestBody=function(){for(var a={requestList:[]},b=0,c=this.getMaxBodySize(),d=0;0<this.pendingRequests.length;){var f=this.pendingRequests[0];if(void 0!=f||null!=f)if(b+=encodeURIComponent(f).length,b>c&&0!=d)break;else a.requestList.push(this.pendingRequests.shift()),d+=1;else this.pendingRequests.shift()}return a};
b.prototype.createPixelRequest=function(a){reqPixel=new Image;reqPixel.src=this.pixelHost+"?"+a};b.prototype.createAjaxPostRequest=function(a){XMLHttpRequest.prototype.sendAsBinary||(XMLHttpRequest.prototype.sendAsBinary=function(a){for(var b=a.length,c=new Uint8Array(b),g=0;g<b;g++)c[g]=a.charCodeAt(g)&255;this.send(c)});if(window.fetch&&window.Request)c="----"+Date.now().toString(16),fetch(this.pixelHost,{method:"POST",mode:"no-cors",headers:{"Content-Type":"multipart/form-data; boundary="+c},body:"--"+
c+'\r\nContent-Disposition: form-data; name="beaconreq"\r\n\r\n'+a+"\r\n--"+c+"--\r\n"});else{var b=new XMLHttpRequest;b.open("POST",this.pixelHost,!0);var c="----"+Date.now().toString(16);b.setRequestHeader("Content-Type","multipart/form-data; boundary="+c);b.setRequestHeader("Access-Control-Allow-Origin","*");b.sendAsBinary("--"+c+'\r\nContent-Disposition: form-data; name="beaconreq"\r\n\r\n'+a+"\r\n--"+c+"--\r\n")}};b.prototype.createSendBeaconRequest=function(a){var b=new FormData;b.append("beaconreq",
a);result=navigator.sendBeacon(this.pixelHost,b);!1==result&&this.createAjaxPostRequest(a)};b.prototype.b64EncodeUnicode=function(a){return btoa(encodeURIComponent(a).replace(/%([0-9A-F]{2})/g,function(a,b){return String.fromCharCode("0x"+b)}))};b.prototype.identifyRequest=function(a){for(var b=!1,c=0;c<this.tagDefinitions.length;c++){var d=this.tagDefinitions[c];if(!0==d.regex.test(a.name)){!1==this.identifiedRequests.hasOwnProperty(d.id)&&(this.identifiedRequests[d.id]=[]);"384"==d.id?(!1==this.identifiedRequests.hasOwnProperty("291")&&
(this.identifiedRequests["291"]=[]),this.identifiedRequests["291"].push(a)):"291"==d.id&&(!1==this.identifiedRequests.hasOwnProperty("384")&&(this.identifiedRequests["384"]=[]),this.identifiedRequests["384"].push(a));this.identifiedRequests[d.id].push(a);b=!0;break}}return b};b.prototype.resetIdentifiedRequests=function(){try{currentTs=performance.now();newIdentifiedRequests={};for(var a in this.identifiedRequests)if(this.identifiedRequests.hasOwnProperty(a))for(z=0;z<this.identifiedRequests[a].length;z++)foundTag=
this.identifiedRequests[a][z],350>Math.abs(currentTs-foundTag.startTime)&&(!1==newIdentifiedRequests.hasOwnProperty(a)&&(newIdentifiedRequests[a]=[]),newIdentifiedRequests[a].push(foundTag));this.identifiedRequests=newIdentifiedRequests}catch(b){console.log(b.message)}};b.prototype.sendRequests=function(a){if(!1==tiMonitor.dataCollector.currentlySendingData){tiMonitor.dataCollector.currentlySendingData=!0;for(base_req_data="pid="+this.pageId+"&sid="+this.siteID+"&purl="+encodeURIComponent(tiMonitor.sendData.currentUrl)+
"&pst="+encodeURIComponent(this.getPageStartTime())+"&pct="+encodeURIComponent(this.getPageCurrentTime())+"&sblf="+encodeURIComponent(tiMonitor.sendData.sampleblackListFlag)+"&sr="+encodeURIComponent(tiMonitor.sendData.sampleRate)+"&mts="+encodeURIComponent(this.getPageCurrentTime());0<this.pendingRequests.length;)requestBody=this.createRequestBody(),encodedRequestString=encodeURIComponent(this.b64EncodeUnicode(JSON.stringify(requestBody))),req_data=base_req_data+"&taginfo="+encodedRequestString+
"&b64=1",!0!=this.isBeaconSupported()||!0!=a&&!0!=tiMonitor.sendData.windowUnloadEvent?this.createAjaxPostRequest(req_data):this.createSendBeaconRequest(req_data);tiMonitor.dataCollector.currentlySendingData=!1}};b.prototype.isValidResourceStartTime=function(a){var b=!0;try{if(a=parseFloat(a),this.timeOnPage()<a||36E5<a)b=!1}catch(c){console.log(c.message)}return b};var l=0;b.prototype.queueRequest=function(a,b){if("jserror"==b&&(l++,3<l))return;if("validationerror"!=b&&"validationsuccess"!=b||!("complete"!=
document.readyState||3E3>performance.now()-tiMonitor.dataCollector.offsetTime)||"DOM Load"==a.triggerTiming){try{if("resource"==b)if(!0==this.isValidResourceStartTime(this.adjustTimeForOffset(a.startTime)))reqName=a.name,req="rt="+b+"&ce="+encodeURIComponent(this.adjustTimeForOffset(a.connectEnd))+"&cs="+encodeURIComponent(this.adjustTimeForOffset(a.connectStart))+"&dle="+encodeURIComponent(this.adjustTimeForOffset(a.domainLookupEnd))+"&dls="+encodeURIComponent(this.adjustTimeForOffset(a.domainLookupStart))+
"&d="+encodeURIComponent(a.duration.toFixed(2))+"&et="+encodeURIComponent(a.entryType)+"&fs="+encodeURIComponent(this.adjustTimeForOffset(a.fetchStart))+"&it="+encodeURIComponent(a.initiatorType)+"&n="+encodeURIComponent(a.name)+"&rde="+encodeURIComponent(this.adjustTimeForOffset(a.redirectEnd))+"&rds="+encodeURIComponent(this.adjustTimeForOffset(a.redirectStart))+"&reqs="+encodeURIComponent(this.adjustTimeForOffset(a.requestStart))+"&rse="+encodeURIComponent(this.adjustTimeForOffset(a.responseEnd))+
"&rss="+encodeURIComponent(this.adjustTimeForOffset(a.responseStart))+"&scc=&st="+encodeURIComponent(this.adjustTimeForOffset(a.startTime))+"&sz="+encodeURIComponent(this.adjustTimeForOffset(a.decodedBodySize)),this.resourceCounter+=1;else return;else if("reqctr"==b){req="rt="+b;for(var c in a)a.hasOwnProperty(c)&&(req=req+"&count_"+c+"="+a[c]);this.resourceCounter+=1}else if("pageload"==b){dom_complete=dom_content_load=dom_interactive=page_size="";try{var d=performance.timing;0!=d.domInteractive&&
(dom_interactive=d.domInteractive-d.fetchStart);0!=d.domContentLoadedEventEnd&&(dom_content_load=d.domContentLoadedEventEnd-d.fetchStart);0!=d.domComplete&&(dom_complete=d.domComplete-d.fetchStart)}catch(f){console.log(f.message)}conn_type=conn_downlink=conn_roundtrip=conn_downlinkMax=conn_effType="";req="rt="+b+"&ref=&top="+encodeURIComponent(this.timeOnPage())+"&domint="+encodeURIComponent(dom_interactive)+"&domcl="+encodeURIComponent(dom_content_load)+"&domcom="+encodeURIComponent(dom_complete)+
"&condl="+encodeURIComponent(conn_downlink)+"&conrt="+encodeURIComponent(conn_roundtrip)+"&coneff="+encodeURIComponent(conn_effType)+"&psz="+ +encodeURIComponent(page_size)}else if("validationerror"==b&&!1==tiMonitor.sendData.preventFiringValidationRules)req="rt="+b+"&fr="+encodeURIComponent(a.failedRule)+"&rv="+encodeURIComponent(a.ruleVersion)+"&pm="+encodeURIComponent(a.pageMacros)+"&fc="+encodeURIComponent(a.failedConditions)+"&vt="+encodeURIComponent(a.validationTime);else if("validationsuccess"==
b&&!1==tiMonitor.sendData.preventFiringValidationRules)req="rt="+b+"&pr="+encodeURIComponent(a.passedRule)+"&rv="+encodeURIComponent(a.ruleVersion)+"&vt="+encodeURIComponent(a.validationTime);else if("jserror"==b)req="rt="+b+"&msg="+a.message;else if("pageBeforeUnload"==b){d=performance.timing;dom_interactive=d.domInteractive-d.fetchStart;dom_content_load=d.domContentLoadedEventEnd-d.fetchStart;dom_complete=d.domComplete-d.fetchStart;dom_content_load_end=d.domContentLoadedEventEnd;response_end=d.responseEnd;
navigation_start=d.navigationStart;firstContentfulPaint=first_paint=timeToFirstPaint=void 0;if(window.performance){var e=window.performance.getEntriesByType("paint");void 0!=e&&0<e.length&&(timeToFirstPaint=parseInt(1E3*e[0].startTime),first_paint=navigation_start+timeToFirstPaint,firstContentfulPaint=parseInt(1E3*e[1].startTime))}req="rt="+b+"&ref=&top="+encodeURIComponent(performance.now())+"&domint="+encodeURIComponent(dom_interactive)+"&domcl="+encodeURIComponent(dom_content_load)+"&domcom="+
encodeURIComponent(dom_complete)+"&domcle="+encodeURIComponent(dom_content_load_end)+"&rse="+encodeURIComponent(response_end)+"&navs="+encodeURIComponent(navigation_start)+"&fpt="+encodeURIComponent(first_paint)+"&tfpt="+encodeURIComponent(timeToFirstPaint)+"&fcpt="+encodeURIComponent(firstContentfulPaint)}}catch(h){console.log(h.message),jeErrorObj={message:h.message},tiMonitor.dataCollector.queueRequest(jeErrorObj,"jserror")}"pageload"==b?(this.pendingRequests.push(req),this.sendRequests(!0)):0<
this.resourceCounter&&(this.pendingRequests.push(req),"validationerror"!=b&&"validationsuccess"!=b||this.sendRequests(!0))}}})();
(function(){function b(a){for(var b=[],d=0;d<a.length;d++){var e=c(a[d][0]);b.push([new RegExp(e,"g"),"*"+a[d][1]])}return b}function l(a,b){for(var c=0;c<b.length;c++)if(b[c][1]===a)return b[c][0];return null}function a(a){this._regexDefs=m;this._defs=h;a&&a.definitions&&(this._regexDefs=b(a.definitions),this._defs=a.definitions)}function g(a,b){for(var c=[],d=0;d<a.length;d++){var g=!0;b&&(g=a.charCodeAt(d)<=b);var f=e.cookieAlphabetMap.hasOwnProperty(a.charAt(d));g&&!f?c.push("*"+a.charCodeAt(d)+
"."):c.push(a.charAt(d))}return c.join("")}function c(a){return a.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1")}function d(a){for(var b={},c="",d=0;d<a.length;d++){var e=a.charAt(d);switch(e){case "=":case "&":case "?":case "/":case "*":case ",":case ":":isNaN(b[c])&&(b[c]=a.split(c).length-1);c="";break;default:c+=e}}a=[];for(var g in b)b.hasOwnProperty(g)&&(c=b[g],c>=n&&g.length>=r&&a.push([g,c]));return a=a.sort(function(a,b){return a[0].length===b[0].length?0:b[0].length>a[0].length?1:-1})}var f=
taginspector.Define,e=taginspector.Cookie,h=[['","referrer":[{"url":"http://',"1-"],['","referrer":[{"url":"https://',"2-"],[',"referrer":[{"url":"http://',"3-"],[',"referrer":[{"url":"https://',"4-"],[',"sessionStartTime":',"5-"],['":{}}',"6-"],["www.google.com","7-"],["www.google.co.uk","8-"],["www.google.","9-"],['"landing":"',"Z"],['"landing":',"L"],['"time":',"A"],['"sessionStartTime":',"S"],['"pageViews":',"P"],['"sessionCount":',"B"],['"sessionLandingPage":',"E"],['"referrer":',"R"],['"url":"http://www.',
"J"],['"url":"https://www.',"M"],['"url":"',"I"],['"url":',"U"],["http://www.","W"],["https://www.","V"],["%2Fen%2Ftsuk%2F","K"],["http%3A%2F%2Fwww","F"],["http%3A%2F%2F","D"],["http://","H"],["https://","X"],['""',"O"],['",',"Y"]],m=b(h);f.clazz("taginspector.datapulse.compression.Encoder",a);a.prototype.encode=function(a,b){for(var e=a.replace(/\*/g,"**"),f=0;f<this._regexDefs.length;f++)var h=this._regexDefs[f],e=e.replace(h[0],h[1]);for(var e=e.replace(/;/g,"*-"),e=e.replace(/&/g,"*."),e=e.replace(/\\/g,
"*/"),e=e.replace(/=/g,"*+"),e=e.replace(/\n/g,"*N"),e=e.replace(/ /g,"*_"),e=e.replace(/\t/g,"*T"),e=e.replace(/,/g,"*C"),e=e.replace(/"/g,"*Q"),f=d(e),h=e.replace(/\$/g,"$$$"),l=[],q=0,m=0;q<f.length;q++){var n=new RegExp(c(f[q][0]),"g"),n=h.replace(n,"$"+m+"-");n!==h&&(l.push(f[q][0]),m++,h=n)}f=[h,l];h=f[1];(l=0<h.length)&&(e=f[0]);e=b?g(e,b):g(e);return l?"Y"+h.join("*")+"?"+e:"N"+e};var r=4,n=2;a.prototype.decode=function(a){var b=null;if("N"===a.charAt(0))a=a.substring(1);else if("Y"===a.charAt(0)){var c=
a.indexOf("?");if(0<=c&&(b=a.substring(1,c),b=b.split("*"),a=a.substring(c+1),b&&0!==b.length&&a)){for(var c="",d=!1,e=!1,g="",f=0;f<a.length;f++){var h=a.charAt(f);"$"===h||d||e?d||e?(d=!1,"$"===h?c+="$":isNaN(+("-"+h))?e?(c=b&&"-"===h&&b[+g]?c+b[+g]:c+("$"+g+h),g="",e=!1):c+="$"+h:(e=!0,g+=h)):d=!0:c+=h}g&&(c+="$"+g);d&&(c+="$");a=c}}b="";d=c=!1;e="";for(g=0;g<a.length;g++)f=a.charAt(g),"*"===f||c||d?c||d?(c=!1,isNaN(+("-"+f))?d?(b="."===f?b+String.fromCharCode(+e):"-"===f&&l(e+"-",this._defs)?
b+l(e+"-",this._defs):b+("*"+e+f),e="",d=!1):"*"===f?b+="*":"-"===f?b+=";":"/"===f?b+="\\":"."===f?b+="&":"+"===f?b+="=":"N"===f?b+="\n":"_"===f?b+=" ":"T"===f?b+="\t":"C"===f?b+=",":"Q"===f?b+='"':null!==l(f,this._defs)?(f=l(f,this._defs),b+=f):b+="*"+f:(e+=f,d=!0)):c=!0:b+=f;e&&(b+="*"+e);c&&(b+="*");return b}})();
(function(){function b(a){this.testBinary=!1;this.binSupported=g;a&&(this.compressor=new taginspector.compression.Compressor,this.encoder=new taginspector.datapulse.compression.Encoder({}),void 0!==a.binSupported&&(this.binSupported=!!a.binSupported))}var l=taginspector.Define,a=taginspector.Cookie;l.global();var g=!1;l.clazz("taginspector.datapulse.compression.CookieCompressor",b);b.prototype.compress=function(b,d){if("string"!==typeof b||""===b)return b;var f=this.encoder.encode(b),e;if(this.binSupported||
this.testBinary){e=this.compressor.compress(f);e='"B'+this.encoder.encode(e,128)+'"';a.set("__qtag_test_bin__",e);var g=a.get("__qtag_test_bin__");a.rm("__qtag_test_bin__");g&&g!==e&&(e=null)}g=this.encoder.encode(this.compressor.compressAnsi(f));f=!d&&f.length<=g.length?'"E'+f+'"':'"C'+g+'"';return e&&e.length<f.length?e:f};b.prototype.decompress=function(a){if("string"!==typeof a||""===a)return a;'"'===a.charAt(0)&&(a=a.substring(1,a.length-1));var b=a.charAt(0);a=a.substring(1);switch(b){case "E":return this.encoder.decode(a);
case "C":return a=this.compressor.decompressAnsi(this.encoder.decode(a)),this.encoder.decode(a);case "B":return a=this.compressor.decompress(this.encoder.decode(a)),this.encoder.decode(a);default:throw"This code is not supported! Code: "+b;}}})();
(function(){var b=taginspector.Cookie,l=taginspector.datapulse.Utils,a=function(){};l.clazz("taginspector.datapulse.Session",a);var g=new taginspector.datapulse.compression.CookieCompressor({});a.readCompressedCookie=function(a){a=b.get(a);return g.decompress(a)};a.setupSession=function(c){var d,f,e,h,m;d={};m="tm_"+c.containerId;var r="x_tm_"+c.containerId;e=b.get(m,!0);var n=!!e;null===e&&(e=b.get(r),e=g.decompress(e));if(e)try{e=JSON.parse(e)}catch(p){e={sc:0,sessionCount:0,pageViews:0,sessionStartTime:0,
referrer:[],sessionLandingPage:"",__v:{}}}else e={sc:0,sessionCount:0,pageViews:0,sessionStartTime:0,referrer:[],sessionLandingPage:"",__v:{}};f=(new Date).getTime();d.sessionCount!==parseInt(e.sc,10)?(e.sessionStartTime=f,e.sc=d.sessionCount,e.sessionCount+=1,e.referrer.push({url:a.getReferrer(),landing:l.getUrl().substring(0,300),time:f}),e.sessionLandingPage=l.getUrl().substring(0,300)):a.isReferrerDifferent()&&!a.referrerIsSameAsPrevious(e.referrer,f,18E5)&&(e.referrer.push({url:a.getReferrer(),
landing:l.getUrl().substring(0,300),time:f}),e.sessionLandingPage=l.getUrl().substring(0,300),e.sessionStartTime=f,e.sessionCount+=1);d.sessionCount=e.sessionCount;d.sessionStartTime=e.sessionStartTime;d.pageStartTime=f;e.pageViews+=1;d.pageViews=e.pageViews;d.sessionLandingPage=e.sessionLandingPage;d.referrer=e.referrer;5<d.referrer.length&&d.referrer.splice(2,d.referrer.length-5);h=JSON.stringify(e);for(f=0;g.compress(h).length>c.maxCookieLength&&5>f;)3<=e.referrer.length?e.referrer.splice(2,1):
2===e.referrer.length?e.referrer=[e.referrer[0]]:1===e.referrer.length&&(e.referrer=[]),h=JSON.stringify(e),f+=1;d.referrer=e.referrer;n&&b.rm(m);m=g.compress(h);b.rm(r);b.set(r,m,365,c.cookieDomain);d.setVariable=function(a,d,f){e.__v[a]=[d,f?f:0];a=g.compress(JSON.stringify(e));b.set(r,a,365,c.cookieDomain)};d.getCookie=function(a,c){var d=b.get(a);if(d&&(c||0===a.indexOf("x_")))try{d=g.decompress(d)}catch(e){}else d=b.decode(d);return d};d.getVariable=function(a){var b;if(a=e.__v[a])if(b=a[1],
0===b||b>(new Date).getTime())return a[0];return null};d.on=function(a,b,c){b.attachEvent?b.attachEvent("on"+a,c):b.addEventListener&&b.addEventListener(a,c,!1)};d.getTagCookie=function(){return a.readCompressedCookie(r)};return a.lastSession=d};a.referrerIsSameAsPrevious=function(b,d,f){var e,g;return 0<b.length?(e=a.getReferrer(),g=l.getUrl().substring(0,300),b=b[b.length-1],b.url===e&&b.landing===g&&b.time+f>d):!1};a.isReferrerDifferent=function(){var b,d;d=a.getReferrer();b=d.indexOf("://");if(-1===
b)return!0;try{return 0!==d.substring(b+3).indexOf(a.getDomain())?!0:!1}catch(g){return!0}};a.getReferrer=function(){return document.referrer?document.referrer.substring(0,300):"direct"};a.getDomain=function(){return document.location.host}})();
(function(){taginspector.datapulse.Utils.namespace("taginspector.datapulse.filter.pattern.PatternType",{CONTAINS:"Contains",MATCHES_EXACTLY:"Matches Exactly",STARTS_WITH:"Starts With",ENDS_WITH:"Ends With",REGULAR_EXPRESSION:"Regular Expression",ALL_URLS:"All URLs",EQUALS:"Equals",DOES_NOT_EQUAL:"Does not Equal",DOES_NOT_CONTAIN:"Does not Contain",DOES_NOT_STARTS_WITH:"Does not Start With",DOES_NOT_END_WITH:"Does not End With",MATCHES_REGEX:"Matches Regex",DOES_NOT_MATCH_REGEX:"Does not Match Regex",
LESS_THAN:"Less Than",GREATER_THAN:"Greater Than"})})();
(function(){function b(g){this._lockObject={};var c={comparisonType:a.CONTAINS,sourceVariable:void 0,comparisonVariable:void 0};if(g)for(var d in g)g.hasOwnProperty(d)&&(c[d]=g[d]);b.superclass.call(this,c)}var l=taginspector.datapulse.Utils,a=taginspector.datapulse.filter.pattern.PatternType;l.clazz("taginspector.datapulse.filter.JsExpressionFilter",b,taginspector.datapulse.filter.BaseFilter);b.prototype.match=function(){var b=!0,c=this.config.sourceVariable.getValue();if("object"==typeof this.config.comparisonVariable)var d=
this.config.comparisonVariable.getValue();else if("string"==typeof this.config.comparisonVariable||"number"==typeof this.config.comparisonVariable)d=this.config.comparisonVariable;else return!1;switch(this.config.comparisonType){case a.LESS_THAN:case a.GREATER_THAN:if(!1==l.isInt(d))return!1;d=parseInt(d)}switch(this.config.comparisonType){case a.DOES_NOT_CONTAIN:case a.CONTAINS:b=0<=c.toLowerCase().indexOf(d.toLowerCase());break;case a.EQUALS:case a.DOES_NOT_EQUAL:case a.MATCHES_EXACTLY:b=c.toLowerCase()===
d.toLowerCase();break;case a.STARTS_WITH:case a.DOES_NOT_STARTS_WITH:b=0===c.toLowerCase().indexOf(d.toLowerCase());break;case a.ENDS_WITH:case a.DOES_NOT_END_WITH:b=c.toLowerCase().substr(-d.length)===d.toLowerCase();break;case a.MATCHES_REGEX:case a.REGULAR_EXPRESSION:case a.DOES_NOT_MATCH_REGEX:b=(new RegExp(d,"iu")).test(c);break;case a.LESS_THAN:b=c<d;break;case a.GREATER_THAN:b=c>d;break;case a.ALL_variableValueS:b=!0}switch(this.config.comparisonType){case a.DOES_NOT_EQUAL:case a.DOES_NOT_CONTAIN:case a.DOES_NOT_STARTS_WITH:case a.DOES_NOT_END_WITH:case a.DOES_NOT_MATCH_REGEX:b=
!b}return b}})();
(function(){function b(a){this._lockObject={};var g={uniqueId:"Macro-"+l++};if(a)for(var c in a)g[c]=a[c];this.reportValue=!1;a&&(this.uniqueId=a.uniqueId,this.reportValue=a.reportValue);this.valueSetTimestamp=0;this.isCachedValueSet=!1;this.cachedValue="";b.superclass.call(this,g)}var l=0;taginspector.datapulse.Utils.clazz("taginspector.datapulse.pagevariable.JsExpression",b,taginspector.datapulse.pagevariable.BaseVariable);b.prototype.getValue=function(){return!0==this.isCachedValueSet&&3>=performance.now()-
this.valueSetTimestamp?this.cachedValue:this.value(!0)?(this.isCachedValueSet=!0,this.valueSetTimestamp=performance.now(),this.cachedValue=this.value(!0).toString()):""}})();


//version: v2.0
tiMonitor.dataCollector = new taginspector.datapulse.DataCollector({siteID:"56b5ec9cde5411ea99110a2767f5ff47", pixelHost:"https://collect.analyze.ly", tagDefinitions: [{id: '2527', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)aarp\\.go2cloud.org\\/)', 'i')},{id: '2667', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(autotrader|kbb)\\.com\\/pixall\\/v2\\/pageload)', 'i')},{id: '2808', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(autotrader|kbb)\\.com\\/pixall\\/pix-(at|kbb)\\.min\\.js)', 'i')},{id: '2809', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(autotrader)\\.com\\/pixall\\/v2\\/event)', 'i')},{id: '2526', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adobedtm\\.com([\\/a-zA-Z0-9]*)?\\/launch|\\/\\/([\\/a-zA-Z0-9].*)adobe([\\/a-zA-Z0-9].*)launch([\\/a-zA-Z0-9-].*)\\.js))|(grainger\\.com([\\/a-zA-Z0-9].*)adobe([\\/a-zA-Z0-9].*)launch([\\/a-zA-Z0-9-].*)\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)d1g3myji5lplsh\\.cloudfront\\.net)', 'i')},{id: '59', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)offermatica\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)tt\\.omtrdc\\.net\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adobetarget\\.com\\/.*\\/rules\\.json))|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)d4isvpgrs7dwu\\.cloudfront\\.net\\/adobetarget\\/)|(\\/mbox\\.js)|((\\/m[0-9]\\/(.*)\\/mbox\\/|target\\.nationwide\\.com))', 'i')},{id: '85', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)leadback\\.advertising\\.com\\/)', 'i')},{id: '139', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)atdmt\\.com\\/mstag\\/site\\/(.*)\\/(mstag\\.js|analytics\\.html))', 'i')},{id: '273', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)js\\.stormiq\\.com\\/[0-9]*\\.ct\\.js)', 'i')},{id: '384', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googleadservices\\.com\\/pagead\\/conversion\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googleadservices\\.com\\/pagead\\/conversion\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google\\.(.*)\\/pagead\\/1p-conversion\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googleadservices\\.com\\/pagead\\/conversion_async\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com\\/.*id=(AW|aw)-)', 'i')},{id: '740', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)constantcontact\\.com\\/(.*)\\/safe_subscribe_logo\\.gif)', 'i')},{id: '882', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/urchin\\.js)', 'i')},{id: '1385', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)s3\\.amazonaws\\.com\\/searchdiscovery-satellite-production\\/|\\/satellitelib([a-zA-Z0-9-]*)\\.js)|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adobedtm\\.com([\\/a-zA-Z0-9]*)?\\/satelliteLib|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)assets\\.adobedtm\\.com\\/.*js)', 'i')},{id: '1420', regex: new RegExp('(^http(s)?:\\/\\/ct\\.pinterest\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)pinimg.com\\/ct\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)log\\.pinterest\\.com\\/)', 'i')},{id: '1436', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)snap\\.licdn\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(dc|imp2|px).ads\\.linkedin\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)bizographics.com\\/insight\\.(min\\.)?js))|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)linkedin\\.com\\/px\\/li_sync)', 'i')},{id: '1473', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)yimg\\.com\\/wi\\/ytc\\.js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)sp\\.analytics\\.yahoo\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)yimg\\.com\\/wi\\/config\\/.*\\.json)', 'i')},{id: '2532', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(demdex|omtrdc)\\.net\\/id\\?d_visid_ver)', 'i')},{id: '2980', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com(\\/[a-z])?\\/collect\\?.*v=2(.*)blockcheck)', 'i')},{id: '2547', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com(.*)(\\?|&).*id\\=(G|g)-)|((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(google-analytics|google)\\.com(\\/[a-z])?\\/collect\\?.*v=2(?:&|$)|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)stats\\.g\\.doubleclick\\.net(\\/[a-z])?\\/collect\\?v=2))', 'i')},{id: '294', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)doubleclick\\.net\\/activity)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(.*)fls\\.doubleclick\\.net\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adservice\\.google\\.com\\/ddm\\/fls\\/z\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)doubleclick\\.net\\/.*\\/rul\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com\\/.*id=(DC|dc)-)|(gtag\\/js\\?id\\=(DC|dc)-)', 'i')},{id: '401', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/siteopt\\.js)', 'i')},{id: '747', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)liveagentforsalesforce\\.com\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)salesforceliveagent\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)force\\.com\\/(.*)\\/(ChatInvite|LiveAgent))', 'i')},{id: '1406', regex: new RegExp('((^http(s)?:\\/\\/connect\\.facebook\\.net\\/(.*)\\/fbevents\\.js|^http(s)?:\\/\\/www\\.facebook\\.com\\/tr(\\/|\\?)|http(s)?:\\/\\/connect\\.facebook\\.net\\/signals\\/(config\\/|plugins\\/identity.js)|^http(s)?:\\/\\/facebook\\.com\\/(platform|common)\\/cavalry_endpoint\\.php)|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)facebook.com\\/privacy_sandbox\\/pixel\\/)', 'i')},{id: '2851', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|).*\\/g\\/collect\\?v=2\\&tid\\=\\.*)', 'i')},{id: '1393', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)platform\\.twitter\\.com\\/oct\\.js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ads-twitter\\.com\\/(uwt|oct)\\.js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)t\\.co\\/(.*\\/i|i)\\/adsct|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)analytics.twitter.com\\/i\\/adsct)', 'i')},{id: '1450', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/gtm\\/optimize\\.js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/gtm\\/js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com.*(opt|OPT)-|googleoptimize\\.com))', 'i')},{id: '2924', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.])\\.|)graph\\.facebook\\.com\\/.*\\/events\\?access_token\\=)', 'i')},{id: '1480', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com\\/gtag\\/js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com\\/.*\\/service_worker\\/.*\\/sw_iframe)', 'i')},{id: '2889', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/privacy-sandbox\\/)', 'i')},{id: '396', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com\\/|\\?id=(gtm|GTM)-([a-zA-Z0-9]{4,10})))|(^donotmatch$)', 'i')},{id: '1', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com(\\/r)?\\/__utm\\.gif)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/u\\/ga\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/p\\/__utm\\.gif)|(\\/u\\/ga_debug\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/ga\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google\\.com\\/js\\/gweb\\/analytics\\/autotrack\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google\\.com\\/js\\/gweb\\/analytics\\/doubletrack\\.js)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/ga_exp\\.js)|((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/analytics\\.js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com\\/plugins\\/ua\\/))|((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google-analytics\\.com(\\/[a-z])?\\/collect|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)stats\\.g\\.doubleclick\\.net(\\/[a-z])?\\/collect)|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googletagmanager\\.com(.*)(\\?|&).*id\\=(UA|ua)-)|((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)stats\\.g\\.doubleclick\\.net\\/dc\\.js|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)stats\\.g\\.doubleclick\\.net\\/__utm\\.gif))', 'i')},{id: '2963', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)analytics-heap\\.taxslayer\\.com\\/)', 'i')},{id: '1397', regex: new RegExp('(^http(s)?:\\/\\/(.*)fls\\.doubleclick\\.net\\/(.*)type=visua0)', 'i')},{id: '2548', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(googletagservices|doubleclick)\\.(com|net)(\\/tag\\/js\\/gpt\\.js|\\/gpt\\/|\\/gampad\\/ads)|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)tpc\\.googlesyndication\\.com\\/safeframe\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googlesyndication\\.com\\/pagead\\/show_companion_ad\\.js)', 'i')},{id: '2549', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googleapis\\.com\\/adexchangebuyer\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adexchangebuyer\\.googleapis\\.com\\/)', 'i')},{id: '2550', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)cm\\.g\\.doubleclick\\.net\\/)', 'i')},{id: '291', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googleads\\.g\\.doubleclick\\.net\\/pagead\\/viewthroughconversion)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google\\.com\\/ads\\/user-lists\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)google\\.com\\/pagead\\/landing)', 'i')},{id: '292', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)gan\\.doubleclick\\.net\\/)', 'i')},{id: '1458', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)bid\\.g\\.doubleclick\\.net\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googleads\\.g\\.doubleclick\\.net\\/dbm\\/ad)', 'i')},{id: '296', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adx\\.g\\.doubleclick\\.net\\/)', 'i')},{id: '390', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)survey\\.g\\.doubleclick\\.net\\/)', 'i')},{id: '1398', regex: new RegExp('(^http(s)?:\\/\\/(ad\\.doubleclick\\.net\\/(.*)visualiqinc(.*)|((.*)\\.|)myvisualiq\\.net\\/))', 'i')},{id: '295', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)www\\.googletagservices\\.com\\/tag\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ad-ace\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ad\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ad\\.[a-z]*\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ad-apac\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ad-emea\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)pubads\\.g\\.doubleclick\\.net\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)securepubads\\.g\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)m\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ad-g\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)2mdn\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)static\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)iv\\.doubleclick\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)cm\\.g\\.doubleclick\\.net\\/)|(^donotmatch$)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)g\\.doubleclick\\.net\\/)', 'i')},{id: '1312', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)ads\\.yahoo\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)analytics\\.yahoo\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)advertising\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adsonar\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)tacoda\\.net\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adtechus\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)adtech\\.de\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)atwola\\.com\\/)', 'i')},{id: '1427', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)bluecore\\.com\\/|^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)triggeredmail\\.appspot\\.com\\/))', 'i')},{id: '2205', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)go2cloud\\.org\\/)', 'i')},{id: '1446', regex: new RegExp('((^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)yieldify\\.com\\/|http(s)?:\\/\\/d33wq5gej88ld6\\.cloudfront\\.net\\/))', 'i')},{id: '1699', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)heapanalytics\\.com\\/)', 'i')},{id: '2601', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)tvpixel\\.com\\/)', 'i')},{id: '2718', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)cloudflareinsights\\.com\\/)', 'i')},{id: '1415', regex: new RegExp('(^http(s)?:\\/\\/(d1fc8wv8zag5ca|d1qbbgtcslwdbx|d36b3qhhowgh2h)\\.cloudfront\\.net\\/([0-9])*.([0-9])*.([0-9])*\\/sp.js|\\/snowplow\\.js|cloudfront\\.net\\/i(.*)(\\?|\\&)(e=(pv|pp|ue|ue|tr)(\\&|$)|(tv\\=))|(com\\.snowplowanalytics\\.snowplow\\/tp2))', 'i')},{id: '2956', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)youtube\\.com\\/(iframe_api|.*\\/www-widgetapi\\.js))', 'i')},{id: '2940', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)s81c\\.com\\/cognitive-tooling-unified-chat\\/v1\\/webchat\\.bundle\\.js)', 'i')},{id: '2945', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)s81c\\.com\\/)', 'i')},{id: '1350', regex: new RegExp('((d1ncmqs035wa42\\.cloudfront\\.net\\/|thismoment-a\\.akamaihd\\.net\\/|tmeast\\.s3\\.amazonaws\\.com|\\.thismoment\\.com\\/))', 'i')},{id: '1419', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)photorankstatics-([a-z]*)\\.akamaihd\\.net\\/)|(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)photorank\\.me\\/)', 'i')},{id: '1448', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)(nmgassets|nmgplatform|sitelabweb|((fyrsbckgi-c|wkxppshj-qx)\\.global\\.ssl\\.fastly)|((uhytajrtpo-a|mmesbkildq-a)\\.akamaihd))\\.(com|net)\\/)', 'i')},{id: '2967', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)googlesyndication\\.com\\/ccm\\/collect)', 'i')},{id: '2992', regex: new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9-\\.]*)\\.|)akamaihd\\.net\\/)', 'i')}]});
tiMonitor.sendData = {
	pageId: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);return v.toString(16);}),
	sentUnload: false,
	currentlyIterating: false,
	pageBeingSampled: true,
	externalTagStartTimes: [],
	internalTagStartTimes: [],
	currentUrl: window.location.href,
	minimumBeforeUnloadRestriction: 5,
	pageTitle: '',
	sampleRate: 1,
	sampleBlackList: new RegExp('.*'),
	sampleBlackListEnabled: false,
	enableFullTagCollection: false,
	fullTagCollectionPageRegexes: null,
	disableUnloadEventHandlers: false,
	sampleblackListFlag: false,
	// If a pageload hit was suppressed, this is a flag and the payload of the most recent suppressed hit
	pendingPageLoad: false,
	pendingPageLoadPayload: null,
	// Runs a request through the PII prefilter and queues it if it passes
	checkQueueRequest: function(hit, htype) {
		if (tiMonitor.sendData.checkRequestFilter(hit, htype)) {
			// Request passes the filter
			if (htype === 'pageload') {
				// If this is a pageload hit, clear any previous pending pageload hit
				tiMonitor.sendData.pendingPageLoad = false;
			} else if (tiMonitor.sendData.pendingPageLoad) {
				// There is a currently pending pageload hit, so send that too
				tiMonitor.dataCollector.queueRequest(tiMonitor.sendData.pendingPageLoadPayload, 'pageload');
				tiMonitor.sendData.pendingPageLoad = false;
			}
			// Send the hit
			tiMonitor.dataCollector.queueRequest(hit, htype);
		} else {
			// Request fails the filter
			//console.log('Suppressing hit');
			// If it's a pageload hit, store it in case it's needed for a future tag hit on this page
			if (htype === 'pageload') {
				tiMonitor.sendData.pendingPageLoad = true;
				tiMonitor.sendData.pendingPageLoadPayload = hit;
			}
		}
	},
	createFakeReq: function(reqUrl){
		fakeHit = {
			connectEnd: 0,
			connectStart: 0,
			decodedBodySize: 0,
			domainLookupEnd: 0,
			domainLookupStart: 0,
			duration: 0,
			entryType: "resource",
			fetchStart: 0,
			initiatorType: "script",
			name: "",
			redirectEnd: 0,
			redirectStart: 0,
			requestStart: 0,
			responseEnd: 0,
			responseStart: 0,
			startTime: 0
		};
		fetchStart = performance.now()
		fakeDuration = 10.47999999905005;
		
		fakeHit.fetchStart = fetchStart;
		fakeHit.startTime = fetchStart;
		fakeHit.duration = fakeDuration;
		fakeHit.responseEnd = fetchStart + fakeDuration;
		fakeHit.name = reqUrl + "&post=1";
		tiMonitor.dataCollector.identifyRequest(fakeHit);
		tiMonitor.sendData.checkQueueRequest(fakeHit, "resource");
		
	},
	isSinglePageApp: function(){
		if(window.angular){
			return true;
		}else{
			return false;
		}
	},
	isPerformanceObserverSupported: function(){
		if(window.PerformanceObserver){
			return true;
		}else{
			return false;
		}
	},
	isInIframe: function(){
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	},
	isPerformanceObserverInitialized: false,
	performanceObserverCallback: function(list){
		if (tiMonitor.sendData.pageBeingSampled == false){
			var perfEntries = list.getEntries();
			for (var i = 0; i < perfEntries.length; i++){
				var req = perfEntries[i];
				if(tiMonitor.sendData.isValidRequest(req) == true){
					tiMonitor.sendData.externalTagStartTimes.push(tiMonitor.sendData.getUniqueReqKey(req));
					tiMonitor.sendData.checkQueueRequest(req, "resource");
				}else{
					tiMonitor.sendData.internalTagStartTimes.push(tiMonitor.sendData.getUniqueReqKey(req));
				}
			}

			tiMonitor.sendData.isPerformanceObserverInitialized=true;
		}
	},
	suportedBrowser: function(){
		var isSupported = true;
		ua = navigator.userAgent;
		var isNativeAndroid = ((ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1) && (ua.indexOf('Version') > -1));
		var isIE = ((ua.indexOf('Trident') > -1) || (ua.indexOf('MSIE') > -1));
		var perfMonSupport = false;
		var isEventSupported = false;
		if(typeof Event == "function"){
			isEventSupported = true;
		}
		if ('performance' in window) { 
			if ('getEntries' in performance) {
				perfMonSupport = true;
			}
		}
		if(isNativeAndroid == true || perfMonSupport == false || isIE == true || isEventSupported == false){
			isSupported = false;
		}
		return isSupported;
	},
	blackList: new RegExp('http(s)?:\/\/(col\.eum-appdynamics\.com|((.*)\.|)mouseflow.com|akstat.io)'),
	lastPerformanceObjLength: 0,
	areTriggersActivated: false,
	isDuplicateRequest: function(req){
		lt = tiMonitor.sendData.getUniqueReqKey(req);
		return !(tiMonitor.sendData.externalTagStartTimes.indexOf(lt) == -1 && tiMonitor.sendData.internalTagStartTimes.indexOf(lt) == -1);
	},
	isBlacklistedRequest: function(req){
		return this.blackList.test(req.name) == true;
	},
	isExternalRequest: function(req){
		externalReq = true;
		windowOrigin = window.location.protocol + '//' + window.location.hostname;
		if(req.name.length >= windowOrigin.length){
			truncReqName = (req.name).substr(0, windowOrigin.length);
			externalReq = (truncReqName).indexOf(windowOrigin) == -1;
		}
		return externalReq;
	},
	isTIRequest: function(req){
		return !((req.name).indexOf(tiMonitor.dataCollector.pixelHost) == -1);
	},
	isValidRequest:function(req){
		var validReq = false;
		var identifiedTag = tiMonitor.dataCollector.identifyRequest(req);
		if(this.isTIRequest(req) == false && (this.isExternalRequest(req) == true || identifiedTag == true) && this.isBlacklistedRequest(req) == false){
			validReq = true;
		}
		return validReq;
	},
	getUniqueReqKey:function(req){
		return (req.startTime).toString() + "-" + (req.responseEnd).toString();
	},
	isBufferFull:function(){
		bufferFull = false;
		if(window.performance.getEntriesByType("resource").length == 150 || window.performance.getEntriesByType("resource").length == 250 || window.performance.getEntriesByType("resource").length == 400){
			bufferFull = true;
		}
		return bufferFull;
	},
	iteratePerformance: function(){
		if(this.currentlyIterating == false){
			this.currentlyIterating = true;

			var pe = performance.getEntriesByType("resource");
			if(this.lastPerformanceObjLength != pe.length){
				this.lastPerformanceObjLength = pe.length;
				for (var i = 0; i < pe.length; i++) {
					var req = pe[i];
					if(this.isDuplicateRequest(req) == false){
						if(tiMonitor.sendData.isValidRequest(req) == true){
							tiMonitor.sendData.externalTagStartTimes.push(tiMonitor.sendData.getUniqueReqKey(req));
							tiMonitor.sendData.checkQueueRequest(req, "resource");
						}else{
							tiMonitor.sendData.internalTagStartTimes.push(tiMonitor.sendData.getUniqueReqKey(req));
						}
					}
				}
			}
			if(this.areTriggersActivated == false){
				this.areTriggersActivated = true;
				tiMonitor.validationRules(true);
			}
			this.currentlyIterating = false;
		}
	},
	domLoadCompleteEvent: (document.readyState == 'complete'),
	windowUnloadEvent: false,
	preventFiringValidationRules: false,
	pageVariableFiredEvents: {},
	fire: function(){
		tiMonitor.dataCollector.sendRequests(false);
	},
	clearBuffer: function(){
		if(window.performance.clearResourceTimings){
			startBufferLength = window.performance.getEntriesByType("resource").length;
			tiMonitor.sendData.iteratePerformance();
			window.performance.clearResourceTimings();
			endBufferLength = window.performance.getEntriesByType("resource").length;

			if (startBufferLength == endBufferLength){
				this.preventFiringValidationRules = true;
			}
		}
	},
	// Call handler when page is hidden or unloaded
	onPageHidden: function(handler) {
		var justTriggered = false;
		function checkTrigger() {
			if (justTriggered) return;
			justTriggered = true;
			setTimeout(function() { justTriggered = false; }, 10);
			handler();
		}
		if (document.addEventListener) {
			document.addEventListener('visibilitychange', function() {
				if (document.visibilityState === 'hidden') {
					checkTrigger();
				}
			}, { capture: true });
		}
		if (window.addEventListener) {
			window.addEventListener('pagehide', checkTrigger, { capture: true });
			if (!tiMonitor.sendData.disableUnloadEventHandlers) {
				// Adding a dummy unload handler forces browser to disable bfcache.
				// This makes the above event handlers fire more reliably.
				// Note: The validation trigger code previously registered an unload handler which caused this to work.  This
				// dummy event is added here to replace the removed validation trigger code.
				window.addEventListener('unload', function() {});
			}
		}
	},
	handleUnload: function(){
		tiMonitor.windowUnloadEvent=true;
		if(tiMonitor.sendData.isPerformanceObserverSupported() == false){
			tiMonitor.sendData.iteratePerformance();
		}
		var firedRequests = tiMonitor.sendData.flushPIIScannedRequestCounter();
		if (!firedRequests) {
			tiMonitor.sendData.fire();
		}
	},
	fullBufferEventListener: function(){
		if("clearResourceTimings" in window.performance){
			if("addEventListener" in window.performance){
				window.performance.addEventListener("resourcetimingbufferfull", function(){
					tiMonitor.sendData.clearBuffer();
				});
			}else{
				if("onresourcetimingbufferfull" in window.performance){
					window.performance.onresourcetimingbufferfull = function(event) {
						tiMonitor.sendData.clearBuffer();
					};
				}
			}
		}
	},
	getCurrentBenchTime: function() {
		try {
			return performance.now();
		} catch {}
		try {
			return Date.now();
		} catch {}
		return 0;
	},
	piiScannedRequestCounter: 0,
	piiScannedRequestSentCounter: 0,
	flushPIIScannedRequestCounter: function() {
		// Don't send extra data if we've only caught a couple additional requests
		var minIncreaseFraction = 0.05;
		if (
			tiMonitor.sendData.piiScannedRequestCounter > tiMonitor.sendData.piiScannedRequestSentCounter &&
			(
				tiMonitor.sendData.piiScannedRequestSentCounter < 1 ||
				(tiMonitor.sendData.piiScannedRequestCounter - tiMonitor.sendData.piiScannedRequestSentCounter) / tiMonitor.sendData.piiScannedRequestSentCounter >= minIncreaseFraction
			)
		) {
			var newRequests = tiMonitor.sendData.piiScannedRequestCounter - tiMonitor.sendData.piiScannedRequestSentCounter;
			var payloadObj = {
				piireqs: newRequests
			};
			tiMonitor.sendData.piiScannedRequestSentCounter = tiMonitor.sendData.piiScannedRequestCounter;
			tiMonitor.dataCollector.queueRequest(payloadObj, 'reqctr');
			tiMonitor.sendData.fire();
			return true;
		}
		return false;
	},
	performanceAccumulator: 0,
	checkPerformanceAccumulator: function() { // returns false if we've exceeded the performance impact
		var LIMIT = 50; // ms
		return tiMonitor.sendData.performanceAccumulator < LIMIT;
	},
	piiFilterRegex: undefined,
	getPIIFilterRegex: function() {
		// Compile the regex only once for efficiency
		if (tiMonitor.sendData.piiFilterRegex === null) return null;
		if (tiMonitor.sendData.piiFilterRegex !== undefined) return tiMonitor.sendData.piiFilterRegex;
		try {
			tiMonitor.sendData.piiFilterRegex = new RegExp('(?:(?:^|\\W)(?!(?:1?(?:800|888|877|866|855|844|833))-)(\\d{3}-\\d{3}-\\d{4}|\\(\\d{3}\\)\\s?\\d{3}-?\\d{4})(?:\\W|$)|(?:\\b(?:phone|phonenumber|cell|cellnumber|mobile|mobilenumber|phno|phn|pno|mobno|mob|tel|telephone|contact|contactnumber|contactno|callerid|callernumber)\\b)[^0-9]{0,3}\\+?(?!(?:1?(?:800|888|877|866|855|844|833)))(\\d{10,15}))|(?:(\\d{1,4} [\\w\\s]{1,20} (street|st|avenue|ave|road|rd|highway|hwy|square|sq|trail|trl|drive|dr|court|ct|park|parkway|pkwy|circle|cir|boulevard|blvd)(\\.|,)?(?=\\s|$)))|(?:(?:^|\\W)(?<!\\:)(?<!\\$)(?<!\\/\\/)(([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?))(?:\\W|$))|(?:(?:^|&|\\?|\\b)(?<!\\.)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?<!1)(?<!0)(?<!10)(?<!192)(?<!127)\\.(25[0-5]|2[0-4][0-9]|[01]?[1-9][1-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[1-9][1-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[1-9][1-9]?))(?!\\.)(?!\\-)(\\b|$))|(?:(?:^|&|\\?|\\=)((3[47|37][0-9]{13}))(?:\\W|$))|(?:(?:^|&|\\?|\\=)((6541|6556)[0-9]{12})(?:\\W|$))|(?:(?:^|&|\\?|\\=)(389[0-9]{11})(?:\\W|$))|(?:(?:^|&|\\?|\\=)(3(?:0[0-5]|[68][0-9])[0-9]{11})(?:\\W|$))|(?:(?:^|&|\\?|\\=)(65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10}))(?:\\W|$))|(?:(?:^|&|\\?|\\=)(63[7-9][0-9]{13})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((?:2131|1800|35\\d{3})\\d{11})(?:\\W|$))|(?:(?:^|&|\\?|\\=)(9[0-9]{15})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((6304|6706|6709|6771)[0-9]{12,15})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((5018|5020|5038|5893|6304|6759|6761|6762|6763)[0-9]{8,15})(?:\\W|$))|(?:(?:^|&|\\?|\\=)(5[1-5][0-9]{14})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((62[0-9]{14,17}))(?:\\W|$))|(?:(?:^|&|\\?|\\=)(4[0-9]{14})(?:\\W|$))|(?:(?:^|&|\\?|\\=)((?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}))(?:\\W|$))|(?:(?:^|\\W)(?<!\\.|\\-)((?!000|666|333|123|20)0*(?:[0-6][0-9][0-9]|[0-7][0-6][0-9]|[0-7][0-7][0-2])[- ](?!00)[0-9]{2}[- ](?!0000)[0-9]{4})(?:\\W|$))', 'i');
		} catch {
			tiMonitor.sendData.piiFilterRegex = null; // unsupported regex
		}
		return tiMonitor.sendData.piiFilterRegex;
	},
	safeDecodeURIComponent: function(str) {
		// Decode urlencoded components without breaking on invalid sequences
		return str.replace(/%(?![0-9A-Fa-f]{2})/g, '%25') // escape lone %
			.replace(/%([0-9A-Fa-f]{2})/g, (m, hex) => {
				try {
					return decodeURIComponent(m);
				} catch {
					return m; // keep as-is if malformed UTF-8
				}
			});
	},
	isFullTagCollectionMemo: null, // cache result of isFullTagCollection; reset for each new page load
	isFullTagCollectionMemoUrl: null, // the page url associated with isFullTagCollectionMemo
	// Return whether full tag collection is currently enabled for this page
	isFullTagCollection: function() {
		// Check memoized result
		if (tiMonitor.sendData.isFullTagCollectionMemo !== null && tiMonitor.sendData.isFullTagCollectionMemoUrl === tiMonitor.sendData.currentUrl) {
			return tiMonitor.sendData.isFullTagCollectionMemo;
		}
		// Function to determine full tag collection status
		function isFullTagCollectionInner() {
			// Check global enable flag for the site
			if (!tiMonitor.sendData.enableFullTagCollection) return false;
			// If page regex list is null, full tag collection is always enabled
			if (tiMonitor.sendData.fullTagCollectionPageRegexes === null) return true;
			// Check page against the regex list
			if (!Array.isArray(tiMonitor.sendData.fullTagCollectionPageRegexes)) return false; // should not happen
			var pageUrl = tiMonitor.sendData.currentUrl || document.location.href;
			for (var i = 0; i < tiMonitor.sendData.fullTagCollectionPageRegexes.length; i++) {
				var regexStr = tiMonitor.sendData.fullTagCollectionPageRegexes[i];
				var regex = new RegExp(regexStr);
				if (regex.test(pageUrl)) {
					return true;
				}
			}
			return false;
		}
		try {
			tiMonitor.sendData.isFullTagCollectionMemo = isFullTagCollectionInner();
			tiMonitor.sendData.isFullTagCollectionMemoUrl = tiMonitor.sendData.currentUrl;
			return tiMonitor.sendData.isFullTagCollectionMemo;
		} catch {
			// should not happen; just in case, enable full tag collection on error
			return true;
		}
	},
	checkRequestFilter: function(hit, htype) {
		if (!tiMonitor.sendData.checkPerformanceAccumulator()) return false;
		var startTime = tiMonitor.sendData.getCurrentBenchTime();
		try {
			if (tiMonitor.sendData.isFullTagCollection()) return true;
			var hitString;
			if (htype === 'pageload') {
				hitString = tiMonitor.sendData.currentUrl || document.location.href;
			} else {
				if (!hit) return false;
				hitString = hit.name;
			}
			if (!hitString) return false;
			// Decode any URL encoded bits inside of hitString.  (None of the PII filters match anything that could look like URL encoding, so this won't reject any matches.)
			hitString = tiMonitor.sendData.safeDecodeURIComponent(hitString);
			// Double-decode - in some cases, embedded PII can be urlencoded twice
			hitString = tiMonitor.sendData.safeDecodeURIComponent(hitString);
			// Process the hit string in delimited batches.  This avoids hitting the backtracking limit early, and avoids certain degenerate cases.
			// Also limit the size of the string checked for matches, just as an additional safety check.
			var MAX_PART_LEN = 250;
			var regex = tiMonitor.sendData.getPIIFilterRegex();
			if (!regex) return false;
			if (htype == "resource") { // Only count resources (not page loads or other) for counting purposes
				tiMonitor.sendData.piiScannedRequestCounter++;
			}
			var parts = hitString.split(/[&?]/g);
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				if (part.length > MAX_PART_LEN) part.length = MAX_PART_LEN;
				if (part.search(regex) >= 0) {
					return true;
				}
			}
			return false;
		} catch (e) {
			// Should never happen; just in case as extra protection against site breakage.
			console.log('TI-RT prefilter error', e);
		} finally {
			var endTime = tiMonitor.sendData.getCurrentBenchTime();
			tiMonitor.sendData.performanceAccumulator += endTime - startTime;
		}
	},
	initialized: false
};

tiMonitor.ruleVariableCache = {
	spaRulesFiring: false,
	_cachedVariableValues: {},
	censor: function(n) {var o = 0;return function(r, t) {if (0 !== o && "object" == typeof n && "object" == typeof t && n == t) {return "[Circular]"}else if (o >= 500) {return "[Unknown]"}else {return (++o, t)}}},
	updateCache: function(maxCacheTime){
		globalVars = tiMonitor.getGlobalJsVars();
		for(var p=0; p<globalVars.length; p++){
			this.getVariableValue(globalVars[p], maxCacheTime)
		}
	},
	getVariableValue: function(variableName, maxCacheTime){
		retVal = '';
		if(this._cachedVariableValues.hasOwnProperty(variableName)){
			if(this._cachedVariableValues[variableName]["cacheTime"] > performance.now() || this.spaRulesFiring == true){
				this._cachedVariableValues[variableName]["cacheTime"] = this._cachedVariableValues[variableName]["cacheTime"] + 30;
				return this._cachedVariableValues[variableName]["val"];
			}
		}
		try{
			try{
				var tmpVarVal = eval(variableName);
			} catch(err) {
				console.log(err.message);
				var tmpVarVal = window[variableName];
			}
			if(typeof tmpVarVal === 'object'){
				try{
					if(tmpVarVal.hasOwnProperty('length')){
						tmpArray = [];
						objStart = tiMonitor.spaRuleObjectLengthTracker.getLastValidatedObjectLength(tmpVarVal, variableName);
						for(z=objStart; z < tmpVarVal.length; z++){
							try{
								tmpArray.push(JSON.stringify(tmpVarVal[z]));
							}catch(err){ }
						}
						retVal = tmpArray.toString();
					}else{
						retVal = JSON.stringify(tmpVarVal);
					}
				}catch(err) {
					retVal = JSON.stringify(tmpVarVal, this.censor(tmpVarVal));
					console.log(err.message);
				}
			}else if(typeof tmpVarVal !== 'undefined'){
				retVal = tmpVarVal;
			}
			this._cachedVariableValues[variableName] = {"val": retVal, "cacheTime": performance.now() + maxCacheTime}

		} catch(err) {
			console.log(err.message);
		}
		
		return retVal;
	}
};

tiMonitor.spaRuleObjectLengthTracker = {
	spaPageCounter: 0,
	spaRuleObjectLengths: {0:{}},
	_checkIfObject: function(obj){
		return typeof(obj) == 'object';
	},
	isTrackable: function(obj){
		if(this._checkIfObject(obj)){
			return obj.hasOwnProperty("length")
		}else{
			return false;
		}
	},
	_trackObjectLength: function(obj, objName){
		if(this.isTrackable(obj)){
			objLen = obj.length;
			this.spaRuleObjectLengths[this.spaPageCounter][objName] = objLen;
		}
	},
	getLastValidatedObjectLength: function(obj, objName){
		if(this.isTrackable(obj)){
			if(this.spaRuleObjectLengths[this.spaPageCounter].hasOwnProperty(objName) == false){
				this._trackObjectLength(obj, objName);
			}

			lastValidationLength = 0;
			if(this.spaRuleObjectLengths[this.spaPageCounter - 1].hasOwnProperty(objName)){
				lastValidationLength = this.spaRuleObjectLengths[this.spaPageCounter - 1][objName]
			}
			return lastValidationLength;
		}
	},
	incrimentSpaPageview: function(){
		this.spaPageCounter = this.spaPageCounter + 1;
		this.spaRuleObjectLengths[this.spaPageCounter] = {};
	}
};

tiMonitor.getGlobalJsVars = function (){
	try {
		var tiGlobalJsVars = [];
		return tiGlobalJsVars;
	}
	catch(err) {
		console.log(err.message);
		jeErrorObj = {
			message: err.message
		};
		tiMonitor.sendData.checkQueueRequest(jeErrorObj, "jserror");
		return [];
	}
};

tiMonitor.validationRules = function (){
	if (tiMonitor.sendData && !tiMonitor.sendData.enableFullTagCollection) {
		return;
	}
	try {
		macro_function_61760768_afe9_5ea4_845b_2794bdd9bcb4 = function(){
			returnVal = 'false';
			if(tiMonitor.dataCollector.identifiedRequests.hasOwnProperty('2547') == true){
				var re = new RegExp("(?:[?&])(id=G-STH2R0M2X3)(&|$)", 'iu');
				for (var i = 0; i < tiMonitor.dataCollector.identifiedRequests['2547'].length; i++) {
					tagReq = tiMonitor.dataCollector.identifiedRequests['2547'][i].name;
					if (re.test(tagReq) || re.test(decodeURIComponent(tagReq))) {
						returnVal = 'true';
						break;
					}
				}
			}
			return returnVal;
		} 
		macro_61760768_afe9_5ea4_845b_2794bdd9bcb4 = new taginspector.datapulse.pagevariable.JsExpression({uniqueId: '61760768_afe9_5ea4_845b_2794bdd9bcb4', reportValue: false});
		macro_61760768_afe9_5ea4_845b_2794bdd9bcb4.setValue(macro_function_61760768_afe9_5ea4_845b_2794bdd9bcb4);
		macro_function_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1 = function(){
			return 'true';
		} 
		macro_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1 = new taginspector.datapulse.pagevariable.JsExpression({uniqueId: '5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1', reportValue: false});
		macro_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1.setValue(macro_function_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1);
		macro_function_8dba80e1_8108_55ae_a02f_1aae8622fb90 = function(){
			returnVal = 'false';
			if(tiMonitor.dataCollector.identifiedRequests.hasOwnProperty('59') == false){
				returnVal = 'true';
			}
			return returnVal;
		} 
		macro_8dba80e1_8108_55ae_a02f_1aae8622fb90 = new taginspector.datapulse.pagevariable.JsExpression({uniqueId: '8dba80e1_8108_55ae_a02f_1aae8622fb90', reportValue: false});
		macro_8dba80e1_8108_55ae_a02f_1aae8622fb90.setValue(macro_function_8dba80e1_8108_55ae_a02f_1aae8622fb90);
		macro_function_455e8d59_ef68_5b85_ad3f_36a942fe9e74 = function(){
			returnVal = 'false';
			if(tiMonitor.dataCollector.identifiedRequests.hasOwnProperty('1') == true){
				var re = new RegExp("(?:[?&])(t=pageview)(&|$)", 'iu');
				for (var i = 0; i < tiMonitor.dataCollector.identifiedRequests['1'].length; i++) {
					tagReq = tiMonitor.dataCollector.identifiedRequests['1'][i].name;
					if (re.test(tagReq) || re.test(decodeURIComponent(tagReq))) {
						returnVal = 'true';
						break;
					}
				}
			}
			return returnVal;
		} 
		macro_455e8d59_ef68_5b85_ad3f_36a942fe9e74 = new taginspector.datapulse.pagevariable.JsExpression({uniqueId: '455e8d59_ef68_5b85_ad3f_36a942fe9e74', reportValue: false});
		macro_455e8d59_ef68_5b85_ad3f_36a942fe9e74.setValue(macro_function_455e8d59_ef68_5b85_ad3f_36a942fe9e74);
		macro_function_31dad1ae_f686_5581_8cbc_52bf9629b428 = function(){
			return tiMonitor.sendData.currentUrl;
		} 
		macro_31dad1ae_f686_5581_8cbc_52bf9629b428 = new taginspector.datapulse.pagevariable.JsExpression({uniqueId: '31dad1ae_f686_5581_8cbc_52bf9629b428', reportValue: false});
		macro_31dad1ae_f686_5581_8cbc_52bf9629b428.setValue(macro_function_31dad1ae_f686_5581_8cbc_52bf9629b428);
		

condition_c6f2acdd_f33a_4097_9dec_3d31ead1a804 = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_61760768_afe9_5ea4_845b_2794bdd9bcb4, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: 'c6f2acdd_f33a_4097_9dec_3d31ead1a804'});

rule_16015 = new taginspector.datapulse.BaseRule({uniqueId: '16015', triggerTiming: 'Window Before Unload',  ruleVersion: 3, dataCollector: tiMonitor.dataCollector});
rule_16015.addFilter(condition_c6f2acdd_f33a_4097_9dec_3d31ead1a804);

condition_a4e1fe5b_5ab3_45f8_8956_20af18fac30e = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_8dba80e1_8108_55ae_a02f_1aae8622fb90, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: 'a4e1fe5b_5ab3_45f8_8956_20af18fac30e'});

rule_18166 = new taginspector.datapulse.BaseRule({uniqueId: '18166', triggerTiming: 'Window Before Unload',  ruleVersion: 2, dataCollector: tiMonitor.dataCollector});
rule_18166.addFilter(condition_a4e1fe5b_5ab3_45f8_8956_20af18fac30e);

condition_ec84f522_3ae6_4f7c_b23b_f5911d1a4074 = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_455e8d59_ef68_5b85_ad3f_36a942fe9e74, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: 'ec84f522_3ae6_4f7c_b23b_f5911d1a4074'});

rule_12622 = new taginspector.datapulse.BaseRule({uniqueId: '12622', triggerTiming: 'Window Before Unload',  ruleVersion: 1, dataCollector: tiMonitor.dataCollector});
rule_12622.addFilter(condition_ec84f522_3ae6_4f7c_b23b_f5911d1a4074);

condition_284abe58_39be_4686_9c8a_237ac88604ff = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_31dad1ae_f686_5581_8cbc_52bf9629b428, comparisonVariable: '.*', comparisonType: 'Matches Regex', uniqueId: '284abe58_39be_4686_9c8a_237ac88604ff'});

rule_11627 = new taginspector.datapulse.BaseRule({uniqueId: '11627', triggerTiming: 'Window Before Unload',  ruleVersion: 1, dataCollector: tiMonitor.dataCollector});
rule_11627.addFilter(condition_284abe58_39be_4686_9c8a_237ac88604ff);


condition_c243b156_0758_4601_a340_b4efb5000b34 = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: 'c243b156_0758_4601_a340_b4efb5000b34'});
trigger_function_trigger_b57b28b4_4e0b_11f1_94a8_12740c7ab49b = function (cb) {
				if(triggerFired == false){
					triggerFired = true;
					try {
						if(condition_c243b156_0758_4601_a340_b4efb5000b34.match() == true){
							cb(true);
						}
					} catch (err) {
						console.log(err.message);
						jeErrorObj = {
							message: err.message
						};
						tiMonitor.dataCollector.queueRequest(jeErrorObj, "jserror");
					}
				}
		}
trigger_b57b28b4_4e0b_11f1_94a8_12740c7ab49b = new taginspector.datapulse.trigger.BaseTrigger({triggerScript: trigger_function_trigger_b57b28b4_4e0b_11f1_94a8_12740c7ab49b, uniqueId: 'b57b28b4_4e0b_11f1_94a8_12740c7ab49b', triggerFired: false });
trigger_b57b28b4_4e0b_11f1_94a8_12740c7ab49b.addRule(rule_16015);
rule_16015.addTrigger(trigger_b57b28b4_4e0b_11f1_94a8_12740c7ab49b);

condition_c4b1fccd_f691_40f2_95ec_173ea04de47c = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: 'c4b1fccd_f691_40f2_95ec_173ea04de47c'});
trigger_function_trigger_b57b350c_4e0b_11f1_94a8_12740c7ab49b = function (cb) {
				if(triggerFired == false){
					triggerFired = true;
					try {
						if(condition_c4b1fccd_f691_40f2_95ec_173ea04de47c.match() == true){
							cb(true);
						}
					} catch (err) {
						console.log(err.message);
						jeErrorObj = {
							message: err.message
						};
						tiMonitor.dataCollector.queueRequest(jeErrorObj, "jserror");
					}
				}
		}
trigger_b57b350c_4e0b_11f1_94a8_12740c7ab49b = new taginspector.datapulse.trigger.BaseTrigger({triggerScript: trigger_function_trigger_b57b350c_4e0b_11f1_94a8_12740c7ab49b, uniqueId: 'b57b350c_4e0b_11f1_94a8_12740c7ab49b', triggerFired: false });
trigger_b57b350c_4e0b_11f1_94a8_12740c7ab49b.addRule(rule_18166);
rule_18166.addTrigger(trigger_b57b350c_4e0b_11f1_94a8_12740c7ab49b);

condition_58ec5915_29f3_4076_aa27_dd316a50395d = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: '58ec5915_29f3_4076_aa27_dd316a50395d'});
trigger_function_trigger_b57b5dde_4e0b_11f1_94a8_12740c7ab49b = function (cb) {
				if(triggerFired == false){
					triggerFired = true;
					try {
						if(condition_58ec5915_29f3_4076_aa27_dd316a50395d.match() == true){
							cb(true);
						}
					} catch (err) {
						console.log(err.message);
						jeErrorObj = {
							message: err.message
						};
						tiMonitor.dataCollector.queueRequest(jeErrorObj, "jserror");
					}
				}
		}
trigger_b57b5dde_4e0b_11f1_94a8_12740c7ab49b = new taginspector.datapulse.trigger.BaseTrigger({triggerScript: trigger_function_trigger_b57b5dde_4e0b_11f1_94a8_12740c7ab49b, uniqueId: 'b57b5dde_4e0b_11f1_94a8_12740c7ab49b', triggerFired: false });
trigger_b57b5dde_4e0b_11f1_94a8_12740c7ab49b.addRule(rule_12622);
rule_12622.addTrigger(trigger_b57b5dde_4e0b_11f1_94a8_12740c7ab49b);

condition_1987d44d_2141_475d_b274_4d782b31a6da = new taginspector.datapulse.filter.JsExpressionFilter({sourceVariable: macro_5d73e5ea_98a3_50d1_b89a_7a8cacf5bae1, comparisonVariable: 'true', comparisonType: 'Equals', uniqueId: '1987d44d_2141_475d_b274_4d782b31a6da'});
trigger_function_trigger_b57b6338_4e0b_11f1_94a8_12740c7ab49b = function (cb) {
				if(triggerFired == false){
					triggerFired = true;
					try {
						if(condition_1987d44d_2141_475d_b274_4d782b31a6da.match() == true){
							cb(true);
						}
					} catch (err) {
						console.log(err.message);
						jeErrorObj = {
							message: err.message
						};
						tiMonitor.dataCollector.queueRequest(jeErrorObj, "jserror");
					}
				}
		}
trigger_b57b6338_4e0b_11f1_94a8_12740c7ab49b = new taginspector.datapulse.trigger.BaseTrigger({triggerScript: trigger_function_trigger_b57b6338_4e0b_11f1_94a8_12740c7ab49b, uniqueId: 'b57b6338_4e0b_11f1_94a8_12740c7ab49b', triggerFired: false });
trigger_b57b6338_4e0b_11f1_94a8_12740c7ab49b.addRule(rule_11627);
rule_11627.addTrigger(trigger_b57b6338_4e0b_11f1_94a8_12740c7ab49b);


		function _asyncFireTrigger(tgr){
			return new Promise(function(resolve, reject){
				tgr.initTrigger(resolve);
			});
		}

		function initUnloadTriggers(){
			var tiTriggerListInit = [];
			tiMonitor.ruleVariableCache.updateCache(100);
			tiTriggerListInit.push(_asyncFireTrigger(trigger_b57b28b4_4e0b_11f1_94a8_12740c7ab49b));
tiTriggerListInit.push(_asyncFireTrigger(trigger_b57b350c_4e0b_11f1_94a8_12740c7ab49b));
tiTriggerListInit.push(_asyncFireTrigger(trigger_b57b5dde_4e0b_11f1_94a8_12740c7ab49b));
tiTriggerListInit.push(_asyncFireTrigger(trigger_b57b6338_4e0b_11f1_94a8_12740c7ab49b));

			Promise.all(tiTriggerListInit).then(function(values){
			});
		}

			window.addEventListener("unload", function (event) {
				tiMonitor.sendData.fire();
			});

		window.addEventListener("pagehide", function (event) {
			tiMonitor.fireValidationRules();
		});

			window.addEventListener("beforeunload", function (event) {
				tiMonitor.fireValidationRules();
			});

		document.addEventListener('tiSimulateUnload', function (e) {
			initUnloadTriggers();
		}, false);



	}
	catch(err) {
		console.log(err.message);
		jeErrorObj = {
			message: err.message
		};
		tiMonitor.sendData.checkQueueRequest(jeErrorObj, "jserror");
	}
};

tiMonitor.fireValidationRules = function (){
	try {
		//fire unload triggers:
		if(typeof Event == "function" && tiMonitor.sendData.pageBeingSampled == false){
			var event = new Event("tiSimulateUnload");
			tiMonitor.sendData.handleUnload();
			document.dispatchEvent(event);
		}
	}
	catch(err) {
		console.log(err.message);
		jeErrorObj = {
			message: err.message
		};
		tiMonitor.sendData.checkQueueRequest(jeErrorObj, "jserror");
	}
};

tiMonitor.enableEnhancedTagSupport = function (){
	try {
		scInterval = 0;
		var tiScPostSupport = setInterval(function() {
			scInterval = scInterval + 100;
			if(scInterval >= 20000){
				clearInterval(tiScPostSupport);
			}
			if(typeof(s) != "undefined"){
				if (s.hasOwnProperty("registerPostTrackCallback")){
					s.registerPostTrackCallback(function(requestUrl) {
						if(requestUrl.length > 2048 || navigator.userAgent.indexOf("iPhone") > -1){
							tiMonitor.sendData.createFakeReq(requestUrl);
						}
					});
					clearInterval(tiScPostSupport);
				}
			}
		}, 100);
		fbInterval = 0;
		var tiFbPostSupport = setInterval(function() {
			fbInterval = fbInterval + 100;
			if(fbInterval >= 20000){
				clearInterval(tiFbPostSupport);
			}
			if(typeof(fbq) != "undefined"){
				if (fbq.hasOwnProperty("on")){
					clearInterval(tiFbPostSupport);
					fbq.on( "fired", function(reqMethod, reqData) {
						if(reqMethod == "POST"){
							params = []
							for(x=1;x<reqData["_params"].length;x++){
								param = reqData["_params"][x];
								params.push(encodeURIComponent(param.name) + '=' + encodeURIComponent(param.value));
							}
							fbUrl = "https://www.facebook.com/tr/?" + params.join('&');
							tiMonitor.sendData.createFakeReq(fbUrl);
						}
					});
				}
			}
		}, 100);
	
	}catch(err) {
		console.log(err.message);
		jeErrorObj = {
			message: err.message
		};
		tiMonitor.sendData.checkQueueRequest(jeErrorObj, "jserror");
	}
};

tiMonitor.initializeNewPage = function (){
	try {
		tiMonitor.windowUnloadEvent = false; // Looks unused
		tiMonitor.sendData.sentUnload = false; // Looks unused
		newPageId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);return v.toString(16);});
		tiMonitor.sendData.pageId = newPageId;
		tiMonitor.dataCollector.pageId = newPageId;
		
		tiMonitor.dataCollector.startTime = Date.now();
		// tiMonitor.dataCollector.identifiedRequests = {};
		tiMonitor.dataCollector.resetIdentifiedRequests();
		tiMonitor.dataCollector.offsetTime = performance.now();
		tiMonitor.sendData.currentUrl = window.location.href;
		tiMonitor.sendData.preventFiringValidationRules = false;
		tiMonitor.dataCollector.resource_size = 0;
		taginspector.datapulse.trigger.BaseTrigger.resetFiredTriggers();
		taginspector.datapulse.pagevariable.BaseVariable.clearCache();
		tiMonitor.spaRuleObjectLengthTracker.incrimentSpaPageview();
	}
	catch(err) {
		console.log(err.message);
		jeErrorObj = {
			message: err.message
		};
		tiMonitor.sendData.checkQueueRequest(jeErrorObj, "jserror");
	}
};

tiMonitor.enableSpaSupport = function() {
	var portRegex = /:[0-9]+$/;
	var kd = {};
	ld = function (a, b) {
		kd[a] = kd[a] || [];
		kd[a][b] = !0
	}
	getWindowParam = function(a, b, c) {
		b && (void 0 === window[a] || c && !window[a]) && (window[a] = b);
		return window[a]
	}
	getUrl = function () {
		return document.location.href;
	}

	getUrlwithoutFragment = function (a) {
		return stripFragmentFromUrl(getUrlDict(a))
	}
	stripFragmentFromUrl = function (a) {
		var b = "";
		if (a && a.href) {
			var c = a.href.indexOf("#");
			b = 0 > c ? a.href : a.href.substr(0, c)
		}
		return b
	}
	getUrlDict = function (a) {
		var b = document.createElement("a");
		a && (b.href = a);
		var c = b.pathname;
		"/" !== c[0] && (a || ld("TAGGING", 1), c = "/" + c);
		var d = b.hostname.replace(portRegex, "");
		return {
			href: b.href,
			protocol: b.protocol,
			host: b.host,
			hostname: d,
			pathname: c,
			search: b.search,
			hash: b.hash,
			port: b.port
		}
	}
	getUrlComponent = function (urlDict, uriComponent, c, d, e) {
		uriComponent && (uriComponent = String(uriComponent).toLowerCase());
		if ("protocol" === uriComponent || "port" === uriComponent){
			urlDict.protocol = stripSemicolon(urlDict.protocol) || stripSemicolon(document.location.protocol);
		}
		"port" === uriComponent ? urlDict.port = String(Number(urlDict.hostname ? urlDict.port : document.location.port) || ("http" == urlDict.protocol ? 80 : "https" == urlDict.protocol ? 443 : "")) : "host" === uriComponent && (urlDict.hostname = (urlDict.hostname || document.location.hostname).replace(portRegex, "").toLowerCase());
		var uriComponentCopy = uriComponent, h, k = stripSemicolon(urlDict.protocol);
		uriComponentCopy && (uriComponentCopy = String(uriComponentCopy).toLowerCase());
		switch (uriComponentCopy) {
			case "url_no_fragment":
				result = stripFragmentFromUrl(a);
				break;
			case "protocol":
				result = k;
				break;
			case "host":
				result = urlDict.hostname.replace(portRegex, "").toLowerCase();
				if (c) {
					var l = /^www\d*\./.exec(result);
					l && l[0] && (result = result.substr(l[0].length))
				}
				break;
			case "port":
				result = String(Number(urlDict.port) || ("http" == k ? 80 : "https" == k ? 443 : ""));
				break;
			case "path":
				urlDict.pathname || urlDict.hostname || ld("TAGGING", 1);
				result = "/" == urlDict.pathname.substr(0, 1) ? urlDict.pathname : "/" + urlDict.pathname;
				var m = result.split("/");
				0 <= n(d || [], m[m.length - 1]) && (m[m.length - 1] = "");
				result = m.join("/");
				break;
			case "query":
				result = urlDict.search.replace("?", "");
				e && (result = getQueryparameters(result, e, void 0));
				break;
			case "extension":
				var q = urlDict.pathname.split(".");
				result = 1 < q.length ? q[q.length - 1] : "";
				result = result.split("/")[0];
				break;
			case "fragment":
				result = urlDict.hash.replace("#", "");
				break;
			default:
				result = a && urlDict.href
		}
		return result
	}
	getUrlFragment = function (a) {
		return getUrlComponent(getUrlDict(a), "fragment")
	}
	stripSemicolon = function (a) {
		return a ? a.replace(":", "").toLowerCase() : ""
	}
	isFunction = function(a) {
		return "function" == typeof a
	}
	getQueryparameters = function(a, b, c) {
		for (var d = a.split("&"), e = 0; e < d.length; e++) {
			var f = d[e].split("=");
			if (decodeURIComponent(f[0]).replace(/\+/g, " ") === b) {
				var h = f.slice(1).join("=");
				return c ? h : decodeURIComponent(h).replace(/\+/g, " ")
			}
		}
	}
	addListener = function(a, b, c, d) {
		a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c)
	}
	var avb = function(){
		function getNewUrlOnEventCallback(event) {
			return event.target && event.target.location && event.target.location.href ? event.target.location.href : getUrl()
		}
		function listenToHashChangeEvents(winObj, histObj) {
			addListener(winObj, "hashchange", function(event) {
				var newUrl = getNewUrlOnEventCallback(event);
				histObj({
					source: "hashchange",
					state: null,
					url: getUrlwithoutFragment(newUrl),
					L: getUrlFragment(newUrl)
				})
			})
		} 
		function listenToPopstateEvents(winObj, histObj) {
			addListener(winObj, "popstate", function(event) {
				var newUrl = getNewUrlOnEventCallback(event);
				histObj({
					source: "popstate",
					state: event.state,
					url: getUrlwithoutFragment(newUrl),
					L: getUrlFragment(newUrl)
				})
			})
		}
		function bindToHistoryEvent(eventName, windowObj, historyObj) {
			var windowHistoryObj = windowObj.history;
			var eventType = windowHistoryObj[eventName];
			if (isFunction(eventType))
				try {
					windowHistoryObj[eventName] = function (q, r, u) {
						eventType.apply(windowHistoryObj, [].slice.call(arguments, 0));
						historyObj({
							source: eventName,
							state: q,
							url: getUrlwithoutFragment(getUrl()),
							L: getUrlFragment(getUrl())
						})
					}
				} catch (q) {}
		}	
		function orgHistoryObj() {
			var historyDict = {
				source: null,
				state: getWindowParam("history").state || null,
				url: getUrlwithoutFragment(getUrl()),
				L: getUrlFragment(getUrl())
			};
			return function(winObj) {
				var l = {};
				l[historyDict.source] = !0;
				l[winObj.source] = !0;
				if (!l.popstate || !l.hashchange || historyDict.L != winObj.L) {
					if(historyDict.url !== undefined && winObj.url !== undefined){
						var historyDictUrlNoQs = (historyDict.url).split("?")[0];
						var winObjUrlNoQs = (winObj.url).split("?")[0];
						if (historyDictUrlNoQs !== winObjUrlNoQs) {
							historyDict = winObj;
							if(performance.now() - tiMonitor.dataCollector.offsetTime > 200){
								tiMonitor.ruleVariableCache.updateCache(100);
								tiMonitor.ruleVariableCache.spaRulesFiring = true;
								setTimeout(function() {
									
									if (tiMonitor.sendData.pageBeingSampled == false){
										tiMonitor.fireValidationRules();
										tiMonitor.sendData.iteratePerformance();
										tiMonitor.sendData.fire();
									}
									tiMonitor.ruleVariableCache.spaRulesFiring = false;
									
									var pageBeingSampled = true;
									tiMonitor.sendData.pageBeingSampled = true;
									var randomInt = Math.floor(Math.random() * (tiMonitor.sendData.sampleRate - 1 + 1)) + 1;
									if (1 == randomInt) {
										tiMonitor.initializeNewPage();
										pageBeingSampled = false;
										tiMonitor.sendData.pageBeingSampled = false;
									    } 
									else if (tiMonitor.sendData.sampleBlackListEnabled == true) {
									    if (tiMonitor.sendData.sampleBlackList.test(tiMonitor.sendData.currentUrl) == true) {
										tiMonitor.initializeNewPage();
										tiMonitor.sendData.sampleblackListFlag = true;
										pageBeingSampled = false;
										tiMonitor.sendData.pageBeingSampled = false;
									    }
									}
									
									if (pageBeingSampled == false){
									    tiMonitor.sendData.checkQueueRequest(null, "pageload");
									    tiMonitor.sendData.iteratePerformance();
									    tiMonitor.sendData.fire();
									    tiMonitor.sendData.sentUnload = true;
									}
								}, 200);
							}
						}
					}
				}
			}
		}(function(f) {
			f()
		})(function() {
			var winObj = getWindowParam("self");
			var histObj = orgHistoryObj();
			listenToHashChangeEvents(winObj, histObj);
			listenToPopstateEvents(winObj, histObj);
			bindToHistoryEvent("pushState", winObj, histObj);
			bindToHistoryEvent("replaceState", winObj, histObj);
		})
	}();
};

tiMonitor.patchPostRequests = function (){
	var SCHEDULE = 'schedule';
	var INVOKE = 'invoke';
	var ADD_EVENT_LISTENER_STR = 'addEventListener';
	var XMLHTTPREQUEST = 'xmlhttprequest';
	var FETCH = 'fetch';
	var SENDBEACON = 'navigator.sendBeacon';
	var ERROR = 'error';
	var BEFORE_EVENT = ':before';
	var AFTER_EVENT = ':after';
	var gaRegex = new RegExp('(^http(s)?:\\/\\/(([a-zA-Z0-9\\-\\.]*)\\.|)stats\\.g\\.doubleclick\\.net(\\/[a-z])?\\/collect|^http(s)?:\\/\\/(([a-zA-Z0-9\\-\\.]*)\\.|)(google-analytics|google)\\.com(\\/[a-z])?\\/collect|gtag\\/js\\?id\\=(G|g)\\-|\\/g\\/collect\\?v=2)','i');
	
	var globalState = {
		fetchInProgress: false
	};

	function convertHitToGetRequest(tagUrl, bodyParams){
		if('URL' in window){
			var parsedTagUrl = new URL(tagUrl);
			if(parsedTagUrl.search != ""){
				//has qstring
				tagUrl = tagUrl + "&"
			}else{
				tagUrl = tagUrl + "?"
			}
		}

		tagUrl = tagUrl + bodyParams.join('&');
		return tagUrl;
	}

	function shouldCollectPostBody(tagUrl, method, body){
		if(method == 'POST'){
			if(body && body != ""){
				return gaRegex.test(tagUrl);
			}
		}
		return false;
	}

	var EventHandler = function () {
		function EventHandler() {
			this.observers = {};
		}
	
		var _proto = EventHandler.prototype;
	
		_proto.observe = function observe(name, fn) {
			var _this = this;
	
			if (typeof fn === 'function') {
				if (!this.observers[name]) {
					this.observers[name] = [];
				}
	
				this.observers[name].push(fn);
				return function () {
					var index = _this.observers[name].indexOf(fn);
	
					if (index > -1) {
						_this.observers[name].splice(index, 1);
					}
				};
			}
		};
	
		_proto.sendOnly = function sendOnly(name, args) {
			var obs = this.observers[name];
	
			if (obs) {
				obs.forEach(function (fn) {
					try {
						fn.apply(undefined, args);
					} catch (error) {
						console.log(error, error.stack);
					}
				});
			}
		};
	
		_proto.send = function send(name, args) {
			this.sendOnly(name + BEFORE_EVENT, args);
			this.sendOnly(name, args);
			this.sendOnly(name + AFTER_EVENT, args);
		};
	
		return EventHandler;
	}();
	
	function apmSymbol(name) {
		return '__apm_symbol__' + name;
	}
	
	function isPropertyWritable(propertyDesc) {
		if (!propertyDesc) {
			return true;
		}
	
		if (propertyDesc.writable === false) {
			return false;
		}
	
		return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
	}
	
	function attachOriginToPatched(patched, original) {
		patched[apmSymbol('OriginalDelegate')] = original;
	}
	
	function patchMethod(target, name, patchFn) {
		var proto = target;
	
		while (proto && !proto.hasOwnProperty(name)) {
			proto = Object.getPrototypeOf(proto);
		}
		if (!proto && target[name]) {
			proto = target;
		}
		var delegateName = apmSymbol(name);
		var delegate;
	
		if (proto && !(delegate = proto[delegateName])) {
			delegate = proto[delegateName] = proto[name];
			var desc = proto && Object.getOwnPropertyDescriptor(proto, name);
	
			if (isPropertyWritable(desc)) {
				var patchDelegate = patchFn(delegate, delegateName, name);
	
				proto[name] = function () {
					return patchDelegate(this, arguments);
				};
	
				attachOriginToPatched(proto[name], delegate);
			}
		}
	
		return delegate;
	}
	var XHR_IGNORE = apmSymbol('xhrIgnore');
	var XHR_SYNC = apmSymbol('xhrSync');
	var XHR_URL = apmSymbol('xhrURL');
	var XHR_METHOD = apmSymbol('xhrMethod');
	
	function patchXMLHttpRequest(callback) {
		var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
	
		if (!XMLHttpRequestPrototype || !XMLHttpRequestPrototype[ADD_EVENT_LISTENER_STR]) {
			return;
		}
	
		var READY_STATE_CHANGE = 'readystatechange';
		var LOAD = 'load';
		var ERROR = 'error';
		var TIMEOUT = 'timeout';
		var ABORT = 'abort';
	
		function invokeTask(task, status) {
			if (task.state !== INVOKE) {
				task.state = INVOKE;
				task.data.status = status;
				callback(INVOKE, task);
			}
		}
	
		function scheduleTask(task) {
			if (task.state === SCHEDULE) {
				return;
			}
	
			task.state = SCHEDULE;
			callback(SCHEDULE, task);
			var target = task.data.target;
	
			function addListener(name) {
				target[ADD_EVENT_LISTENER_STR](name, function (_ref) {
					var type = _ref.type;
	
					if (type === READY_STATE_CHANGE) {
						if (target.readyState === 4 && target.status !== 0) {
							invokeTask(task, 'success');
						}
					} else {
						var status = type === LOAD ? 'success' : type;
						invokeTask(task, status);
					}
				});
			}
			addListener(READY_STATE_CHANGE);
			addListener(LOAD);
			addListener(TIMEOUT);
			addListener(ERROR);
			addListener(ABORT);
		}
	
		var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () {
			return function (self, args) {
				if (!self[XHR_IGNORE]) {
					self[XHR_METHOD] = args[0];
					self[XHR_URL] = args[1];
					self[XHR_SYNC] = args[2] === false;
				}
	
				return openNative.apply(self, args);
			};
		});
	
		var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () {
			return function (self, args) {
				if (self[XHR_IGNORE]) {
					return sendNative.apply(self, args);
				}
				var task = {
					source: XMLHTTPREQUEST,
					state: '',
					type: 'macroTask',
					data: {
						target: self,
						method: self[XHR_METHOD],
						sync: self[XHR_SYNC],
						url: self[XHR_URL],
						status: ''
					}
				};
				try {
					if(shouldCollectPostBody(task.data.url, task.data.method, args[0])){
						var bodyParamArr = args[0].split("&");
						var convertedTagUrl =  convertHitToGetRequest(task.data.url, bodyParamArr);
						tiMonitor.sendData.createFakeReq(convertedTagUrl);
					}
				} catch (err) {
					console.log(err.message);
				}
	
				try {
					scheduleTask(task);
					return sendNative.apply(self, args);
				} catch (e) {
					invokeTask(task, ERROR);
					throw e;
				}
			};
		});
	}
	
	function scheduleMicroTask(callback) {
		Promise.resolve().then(callback);
	}
	
	function patchFetch(callback) {
		if (!window.fetch || !window.Request) {
			return;
		}
	
		function scheduleTask(task) {
			task.state = SCHEDULE;
			callback(SCHEDULE, task);
		}
	
		function invokeTask(task) {
			task.state = INVOKE;
			callback(INVOKE, task);
		}
		var nativeFetch = window.fetch;
	
		window.fetch = function (input, init) {
			var fetchSelf = this;
			var args = arguments;
			var request, url;
	
			if (typeof input === 'string') {
				request = new Request(input, init);
				url = input;
			} else if (input) {
				request = input;
				url = request.url;
			} else {
				return nativeFetch.apply(fetchSelf, args);
			}
	
			var task = {
				source: FETCH,
				state: '',
				type: 'macroTask',
				data: {
					target: request,
					method: request.method,
					url: url,
					aborted: false
				}
			};
			try {
				if(shouldCollectPostBody(task.data.url, task.data.method, args[0])){
					var bodyParamArr = args[0].split("&");
					var convertedTagUrl =  convertHitToGetRequest(task.data.url, bodyParamArr);
					tiMonitor.sendData.createFakeReq(convertedTagUrl);
				}
			} catch (err) {
				console.log(err.message);
			}

			return new Promise(function (resolve, reject) {
				globalState.fetchInProgress = true;
				scheduleTask(task);
				var promise;
	
				try {
					promise = nativeFetch.apply(fetchSelf, [request]);
				} catch (error) {
					reject(error);
					task.data.error = error;
					invokeTask(task);
					globalState.fetchInProgress = false;
					return;
				}
	
				promise.then(function (response) {
					resolve(response);
					scheduleMicroTask(function () {
						task.data.response = response;
						invokeTask(task);
					});
				}, function (error) {
					reject(error);
					scheduleMicroTask(function () {
						task.data.error = error;
						invokeTask(task);
					});
				});
				globalState.fetchInProgress = false;
			});
		};
	}
	
	function patchBeacon(callback){
		var nativeSendBeacon = window.navigator.sendBeacon;
	
		window.navigator.sendBeacon = function (url, data) {
			var beaconSelf = this;
			var args = arguments;
			
			if ('Request' in window) {
				try {
					var request, url;
					request = new Request(url);
					url = request.url;
					if(shouldCollectPostBody(url, "POST", data)){
						var bodyParamArr = data.split("&");
						var convertedTagUrl = convertHitToGetRequest(url, bodyParamArr);
						tiMonitor.sendData.createFakeReq(convertedTagUrl);
					}
				} catch (err) {
					console.log(err.message);
				}
			}

			return nativeSendBeacon.apply(beaconSelf, arguments);
		}
	}
	
	var patchEventHandler = new EventHandler();
	var alreadyPatched = false;
	
	function patchAll() {
		if (!alreadyPatched) {
			alreadyPatched = true;
			patchXMLHttpRequest(function (event, task) {
				patchEventHandler.send(XMLHTTPREQUEST, [event, task]);
			});
			if ('Promise' in window) {
				patchFetch(function (event, task) {
					patchEventHandler.send(FETCH, [event, task]);
				});
			}
			if (window.navigator) {
				if(window.navigator.sendBeacon){
					patchBeacon(function (event, task) {
						patchEventHandler.send(SENDBEACON, [event, task]);
					});
				}
			}
		}
		return patchEventHandler;
	}
	patchAll();
}

tiMonitor.initializeMain = function() {
	if(tiMonitor.sendData.suportedBrowser() == true && tiMonitor.sendData.isInIframe() == false){
		if(tiMonitor.sendData.initialized == false){
			tiMonitor.sendData.initialized = true;
			var pageBeingSampled = true;
			var randomInt = Math.floor(Math.random() * (tiMonitor.sendData.sampleRate - 1 + 1)) + 1;
			if (1 == randomInt) {
				pageBeingSampled = false;
				tiMonitor.sendData.pageBeingSampled = false;
			} 
			else if (tiMonitor.sendData.sampleBlackListEnabled == true) {
				if (tiMonitor.sendData.sampleBlackList.test(tiMonitor.sendData.currentUrl) == true) {
					tiMonitor.sendData.sampleblackListFlag = true;
					pageBeingSampled = false;
					tiMonitor.sendData.pageBeingSampled = false;
				}
			}
			if(pageBeingSampled == false && tiMonitor.sendData.isBufferFull() == false){
				tiMonitor.sendData.checkQueueRequest(null, "pageload");
				tiMonitor.sendData.iteratePerformance();
				tiMonitor.sendData.fire();
				tiMonitor.sendData.sentUnload = true;
				if(false){
					tiMonitor.dataCollector.session = taginspector.datapulse.Session.setupSession({"containerId": "56b5ec9cde5411ea99110a2767f5ff47"});
				}
				tiMonitor.sendData.fullBufferEventListener();
				tiMonitor.spaRuleObjectLengthTracker.incrimentSpaPageview();

				if(tiMonitor.sendData.isPerformanceObserverSupported() == true){
					var iteratePerformanceCompleted = false;
					while(iteratePerformanceCompleted == false){
						tiMonitor.sendData.iteratePerformance();
						pe = performance.getEntriesByType("resource");
						if(tiMonitor.sendData.lastPerformanceObjLength == pe.length){
							iteratePerformanceCompleted = true;
						}
					}
					var observer = new PerformanceObserver(tiMonitor.sendData.performanceObserverCallback);
					observer.observe({entryTypes: ['resource']});

				}else{
					setInterval(function () {tiMonitor.sendData.iteratePerformance()}, 1000);
				}
				tiMonitor.enableEnhancedTagSupport();
				if(false){
					tiMonitor.patchPostRequests();
				}
				
				try {
					tiMonitor.enableSpaSupport();
				} catch (err) {
					console.log(err.message);
					jeErrorObj = {
						message: err.message
					};
					tiMonitor.sendData.checkQueueRequest(jeErrorObj, "jserror");
				}
				setInterval(function () {tiMonitor.sendData.fire()}, 1000);

				tiMonitor.sendData.onPageHidden(function() {
					tiMonitor.sendData.handleUnload();
				});

				// Flush the scanned request counter after 5 seconds, in case the unload hook doesn't reliably fire
				setTimeout(function() { tiMonitor.sendData.flushPIIScannedRequestCounter(); }, 5000);
			}
		}
	}
}
tiMonitor.initializeMain();


 }