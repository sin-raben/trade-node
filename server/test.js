/*eslint no-console: 0, "quotes": [0, "single"], module: 0*/
/*eslint no-unused-vars: 0*/
"use strict";

var crypto = require("crypto");
var d = crypto
	.createHmac("md5","")
	.update("token")
	.digest("hex"); //md5("token","key")
console.log(d);
function makeid(lg=1, ng=1) {
	ng -=1;
	let text = "";
	var possible =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	for (let i = 0; i <= ng; i++) {
		for (let i = 0; i < lg; i++)
			text += possible.charAt(
				Math.floor(Math.random() * possible.length)
			);
		if (ng > i) text += "-";
	}

	return text;
}
//console.log(makeid(15,2));
