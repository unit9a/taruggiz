model.Account.entityMethods.AddPlugin = function(fileName) {
   	// check if the system already has the plugin, if not add it
   	// then add connector
   	
   	var installation = ds.Plugin.find('fileName == :1', fileName);
	if ( !installation ) {
			installation = ds.Plugin.Install(fileName, this.user);
	}
	else{
		installation = {
        log: ['attempting to ReInstall: ' + fileName],
        add: function(string) {
            this.log.push(string);
        },
        plugin: installation
    };
	}
	
	if ( installation.plugin.taruInfo.connector ) {
		var connectorInfo = installation.plugin.taruInfo.connection;
		var foundConnector = this.connectors.find(
			'plugin.taruInfo.connector == :1 && plugin.taruInfo.conection.protocol == :2',
			true, connectorInfo.protocol
		);
		
		if( foundConnector ){ 
			try {
				foundConnector.remove();
				installation.add('current connector removed');
			}
			catch (err) {
				installation.add('ERROR: failed to remove current connector');
			}
		}
	 	var newConnector = new ds.ExternalConnector({
	    	account: this,
	    	enable: true,
	    	plugin: installation.plugin
	    });
	    newConnector.save();
		installation.add('new connector added');
	   
	    if ( newConnector.GetEndPoint({}) ){
	    	installation.add('endPoint assigned');
	    }
	    else {
	    	installation.add('endPoint not assigned');
	    };
	    
   	debugger;
	    newConnector.Start();
		installation.add('new connector started');
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

model.Account.entityMethods.GetConnectorDetails = function(fileName) {
   	var foundAdapter = this.connections.find('fileName == :1', fileName);
	 if (!foundAdapter ) {
	 	return {error: 'not found'};
    }
    else {
		if (!foundAdapter.meta) {
			foundAdapter.Start();
		}
    	return foundAdapter.meta;
    }
};
model.Account.entityMethods.GetConnectorDetails.scope = "public";

model.Account.entityMethods.GetEndPoint = function(endPointType) {
	if(!endPointType){
		return false;
	}
	
	var existingEndpoint = this.endPoints.find('protocol == :1', endPointType);
	
	if (!existingEndpoint) {
		var existingWorker = ds.SystemWorker.find(
			'protocol == :1', endPointType
		);
		
		if (!existingWorker) {
			//throw {taruError: "Unsupported Adapter type: " + endPointType};
			return false;
		}
		else{
			
			var newEndPoint = new ds.EndPoint({
				enabled: true,
		    	protocol: endPointType,
		    	worker: existingWorker
			});
			newEndPoint.save();
			
			newEndPoint.EnableService(true);
			return newEndPoint;
		}
	}
	
	existingEndpoint.EnableService(true);
	return existingEndpoint;
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
