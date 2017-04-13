/*	main taruggiz service
*/
var serviceFile = new File(module.filename);
var taruCore = require('taruCore');
var taruSubProcessManager = new SharedWorker( './taruProcessManager', 'taruSubProcessManager' );
// 0 init crypto sub thread with a system worker

// 1 init class dictionaries with taruCore

// 2 start dataStore service

// 3 load dictionaries into respective classes

// 4 run a light test - one entiry per class

/* 5 init critical sub processes(threads and services)
	a - host hardware abstaction with node.js and cylon.js...
	b - https Restful service
	c - websockets service
*/

exports.postMessage = function(message) {
    console.log("taruService file got message %o is starting", message);
    //var handlerFile = new File(serviceFile.parent, "./handlers.js");
    
    switch(message.name){
        case "applicationWillStart":
            console.log("taruService file %s got the application start signal", module.filename);
            
            /* 0 init crypto sub thread with a system worker
                1 - user node's builtin crpyto lib
                2 - if that does not work use openssl command line with system worker
            */
            taruSubProcessManager.init();

            // get all enabled sub process
            var enabledSubProcesses = ds.SubProcess
            var report = taruSubProcessManager.start(enabledSubProcesses);
            console.log("ds subprocesses %o ", report);
           

		// 1 init class dictionaries with taruCore

		// 2 start dataStore service
            
            break;
        case "'catalogDidReload":
            console.log("taruService file %s got DB start signal", module.filename);
            break;
    }
}
