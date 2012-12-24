define([
	"dojo/_base/declare",
	"./LinkedList"
], function(declare, LinkedList) {
	var NIL = LinkedList.NIL_NODE;
	var buildHighLevelNode = function(v) {
		var node = LinkedList.buildNode(v);
		node.up = NIL;
		node.down = NIL;
	};

	var SkipList = declare("", null, {
		levelSize: 0,
		startPoint: NIL,
		add: function(v) {

		},
		_addHighLevel: function(v){
			buildHighLevelNode(v);
		},
		remove: function(v) {

		},
		search: function(v) {

		}
	});

	return SkipList;
});
