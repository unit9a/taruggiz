var taruCore = require('taruCore');

model.GeneralNode.entityMethods.GetType = function() {
	return taruCore.dictionaryLookup('types', this.type );
};

model.GeneralNode.entityMethods.GetState = function() {
	return taruCore.parseGeneralNode('states', this.state );
};