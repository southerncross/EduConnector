var PKUConnector = {

    createNew: function() {
	var c = {};

	const MAGICSTRING = "|;kiDrqvfi7d$v0p5Fg72Vwbv2;|";	
	var username = "";
	var password = "";
	var conState = "DISCONNECTED"; // DISCONNECTED, CONNECTED_FREE, CONNECTED_GLOBAL
	var mode = "Manual";
	var hasLogin = false;
	var hasTimer = false;
	var notifOn = true;
	var sleepInterval = 10000;
	var topics = {};
	
	c.initialize = function() {
	    var data = Data.createNew();
	    var msg = "";
	    
	    chrome.storage.sync.get(data, function(items) {
		data = items;
		username = data.userInfo.PKU.username;
		password = data.userInfo.PKU.password;
		msg = "initialize: " + username + " " + password;
		console.log(msg);
	    });

	    // TODO: deploy observer mode
	};

	c.publish = function(topic, args) {
	    var subscribers = [];

	    if (!topics[topic]) {
		return;
	    }
	    PKUConnector.subscribers = topics[topic];
	    for (i in subscribers) {
		subscribers[i].handle(topic, args);
	    }
	};

	c.subscribe = function(topic, handler) {
	    if (!topics[topic]) {
		return;
	    }

	    // TODO: Is that right if we push more than one {handle: handler}?
	    topics[topic].push({
		handle: hander
	    });
	};

	c.getMode = function() {
	    return mode;
	};

	c.connectFree = function() {
	    console.log("connectFree");
	    c._check();
	    if (false === hasLogin) {
		c._login();
	    }
	    if (true === hasLogin) {
		c._connect("FREE");


	    }
	};

	c.connectGlobal = function() {
	    console.log("connectGlobal");
	    c._check();
	    if (false === hasLogin) {
		c._login();
	    }
	    if (true === hasLogin) {
		c._connect("GLOBAL");
	    }
	};

	c.disconnectMe = function() {
	    console.log("disconnectMe");
	    c._check();
	    if (false === hasLogin) {
		c._login();
	    }
	    if (true === hasLogin) {
		c._disconnect("ME");
	    }
	};

	c.disconnectAll = function() {
	    console.log("disconnectAll");
	    c._check();
	    if (false === hasLogin) {
		c._login();
	    }
	    if (true === hasLogin) {
		c._disconnect("ALL");
	    }
	};

	c._login = function() {
	    console.log("login");
	    var url = "http://its.pku.edu.cn/cas/login";
	    var msg = "";

	    chrome.cookies.get({
		url: "http://its.pku.edu.cn",
		name: "authUser"
	    }, function(cookie) {
		console.log("Login before, get cookie");
		console.log(cookie);
	    });

	    chrome.cookies.get({
		url: "http://its.pku.edu.cn",
		name: "JSESSIONID"
	    }, function(cookie) {
		console.log("Login before, get cookie");
		console.log(cookie);
	    });

	    $.ajax(url, {
		type: "POST",
		async: false,
		cache: false,
		data: {
		    username1: username,
		    password: password,
		    fwrd: "free",
		    pwd_t: "密码",
		    username: username + MAGICSTRING + password + MAGICSTRING + "12"
		},
		error: function(request, status, error) {
		    console.log(error);
		    c._notify(error);
		    hasLogin = false;
		},
		success: function(data, status) {
		    // TODO: Add cookie support
		    if (data.indexOf("ipgwopen") > 0) {
			msg = "Login successfully";
			console.log(msg);
			hasLogin = true;

/*
			chrome.cookies.get({
			    url: "http://its.pku.edu.cn",
			    name: "authUser"
			}, function(cookie) {
			    console.log("Login successfully, get cookie");
			    console.log(cookie);
			    var d = {};
			    d.url = "http://its.pku.edu.cn";
			    d.name = cookie.name;
			    d.value = cookie.value;
			    d.domain = cookie.domain;
			    d.path = cookie.path;
			    d.secure = cookie.secure;
			    d.httpOnly = cookie.httpOnly;
			    d.expirationDate = cookie.expirationDate;
			    chrome.cookies.set(d, function(cookie) {
				console.log("Login set cookie");
				console.log(cookie);
				//console.log(chrome.runtime.lastError);
			    });
			});

			chrome.cookies.get({
			    url: "http://its.pku.edu.cn",
			    name: "JSESSIONID"
			}, function(cookie) {
			    console.log("Login successfully, get cookie");
			    console.log(cookie);
			    var d = {};
			    d.url = "http://its.pku.edu.cn";
			    d.name = cookie.name;
			    d.value = cookie.value;
			    d.domain = cookie.domain;
			    d.path = cookie.path;
			    d.secure = cookie.secure;
			    d.httpOnly = cookie.httpOnly;
			    d.expirationDate = cookie.expirationDate;
			    chrome.cookies.set(d, function(cookie) {
				console.log("Login set cookie");
				console.log(cookie);
				//console.log(chrome.runtime.lastError);
			    });
			});
*/
		    }
		    else {
			msg = "Login not successfully"
			console.log(msg);
			console.log(data);
			c._notify(msg);
			hasLogin = false;
		    }
		}
	    });
	};

	c._connect = function(type) {
	    var url = "http://its.pku.edu.cn/netportal/";
	    var msg = "";
	    
	    switch (type) {
	    case "FREE":
		url = url + "ipgwopen";
		break;
	    case "GLOBAL":
		url = url + "ipgwopenall";
		break;
	    default:
		console.error("Error: undefined connection type.");
		break;
	    }

	    $.ajax(url, {
		type: "GET",
		async: false,
		cache: false,
		error: function(request, status, error) {
		    console.log(error);
		    c._notify(error);
		},
		success: function(data, status) {
		    // If disconnect success, there will be a "Successfully" word
		    if (data.indexOf("successfully") > 0) {
			msg = "Connect " + type + " succeeded.";
			console.log(msg);
			conState = "CONNECTED_" + type;
		    }
		    else {
			msg = "Connect " + type + " failed, something else.";
			console.error(msg);
			console.log(data);
		    }
		    c._notify(msg);
		}
	    });
	};

	c._disconnect = function(type) {
	    var url = "http://its.pku.edu.cn/netportal/";
	    var msg = "";
	    
	    switch (type) {
	    case "ME":
		url = url + "ipgwclose";
		break;
	    case "ALL":
		url = url + "ipgwcloseall";
		break;
	    default:
		console.error("Error: ndefined disconnection type.");
		break;
	    }

	    $.ajax(url, {
		type: "GET",
		async: false,
		cache: false,
		error: function(request, status, error) {
		    console.log(error);
		    c._notify(error);
		},
		success: function(data, status) {
		    // If disconnect success, there will be a "Succeeded" word
		    if (data.indexOf("Succeeded") > 0) {
			msg = "Disconnect " + type + " succeeded.";
			console.log(msg);
			conState = "DISCONNECTED";
		    }
		    else {
			msg = "Disconnect " + type + " failed, something else.";
			console.error(msg);
			console.log(data);
		    }
		    c._notify(msg);
		}
	    });
	};

	c._check = function() {
	    var url = "http://its.pku.edu.cn/netportal/";
	    var msg = "";

	    $.ajax(url, {
		type: "GET",
		async: false,
		cache: false,
		error: function(rquest, status, error) {
		    hasLogin = false;
		},
		success: function(data, status) {
		    // TODO: Add English language support
		    if (data.indexOf("您来自校外") > 0 || data.indexOf("来自校内") > 0) {
			msg = "Has logged";
			console.log(msg);
			hasLogin = true;
		    }
		    else {
			msg = "Not logged";
			hasLogin = false;
		    }
		}
	    });
	};

	c._notify = function(msg) {
	    var icoUrl = "";

	    switch (conState) {
	    case "DISCONNECTED":
		icoUrl = "picture/disconnect.ico";
		break;
	    case "CONNECTED_FREE":
		icoUrl = "picture/free.ico";
		break;
	    case "CONNECTED_GLOBAL":
		icoUrl = "picture/global.ico";
		break;
	    }

	    var notification = webkitNotifications.createNotification(
		icoUrl,
		"PKU Connector",
		msg
	    );

	    if (true === notifOn) {
		notification.show();
		setTimeout(function() {
		    notification.cancel();
		}, 1500);
	    }

	    chrome.browserAction.setIcon({path: icoUrl});
	};

	c.changeMode = function() {
	    var popup = chrome.extension.getViews({
		type: "popup"
	    })[0];
	    var msg;

	    switch (mode) {
	    case "Smart":
		mode = "Manual";
		popup.btnChangeMode.val("Manual");
		c._toManualMode();
		msg = "Turn to Manual mode";
		break;
	    case "Manual":
		mode = "Smart";
		popup.btnChangeMode.val("Smart");
		c._toSmartMode();
		msg = "Turn to Smart mode, will turn off notification";
		break;
	    }

	    c._notify(msg);
	};

	c._onBeforeNavigate = function(details) {
	    if (true === hasTimer) {
		return;
	    }
	    hasTimer = true;
	    // TODO: open global connection
	    setTimeout(c._timer, sleepInterval);
	};

	c._timer = function() {
	    chrome.tabs.query({status: "loading"}, function(result) {
		console.log(result);
		if (0 === result.length) {
		    // TODO: open free connection
		    console.log("time out! no loading pages, open free");
		    hasTimer = false;
		}
		else {
		    console.log("time out! has loading pages, continuing");
		    setTimeout(c._timer, sleepInterval);
		}
	    });
	};

	c._toSmartMode = function() {
	    chrome.webNavigation.onBeforeNavigate.addListener(c._onBeforeNavigate);
	};

	c._toManualMode = function() {
	};

	c.test = function() {
	    console.log("test");
	    // TODO: Experiment
	    /*
	    chrome.cookies.get({
		url: "http://its.pku.edu.cn",
		name: "authUser"
	    }, function(cookie) {
		console.log("Get cookie");
		console.log(cookie);
	    });

	    chrome.cookies.get({
		url: "http://its.pku.edu.cn",
		name: "JSESSIONID"
	    }, function(cookie) {
		console.log("Get cookie");
		console.log(cookie);
	    });
	    */
	    chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
		console.log("before navigate");
	    });

	    chrome.webNavigation.onCommitted.addListener(function(details) {
		console.log("on committed");
	    });

	    chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
		console.log("on DOM content loaded");
	    });

	    chrome.webNavigation.onCompleted.addListener(function(details) {
		console.log("on completed");
	    });
	};

	return c;
    }
};

