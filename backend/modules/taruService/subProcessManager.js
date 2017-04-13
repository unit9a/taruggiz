 var processManager = function() {
     this.sharedWorker = null ;
 };

 processManager.prototype.init = function( path, workerID) {
     this.sharedWorker = new SharedWorker( path, workerID);;
 };

 processManager.prototype.spawn = function(params) {
    var moduleMap = {
		"cylon": ''
	};
	
	var workerThread = (function (){
		var launchers = {
			'nodejs': new NodeWorker(
					moduleMap[params.module]
					, params.module + '-' + params.name
			)
			,'systemWorker'
			,'wakandaWorker'
		};
		return launchers[params.type];
	})();
    var myWork
    //console.log('buz!');
 };


 exports = new processManager();
