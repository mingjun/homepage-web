define([
	"dojo/_base/declare"//TODO amd convert
], function(declare) {
	var NIL = {
		value: NaN,
		next: null,
		previous: null
	};
	//TODO SET NIL immutable

	function buildNode(v) {
		var node = {
			value: v,
			next: NIL,
			previous: NIL
		};
		return node;
	}

	var dummyNode = buildNode("dummyNode");
	var LinkedList = declare("", null, {
		root: NIL,
		last: NIL,
		size: 0,
		constructor: function() {
			this.root = dummyNode;
			this.last = dummyNode;
		},
		add: function(v, index) {
			if(typeof index === "undefined") {
				index = this.size;
			}
			var preNode = this.last;
			if(index < this.size) {
				preNode = this._goto(index-1);
			}
			var node = buildNode(v);
			node.next = preNode.next;
			preNode.next = node;
			node.previous = preNode;
			if(node.next !== NIL) {
				node.next.previous = node;
			} else {
				this.last = node;
			}

			this.size ++;
		},
		_goto: function(index) {
			var p = this.root;
			var count = -1;
			while(!!p.next && p.next !== NIL && count < index) {
				p = p.next;
				count ++;
			}
			var r = p;
			return r;
		},
		get: function(index) {
			if(0<= index && index < this.size) {
				return this._goto(index).value;
			} else {
				return;
			}
		},
		remove: function(index) {
			var p = this._goto(index);
			if(p === this.root || p === NIL) return;
			var preNode = p.previous;
			var nextNode = p.next;
			preNode.next = nextNode;
			if(nextNode !== NIL) {
				nextNode.previous = preNode;
			} else {
				this.last = preNode;
			}
			this.size --;
			return p.value;
		},
		forEach: function(cb) {
			var p = this.root;
			while(!!p.next && p.next !== NIL) {
				p = p.next;
				console.log(p);
				cb && cb(p.value);
			}
		}
	});
	LinkedList.NIL_NODE = NIL;
	LinkedList.buildNode = buildNode;

	var VisibleLinkedList = declare("", LinkedList, {
		domNode: null,
		constructor: function(node) {
			node.innerHTML = "LinkedList:";
			this.domNode = dojo.create("ol", {className:"LinkedList"}, node, "last");
		},
		add: function(v, index) {
			if(typeof index === "undefined") {
				index = this.size;
			}
			if(index === this.size) {
				dojo.create("li", {innerHTML: v}, this.domNode, "last");
			} else {
				var findNode = dojo.query("li", this.domNode)[index];
				dojo.create("li", {innerHTML: v}, findNode, "before");
			}
			this.inherited(arguments);
			console.log("add");
		},
		get: function(index) {
			var findNode = dojo.query("li", this.domNode)[index];
			if(findNode) {
				dojo.addClass(findNode, "accessed");
				setTimeout(function(){
					dojo.removeClass(findNode, "accessed");
				}, 1000);
			}
			return this.inherited(arguments);
		},
		remove: function(index) {
			var nodeArray = dojo.query("li", this.domNode);
			if(0 <= index && index < nodeArray.length) {
				dojo.destroy(nodeArray[index]);
			}
			return this.inherited(arguments);
		}

	});

	LinkedList.VisibleLinkedList = VisibleLinkedList;
	return LinkedList;
});
