var taruCore = require('taruCore');

model.GeneralNode.entityMethods.GetType = function() {
	return taruCore.parseGeneralNode('type', this.type );
};

model.GeneralNode.entityMethods.GetState = function() {
	return taruCore.parseGeneralNode('state', this.state );
};