define([
	"dojo/_base/declare"
], function(declare) {
	var K = 1024;
	var unit = [
		{name:"B", value: 1},
		{name:"KB", value: K},
		{name:"MB", value: K*K},
		{name:"GB", value: K*K*K},
		{name:"PB", value: K*K*K*K},
		{name:"PB", value: K*K*K*K*K}
	];

	var Space = declare("", null, {
		value: 0,
		unit: unit[0].name,
		toString: function() {
			return Number(this.value).toPrecision(4)+this.unit;
		}
	});

	return {
		toSpace: function(valueInByte) {
			var r = new Space();
			for(var i=0;i<unit.length;i++) {
				var item = unit[i];
				if(item.value <= valueInByte && valueInByte < item.value*K){
					r.value = valueInByte/item.value;
					r.unit = item.name;
					break;
				}
			}
			return r;
		}
	};
});
