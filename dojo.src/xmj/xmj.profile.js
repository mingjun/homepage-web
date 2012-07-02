var profile = (function(){
	var testResourceRe = /\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"xmj/xmj.profile":1,
				"xmj/package.json":1,
			};
			return (mid in list) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
		},

		excludes = [
			
		],

		excludesRe = new RegExp(("^dojox/(" + excludes.join("|") + ")").replace(/\//, "\\/")),

		usesDojoProvideEtAl = function(mid){
			return excludesRe.test(mid);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid);
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && !usesDojoProvideEtAl(mid) && /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return 0;
			}
		},

		trees:[
			[".", ".", /(\/\.)|(~$)/]
		]
	};
})();
