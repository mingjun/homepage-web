//js helper for wenxin's photo album
define([
	"dojo/on",
	"dojo/query",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/json",
	"dojo/_base/xhr",
	"dojo/_base/array",
	"dojo/keys"
], function(on, query, domStyle, domClass, json, xhr, array, keys) {

	//math
	function modInRange(x, n) {
		var m = x % n;
		(m < 0) && (m += n);
		return m;
	}

	/**
	 * reorder a list of with (2m+1) elements
	 * @param x: index in the list
	 * @param n: the size of the list n==2m+1
	 * f(0, 2m+1) -> m
	 * f(1, 2m+1) -> m+1
	 * f(2, 2m+1) -> m-1
	 * f(3, 2m+1) -> m+2
	 * ...
	 */
	function reorderMid2Sides(x, n) {
		var m = Math.floor((n-1)/2);
		return (x % 2 === 0) ?
		 (m - (x/2)) :
		 (m + (x+1)/2);
	}

	function shuffle(list) {
		var rKey = "_rank";
		array.forEach(list, function(item){ item[rKey] = Math.random();});
		sort(list, rKey);
	}
	function sort(list, key) {
		list.sort(function(a,b) {
			var r;
			if(a[key] < b[key]) {
				r = -1;
			} else if (a[key] > b[key]) {
				r = 1;
			} else {
				r = 0;
			}
			return r;
		});
	}

	//strings
	function isNotEqual(s, t) {
		if(s.length !== t.length) {
			return true;
		}
		var start = s.length /2, end = start+10;
		if(s.substring(start, end) !== t.substring(start, end)) {
			return true;
		}
		return s !== t;
	}


	/**
	 * @param index: center index
	 * @param list: source list for all photo info
	 * @param delta: "radius" of surroundings,
	 *     default delta = 2, so 5 elements will be returned
	 * @return subset of list
	 */
	function getSurroundings(index, list, delta) {
		delta = delta || 2;
		var count = delta + 1 + delta;
		var length = list.length;
		var start = modInRange(index - delta, length);
		var r = [];
		for(var i = 0; i< count; i++) {
			r.push(list[modInRange(start+i, length)]);
		}

		//performance hack here
		query(".hackImgs>img").forEach(function(img, i) {
			img.src = r[reorderMid2Sides(i, count)].url;
		});

		return r;
	}
	/**
	 * @param time: "2012:09:21:15:45:34"
	 */
	function parseTime(time) {
		var a = /(\d+):(\d+):(\d+):(\d+:\d+):\d+/.exec(time);
		return a[1]+"年"+a[2]+"月"+a[3]+"日 "+a[4];
	}


	var domNodes = {};
	function displayImages(dList) {
			var mid = (dList.length-1)/2;
			var c = dList[mid];
			var url = c.url;
			var file = url.substring(url.lastIndexOf("/") + 1);
			domNodes.message.innerHTML = file;
			domNodes.message.href = url;
			domNodes.time.innerHTML = parseTime(c.time);
			setBG(domNodes.current, c);
			setBG(domNodes.previous, dList[mid-1]);
			setBG(domNodes.next, dList[mid+1]);
	}
	//show photo as a BG (background)
	function setBG(node, photo) {
		domStyle.set(node, {
			backgroundImage: "url(" + photo.url + ")"
		});
	}

	function config(list){
		var PAGE_SIZE = 10;
		var currentIndex = 0;
		function showNext(offset) {
			if( isNaN(offset) ) {offset=1;}
			currentIndex = modInRange(currentIndex+offset, list.length);
			displayImages(getSurroundings(currentIndex, list));
		}
		showNext(0);

		on(domNodes.next, "click", function(){
			showNext(1);
		});
		on(domNodes.previous, "click", function(){
			showNext(-1);
		});

		var shuffled = false;
		on(domNodes.shuffle, "click", function(e){
			if(!shuffled) {
				shuffle(list);
				currentIndex = 0;
				showNext(0);
				domClass.remove(domNodes.shuffle, "s_not");
			} else {
				sort(list, "time");
				currentIndex = 0;
				showNext(0);
				domClass.add(domNodes.shuffle, "s_not");
			}
			shuffled = !shuffled;
		});

		var h = 0;
		var DURATION = 2000;
		function playStep() {
			showNext(1);
			h = setTimeout(playStep, DURATION);
		}
		on(domNodes.play, "click", function(){
			if(h !== 0) {
				clearTimeout(h);
				h = 0;
				domClass.add(domNodes.play, "s_not");
			} else {
				h = setTimeout(playStep, DURATION);
				domClass.remove(domNodes.play, "s_not");
			}
		});

		on(document.body, "keydown", function(event){
			switch(event.keyCode) {
			case keys.LEFT_ARROW:
				showNext(-1);
				break;
			case keys.RIGHT_ARROW:
			case keys.SPACE:
				showNext(1);
				break;
			case keys.PAGE_UP:
			case keys.UP_ARROW:
				showNext(-PAGE_SIZE);
				break;
			case keys.PAGE_DOWN:
			case keys.DOWN_ARROW:
				showNext(PAGE_SIZE);
				break;
			case keys.HOME:
				currentIndex = 0;
				showNext(0);
				break;
			case keys.END:
				currentIndex = 0;
				showNext(-1);
				break;
			case keys.F1:
				shuffle(list);
				currentIndex = 0;
				showNext(0);
				domClass.remove(domNodes.shuffle, "s_not");
				break;
			case keys.F2:
				sort(list, "time");
				currentIndex = 0;
				showNext(0);
				domClass.add(domNodes.shuffle, "s_not");
			}
		});
		//enable actions in page
		domClass.add(domNodes.root, "s_loaded");
	}

	var enabled = false;
	/**
	 * helper is the export object
	 * usage:
	 *     helper.enable()
	 */
	var helper = {
		// enable the all functionalities
		enable: function(nodes) {
			if(!enabled) {
				enabled = true;
			} else {
				return;
			}
			domNodes = nodes;

			var key = "photoList";
			var listStr = localStorage.getItem(key);
			var configged = false;
			if(listStr) {
				config(json.parse(listStr));
				configged = true;
			}
			xhr("GET", {
				url: "/data/photo/wenxin",
				handleAs: "json"
			}).then(function(list) {
				if(!configged) {
					config(list);
					configged = true;
				}

				//update list if changed
				var newListStr = json.stringify(list);
				var listStr = localStorage.getItem(key) || "";
				if(isNotEqual(newListStr, listStr)) {
					localStorage.setItem(key, newListStr);
				}
			}, function(err) {
				if(!configged) {
					domNodes.time.innerHTML = "服务器维护中...请稍后尝试。";
				}
			});
		}
	};
	return helper;
});