
model.SubProcess.entityMethods.GetInfo = function() {
	/* return object with:
	init date
	nubmer of child nodes
	time of last update
	*/
	return {};
};
model.SubProcess.entityMethods.Log = function() {
	/* add a transation record to log class 
	for ANY updates to this or it's children
	*/
};

model.SubProcess.entityMethods.startWorker = function() {
	
	var moduleMap = {
		"cylon": ''
	};
	
	var workerThread = (function (){
		var launchers = {
			'nodejs': new NodeWorker( moduleMap[this.module], this.module + '-' + this.name)
			
		};
		return launchers[this.type];
	})();
    var myWorkerProxy = new NodeWorker( './worker.js', 'my-worker-id' );

};