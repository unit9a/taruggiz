

model.Connector.name.onGet = function() {
	return this.plugin.taruInfo.name + " " + this.plugin.taruInfo.version;
};