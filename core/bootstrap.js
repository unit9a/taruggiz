application['ActivePlugins'] = {};
application['EndPointDir'] = {
	GateKeeper: function (protocol, origin, source){
		
		if (!EndPointDir[protocol]){
			return false;
		}
		
		var originsDir = EndPointDir[protocol].origins;
		if (!originsDir[origin]){
			if(!SecParams.noresponse){
				return false; // TODO:: cahnge to a HTTP code with relevant message
			}
		}
		else{
			EndPointDir[protocol].origins[origin].count++;
		}
		
		var soucesDir = EndPointDir[protocol].sources;
		if (!soucesDir[source]){
			if(!SecParams.noresponse){
				return false; // TODO:: cahnge to a HTTP code with relevant message
			}
		}
		return soucesDir[source];
	}
};
application['SecParams'] = {};
// load defualt plugins

LoadDefaultPlugins = function() {
	
	function LoadDefault (protocol, fileName){
		var foundPluginInstance = ds.Plugin.find(
			'fileName == :1', fileName
		);
		if (!foundPluginInstance) {
			var commonJSModule = ds.Plugin.LoadCommonJS( fileName );
			if(  !ds.Plugin.CheckTaruInfo( commonJSModule, fileName ).error ) {
				var newPlugin = new ds.Plugin({
					fileName: fileName,
					dateAdded: new Date(),
					enabled: true,
					taruInfo: commonJSModule.taruInfo,
					protocol: protocol,
					sourceUser: 'serverDefault'
				});
				newPlugin.save();
				newPlugin.GenerateWorkers();
			}
			else{
				throw {error: 'could not load default module:' + fileName};
			}
		}
		else{
			foundPluginInstance.GenerateWorkers();
		}
		
	}
	
	LoadDefault ('http', 'defaultHTTP');
	LoadDefault ('websocket', 'defaultWebSocket');
}
//ds.Plugin.LoadCommonJS('defaultHTTP');
//ActivePlugins;
//console.log('fileName::: defaultHTTP, require(fileName) %s', ds.Plugin.LoadCommonJS('defaultHTTP').taruInfo);

LoadDefaultPlugins();
ds.Account.StartAllAccounts();
debugger
ActivePlugins