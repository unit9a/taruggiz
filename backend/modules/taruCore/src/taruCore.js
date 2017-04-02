/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('Untitled1').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/
const thetypeof = function(name) {
        let obj = {};
        obj.object = 'object Object'
        obj.array = 'object Array'
        obj.string = 'object String'
        obj.boolean = 'object Boolean'
        obj.number = 'object Number'
        obj.type = Object.prototype.toString.call(name).slice(1, -1)
        obj.name = Object.prototype.toString.call(name).slice(8, -1)
        obj.is = (ofType) => {
            ofType = ofType.toLowerCase();
            return (obj.type === obj[ofType])? true: false
        }
        obj.isnt = (ofType) => {
            ofType = ofType.toLowerCase();
            return (obj.type !== obj[ofType])? true: false
        }
        obj.error = (ofType) => {
            throw new TypeError(`The type of ${name} is ${obj.name}: `
            +`it should be of type ${ofType}`)
        }
        return obj;
    };
    
function objectToDictionary (){	
	var dictionary = {};
	
	for (let object of arguments) {
		for (var property in object) {
	    	if (dictionary.hasOwnProperty(property)) {
	    		throw ("already Defined: " + property);
	    	}
	    	else if (object.hasOwnProperty(property)) {
		        dictionary[property] = object[property];
		        dictionary[object[property]] = property
		    }
		    else{
		    	throw ("MAJOR ERROR : ghost property" + property);
		    }
		}
    
    return dictionary;
}
}
const DICTIONARY =  require( "./taruDictionary.json" );

const GENERALNODE_DICTIONARY = {
	types: objectToDictionary(DICTIONARY.generalNode.types)
	,states: objectToDictionary(DICTIONARY.commonStates, DICTIONARY.generalNode.states)
};


exports.parseGeneralNode = function helloWorld (prop, value) {
	//check if NOT a valid entitiy
	if ( !prop || !GENERALNODE_DICTIONARY[prop]){
		throw("requested invalid or falsy general node property");
	}
	return GENERALNODE_DICTIONARY[prop][value]
};
