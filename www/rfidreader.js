/*global cordova, module*/

myPlugin =  {
	retryCount: 0,
	readSuccessCallback: function(message) {
		myPlugin.successCallback(message);
		myPlugin.retryCount = 0;
	},
	readErrorCallback: function(message) {
		if (myPlugin.retryCount < myPlugin.retryMax) {
			myPlugin.retryCount++;
			// nochmal ausführen
			cordova.exec(myPlugin.readSuccessCallback, myPlugin.readErrorCallback, "RfidReader", "readTag", myPlugin.args);
		} else {
			myPlugin.errorCallback(message);
			myPlugin.retryCount = 0;
		}
	},
	inventorySuccessCallback: function() {
		//wenn hier ein erfolgreicher callback gemacht wurde, addiere den counter von diesem epc im jsonarray auf +1 und wiederhole den scanvorgang so lange wie eingestellt
	},
	inventoryErrorCallback: function() {
		//ändere nichts im json array setze den retrycounter auf +1 und wiederhole den vorgang so lange wie eingestellt
	},
	inventoryAddResults: function() {
		//wenn alle durchläufe beendet sind gebe diese an die app weiter und setze den counter wieder auf 0
	}
};

module.exports = {
	echo: function (args, successCallback, errorCallback) {
		if (!Array.isArray(args)) args = [args];
		cordova.exec(successCallback, errorCallback, "RfidReader", "echo", args);
	},
	startRfidListener: function (args, successCallback, errorCallback) {
		if (!Array.isArray(args)) args = [args];
		cordova.exec(successCallback, errorCallback, "RfidReader", "startRfidListener", args);
	},
	endRfidListener: function (args, successCallback, errorCallback) {
		if (!Array.isArray(args)) args = [args];
		cordova.exec(successCallback, errorCallback, "RfidReader", "endRfidListener", args);
	},
	scanInventory: function (args, successCallback, errorCallback) {
		if (!Array.isArray(args)) args = [args];
		cordova.exec(myPlugin.inventorySuccessCallback, errorCallback, "RfidReader", "scanInventory", args);
	},
	readTag: function (args, successCallback, errorCallback) {
		if (!Array.isArray(args)) args = [args];
		myPlugin.retryMax = Math.max(1,parseInt(args[0].retries));
		myPlugin.args = args;
		myPlugin.successCallback = successCallback;
		myPlugin.errorCallback = errorCallback;
		//cordova.exec(successCallback, errorCallback, "RfidReader", "readTag", args);
		cordova.exec(myPlugin.readSuccessCallback, myPlugin.readErrorCallback, "RfidReader", "readTag", args);
	},
	writeTag: function (args, successCallback, errorCallback) {
		if (!Array.isArray(args)) args = [args];
		cordova.exec(successCallback, errorCallback, "RfidReader", "writeTag", args);
	}
};
