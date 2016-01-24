/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('temp').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/
//var exports = {};
exports.taruInfo = {
    name: 'default:HTTP',
    version: '0.01',
    docs: 'none',
    worker: true,
    connection: {
        type: 'ajax',
        protocol: 'http'
    }
};

var generalError = {
    name: 'Module: ' + exports.taruInfo.name
};
var publicIPAddress = '';

exports.RespHeadersToObj = function(headers) {
    debugger;
    var headersArray = headers.split('\n');
    var headersObj = {};

    headersArray.forEach(function(header, index, headersArray) {
        var name, indexSeparator, value;

        if (header.indexOf('HTTP/1.1') === 0) { // this is not a header but a status          
            return; // filter it
        }

        indexSeparator = header.indexOf(':');
        name = header.substr(0, indexSeparator);
        if (name === "") {
            return; // filter null values
        }
        value = header.substr(indexSeparator + 1).trim(); // clean up the header attribute
        headersObj[name] = value; // fills an object with the headers
    });

    return headersObj;
};

function SendXHR() {
    var xhr = new XMLHttpRequest(); // instanciate the xhr object


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

        if (missingParams.length) {
            throw {
                name: 'missing keys',
                e: 'not found: ' + missingParams.toString(),
                raw: resultObj
            };
        }
        else {
            return resultObj
        }

    };
    xhr.open('GET', tokenRequest);

    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send();

}

function GetPublicAddress() {
    var xhr, headersArray, result, resultObj = {},
        URLText, resultTxt, responceRaw;
    var headersObj = {};


    xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) {
            return;
        }
        headersObj = exports.RespHeadersToObj(this.getAllResponseHeaders()); //get the headers of the response
        var result = this.responseText; //get the contents of the response
        responceRaw = this.response;
        if (headersObj['Content-Type'] && headersObj['Content-Type'].indexOf('json') !== -1) {
            resultObj = JSON.parse(result);
        }
        else {
            resultTxt = result;
        }
    };

    xhr.open('GET', 'https://api.ipify.org', true); //?format=json
    xhr.send();

    var ipAddress = resultTxt || resultObj.ip;
    return ipAddress;

    /*
      
     //we build the following object to display the responses in the code editor

    return {
        responceRaw: responceRaw,
        headersArray: headersArray,
        URLText: URLText,
        statusLine: xhr.status + ' ' + xhr.statusText,
        headers: headersObj,
        result: resultObj || resultTxt
    };
    */
}

function main(request, response) {
    var origin = request.headers.host,
        source = exports.taruInfo.protocol;

    var connectorID = EndPointDir.GateKeeper(exports.taruInfo.protocol, origin, source);
    if (!connectorID) {

        if (!SecParams.noresponse) {
            return false; // TODO:: cahnge to a HTTP code with relevant message
        }
    }
}

exports.newConnection = function(params) {
    if (!params.type || params.type != exports.taruInfo.connection.protocol) {
        return false;
    }
    return new XMLHttpRequest();
};

exports.createAddress = function(connector, params) {
    if (!connector || !connector.ID) {
        generalError.message = 'connector is falsy or has no "ID"';
        throw generalError;
    }
    else if (!params.address || !params.func) {
        generalError.message = '"address" or "func" are null or falsy';
        return {
            error: generalError
        };
    }

    var regexString = '(?i)^/' + connector.endPoint.ID + '/';
    var addressString = '/' + connector.endPoint.ID + '/';
    var filePath = 'Modules/' + connector.plugin.fileName + '.js';

    regexString += params.regex;
    addressString += params.address;

    try {
        addHttpRequestHandler(regexString, filePath, params.func);
        return {
            regex: regexString,
            address: addressString,
            remove: function() {
                try {
                    return removeHttpRequestHandler(regexString, filePath, params.func);
                }
                catch (e) {
                    generalError.message = 'could not remove HttpRequestHandler: ' + regexString;
                    generalError.error = e;
                    return {
                        error: generalError
                    };
                }
            },
            timeCreated: new Date()
        }
    }
    catch (e) {
        generalError.message = '"address" or "func" are null or falsy';
        generalError.error = e;
        return {
            error: generalError
        };
    }
};

exports.StartWorker = function(config) {
	config = config ? config : {};
	
    if (!config.publicIPAddress) {
        var ipAddress = GetPublicAddress();
        if (!ipAddress) {
            generalError.message = 'did not get public IP of this server';
            return {
                error: generalError,
                status :"error"
            }
        }
        else {
            config.publicIPAddress = ipAddress;
        }
    }
    
    return {
    	config: config,
    	status :"STARTED"
    }
};

exports.StopWorker = function(config) {
    return {
    	config: config,
    	status :"STOPPED"
    }
};