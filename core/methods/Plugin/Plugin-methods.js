model.Plugin.methods.CheckTaruInfo = function(module, fileName) {
    var taruError = {};
    if (!module) {
        taruError.message = 'module empty';
        return {
            error: taruError
        };
    }

    if (!module.hasOwnProperty('taruInfo')) {
        taruError.message = 'taruInfo property missing or invalid in: ' + fileName;
    }
    else if (typeof module.taruInfo != 'object') {
        taruError.message = 'taruInfo property is not an object: ' + fileName;
    }
    else {

        var criticalProperties;

        if (!module.taruInfo.worker) {
            criticalProperties = ['taruConnect', 'taruParse'];
        }
        else {
            criticalProperties = ['StartWorker', 'StopWorker'];
        }

        criticalProperties.forEach(function(propertyName, index) {
            if (!module.hasOwnProperty(propertyName)) {
                if (!index) {
                    taruError.message = fileName + ' is missing properties: ';
                }
                else {
                    taruError.message += ', '
                }
                taruError.message += propertyName;
            }
        });
    }

    if (taruError.message) {
        throw taruError;
        return {
            error: taruError
        };
    }
    else {
        return {
            error: false
        };
    }
};

model.Plugin.methods.LoadCommonJS = function(fileName) {
    var taruError = {};
    if (!fileName) {
        //throw taruError;
        return {
            error: {
                message: 'No valid file name for filename'
            }
        };
    }
    
    if (!application.ActivePlugins) {
        application['ActivePlugins'] = {};
    }

    if (!application.ActivePlugins[fileName]) {
        var taruInfoCheck;

        try {
            taruInfoCheck = ds.Plugin.CheckTaruInfo(require(fileName), fileName);
        }
        catch (err) {
            taruInfoCheck = {
                error: err
            };
        }

        if (taruInfoCheck.error || !taruInfoCheck) {
            //throw taruInfoCheck;
            return taruInfoCheck;
        }
        else {
            application.ActivePlugins[fileName] = require(fileName);
        }
    }

    return application.ActivePlugins[fileName];

};
//model.Plugin.methods.LoadCommonJS.scope = "public";

model.Plugin.entityMethods.UnloadCommonJS = function() {
    if (application.ActivePlugins[this.fileName]) {
        delete application.ActivePlugins[this.fileName];
    }
    else {
        return "CommonJS module empty";
    }
};

model.Plugin.methods.Install = function(fileName, userID) {
    /*
	1-check for exisitng commonm.js file in ds.Plugin class
	1a) attmept to move file into modulas folder
	1b) if there are conflicts return error to user
	1c) else load module with 'require' function
	*/
    var procesState = {
        log: ['attempting to install: ' + fileName],
        add: function(string) {
            this.log.push(string);
        }
    };
    var uploadedModule;
    var existingPlugin;

    try {
        uploadedModule = require(File(FileSystemSync("PluginUploads"), fileName).path);
    }
    catch (err) {
        procesState.error = err;
        procesState.add('error accessing file: ' + fileName);
    }

    var taruInfoCheck = ds.Plugin.CheckTaruInfo(uploadedModule, fileName);
    if (taruInfoCheck.error) {
        return taruInfoCheck;
    }
    else {
        existingPlugin = ds.Plugin.find('taruInfo.version == :1 AND taruInfo.name == :2', uploadedModule.taruInfo.version, uploadedModule.taruInfo.name);
    }

    if (!existingPlugin) {
        var uploadedFile = null;
        try {
            uploadedFile = File(FileSystemSync("PluginUploads"), fileName)
            procesState.add('started install: ' + fileName);
        }
        catch (err) {
            procesState.error = err;
            procesState.add('failed to start install: ' + fileName);
        }
        if (uploadedFile) {
            //move file to modules folder
            try {
            	var newPathAndName = FileSystemSync("Modules").path + uploadedFile.nameNoExt + '.js';
                uploadedFile.moveTo(newPathAndName, "Overwrite");
                procesState.add('plugin added: ' + uploadedFile.nameNoExt);
            }
            catch (err) {
                if (err.error[0].errCode === 606) {
                    procesState.add('plugin file already exist');
                }
                else {
                    procesState.error = err;
                    procesState.add('plugin not added');
                }
            }

            //remove file
            try {
                uploadedFile.remove();
                if (!procesState.error) {
                    procesState.add('intall complete : ' + uploadedFile.nameNoExt);
                    fileName = uploadedFile.nameNoExt + '.js';
                }
                else {
                    procesState.add('intall aborted : ' + fileName);
                }
            }
            catch (err) {
                procesState.error = err;
                procesState.add('intall failed: could not remove temoprary: ' + fileName);
            }
        }
        console.error('procesState %o:', procesState);

        if (!procesState.error) {
            procesState.plugin = new ds.Plugin({
                fileName: fileName,
                taruInfo: uploadedModule.taruInfo,
                sourceUser: userID,
                dateAdded: new Date(),
                enabled: true
            });
            if (uploadedModule.taruInfo.service) {
                procesState.plugin.serviceType = uploadedModule.taruInfo.service;
            }
            procesState.plugin.save();
            procesState.plugin.GenerateWorkers();
        }
        else {
            //console.log('file not added');
            procesState.plugin = existingPlugin;
        }
    }
    else {
        procesState.add('plugin already installed: ' + fileName);
        procesState.plugin = existingPlugin;
    }

    ds.Plugin.LoadCommonJS(procesState.plugin.file);

    return procesState;
};


