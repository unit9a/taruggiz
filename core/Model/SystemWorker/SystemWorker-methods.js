

model.SystemWorker.entityMethods.Start = function(endPoint) {
	this.plugin.Module().StartWorker(endPoint);
};

model.SystemWorker.entityMethods.Stop = function(endPoint) {
	this.plugin.Module().StartWorker(endPoint);
};
