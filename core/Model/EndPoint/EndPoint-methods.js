model.EndPoint.entityMethods.EnableService = function(state) {
    //start worker or any external code
    try {
        if (state === true) {
            this.status = this.worker.Start(this);
        }
        else {
            this.status = this.worker.Stop(this);
        }
    }
    catch (err) {
        this.status = "error";
        throw err;
        console.error(err);
    }
    this.save();

    //if started properly, update endpoint diretory
    if (this.status != "error") {
        ds.EndPoint.UpdateDir(this);
    }

};

model.EndPoint.entityMethods.Connect = function(connector) {
    return this.worker.Module().taruConnect(connector, this);
};

model.EndPoint.entityMethods.Handle = function(connector, endpoint) {
    return this.worker.Module().WorkerMain(connector, endpoint);
};

model.EndPoint.methods.UpdateDir = function(endPoint) {
    if (!endPoint.protocol || !endPoint.worker) {
        return false;
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



model.EndPoint.entityMethods.RegisterConnection = function(connector) {
    var protocol = this.protocol,
        extrnOrigin = connector.extrnOrigin,
        extrnSource = connector.extrnSource;

    if (!extrnOrigin || !extrnSource) {
        return false;
    }

    if (!ds.EndPoint.UpdateDir(this)) {
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