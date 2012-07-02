dependencies = {
	layers: [
		{
			name: "../dijit/dijit-all.js",
			dependencies: [
				"dijit.dijit-all"
			]
		},
		{
			name: "../dojox/grid/DataGrid.js",
			dependencies: [
				"dojox.grid.DataGrid"
			]
		},
		{
			name: "../xmj/xmj.js",
			dependencies: [
				"xmj.xmj"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
        [ "xmj", "../xmj" ]
	]
}
