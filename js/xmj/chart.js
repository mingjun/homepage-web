define([
 	"dojox/charting/Chart",
 	"dojox/charting/themes/ThreeD",
 	"dojox/charting/axis2d/Default",
 	"dojox/charting/plot2d/Markers"
], function(Chart, ThreeD) {
	return function(statistics, node) {
		var customTheme = ThreeD.clone();
		customTheme.plotarea.fill = "#fed";

		var c = new Chart(node).
			setTheme(customTheme).
		    addAxis("x", {
		    	title: "时间",
		    	titleOrientation: "away",
		    	labels: statistics.xAxisLables ,
		    	fixLower: "major", fixUpper: "major", natural: true, includeZero: false
		    	}).
		    addAxis("y", {
		    	title: "访问量",
		    	vertical: true, fixLower: "major", fixUpper: "major", natural: true, includeZero: true}).
		    addPlot("default", {type: "Markers"}).
		    addSeries("over-all", statistics.points).
		    render();
		return c;
	};
});
