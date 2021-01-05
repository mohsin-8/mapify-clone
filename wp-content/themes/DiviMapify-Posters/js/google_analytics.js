//<!-- GDPR check if non essential cookies accepted -->
document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=UA-58047905-2"></script>');
function userAccepts(name) {
	let cookie = {};
	document.cookie.split(';').forEach(function(el) {
		let [k,v] = el.split('=');
		cookie[k.trim()] = v;
	})
	return cookie[name];
}

var user_accepted = userAccepts("cookielawinfo-checkbox-non-necessary");
if (user_accepted === "yes") {
	var subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
	// dont track test sites
	if (!["static", "test", "admin", "vercel", "local"].includes(subdomain)) {
		// for prod sites (UA)
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-58047905-2', {
			cookie_flags: 'max-age=7200;secure;samesite=none'
		});
		// for prod sites (v4)
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-2T8J54C7TZ');
	} else {
		// for test sites (UA)
		console.log('test sites');
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-58047905-7', {
			cookie_flags: 'max-age=7200;secure;samesite=none'
		});
		// for test sites (v4)
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-B5D6JZGJQ8',{'debug_mode':true});
	}
}