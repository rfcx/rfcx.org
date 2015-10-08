
/*
 * GET home page.
 */

var navItems = [
//  [ page-id, nav-title, uri-path, page-title, show-in-nav, is-isolated ]
    [ "intro", "Home", "/", "Protecting rainforests with real-time data", true, false ],
    [ "about", "About", "/about", "About", true, false ],
    [ "get_involved", "Get Involved", "/get_involved", "Get Involved", true, false ],
    [ "media", "Media", "/media", "Media", true, false ],

    [ "press", "Press", "/press", "Press Clippings", false, false ],
    [ "donate", "Donate", "/donate", "Donate", false, true ],
    [ "ecuador", "Ecuador", "/ecuador", "Ecuador", false, false ],
    [ "tumblr", "Tumblr", "http://tumblr.rfcx.org/", "", false, false ]
  ];
for (var i = 0; i < navItems.length; i++) { navItems[i][3] = "Rainforest Connection | "+navItems[i][3]; }

var socialMedia = [
  [ "github", "https://github.com/rfcx", "github-square", "Fork our repos on Github!", "Github"],
  [ "youtube", "http://www.youtube.com/user/RfcxOrg", "youtube-square", "Watch our videos on YouTube!", "YouTube"],
  [ "instagram", "http://instagram.com/rainforestcx", "instagram", "Check us out on Instagram!", "Instagram"],
  [ "tumblr", "http://tumblr.rfcx.org/", "tumblr-square", "Check out our Tumblr!", "Tumblr"],
  [ "flickr", "http://flickr.com/photos/rainforestcx/", "flickr", "Check us out on Flickr!", "Flickr"],
  [ "linkedin", "http://www.linkedin.com/company/rainforest-connection", "linkedin-square", "Check us out on LinkedIn!", "LinkedIn"],
  [ "google-plus", "https://plus.google.com/+RfcxOrg", "google-plus-square", "Check us out on Google+!", "Google+"],
  [ "twitter", "https://twitter.com/RainforestCx", "twitter-square", "Check us out on Twitter!", "Twitter"],
  [ "facebook", "https://www.facebook.com/RainforestCx", "facebook-square", "Check us out on Facebook!", "Facebook"]
];

function setJadeVars(process, jV) {
  var inProd = (process.env.NODE_ENV === "production");
  jV.app_version = process.env.productionVersionId;
  jV.node_env = process.env.NODE_ENV;
  jV.title += (inProd ? "" : (" ("+process.env.NODE_ENV+")"));
  jV.segment_analytics_client_id =  process.env.SEGMENT_ANALYTICS_CLIENT_ID;
  jV.addthis_pubid = process.env.ADDTHIS_PUBID;
  jV.bootstrap_cdn = inProd ? "//netdna.bootstrapcdn.com" : "/vendor";
  jV.googlelibs_cdn = inProd ? "//ajax.googleapis.com/ajax/libs" : "/vendor";
  jV.videojs_cdn = inProd ? "//vjs.zencdn.net" : "/vendor/video.js";
  jV.cdnjs_cdn = inProd ? "//cdnjs.cloudflare.com/ajax/libs" : "/vendor";
  jV.rfcx_cdn = inProd ? "//d265tty8j31r8c.cloudfront.net/cdn" : "/cdn";
  jV.rfcx_vendor_cdn = inProd ? "//d265tty8j31r8c.cloudfront.net/vendor" : "/vendor";
  jV.rfcx_static_cdn = inProd ? "//d1gbw6jvuihkp4.cloudfront.net" : "//rfcx-static.s3.amazonaws.com";
  jV.nav_items = navItems;
  jV.social_media = socialMedia;
  jV.media_assets = []; if (jV.current_page[0] === "media") { jV.media_assets = require("./../data/media.js").load(); }
  return jV;
}

exports.navItems = navItems;

exports.page = function(req, res, process){
  var navItem = [];
  for (var i = 0; i < navItems.length; i++) {
    if (req.route.path === navItems[i][2]) {
      navItem = navItems[i]; break;
    }
  }
  if (  (process.env.NODE_ENV==="production")
    &&  (   (req.host!=="rfcx.org")
        ||  (req.headers["x-forwarded-proto"]!=="https")
        )
    ) {
    res.writeHead(302, { "Location": "https://rfcx.org"+req.path } );
    res.end();
  } else {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.render(navItem[0], setJadeVars(process, {
      current_page: navItem,
      http_headers: req.headers,
      locale: req.locale,
      locale_url: req.locale_url
    }));
  }
};

exports.redirectToHomePage = function(req,res) {
  res.writeHead(302, { "Location": "/" } );
  res.end();
};

exports.returnHealthCheck = function(req,res) {
  var sendString = "rfcx";
  if (req.query.headers==="1") { sendString += "<br />"+JSON.stringify(req.headers); }
  res.send(sendString);
};
