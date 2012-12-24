define(
[
	"dojo/domReady",
	"dojo/dom",
	"dojo/json",
	"dojo/_base/xhr",
	"dojox/charting/Chart",
	"dojox/charting/themes/ThreeD",
	"dojox/charting/axis2d/Default",
	"dojox/charting/plot2d/Lines"
],
function() {
	var args = arguments;
	var test = function() {
		console.log(args);
	};
	return test;
});