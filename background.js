/*
  eduConnector
  backgrounds.js
*/

var data = Data.createNew();
var school = "";
var connector = {};

// Add some event listeners
chrome.runtime.onInstalled.addListener(onInstalled);

// Initialization
chrome.browserAction.setIcon({path:"picture/disconnect.ico"});
chrome.storage.sync.get(data, onLoaded);

// Callback funtions
function onLoaded(items) {
    school = items.statusInfo.defaultSchool;

    switch (school) {
    case "PKU":
	console.log("PKU");
	chrome.browserAction.setPopup({popup: "PKU_popup.html"});
	connector = PKUConnector.createNew();
	connector.initialize();
	break;
    case "BJMU":
	// TODO
	break;
    }
}

function onInstalled() {
    chrome.tabs.create({
	url: "options.html",
	active: true
    });
}
