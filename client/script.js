/*jshint browser: true, undef: true, unused: true, devel: true, esversion: 6, -W097 */
/*eslint no-console: 0, "quotes": [0, "single"], module: 0, globals:[0, "obj"]*/
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
"use strict";

var mymap;
var markers;
var socket;
var s;
var wsfunc = {
	zero: function(head, body) {
		console.log(
			"error",
			"Метод " + head + " не найден, его значение",
			body
		);
	},
	autchUser: function(body) {
		console.log("body", body);
		wsm("getLogCoord", {});
	},
	getMbTov: function(body) {
		console.log("body", body);
	},
	getLogCoord: function(body) {
		var o = {};
		body.forEach(elem => {
			if (o[elem.token]) {
				let e = {
					lon: elem.coord.y,
					lat: elem.coord.x
				};
				o[elem.token].push(e);
			} else {
				o[elem.token] = [];
			}
		});
		for (let prop in o) {
			//[{"lon": 48.509, "lat":43.08},{"lon":47.503, "lat":41.06}]
			//console.log('o[prop]', );
			var d = o[prop]; //.splice(1,3);
			//console.log('d', JSON.stringify(d));
			var polyline = new L.polyline(d, {
				color: "red",
				weight: 3
			});
			console.log("polyline", polyline);
			mymap.addLayer(polyline);
		}
	}
};

//отправить объект на сервер
function wsm(head, body) {
	console.log("head, body", head, body);
	var ob = {
		head: "",
		body: {}
	};
	ob.head = head;
	ob.body = body;
	var st = JSON.stringify(ob);
	socket.send(st);
}

function initMap() {
	//"use strict";
	/*Подготовка данных*/

	//var markers = [];
	mymap = L.map("mapid").setView([47.505, 41.505], 8);

	L.tileLayer(
		"https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw",
		{
			maxZoom: 18,
			attribution:
				'Map <a href="http://openstreetmap.org">OSM</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">M</a>',
			id: "mapbox.streets"
		}
	).addTo(mymap);

	markers = L.markerClusterGroup({
		/*iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: '<b>+' + cluster.getChildCount() + '</b>'
            });
        },*/
		maxClusterRadius: 50,
		disableClusteringAtZoom: 15,
		//spiderfyOnMaxZoom: false,
		showCoverageOnHover: false
		//zoomToBoundsOnClick: false
	}); /**/
	mymap.addLayer(markers);

	L.circle([47.508, 41.11], 500, {
		color: "red",
		fillColor: "#f03",
		fillOpacity: 0.5
	})
		.addTo(mymap)
		.bindPopup("Кружочек");

	L.polygon([[47.509, 41.08], [47.503, 41.06], [47.51, 41.047]])
		.addTo(mymap)
		.bindPopup("треуголь"); /**/
	//var data = 'M100,200 C100,100 250,100 250,200S400,300 400,200',
	//var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
	var polyline = new L.polyline(
		[[47.509, 42.09], [47.513, 42.06], [47.51, 42.047]],
		{
			color: "red",
			weight: 3
		}
	);
	mymap.addLayer(polyline);
	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("Координаты клика " + e.latlng.toString())
			.openOn(mymap);
	}

	/**/
	mymap.on("click", onMapClick);
}

window.onload = function() {
	//document.forms.log_form.login.value = localStorage.login;
	if (!window.WebSocket) {
		document.body.innerHTML =
			"WebSocket в этом браузере не поддерживается.";
	}
	socket = new WebSocket("ws://pol-ice.ru:8890");

	socket.onopen = function() {
		console.log("Соединение установлено.");
		wsm("autchUser", {
			idToken: "gofman-1",
			criptoPass: {
				login: "gofman",
				pass: "1"
			}
		});
		//wsm("getFileKey", {});
		//wsm('getMbTov', {len: 1});
	};
	socket.onclose = function(event) {
		if (event.wasClean) {
			alert("Соединение закрыто чисто");
		} else {
			alert("Обрыв соединения"); // например, "убит" процесс сервера
		}
		alert("Код: " + event.code + " причина: " + event.reason);
	};

	socket.onmessage = function(event) {
		//alert("Получены данные " + event.data);
		var message = event.data;
		s = message;
		console.log("event.data", message);
		var obj;
		try {
			obj = JSON.parse(message);
		} catch (err) {
			console.log("err", err);
		}

		try {
			if (obj.head && obj.body) {
				if (wsfunc[obj.head]) {
					wsfunc[obj.head](obj.body);
				} else {
					console.log("errщк");
					wsfunc.zero(obj.head, obj.body);
				}
			}
		} catch (err) {
			console.log("err+", err);
		}
	};

	socket.onerror = function(error) {
		alert("Ошибка " + error.message);
	};

	initMap();
	//
};
/*
//document.addEventListener('DOMContentLoaded', myFunc);

function myFunc() {
    var _script = document.createElement("script");
    _script.src = "2.js";
    document.getElementsByTagName("head")[0].appendChild(_script);
    _script.onload = function() {
        alert(myArray);
    };
    _script.onerror = function() {
        alert('ошибка загрузки');
    };
}*/
