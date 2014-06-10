/*
  PKUConnector
  PKU_popup.js
*/


var btnConnectFree;
var btnConnectGlobal;
var btnDisconnectMe;
var btnDisconnectAll;
var btnCheckCookie;
var btnChangeMode;
var background = chrome.extension.getBackgroundPage(); 
var connector = background.connector;

$(document).ready(function() {
    btnConnectFree = $("#connectFree");
    btnConnectGlobal = $("#connectGlobal");
    btnDisconnectMe = $("#disconnectMe");
    btnDisconnectAll = $("#disconnectAll");
    btnCheckCookie = $("#checkCookie");
    btnChangeMode = $("#mode");
    background = chrome.extension.getBackgroundPage(); 
    connector = background.connector;

    btnConnectFree.click(connector.connectFree);
    btnConnectGlobal.click(connector.connectGlobal);
    btnDisconnectMe.click(connector.disconnectMe);
    btnDisconnectAll.click(connector.disconnectAll);
    btnCheckCookie.click(connector.test);
    btnChangeMode.click(connector.changeMode);

    btnChangeMode.val(connector.getMode());
});
