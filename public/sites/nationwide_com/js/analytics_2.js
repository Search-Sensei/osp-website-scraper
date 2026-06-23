
function piResponse() {
		piSetCookie('visitor_id677263', '1609272434', 3650);
			piSetCookie('visitor_id677263-hash', '6949da9ec9c797f175f79b45cc5faed1a6d363ea33aa393e7c3c92faca1f703aa4c9d9dfa6051660823d6a1ba8138e6adc90e64d', 3650);
		
		if (document.location.protocol != "https:" || (document.location.protocol == "https:" && true)) {
		var analytics_link = document.location.protocol + "//" + "pages.nationwide.com/analytics?";
		pi.tracker.visitor_id='1609272434';

				pi.tracker.visitor_id_sign='6949da9ec9c797f175f79b45cc5faed1a6d363ea33aa393e7c3c92faca1f703aa4c9d9dfa6051660823d6a1ba8138e6adc90e64d';
		
				pi.tracker.campaign_id='1085';
		
		var variables = 'conly=true';
		for (property in pi.tracker) {
					variables += "&" + property + "=" + encodeURIComponent(pi.tracker[property]);
				}
		var headID = document.getElementsByTagName("head")[0];
		piScriptObj[piScriptNum] = document.createElement('script');
		piScriptObj[piScriptNum].type = 'text/javascript';
		piScriptObj[piScriptNum].src = analytics_link + variables;
		headID.appendChild(piScriptObj[piScriptNum]);
		piScriptObj[piScriptNum].onload = function() { return; }
	}
	}
piResponse();




