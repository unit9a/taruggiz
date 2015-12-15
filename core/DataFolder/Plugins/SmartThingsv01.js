/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('temp').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/
var OAuth = {
	ClientID : 'e416b93a-c853-45b1-a6d0-446c69be5de2',
	ClientSecret : '2aa0df48-06af-4c16-abfb-451a72e5c8e7'
};
var baseURL = 'https://graph.api.smartthings.com';


exports.taruInfo = {
	name: 'SmartThings',
	version:'0.01',
	docs: 'none',
	connector: true,
	connection:{
		type: 'ajax',
		protocol: 'http'
	}
};

exports.taruConnect =  function (config, connectionAdapter) {
		
	function requestAuthorizationCode (redirectUri) {
		var xhr, headers, result, resultObj, URLText, URLJson;
		var headersObj = {};

		URLText = baseURL + '/oauth/authorize?' 
			+ 'response_type=code'
			+ '&client_id=' + OAuth.ClientID
			+ '&scope=app' 
			+ '&redirect_uri=' + encodeURIComponent(redirectUri)
		;


		xhr = new XMLHttpRequest(); // instanciate the xhr object
		// you could pass a proxy parameter if you do not want to use your default proxy settings

		xhr.onreadystatechange = function() { // event handler
			var state = this.readyState;
			if (state !== 4) { // while the status event is not Done we continue
				return;
			}
			var headers = this.getAllResponseHeaders(); //get the headers of the response
			var result = this.responseText;  //get the contents of the response
			var headersArray = headers.split('\n'); // split and format the headers string in an array
			headersArray.forEach(function(header, index, headersArray) {
			 var name, indexSeparator, value;

			if (header.indexOf('HTTP/1.1') === 0) { // this is not a header but a status          
			     return; // filter it
			 }

			indexSeparator = header.indexOf(':'); 
			name = header.substr(0,indexSeparator);
			if (name === "") {
			    return;
			}
			value = header.substr(indexSeparator + 1).trim(); // clean up the header attribute
			headersObj[name] = value; // fills an object with the headers
			});
			if (headersObj['Content-Type'] && headersObj['Content-Type'].indexOf('json') !== -1) {  
			     // JSON response, parse it as objects
			 resultObj = JSON.parse(result);
			} else { // not JSON, return text
			 resultTxt = result;
			}
		};

		xhr.open('GET', URLText); // to connect to a Web site
		xhr.send(); // send the request
		statusLine = xhr.status + ' ' + xhr.statusText; // get the status

		// we build the following object to display the responses in the code editor
		return {
			URLText: URLText,
			statusLine: statusLine,
			headers: headersObj,
			result: resultObj || resultTxt
		};
	}

	if (!config.step2 || !config.step3 || !config.step4) {
		var URLText = baseURL + '/oauth/authorize?' 
			+ 'response_type=code'
			+ '&client_id=' + OAuth.ClientID
			+ '&scope=app' 
			+ '&redirect_uri=' + encodeURIComponent(redirectUri)
		;
		return {
			html: "<a href=" + URLText + ">Connect to SmartThings</a>"
		};

	}
	else{
		return {html:'error from common.js file'};
	}
	
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

function main(request,response) {
	if (!endPointEntity) {
		return "endPointEntity is null";
	};

	return {
		request: request,
		response: response
	};
}