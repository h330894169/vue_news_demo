/**
 *server 服务
 * @author lihua 
 *
 */
module.exports = plugin;
var browserSync = require('browser-sync').create();
var httpProxy = require('http-proxy');  
var proxy = httpProxy.createProxyServer({}); 
var node_path = require('path');
var url = require('url');
function plugin(options) {
	
var isReady = false;
var startPath = "/index.html";
var proxyUrl = options.dataSource?"http://h5.ziztour.com/rest":"http://demo.h5.ziztour.com/rest";/**"http://127.0.0.1:5310/rest"**/;
var cookie = {};
var timer = null;
// 捕获异常  
proxy.on('error', function (err, req, res) {
	console.log(err)
  res.writeHead(500, {  
    'Content-Type': 'text/plain'  
  });  
  res.end('Something went wrong. And we are reporting a custom error message.');  
}); 

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	//console.log(res.getHeader["set-cookie"]);
	//console.log(proxyReq)
    for(var key in req.headers){
      //  proxyReq.setHeader(key, req.headers[key]);
	}
    //proxyReq.setHeader("host" , url.parse(options.target).hostname);
    //proxyReq.setHeader("User-Agent" , "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0");

    //req.headers.forEach()

    if(cookie){
	  //proxyReq.setHeader('cookie', cookie[res.getHeader["set-cookie"]]);
	  proxyReq.setHeader('cookie', cookie);
	}
	//console.log(proxyReq.getHeader("User-Agent"))
    console.log("-----------")
});

proxy.on('proxyRes', function(proxyRes, req, res, options) {
	var proxyCookie = proxyRes.headers["set-cookie"];
	if(proxyCookie){
		
		//cookie[req.headers["cookie"]] = proxyCookie;
		cookie  = proxyCookie;
		//console.log(req)
	}
	//console.log(proxyRes.headers)
	//console.log(proxyRes.headers["set-cookie"])
    //proxyRes.headers["host"] = "demo.h5.ziztour.com";
    //res.headers["host"] = "demo.h5.ziztour.com";
	//res.setHeader("Set-Cookie", [proxyRes.headers["set-cookie"]]);
});

var path = {
	dev:["distxxxx/**"],
	svn:[".svn/**","../static/.svn"]
}
console.log("server watch path is:" + path.dev)


browserSync.init({
     server: {
        baseDir: [options.dir||"./.tmp"/**,'bower_components'**/],
        routes: {
        	"/bower_components":options.dir + "/../bower_components",
            "/static": options.dir + "/static",
	        "/": options.dir + "/html"
	    },
	    middleware: function (req, res, next) {
            //next();
			var urlPath = url.parse(req.url);
			if(urlPath.pathname.indexOf(".")==-1){
				var temp = proxyUrl;
				//console.log(urlPath.pathname)
				if(urlPath.pathname.endsWith("wechat/forceauth") ||  urlPath.pathname.endsWith("wechat/callback")){
                    temp = proxyUrl.replace("/rest","")
				}
                //proxyUrl = (urlPath.pathname.endsWith("wechat/forceauth") ||  urlPath.pathname.endsWith("wechat/callback"))?proxyUrl.replace("/rest",""):proxyUrl;
                //proxyUrl = "http://127.0.0.1:5310";
                proxy.headers = req.headers;
                proxy.headers.host = url.parse(temp).hostname
				console.log(temp);
				//console.log(proxy.headers);

	        	proxy.web(req, res, { target: temp});
	        }else{
		        next();
	        }
	    }
    },
    notify:false,
    open: "external",
    files:path.dev,
    browser:"chrome",
    startPath: startPath,
    logLevel: "silent"
});
browserSync.watch(path.dev).on("ready",function(){
	isReady = true;
	console.log("server is ready........")
})
browserSync.watch(path.dev).on("change",function(path){
	if(isReady){
		if(options.watchCallBack){
			options.watchCallBack(path);
		}
	}
})
browserSync.watch(path.dev).on("add",function(path){
	if(isReady){
		if(options.watchCallBack){
			options.watchCallBack(path);
		}
        clearTimeout(timer);
        timer = setTimeout(function(){
            console.log("reload.....")
            browserSync.reload();
        },100)
	}
})
var svnChange = function(file_path){
}
browserSync.watch(path.svn).on("change",svnChange)
browserSync.watch(path.svn).on("add",svnChange)
return browserSync;
}





/**
var connect = require('connect')
var http = require('http')

var app = connect()

// store session state in browser cookie
var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
 
app.use(function (req, res, next) {
  // Update views 
  req.session.views = (req.session.views || 0) + 1
 
  // Write response 
  res.end(req.session.views + ' views')
})
// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
})
//create node.js http server and listen on port
http.createServer(app).listen(3001)
**/

