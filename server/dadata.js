/*jshint node:true, esversion: 6, unused: true */
/*
  curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Token b56aea5d46095861a068daf91fbfd4c671d1ba90" \
  -d '{ "query": "77000000000268400" }' \
  https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address
*/
/*
https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party
https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank
https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio
https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address
https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/email
*/

/*function datToStr(date) {
  var rightNow = new Date(date);
  return rightNow.toISOString().slice(0, 10).replace(/-/g, "");
}*/


const https = require('https');
var fadress = function (adr) {
	return new Promise(function (resolve, reject) {
		var options = {
			hostname: 'suggestions.dadata.ru',
			port: 443,
			path: '/suggestions/api/4_1/rs/suggest/address',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'Token b56aea5d46095861a068daf91fbfd4c671d1ba90',
				/*'Content-Length': Buffer.byteLength(post_data)/**/
			},
			json: true

		};
		var post_data = '{"query": "' + adr + '", "count": 1}';
		var req = https.request(options, (res) => {
			// console.log('statusCode: ', res.statusCode);
			var str = "";
			res.on('data', (d) => {
				str = str + d.toString();
			});
			res.on('end', () => {
				var json;
				try {
					json = JSON.parse(str.toString());
					resolve(json.suggestions[0]);
				} catch (err) {
					reject(err);
					return;
				}
			});
		});

		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			reject(e);
		});

	});
};
exports.adress = fadress;
