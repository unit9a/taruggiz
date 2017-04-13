function createSubProcess() {
    var newProcess = new ds.SubProcess({
        type: 'nodejs',
        name: 'philips hue',
    	module: 'cylon'
    });
    newProcess.save(); // save the entity
}
