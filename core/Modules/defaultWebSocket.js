/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('temp').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/
exports.taruInfo = {
	name: 'testmodual',
	version:'0.01',
	docs: 'none',
	worker: true,
	connection:{
		type: 'ajax',
		protocol: 'websocket'
	}
};

exports.taruConnect = {
	
};

exports.taruParse = {
	
};

exports.StartWorker = function (endPointEntity) {
	if (!endPointEntity.ID)
	{
		return 'no endPointEntity ID';
	}
	endPointEntity.config.uri = endPointEntity.ID + '/st' + OAuth.ClientID;
	endPointEntity.save();

	addHttpRequestHandler('(?i)^/' + endPointEntity.config.uri + '$', 'Modules/defaultHTTP.js', 'main');

	return "STARTED endPoint: " + endPointEntity.ID;
};

exports.StopWorker = function (endPointEntity) {
	if (!endPointEntity.ID)
	{
		return 'no endPointEntity';
	}

	removeHttpRequestHandler('(?i)^/' + endPointEntity.ID + '$', 'Modules/defaultHTTP.js', 'main');

	return "STOPPED endPoint: " + endPointEntity.ID;
};