model.SystemWorker.entityMethods.Start = function() {
    if (this.enabled < 0) {
        if (this.status != 'disabled') {
            this.status = 'disabled';
            this.save();
        }
        return {
            error: {
                name: 'SystemWorker',
                message: 'worker disabled',
            }
        };
    }
    try {
        var results = this.plugin.Module().StartWorker(this.config);

        this.config = results.config ? results.config : {};
        this.status = results.status ? results.status : 'none';
        this.enabled = 1;
        this.save();
        return results;
    }
    catch (e) {
        return {
            error: {
                name: 'SystemWorker',
                message: 'error starting common.js module:' + this.plugin.fileName,
                error: e
            }
        };
    }

};

model.SystemWorker.entityMethods.Stop = function() {
    try {
        var result = this.plugin.Module().StopWorker(this.config);

        this.config = results.config ? results.config : {};
        this.status = results.status ? results.status : 'stopped';
        this.enabled = 0;
        this.save();
        return results;
    }
    catch (e) {
        return {
            error: {
                name: 'SystemWorker',
                message: 'error stopping common.js module:' + this.plugin.fileName,
                error: e
            }
        };
    }
};

model.SystemWorker.entityMethods.Reset = function() {
    this.config = {};
    this.status = 'off line';
    this.enabled = (this.enabled > 0 ) ? 0 : this.enabled;
    this.save();
};
model.SystemWorker.entityMethods.Enable = function() {
    this.enabled = 0;
    this.save();
    this.Reset();
};
model.SystemWorker.entityMethods.Disable = function() {
    this.Reset();
    this.enabled = -1;
    this.save();
};


model.SystemWorker.methods.InitAllWorkers = function() {
    console.log('SystemWorker: Resetting all workers');
    this.all().forEach(function(worker) {
        worker.Reset();

    });
    console.log('SystemWorker: Starting enabled workers');
    this.all().forEach(function(worker) {
        worker.Start();
    });
    console.log('SystemWorker: Workers Ready');
};