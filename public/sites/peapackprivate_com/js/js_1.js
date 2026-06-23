(function() {
try {
    try {
    if (typeof MtVoid === 'undefined') {
	var MtVoid = {
            loc_data : {},
            scr_data : {
  "delimiter":"%5BINSERT%20DELIMITER%5D",
  "product_brand":"%5BINSERT%20MACRO%5D",
  "primary-x-request-id":"2c2644f4c84dd4a6dcbc732103721589",
  "product_quantity":"%5BINSERT%20MACRO%5D",
  "revenue":"%5BINSERT%20MACRO%5D",
  "mt_pp":"2",
  "version":"1.1",
  "order_id":"%5BINSERT%20MACRO%5D",
  "mt_cb":"1781350523562",
  "event_type":"catchall",
  "v1":"%5BINSERT%20MACRO%5D",
  "document_title":"Search%20%E2%80%BA%20Peapack%20Private%20Bank%20%26%20Trust",
  "product_category":"%5BINSERT%20MACRO%5D",
  "mt_pqc":"mt_aid",
  "mt_gfp":"mt_fp_mt_aid",
  "location":"https%3A%2F%2Fwww.peapackprivate.com%2Fsearch%3Fq%3DBank",
  "document_path":"%2Fsearch",
  "mt_fpa":"1",
  "mt_id":"2476944",
  "industry":"Financial%20Services%20%26%20Fintechs",
  "mt_adid":"433287",
  "language":"en-US%2Cen%3Bq%3D0.9",
  "mt_exem":"%5BINSERT%20SHA-256%20HASHED%20EMAIL%5D",
  "mt_lim":"20",
  "product_price":"%5BINSERT%20MACRO%5D",
  "product_id":"%5BINSERT%20MACRO%5D"
},
            acq_data : {},
            get: function(obj_name, var_name) {
		return this[obj_name][var_name];
	    },
            set: function(obj_name, var_name, value) {
		this[obj_name][var_name] = value;
		return value;
	    },

            parse_qry: function(qs, destination) {
		qs.replace(/[?&]([^=]+)=([^&]*)/g, function(all, key, value) {
		    destination[key]= value;
		});
            },

            makeqs : function() {
		var qs = "";
		var keys = [].concat.call(arguments);
		if (keys.length < 2) {
		    keys = Object.keys(this.acq_data);
		}
		var pairs = [];
		var self = this;
		keys.forEach(function(key) {
		    pairs.push(key+'='+encodeURIComponent(self.acq_data[key]));
		});
		return pairs.join("&");
	    },

	    gcook: function(name) {
		if (document.cookie == null)
		    return null;
		const fetch_cookie = RegExp(name+"=([^;]+)");
		if (fetch_cookie == null)
                    return null;
		const values = document.cookie.match(fetch_cookie);
		if (values == null)
		    return null;
		this.set('acq_data', name, values[1]);
		var abbrev = name.replace(/mt_fp_/g, '');
		this.set('acq_data', abbrev, values[1]);
		return values[1];
	    },

 	    scook: function(name, value, expire_secs) {
        	var date = new Date();
		date.setTime(date.getTime() + expire_secs);
       		var expire = date.toUTCString();
		var domain = window.location.hostname.match("[^.]+\.[^.]+$")[0];
       		var cookie_str = name+'='+value +
		    '; domain='+domain +
                    '; expires='+expire +
                    '; path=/; Secure; SameSite=None';
		document.cookie = cookie_str;
		return document.cookie;
	    }
	}

	MtVoid.parse_qry(window.location.search, MtVoid.loc_data);
	MtVoid.set('acq_data', 'primary-x-request-id', "3341fa438bc19d3fcf20499bfc9961f0");
	MtVoid.set('acq_data', 'mt_sec', 'kv');

	var mt_fp_uuid = MtVoid.gcook("mt_fp_uuid")
	if (mt_fp_uuid == null) {
            if (MtVoid.get('scr_data', 'mt_sfp') != null) {
		MtVoid.scook('mt_fp_uuid', "7d8c6a2d-4084-4400-b215-b081e3e318cd", 396*24*60*60*1000);
            }
	}

        if (MtVoid.get('scr_data', 'mt_fpa') != null) {
	    var mt_aid = MtVoid.get("loc_data", "mt_aid");
	    if (mt_aid != null) {
		MtVoid.scook('mt_fp_mt_aid', mt_aid, 30*60*60*24*1000);
            }
	}

	var mt_pqc = MtVoid.get('scr_data', 'mt_pqc');
	if (mt_pqc != null) {
            var pqc = mt_pqc.split(/[:,|]/);
	    pqc.forEach(function(key) {
		if (MtVoid.get('loc_data', key) != null)
    		    MtVoid.set('acq_data', key, MtVoid.get('loc_data', key));
	    })
	}

	var mt_gfp = MtVoid.get('scr_data', 'mt_gfp');
	if (mt_gfp != null) {
	    var gfp = mt_gfp.split(/[:,|]/);
	    gfp.forEach(function(key) {
    		MtVoid.gcook(key)
	    })
	}
    }
}
catch(ex) {
    new Image().src = "//pixel.mathtag.com/error/img?error_domain=jskvstore&what=" + encodeURIComponent(ex.message);
}
if (typeof window.MtBts === 'undefined') {
    window.MtBts = function() {
	metric = function(url, wait)
	{	
            setTimeout(function() {
                var e = new Image();
                e.src = url;
            }, wait);
	}
	var intervals = [0, 10];
	var inlen = intervals.length;
	for (var k = 0; k < inlen; ++k)
            this.metric("https://pixel.mathtag.com/comp/img?mt_id=99&ns=xx&bcdv="+k, intervals[k] * 1000);
    };
    window.MtBts()
}
       (function() {
	   try {
 	       var stat = '';

               var mt_aid = MtVoid.get('acq_data', 'mt_aid');
               var mt_fp_mt_aid = MtVoid.get('acq_data', 'mt_fp_mt_aid');

               if (!(mt_aid || mt_fp_mt_aid)) {
		   return
	       }

               if (MtVoid.get('loc_data', 'mt_aid'))
		   stat += 'p2_landing_page,';
               if (mt_aid)
 		   stat += 'p2_mt_aid,';
  	       if (mt_fp_mt_aid)
                  stat += 'p2_mt_fp_mt_aid,';
               stat += "immediate";

       	       var refire = 'https://pixel.mathtag.com/event/img?primary-x-request-id=2c2644f4c84dd4a6dcbc732103721589&mt_pp=2&version=1.1&delimiter=%5BINSERT%20DELIMITER%5D&mt_exem=%5BINSERT%20SHA-256%20HASHED%20EMAIL%5D&industry=Financial%20Services%20%26%20Fintechs&mt_adid=433287&event_type=catchall&mt_id=2476944&order_id=%5BINSERT%20MACRO%5D&product_brand=%5BINSERT%20MACRO%5D&product_category=%5BINSERT%20MACRO%5D&product_id=%5BINSERT%20MACRO%5D&product_price=%5BINSERT%20MACRO%5D&product_quantity=%5BINSERT%20MACRO%5D&revenue=%5BINSERT%20MACRO%5D&mt_pqc=mt_aid&mt_lim=20&language=en-US%2Cen%3Bq%3D0.9&mt_fpa=1&document_title=Search%20%E2%80%BA%20Peapack%20Private%20Bank%20%26%20Trust&location=https%3A%2F%2Fwww.peapackprivate.com%2Fsearch%3Fq%3DBank&document_path=%2Fsearch&v1=%5BINSERT%20MACRO%5D&mt_cb=1781350523562&stat='+stat+'&primary_mt_timestamp=1781350532&'+MtVoid.makeqs();
               new Image().src= refire;
	   } catch(ex) {
	       new Image().src="//%s/error/img?error_domain=immediate&what="+encodeURIComponent(ex.message);
	   }
       }
       )();
(function(){
/**/

})();
(function() {
    try {
        if (document.getElementById('mm_sync_back_ground'))
           return;
        var frm = document.createElement('iframe');
        frm.style.visibility = 'hidden';
        frm.style.display = 'none';
        frm.src = "https://pixel.mathtag.com/sync/iframe?mt_uuid=7d8c6a2d-4084-4400-b215-b081e3e318cd&no_iframe=1&mt_adid=433287&mt_lim=20&source=mathtag";
        frm.setAttribute("id", "mm_sync_back_ground");
        frm.title="MediaMath Advertising";

        if (document.body)
            document.body.appendChild(frm);
        else
            if (document.head)
                document.head.appendChild(frm);
    }
    catch(ex)
    {
        new Image().src="//pixel.mathtag.com/error/img?error_domain=synciframe&what="+encodeURIComponent(ex.message);
    }
})();

}
catch(ex)
{
   new Image().src="//pixel.mathtag.com/error/img?error_domain=wrap_js&what="+encodeURIComponent(ex.message);
}
})();
