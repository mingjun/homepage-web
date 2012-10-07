define([
	"dojo/on",
	"dojo/_base/declare",
	"dojo/_base/xhr",
	"dojo/dom-construct",
	"dojo/_base/array"
], function(on, delare, xhr, domConstruct, array) {

	return delare ("", null, {
		baseUrl: null,
		formNode: null,
		outputNode: null,
		postscript: function(args) {
			this.baseUrl = args.baseUrl;
			this.formNode = args.formNode;
			this.outputNode = args.outputNode;
		},
		bind: function() {
			var _this = this;
			on(this.formNode, "submit", function(e) {
				e.preventDefault();
				_this.showMessage("如意如意，随我心意，快快显灵");
				_this.search();
			});
		},
		showMessage: function(msg) {
			this.outputNode.innerHTML = msg;
		},
		search: function() {
			var _this = this;
			xhr("GET", {
				url: this.baseUrl + "/data/search",
				form: this.formNode,
				handleAs: "json"
			}).then(
				function(list){
				_this.renderOutput(list);
				},
				function(error){
					_this.showMessage("搜索失败");
				}
			);
		},
		renderOutput: function(list) {
			if(0 === list.length) {
				this.showMessage("无结果");
				return;
			}
			var ul = domConstruct.create("ul", {}, this.outputNode, "only");
			array.forEach(list, function(item) {
				var li = domConstruct.create("li", {}, ul , "last");
				domConstruct.create("a", {
					href: item.path,
					target: "_blank",
					innerHTML : item.title
					}, li , "only");
			});
		}
	});
});