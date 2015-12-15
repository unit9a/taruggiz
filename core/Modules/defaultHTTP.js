/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('temp').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/
exports.taruInfo = {
	name: 'default:HTTP',
	version:'0.01',
	docs: 'none',
	worker: true,
	connection:{
		type: 'ajax',
		protocol: 'http'
	}
};


exports.taruConnect = function (endPointEntity) {}

exports.StartWorker = function (endPointEntity) {
	if (!endPointEntity.ID)
	{
		return 'no endPointEntity ID';
	}

	addHttpRequestHandler('(?i)^/' + endPointEntity.ID + '$', 'Modules/' + endPointEntity.fileName + '.js', 'main');

	return "STARTED endPoint: " + endPointEntity.ID;
};

exports.StopWorker = function (endPointEntity) {
	if (!endPointEntity.ID)
	{
		return 'no endPointEntity';
	}

	removeHttpRequestHandler('(?i)^/' + endPointEntity.ID + '$', 'Modules/' + endPointEntity.fileName + '.js', 'main');

	return "STOPPED endPoint: " + endPointEntity.ID;
};

function main(request,response) {
	var origin = request.headers.host,
	source = exports.taruInfo.protocol;
	
	var connectorID = EndPointDir.GateKeeper( exports.taruInfo.protocol, origin, source);
	if (!connectorID) {
		
		if(!SecParams.noresponse){
			return false; // TODO:: cahnge to a HTTP code with relevant message
		}
	}
}