
model.Plugin.methods.ListConnectors = function() {
	return ds.Plugin.query('protocol != ""')
		.toArray('taruInfo');
	
};
model.Plugin.methods.ListConnectors.scope = "public";

model.ExternalConnector.entityMethods.Start = function() {
	if ( ! this.endPoint ){
		return false;
	}
	
	var accessAttempt = this.endPoint.Connect(this);
	if ( accessAttempt.newConfig ){
		this.config = accessAttempt.newConfig;
		this.save();
		
		if ( this.config.getExternalAuth ){
			return {
				display: {
					link: {
						text: 'please go to',
						ref: this.config.getExternalAuth
					}
				}
			}
		}
	}
	
	if (accessAttempt.origin && accessAttempt.source){
		this.config = accessAttempt.config;
		this.extrnOrigin = accessAttempt.origin;
		this.extrnSource = accessAttempt.source;
		this.save();
		
		return this.endPoint.RegisterConnection(this);
	}
};



model.ExternalConnector.collectionMethods.StartAll = function() {
	this.forEach( function( connector ) {
        connector.Start();
    });
};



model.ExternalConnector.entityMethods.GetEndPoint = function(params) {
	var protocol = this.plugin.taruInfo.connection.protocol;
	
	var endPoint = this.account.GetEndPoint(protocol);
	if ( endPoint ) {
		this.endPoint = endPoint;
		this.save();
	}
	
};
