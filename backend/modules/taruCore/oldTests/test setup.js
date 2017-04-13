//delete Y.Assert ;
 Y.Assert = require("assert");
//var test = require("test");

var testCase = {
     name: "testCaseName",
      
    testFails: function() {
            Y.Assert.equal(1>0, true, '1 is always higher than 0');
        },
         
    testPasses: function() {
            Y.Assert.ok(true, "True is always true");
        }
    };
    
  // var tester = .init()
    
    require("unitTest").init().run(testCase.testFails).getReport();
   /*
var assert = require('assert');
 
require('test').run({
  testEquality: function() {
    assert.equal(1>0, true, '1 is always higher than 0');
  },
 
  testGroup: {
    testOK: function() {
      assert.ok(true, "True is always true");
    }
  }
});
*/