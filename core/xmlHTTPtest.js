

var OAuth = {
	ClientID : 'e416b93a-c853-45b1-a6d0-446c69be5de2',
	ClientSecret : '2aa0df48-06af-4c16-abfb-451a72e5c8e7'
};
var baseURL = 'https://graph.api.smartthings.com';


function requestAuthorizationCode (redirectUri) {
	var xhr, headersArray, headers, result, resultObj, URLText, URLJson, responceRaw;
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
		responceRaw = this.response;
		 headersArray = headers.split('\n'); // split and format the headers string in an array
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
		responceRaw: responceRaw,
		headersArray: headersArray,
		URLText: URLText,
	statusLine: statusLine,
	headers: headersObj,
	result: resultObj || resultTxt
	};
}

//requestAuthorizationCode('yahoo.com');

EndPointDir;