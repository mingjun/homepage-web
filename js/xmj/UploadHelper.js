define([
	"dojo/on",
	"dojo/json",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/xhr"
], function(on, json, delare, lang, xhr) {

	function defaultHandler(message) {
		console.log(message);
	}

	var wshandlers = {
			onmessage: function(evt) {
				console.log("onmessage", evt.data);
			},
			onclose: function(evt) {
				console.log("close", evt);
			},
			onopen: function(evt) {
				console.log("open");
			},
			onerror: function(e) {
				console.log("error", e);
			}
		};

	return delare ("", null, {
		ws: null,
		createWs: function(/*Function ? */onProgress) {
			console.log("creating ws");
			var url = "ws:"+location.hostname + ":8080"+"/data/files/status";
			var wsClass = window.WebSocket || window.MozWebSocket || Function;
			var ws = new wsClass(url);
			this.ws = ws;
			if(typeof onProgress !== "function") {
				onProgress = defaultHandler;
			}
			lang.mixin(ws, wshandlers, {
				onmessage: function(evt) {
					onProgress(json.parse(evt.data));
				}
			});
			return ws;
		},
		closeWs: function() {
			var ws = this.ws;
			if(ws) {
				ws.close();
				delete this.ws;
			}
		},

		bind: function(formNode, iframeNode, /*Function ? */onProgress, /*Function ? */onComplete) {
				var _this = this;
				on(formNode, "submit", function(){
					_this.createWs(onProgress);
				});
				on(iframeNode, "load", function(){
					xhr("GET", {url: "data/files", handleAs: "json"}).then(function(result) {
						_this.closeWs();
						onComplete(result);
					});
				});
		}
	});
});