model.Plugin.entityMethods.Uninstall = function() {
    var result;
    var name = this.fileName;

    try {
        this.UnloadCommonJS();
        var moduleFile = File(FileSystemSync("PluginUploads"), this.fileName);
        moduleFile.remove();
        result = name + " uninstalled successfully.";
    }
    catch (err) {
        result = name + " uninstalled failed.";
        throw err;
    }

    return result;
};


model.Plugin.entityMethods.Module = function() {
    var loadedModule;
    
    if (!application.ActivePlugins || !application.ActivePlugins[this.fileName]) {
        loadedModule = ds.Plugin.LoadCommonJS(this.fileName)
    }
    else{
    	loadedModule = application.ActivePlugins[this.fileName];
    }

    if (!loadedModule) {
        throw {message: 'can not load commonJS module'};
    }

    // set timer to remove common js file from memory if it is not being used infrequent
    setTimeout(this.UnloadCommonJS, this.idleTime);
    return loadedModule;
};



model.Plugin.methods.ListPlugins = function() {
    return ds.Plugin.query('protocol != ""').toArray('taruInfo');
};
model.Plugin.methods.ListPlugins.scope = "public";

model.Plugin.entityMethods.GenerateWorkers = function() {
    var worker = this.taruInfo.worker;
    if (!worker) {
        return {
            error: 'no worker object found'
        };
    }
    
    var exisitingWorker = this.workers.find('plugin.taruInfo.connection.protocol == :1', this.taruInfo.connection.protocol)
    if (exisitingWorker) {
        exisitingWorker.remove();
    }

    var newWorker = new ds.SystemWorker({
        protocol: this.taruInfo.connection.protocol,
        plugin: this,
        enabled: true
    });
    newWorker.save();
    
    return newWorker;
};

model.Plugin.methods.FindWorker = function(params) {
	if (!params.protocol) {
		throw {
			name: 'missing parameter',
			message: '"protocol" property not provided or is falsy',
			input: params
		};
	}
	var foundPlugin = ds.Plugin.find('taruInfo.worker == :1 AND taruInfo.connection.protocol ==  :2', true, params.protocol);
	if ( foundPlugin ) {
		var existingWorker = foundPlugin.workers.find('protocol ==  :1', params.protocol);
		
		if (existingWorker) {
			return existingWorker;
		}
		
		var newWorker = new ds.SystemWorker({
	        protocol: foundPlugin.taruInfo.connection.protocol,
	        plugin: foundPlugin,
	        enabled: true
	    });
	    newWorker.save();
	    return newWorker;
	}
	else{
		return {
			error:{
				name:'Plugin: FindWorker',
				message: 'No plugin found for protcol',
				input: params.protocol
			}
		};
	}
}