// TODO: Now, it can't deal with conditions that manually close tabs
var PKUTimer = {
    createNew: function() {
	var t = {};
	var connector = {};
	const timeNavigate = 3000;
	const timeHoldGlobal = 10000; // TODO: This should be 5 min.
	var loadings = {};
	var running = false;

	t.initialize = function(con) {
	    connector = con;
	};

	t.setTimer = function(callback, time) {
	    setTimeout(callback, time);
	};

	t.navigating = function(details) {
	    loadings[details.tabId] = details.url;
	    // TODO: There could be synchronization problem
	    if (!running) {
		running = true;
		t.setTimer(t.checkLoadings, timeNavigate);
	    }
	};
	
	t.checkLoadings = function(details) {
	    // If there is any navigations unfinished
	    // We believe that beforeNavigate and committed will happen at the same time.
	    if (Object.keys(loadings).length > 0) {
		running = true;
		switch (connector.getState()) {
		case "DISCONNECTED":
		case "CONNECTED_FREE":
		    connector.connectFree();
		    break;
		case "CONNECTED_GLOBAL":
		    // Do nothing
		    break;
		}
		t.setTimer(t.checkLoadings, timeHoldGlobal);
	    }
	    else {
		switch (connector.getState()) {
		case "DISCONNECTED":
		case "CONNECTED_FREE":
		    // Do nothing
		    break;
		case "CONNECTED_GLOBAL":
		    connector.connectGlobal();
		    break;
		}
		running = false;
	    }
	};

	t.navigated = function(details) {
	    loadings[details.tabId] = undefined;
	};

	return t;
    }
};
