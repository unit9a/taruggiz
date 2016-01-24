/*	this common.js module communicates with the smarthings platform
doc link: http://docs.smartthings.com/en/latest/smartapp-web-services-developers-guide/authorization.html

*/
//var exports ={};
var xhr = new XMLHttpRequest(); // instanciate the xhr object
var ParseAllResponseHeaders = function(headers) {
	var headersArray = headers.split('\n');
	var headersObj = {};

	headersArray.forEach(function(header, index, headersArray) {
		var name, indexSeparator, value;

		if (header.indexOf('HTTP/1.1') === 0) { // this is not a header but a status          
		return; // filter it
		}

		indexSeparator = header.indexOf(':'); 
		name = header.substr(0,indexSeparator);
		if (name === "") {
		return; // filter null values
		}
		value = header.substr(indexSeparator + 1).trim(); // clean up the header attribute
		headersObj[name] = value; // fills an object with the headers
	});

	return headersObj;
};


var OAuth = {
	baseURL: 'https://graph.api.smartthings.com',
	clientID : 'e416b93a-c853-45b1-a6d0-446c69be5de2',
	clientSecret : '2aa0df48-06af-4c16-abfb-451a72e5c8e7',
	ParseResponseResult: function( headers, responseString) {
		if (headers['Content-Type'] && headers['Content-Type'].indexOf('json') !== -1) {  
			 try {
				return JSON.parse(responseString);
			 } catch (e) {
				throw {
					name: 'Expected Valid JSON',
					error: e,
					raw: responseString
				};
			 }
		} else { // no JSON, return text
			throw {
				name: 'Content-Type is not JSON',
				error: e,
				raw: responseString
			};
		}
	},
	GenAuthCodeLink: function( params) {
		if (!params.address) {
			throw {
				name: 'missing property',
				message: '"address" not found or empty',
				input: params
			};
		}

		return this.baseURL + '/oauth/authorize?' 
			+ 'response_type=code'
			+ '&client_id=' + this.clientID
			+ '&scope=app' 
			+ '&redirect_uri=' + encodeURIComponent(params.address + '/OAuth' )
		;
	},
	GetAccessToken: function( params) {
		var tokenRequest = this.baseURL + '/oauth/authorize?' 
			+ 'grant_type=authorization_code'
			+ '&code=' + params.endPoint.config.oauth.authCode
			+ '&client_id=' + this.clientID
			+ '&client_secret='  + this.clientSecret
			+ '&redirect_uri=' + encodeURIComponent(params.endPoint.fullAddress + '/OAuth' )
		;

		xhr.onreadystatechange = function() {
			var headers = ParseAllResponseHeaders(this.getAllResponseHeaders());
			var resultObj = ParseResponseResult(headers, this.responseText);
			resultObj.timeRecieved = new Date().getTime() / 1000;

			var requiredParams = ['access_token', 'expires_in', 'token_type'];
			var missingParams = [];
			requiredParams.forEach(function(param) {
				if (!resultObj.hasOwnProperty(param)) {
					//|| resultObj[param] === null || resultObj[param] === ''
					missingParams.push(param);
				}
			});

			if (missingParams.length){
				throw {
					name: 'missing keys',
					e: 'not found: ' + missingParams.toString(),
					raw: resultObj
				};
			} else {
				return resultObj
			}

		};

		xhr.open('GET', tokenRequest);

		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send();
	},

	GetEndpointURI: function() {},
	RestCall: function() {}

};


exports.taruInfo = ( function () {
	return {
		name: 'SmartThings',
		version:'0.01',
		docs: 'none',
		connector: true,
		connection:{
			type: 'ajax',
			protocol: 'http'
		}
	}
}());


exports.taruConnect =  function ( params ) {
	debugger;
	var endPoint = params.endPoint;
	var config = params.connector.config || {};

	config.auth = (config.auth)? !config.auth: {};

	if (!config.auth.access_token || !config.auth.expires_in) {
		
		return {
			newConfig: {
				getExternalAuth: {
					uiDisplay: {
						link: {
							text: 'Connect to SmartThings',
							ref: OAuth.GenAuthCodeLink({ address: endPoint.fullAddress})
						}
					},
					createEndPoint: {
						address: 'OAuth',
						handler: 'OAuth'
						//file: optionsal
					}
				}
			}
			
			//html: "<a href=" + URLText + ">Connect to SmartThings</a>"
		};

	}
	else {
		var expiredToken = (config.auth.timeRecieved + config.auth.expires_in) < new Date().getTime() / 1000;
		if (expiredToken){
			/* reconnect */
			// return
		};
		return {html:'error from common.js file'};
	}
/*
	{
		config:, // holds reconnection and auth. info like tokens 
		origin:, // host address of server that further comunication will use 
		source:, // attcual uri 
	}
*/	
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

function OAuth(request,response) {
	var origin = request.headers.host,
	source = exports.taruInfo.protocol;
	
	
	var connectorID = EndPointDir.GateKeeper( exports.taruInfo.protocol, origin, source);
	if (!connectorID) {
		
		if(!SecParams.noresponse){
			return false; // TODO:: cahnge to a HTTP code with relevant message
		}
	}

	return {
		request: request,
		response: response
	};
}

function main(request,response) {
	if (!endPointEntity) {
		return "endPointEntity is null";
	};

	return {
		request: request,
		response: response
	};
}