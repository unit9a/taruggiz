model.Connector.entityMethods.Setup = function() {
    var setupErrors = {
        error: true,
        name: 'Connector: Setup failed'
    };
    if (!this.plugin || !ds.Plugin.find("ID == :1", this.plugin.ID)) {
        setupErrors.plugin = '"plugin" property is falsy or not found';
    }

    if (setupErrors.plugin) {
        setupErrors.message = 'Conector ' + this.ID + '>> ' + setupErrors.plugin;
        setupErrors.connectorID = this.ID;
        console.log(JSON.stringify(setupErrors));

        ds.Connector(this.ID).remove();
        return setupErrors;
    }

    var endPointType = this.plugin.taruInfo.connection.protocol;
    var matchingEndpoint = this.account.endPoints.find('worker.plugin.taruInfo.connection.protocol == :1', endPointType);
    var matchingWorker = ds.Plugin.FindWorker({
        protocol: endPointType
    });

    if (matchingWorker.error) {
        setupErrors.message = 'Error assigning system worker to EndPoint';
        setupErrors.error = matchingWorker.error;
        return setupErrors
    }

    if (!matchingEndpoint) {
        matchingEndpoint = new ds.EndPoint({
            account: this.account,
            enabled: true,
            protocol: endPointType,
            worker: matchingWorker
        });
    }
    else {
        matchingEndpoint.worker = matchingWorker;
    }
    matchingEndpoint.save();
    this.endPoint = matchingEndpoint;
    this.save();
    return matchingEndpoint;
}

model.Connector.entityMethods.Start = function() {
    var startupWorker, accessAttempt;
    var startupErrors = {
        name: 'Connector: Startup failed'
    };
    var setupResult = this.Setup();

    if (setupResult.error) {
        startupErrors.message = 'start up connetor failed';
        startupErrors.error = setupResult.error;
        return startupErrors;
    }

    startupWorker = this.endPoint.EnableWorker(true);
    if (!startupWorker || startupWorker.error) {
        startupErrors.message = 'Connentor endpoint could not start worker';
        startupErrors.error = startupWorker.error;
        return startupErrors;
    };

    accessAttempt = this.plugin.Module().taruConnect({
        connector: this,
        config: this.config,
        state: this.state
    });

    if (accessAttempt.newConfig) {
        this.config = accessAttempt.newConfig;
        this.state = accessAttempt.state || {};

        var newState = this.state;
        newState.status = 'NotConnected';
        newState.display = this.config.uiDisplay;
        this.state = newState;

        this.save();
        return this.state;
    }

    if (accessAttempt.origin && accessAttempt.source) {
        this.config = accessAttempt.config;
        this.extrnOrigin = accessAttempt.origin;
        this.extrnSource = accessAttempt.source;
        this.save();

        return this.endPoint.RegisterConnector(this);
    }
};

model.Connector.collectionMethods.StartAll = function() {
    this.forEach(function(connector) {
        connector.Start();
    });
};

model.Connector.entityMethods.createAddress = function(params) {
    return this.endPoint.worker.plugin.Module().createAddress(this, params);
};
model.Connector.entityMethods.removeAddress = function(params) {
    return this.endPoint.worker.plugin.Module().removeAddress(this, params);
};