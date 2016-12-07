//require.ensure(["./lib/demo"], function(require) {
/**
require(["./lib/demo"], function(require) {
    var $ = require("jquery");
    console.log("aaa");
    var module2 = require("./lib/demo2");
    console.log("bbb");
    console.log($("body").text())
    require("./lib/demo");
});
 **/
var $ = require("jquery");
require("angular")

console.log("aaa");
var module2 = require("./lib/demo2");
console.log("bbb");
console.log($("body").text())
require("./lib/demo");
console.log(demov)