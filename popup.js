var username;
var password;

function connectFree() {
    connect("free");
}

function connectGlobal() {
    connect("global");
}

function connect(fwrd) {
    var magicString = "|;kiDrqvfi7d$v0p5Fg72Vwbv2;|";
    var username = "1301214306";
    var password = "PKU1406w";

    if ("free" == fwrd) {
	// jquery ajax post method
	$.post("http://its.pku.edu.cn/cas/login", 
	       {
		   username1: username,
		   password: password,
		   fwrd: "free",
		   pwd_t: "密码",
		   username: username + magicString + password + magicString + "12"
	       },
	       function(data) {
		   $.get("http://its.pku.edu.cn/netportal/ipgwopen", function(data) {
		       console.log("connect " + fwrd);
		       $("#status").html("free connection");
		       // TODO add something to capture errors
		       // like this: $(data).find(table"[exp]")
		   });
	       });
    }
    else if ("global" == fwrd) {
	// jquery ajax post method
	$.post("http://its.pku.edu.cn/cas/login", 
	       {
		   username1: username,
		   password: password,
		   fwrd: "free",
		   pwd_t: "密码",
		   username: username + magicString + password + magicString + "12"
	       },
	       function(data) {
		   $.get("http://its.pku.edu.cn/netportal/ipgwopenall", function(data) {
		       console.log("connect " + fwrd);
		       $("#status").html("global connection");
		       // TODO add something to capture errors
		       // like this: $(data).find(table"[exp]")
		   });
	       });
    }
}

$(document).ready(function () {
    $("#connectFree").click(connectFree);

    $("#connectGlobal").click(connectGlobal);
    
    $("#info").click(function() {
	console.log("status");
	chrome.tabs.query({status: "loading"}, function(tabs) {
	    console.log(tabs.length);
	    /*
	      for (var i in tabs)
	      console.log(tabs[i].url);
	    */
	})
    });

    /*
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      //console.log(changeInfo.status + " " + tab.url);
      if ("loading" == changeInfo.status) {
      console.log(">>>" + tab.url + " " + changeInfo.status);
      //connect("global");
      console.log("<<<")
      }
      else if ("complete" == changeInfo.status){
      console.log(">>>" + tab.url + " " + changeInfo.status);
      //connect("free");
      console.log("<<<");
      }
      });
    */

    chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	console.log("before navigate: " + details.url);
	//connect("global");
    });

    chrome.webNavigation.onCompleted.addListener(function(details) {
	console.log("completed: " + details.url);
	//connect("free");
    });
});
