var count = 0;
var hasLogin = false;
var magicString = "|;kiDrqvfi7d$v0p5Fg72Vwbv2;|";
var username = "";
var password = "";
var operation = "";
var notification;

chrome.browserAction.setIcon({path:"red.ico"});
chrome.runtime.onInstalled.addListener(onInstalled);

init();

chrome.browserAction.onClicked.addListener(function() {
    count = (count + 1) % 3;    
    switch (count % 3) {
    case 0: // disconnect
	chrome.browserAction.setIcon({path:"red.ico"});
	checkStatus();
	if (!hasLogin)
	    login();
	operation = "ipgwclose"
	operate();
	notification = webkitNotifications.createNotification(
	    "red.ico",
	    "disconnect",
	    "success"
	);
	notification.show();
	break;
    case 1: // free
	chrome.browserAction.setIcon({path:"yellow.ico"});
	checkStatus();
	if (!hasLogin)
	    login();
	operation = "ipgwopen";
	operate();
	// TODO change this notification to chrome.notifications.xxx
	notification = webkitNotifications.createNotification(
	    "yellow.ico",
	    "connect free",
	    "success"
	);
	notification.show();
	break; 
    case 2: // global
	chrome.browserAction.setIcon({path:"green.ico"});
	checkStatus();
	if (!hasLogin)
	    login();
	operation = "ipgwopenall";
	operate();
	notification = webkitNotifications.createNotification(
	    "green.ico",
	    "connect global",
	    "success"
	);
	notification.show();
	break;
    }
});


function init() {
    chrome.storage.sync.get({
	username: "",
	password: ""
    }, function(items) {
	username = items.username;
	password = items.password;
    });
}


function checkStatus() {
    $.ajax("http://its.pku.edu.cn/netportal/", {
	type: "GET",
	async: false,
	cache: false,
	error: function(rquest, status, error) {
	    hasLogin = false;
	},
	success: function(data, status) {
	    // TODO
	    //console.log(data);
	    if (data.indexOf("您来自校外") > 0) {
		hasLogin = false;
		console.log("status not login");
	    }
	    else if (data.indexOf("来自校内") > 0) {
		hasLogin = true;
		console.log("status login");
		$.ajax("http://its.pku.edu.cn/itsmobile/PKU", function(data) {
		    console.log(data)
		});
	    }
	}
    });
}


function login() {
    $.ajax("http://its.pku.edu.cn/cas/login", {
	type: "POST",
	async: false,
	cache: false,
	data: {
	    username1: username,
	    password: password,
	    fwrd: "free",
	    pwd_t: "密码",
	    username: username + magicString + password + magicString + "12"
	}, 
	error: function(request, status, error) {
	    // TODO
	    hasLogin = false;
	    console.log("login error");
	    console.log(error);
	},
	success: function(data, status) {
	    // TODO
	    // Error messages that could happen:
	    //  1. username or password wrong

	    if (data.indexOf("ipgwopen") > 0) {
		hasLogin = true;
		console.log("login successfully");
		chrome.cookies.getAll({}, function(cookies) {
		    for (var i in cookies) {
			console.log(cookies[i]);
		    }
		});
	    }
	    else {
		hasLogin = false;
		console.log("login something else");
		console.log(data);
	    }

	    $.ajax("http://its.pku.edu.cn/itsmobile/PKU/wIPGW", function(data) {
		console.log(data)
	    });
	}
    });
}


function operate() {
    var url = "http://its.pku.edu.cn/netportal/" + operation;
    $.ajax(url, {
	type: "GET",
	async: false,
	cache: false,
	error: function(request, status, error) {
	    // TODO
	    console.log(operation + " error");
	    console.log(error);
	},
	success: function(data, status) {
	    // TODO
	    // Error messages that could happen:
	    //  1. not enough money of this account
	    //  2. frozen account
	    if (data.indexOf("successfully") > 0 || data.indexOf("Succeeded") > 0) {
		console.log(operation + " success");
	    }
	    else {
		console.log(operation + " something else");
	    }
	}
    });
}


function onInstalled() {
    chrome.tabs.create({
	url: "options.html",
	active: true
    });
}

