
var buster = require("buster");
var assert = buster.referee.assert;
var expect = buster.referee.expect;


//var myLib = require("../lib/my-lib");

// buster.testCase("Buster setup test - A module", {
//     "states the obvious": function () {
//         assert(true);
//     }
// });

buster.spec.expose(); // Make some functions global
describe("Buster setup test", function () {
    it("states true = true", function () {
        expect(true).toEqual(true);
    });
});


