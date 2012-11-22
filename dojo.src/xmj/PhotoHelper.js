define([
	"dojo/on",
	"dojo/query",
	"dojo/window",
	"dojo/dom-style",
	"dojo/json",
	"dojo/_base/declare",
	"dojo/_base/xhr",
	"dojo/dom-geometry",
	"dojo/_base/array"
], function(on, query, win, domStyle, json, delare, xhr, domGeometry, array) {
	//math
	function modInRange(x, n) {
		var m = x % n;
		(m < 0) && (m += n);
		return m;
	}
	/**
	 * a list of n (2m+1) elements
	 * f(0) -> m
	 * f(1) -> m+1
	 * f(2) -> m-1
	 * f(3) -> m+2
	 * ...
	 */
	function reorderMid2Sides(x, n) {
		var y = 0;
		var m = Math.floor(n-1)/2;
		return (x % 2 === 0) ?
		 (m - (x/2)) :
		 (m + (x+1)/2);
	}
	function getSurroundings(index, list, delta) {
		delta = delta || 2;
		var count = delta + 1 + delta;
		var length = list.length;
		var start = modInRange(index - delta, length);
		var r = [];
		for(var i = 0; i< count; i++) {
			r.push(list[modInRange(start+i, length)]);
		}
		query(".hidden>img").forEach(function(img, i) {
			img.src = r[reorderMid2Sides(i, count)].url;
		});
		return r;
	}
	var domNode = {};
	function displayImages(simpleImageList) {
		xhr("GET", {
			url: "/data/photo/details",
			content: {photoURLs: json.stringify(simpleImageList)},
			handleAs: "json"
		}).then(function(dList) {
			var mid = (dList.length-1)/2;
			var c = dList[mid];
			domNode.message.innerHTML = c.name;
			domNode.message.href = c.url;
			setBG(domNode.current, c);
			setBG(domNode.previous, dList[mid-1]);
			setBG(domNode.next, dList[mid+1]);
		});
	}
	function setBG(node, photo) {
		var h = domGeometry.getContentBox(node).h;
		var size = "auto auto";
		if(h < photo.height) {
			size = "auto 100%";
		}
		domStyle.set(node, {
			backgroundSize: size,
			backgroundImage: "url(" + photo.url + ")"
		});
	}

	var helper = {
		enable: function(node) {
			domStyle.set(node, {height: win.getBox().h + "px"});
			domNode.previous = query(">.previous", node)[0];
			domNode.current = query(">.current", node)[0];
			domNode.next = query(">.next", node)[0];
			domNode.message = query(">.message>a", node)[0];
			domNode.play = query(">.menu>.play", node)[0];

			xhr("GET", {
				url: "/data/photo?path=wenxin",
				handleAs: "json"
			}).then(function(list){
				var currentIndex = 0;
				displayImages(getSurroundings(currentIndex, list));

				on(domNode.next, "click", function(){
					currentIndex = modInRange(currentIndex+1, list.length);
					displayImages(getSurroundings(currentIndex, list));
				});
				on(domNode.previous, "click", function(){
					currentIndex = modInRange(currentIndex-1, list.length);
					displayImages(getSurroundings(currentIndex, list));
				});

				var h = 0;
				on(domNode.play, "click", function(){
					if(h !== 0) return;
					domNode.play.innerHTML = "正在播放...";
					h = setInterval(function(){
						displayImages(getSurroundings(++currentIndex, list));
						if(currentIndex > list.length) {
							clearInterval(h);
							h = 0;
							domNode.play.innerHTML = "幻灯片播放";
						}
					}, 2000);
				});
			});
		}
	};
	return helper;
});