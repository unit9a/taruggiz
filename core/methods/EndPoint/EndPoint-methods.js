
model.EndPoint.entityMethods.EnableWorker = function(state) {
    //start worker or any external code
    var endPointError = {
        name: 'EndPoint: Enabling Worker'
    };
    
    if (!this.worker) {
		endPointError.message = 'EndPoint worker is falsy';
		throw endPointError;
    }
    
    var workerMethod = (state === true) ? 'Start' : 'Stop';
    var result = this.worker[workerMethod](this);
    
	if (result.error) {
		endPointError.message = 'Worker falied to: ' + workerMethod;
		endPointError.error = result.error;
        this.state = endPointError.message;
    	this.save();
	}
	else{
		this.state = 'Worker started';
    	this.save();
		//if started properly, update endpoint directory
		ds.EndPoint.UpdateDir(this);
	}
	
    return result;
};

model.EndPoint.entityMethods.Connect = function(connector) {
    return this.worker.plugin.Module().taruConnect({
    	connector: connector,
    	endPoint: this
    });
};

model.EndPoint.entityMethods.Handle = function(connector, endpoint) {
    return this.worker.plugin.Module().WorkerMain({
    	connector: connector,
    	endPoint: this
    });
};

model.EndPoint.entityMethods.Plugin = function(connector, endpoint) {
    return this.worker.plugin.Module();
};

model.EndPoint.methods.UpdateDir = function(endPoint) {
    var endPointError = {
    	error: true,
        name: 'Application EndPoint Directory'
    };
		console.log('endPoint');
		console.log(endPoint.getDataClass().getName());
		//console.log(ds.EndPoint(endPoint.ID).getDataClass().getName());
		
	if (!(ds.EndPoint.getName() == endPoint.getDataClass().getName()) || !endPoint.ID) {
		endPointError.message = 'EndPoint worker is falsy';
		endPointError.error = endPoint.ID;
		console.log(endPointError);
		throw endPointError;
	}
	
    if (!endPoint.protocol || !endPoint.worker) {
    	endPointError.message = 'endpoint protocol or worker is falsy';
        throw endPointError;
    }
    
    if ( !application.EndPointDir ) {
    	application.EndPointDir = {};
    }

    if (!EndPointDir[endPoint.protocol]) {
        EndPointDir[endPoint.protocol] = {
            origins: {},
            sources: {},
            createdBy: endPoint.ID,
            timeStamp: new Date()
        }
        /* 
        Note: the reason "sources" is not a member of "origins"
			is in case of multiple aliases per origin. This avoids
			managing dulicate "sources" objects per allowedOrigin.
        */
    }
    return true;
};



model.EndPoint.entityMethods.RegisterConnector = function(connector) {
    var protocol = this.protocol,
        extrnOrigin = connector.extrnOrigin,
        extrnSource = connector.extrnSource;

    if (!extrnOrigin || !extrnSource) {
        return false;
    }

    if (ds.EndPoint.UpdateDir(this).error) {
        return false;
    }

    var origins = EndPointDir[protocol].origins;
    if (!origins[extrnOrigin]) {
        origins[extrnOrigin] = {
            count: 0,
            createdBy: connector.ID,
            time: new Date()
        }
        EndPointDir[protocol].origins[extrnOrigin] = origins[extrnOrigin];
    }

    var sources = EndPointDir[protocol].sources;
    if (!sources[extrnSource]) {
        sources[extrnSource] = connector.ID
        EndPointDir[protocol].sources[extrnSource] = sources[extrnSource];
    }
    return true;

};

model.EndPoint.entityMethods.FindWorker = function(params) {
	
	if (!this.worker) {
		var matchingWorker = ds.SystemWorker.find(
			'protocol == :1', this.protocol || params.protocol
		);
		
		if (!matchingWorker) {
			var newWorker = ds.Plugin.CreateWorker({ protocol: this.protocol });
			
			if ( newWorker && !newWorker.error ) {
				matchingWorker = newWorker;
			}
			else if ( newWorker.error ) {
				return newWorker ;
			}
			else {
				return false;
			}
			
		}
		
		this.worker = matchingWorker;
		this.save();
		return matchingWorker;
	}	
}
