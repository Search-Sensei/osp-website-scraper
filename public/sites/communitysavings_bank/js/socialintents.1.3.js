var socialintents=false;var socialintents_vars2={};
(function(){
function loadFile(pageHost, filename, filetype, sri){var mh = (("http:" == document.location.protocol) ? "http://" : "https://");filename=mh+pageHost+filename;
if (filetype=="js"){var fileref=document.createElement('script');fileref.setAttribute("type","text/javascript");fileref.setAttribute("src", filename);}else if (filetype=="css"){var fileref=document.createElement("link");fileref.setAttribute("rel", "stylesheet");fileref.setAttribute("type", "text/css");fileref.setAttribute("href", filename);}if (typeof fileref!="undefined"){if (sri){fileref.setAttribute("integrity",sri);fileref.setAttribute("crossorigin","anonymous");}var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(fileref, x);}}
function getParameterByName(name) {var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);return match && decodeURIComponent(match[1].replace(/\+/g, ' '));}
function getWid(url) {var type = url.split('#');var hash = '';if(type.length > 1) hash = type[1];return hash;}
function endsWithSI(str, suffix) {return str.length >= suffix.length && str.substring(str.length - suffix.length) == suffix;}
function startsWithSI(str,prefix){return (str.substring(0, prefix.length) == prefix);}
function siUrlMatchSI(pattern){
    if (!pattern || pattern.length==0) return true;
    var ldom=window.location.protocol + '//' + window.location.host;
    var cur=window.location.href.split('?')[0];;var tokens = pattern.split(',');var match=false;
    for (var i = 0; i < tokens.length; i++) {
        try{
        var token=tokens[i].trim();
        if (token===ldom)match=true;
        if (token ==='*')match=true;
        else if (token.charAt(0) === '*' && token.charAt(tokens[i].length-1) === '*')
        {if (cur.indexOf(token.substring(1,token.length-1))> 0) match= true;}
        else if (token.charAt(0) === '*')
        {if (endsWithSI(cur,token.substring(1))) match= true;}
        else if (token.charAt(token.length-1) === '*')
        {if (startsWithSI(cur,token.substring(0,token.length-1))) match= true;}
        else{if (endsWithSI(cur,token)) match= true;}
        }catch(err){match=true;}
    }
    return match;
}
function loadScripts(){
    var mh = (("https:" == document.location.protocol) ? "https://" : "https://");var scriptUrl=mh+"www.socialintents.com/json/jsonGV.jsp";var url='';
    jQuery('script').each(function(i, e) {
        var scriptSrc=jQuery(e).attr('src');if (scriptSrc && scriptSrc.indexOf('socialintents')>0) url=scriptSrc;
    });
    var uid=getWid(url);
    if (uid){
        var socialintents_wids=JSON.parse(sessionStorage.getItem("socialintents_vs_"+uid));
        if (socialintents_wids && socialintents_wids !== "undefined"){
            var timer=0;
            jQuery.each(socialintents_wids, function(i, cwid) {
              var type=cwid.type;var wid=cwid.wid;var urlPat=cwid.pattern;var urlPatEx=cwid.patternExclude;
              if (siUrlMatchSI(urlPat) && (urlPatEx.length===0 ||!siUrlMatchSI(urlPatEx))){
                setTimeout(function() {
                  if (type ==="chat"){
                  loadFile("www.socialintents.com","/api/chat/socialintents.1.4.js#"+wid,"js");
                  }else if (type !== "null"){
                  loadFile("www.socialintents.com","/api/"+type+"/socialintents.1.3.js#"+wid,"js");
                  }  
                }, timer*800);  
                timer=timer+1;
              }
            })
        } else {
            var ping=scriptUrl+'?uid='+uid;
            jQuery.ajax({type: 'GET',url: ping,async:true,jsonpCallback:'jsonCallback',contentType: "application/json",
                dataType: 'jsonp',
                success: function(json) {
                    socialintents_wids=json.widgets;var timer=0;
                    jQuery.each(socialintents_wids, function(i, cwid) {
                      var type=cwid.type;var wid=cwid.wid;var urlPat=cwid.pattern;var urlPatEx=cwid.patternExclude;
                      if (siUrlMatchSI(urlPat) && (urlPatEx.length===0 || !siUrlMatchSI(urlPatEx))){
                        setTimeout(function() {
                            if (type ==="chat"){
                            loadFile("www.socialintents.com","/api/chat/socialintents.1.4.js#"+wid,"js");
                            }else if (type !== "null"){
                            loadFile("www.socialintents.com","/api/"+type+"/socialintents.1.3.js#"+wid,"js");
                            }       
                        }, timer*800);  
                        timer=timer+1;
                      }
                    })
                    sessionStorage.setItem('socialintents_vs_'+uid, JSON.stringify(socialintents_wids));
                    setTimeout(function() {
                        sessionStorage.removeItem('socialintents_vs_'+uid);
                    }, 60000)
                },
                error: function(e) {console.log(e.message);}
            });
        }
    } 
}
if(!window.jQuery || jQuery.fn.jquery == '1.5.1' || jQuery.fn.jquery == '1.4.2' || jQuery.fn.jquery == '1.6.1' || jQuery.fn.jquery == '1.6.2' || jQuery.fn.jquery == '1.6.4')
{loadFile("ajax.googleapis.com","/ajax/libs/jquery/3.6.0/jquery.min.js","js");}
if (!socialintents){
    socialintents=true;
    setTimeout(function() {
        if(!window.jQuery){
            setTimeout(function() {loadScripts();}, 750);
        }
        else{loadScripts();}
    }, 250);
}
})();