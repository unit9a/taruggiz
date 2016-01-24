model.Account.entityMethods.AddPlugin = function(fileName) {
   	// check if the system already has the plugin, if not add it
   	// then add connector
   	var installation = ds.Plugin.find('fileName == :1', fileName);
	if ( !installation ) {
			installation = ds.Plugin.Install(fileName, this.user);
	}
	else{
		installation = {
	        log: ['attempting to Reinstall: ' + fileName],
	        add: function(string) {
	            this.log.push(string);
	        },
	        plugin: installation
	    };
	}
	
	if ( installation.plugin.taruInfo.connector ) {
		var connectorInfo = installation.plugin.taruInfo.connection;
		
		var foundConnectors = this.connectors.query(
			'plugin.taruInfo.name == :1 and plugin.taruInfo.version == :2',
			 installation.plugin.taruInfo.name, installation.plugin.taruInfo.version
		);
		
		if( foundConnectors.length ){ 
			try {
				foundConnectors.forEach(function(connectorEntity){
					connectorEntity.plugin = installation.plugin;
					connectorEntity.save();
					installation.add('connector: ' + connectorEntity.ID +' updated');
				});
			}
			catch (err) {
				installation.add('ERROR: failed to update exisiting current connector');
			}
		}
		else{
			try {
				var newConnector = this.SetupConnector(installation.plugin);
				installation.add('new connector added :' + newConnector.ID);
			}
			catch (e) {
				installation.add('ERROR:' + JSON.stringify(e));
			}
		}
	}
	else{
		installation.add('plugin is not a connector');
	}

    if (installation.plugin){
    	delete installation.plugin;
    }
    if (installation.add){
    	delete installation.add;
    }
    return installation;
};
model.Account.entityMethods.AddPlugin.scope = "public";

model.Account.entityMethods.GetConnectorDetails = function(nameAttribute) {
   	var foundConnector = this.connectors.find('name == :1', nameAttribute);
	 if (!foundConnector ) {
	 	return {error: 'not found'};
    }
    else {
		if (!foundConnector.state) {
			return { display: { text: 'Begin Setup' } };
		}
    	return foundConnector.state;
    }
};
model.Account.entityMethods.GetConnectorDetails.scope = "public";

model.Account.entityMethods.ListConnectors = function() {
      return this.connectors.toArray('name, enable');
};
model.Account.entityMethods.ListConnectors.scope = "public";

model.Account.entityMethods.ResetConnector =  function(nameAttribute) {
   	var foundConnector = this.connectors.find('name == :1', nameAttribute);
	if ( !foundConnector ) {
	 	return {error: 'not found'};
    }
    else {
		foundConnector.config = {};
		foundConnector.save();
		return foundConnector.Start();
    }
};
model.Account.entityMethods.ResetConnector.scope = "public";

model.Account.entityMethods.SetupConnector = function(plugin) {
	var endPointType = plugin.taruInfo.connection.protocol;
	
	if(!endPointType){
		throw {
			name: 'missing property',
			message: '"protocol" property not found ',
			input: plugin.taruInfo.connection
		};
	}
	
	var matchingEndpoint = this.endPoints.find('worker.plugin.taruInfo.connection.protocol == :1', endPointType);
	
	if (!matchingEndpoint) {
		var matchingWorker = ds.SystemWorker.find(
			'plugin.taruInfo.connection.protocol == :1', endPointType
		);
		
		if (!matchingWorker) {
			throw {
				name: 'install error',
				message: 'plugin for connector protocol is not found'
			};
		}
		else{
			
			matchingEndpoint = new ds.EndPoint({
				account: this,
				enabled: true,
		    	protocol: endPointType,
		    	worker: matchingWorker
			});
			matchingEndpoint.save();
			//matchingEndpoint.worker = matchingWorker;
			//matchingEndpoint.connectors.add(newConnector);
		}
	}

	
	var newConnector = new ds.Connector({
    	account: this,
    	enabled: true,
    	plugin: plugin,
    	config: {},
    	state: {},
    	endPoint: matchingEndpoint
    });
	newConnector.save();
	newConnector.endPoint.EnableWorker(true);
	
	return newConnector;
};


model.Account.entityMethods.taruStart = function() {
	//this.endPoints.StartAll();
	this.connectors.StartAll();
};

model.Account.methods.StartAllAccounts = function() {
	console.log('Starting all user accounts');
	ds.Account.all().forEach(function(account){
		//TODO:: add "if account id enabled check"
		account.taruStart();
	});
	console.log('Finshed starting all user accounts');
};
