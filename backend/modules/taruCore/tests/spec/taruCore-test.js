var buster = require("buster");
var assert = buster.referee.assert;
buster.spec.expose(); // Make some functions global
var expect = buster.referee.expect;

//taruCore;
var taruCore = require("../../src/taruCore");


describe("taruCore SSJS module", function() {

    describe("Dictionary", function() {

        // before(function() {
        // 	this.testDictionary = {
        // 		"term" : "definition",
        // 		"0" : "number"
        // 	};

        // 	this.badTestDictionary = {
        // 		"term" : "definition",
        // 		"0" : "number",
        // 		"term": "unwanted duplicate"
        // 	};

        //    this.result =  taruCore.objectToDictionary(this.testDictionary);
        // });
        describe("objectToDictionary()", function() {
            it("Can return a dictionary object that has matching key pairs", function() {
                var testDictionary = {
                    "term": "definition",
                    "0": "number"
                };
                var result = taruCore.objectToDictionary(testDictionary);

                assert.isObject(result, "result is NOT an object")

                for (var definition in testDictionary) {

                    expect(result[definition]).toEqual(testDictionary[definition]);
                    //buster.referee.fail("Expected ${result} to have key ${definition} : ${testDictionary[definition]}");
                    expect(result[testDictionary[definition]]).toEqual(definition);
                    //buster.referee.fail("Expected ${result} to have key ${testDictionary[definition]} : ${definition}");

                }
            });

            it("throws error on a duplicate entry", function() {
                //var result =  
				var badTestDictionary = badTestDictionary = {
					"term": "definition",
					"0": "number",
					"unwanted duplicate": "term"
				};
                assert.exception(function() {
                    //debugger;
                    var result = taruCore.objectToDictionary(badTestDictionary);
                });

            });
        });

        it("taruCore.DICTIONARY includes some taruDictionary.json keys", function() {
            var jsonFile = require("../../src/taruDictionary.json");
            var	testDictionary = jsonFile.generalNode.types;

            var activeDictionary = taruCore.DICTIONARY.types;

            for (var definition in testDictionary) {
                expect(activeDictionary[definition]).toEqual(testDictionary[definition]);
                expect(activeDictionary[testDictionary[definition]]).toEqual(definition);
            }
        })

        it("dictionaryLookUp()", function() {
        	var jsonFile = require("../../src/taruDictionary.json");
            var	testDictionary = jsonFile.generalNode.types;

			for (var definition in testDictionary) {
				debugger;
                expect(taruCore.dictionaryLookUp('types', definition ))
                	.toEqual(testDictionary[definition]);
                expect(taruCore.dictionaryLookUp('types', testDictionary[definition] ))
                	.toEqual(definition);
            }

        })
    });

});
