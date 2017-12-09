/* exported: "gr" */
/*eslint no-console: 0, "quotes": [0, "single"] */
/*jshint node:true, esversion: 6 */
"use strict";
var WebSocketServer = new require("ws");
var pgp = require("pg-promise")({
	// Initialization Options
});
var cn = "postgres://postgres:postgres@localhost:5432/office";
var db = pgp(cn);
//var fs = require('fs');
var wsf = [];

{
	let f = require("./wsfunc").fun;
	for (let prop in f) {
		wsf[prop] = f[prop];
	}
}
{
	let f = require("./wsfuncmobile").fun;
	for (let prop in f) {
		wsf[prop] = f[prop];
	}
}

/*
//превратить массив ArrM объектов в объект с ключем указанным PolM
function gr(ArrM, PolM) {

	var ArrKey = {};
	for (var i = 0; i < ArrM.length; i++) {
		var key = "";
		for (var j = 0; j < PolM.length; j++) {
			key += ArrM[i][PolM[j]];
		}
		if (!ArrKey[key]) {
			ArrKey[key] = [];
		}
		ArrKey[key].push(ArrM[i]);
	}
	return ArrKey;
}
*/

wsf.reload = function(client, obj) {
	var path = "./mobile/server/node_modules/";

	var fs = require("fs");
	var rearstat = function(name) {
		return new Promise((resolve, reject) => {
			fs.stat(path + name, function(error, stat) {
				if (error) reject(error, "1");
				resolve(stat);
			});
		});
	};
	var readdir = function(path, mtime) {
		return new Promise((resolve, reject) => {
			var arf = [];
			fs.readdir(path, function(error, list) {
				if (error) reject(error, "2");
				Promise.all(list.map(rearstat)).then(res => {
					for (var i = 0; i < res.length; i++) {
						if (res[i].mtime > new Date(mtime)) {
							let name = list[i].slice(0, list[i].indexOf("."));
							console.log(name);
							arf.push({ name: name, mtime: res[i].mtime });
						}
					}
					resolve(arf);
				});
			});
		});
	};
	return new Promise(resolve => {
		try {
			if (obj.mtime) {
				readdir(path, obj.mtime).then(
					r => {
						let result = r.map(function(el) {
							console.log("restart function", el.name);
							if (wsf[el.name]) {
								//wsf[el.name] = reload(path + el.name).fun;
								wsf[el.name] = false;
								delete require.cache[require.resolve(el.name)];

								return el.name;
							}
							return el.name + "*";
						});

						resolve({ result });
					},
					eer => {
						console.log("eer", eer);
					}
				);
			} else if (obj.names) {
				let result = obj.names.map(function(el) {
					console.log("restart function", el);
					if (wsf[el]) {
						try {
							wsf[el] = false;
							delete require.cache[require.resolve(el)];
						} catch (error) {
							console.log(error);
						}

						//delete require.cache[require.resolve(path+el+'.js')];
						//delete wsf[el];
						//wsf[el] = reload(path + el).fun;
						return el;
					}
					return el + "*";
				});
				resolve({ result });
			}
		} catch (e) {
			console.log(e);
			//reject("ee", e);
		}
	});
};

function wsm(client, head, body, id, arg) {
	var ob = {
		head: head,
		body: body
	};
	if (id) ob.id = id;
	if (arg) ob.arg = arg;
	var st = JSON.stringify(ob);
	console.log("st", st);
	client.send(st, { compress: true });
	//console.log("принято", client.bytesReceived /*, /*client*/);
	//console.log("отправлено", client._sender._socket._bytesDispatched);
}

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
	port: 8890
});
webSocketServer.on("connection", function(ws) {
	var id = Math.random();
	clients[id] = ws;
	console.log("новое соединение " + id);

	ws.on("message", function(message) {
		//console.log('+получено сообщение ' + message);
		var obj;
		try {
			obj = JSON.parse(message);
		} catch (err) {
			console.error("ошибка парсинга", message);
			wsm(clients[id], "error", {
				err: "" + err
			});
		}

		try {
			if (obj.head && obj.body) {
				if (!wsf[obj.head]) {
					try {
						wsf[obj.head] = require(obj.head).fun;
						console.log("загрузка функции " + obj.head);
					} catch (error) {
						console.error(obj.head + " метод не загружен", error);
						wsf.zero(clients[id], obj.head, obj.body);
					}
				}
				if (wsf[obj.head]) {
					console.log(obj.head, "запрос");
					wsf[obj.head](clients[id], obj.body, db).then(
						ret => {
							console.log(obj.head, "ответ");
							wsm(clients[id], obj.head, ret, obj.id, obj.arg);
						},
						e => {
							console.log(e, obj.head);
						}
					);
				} else {
					console.error("err", "метод не найден");
					wsf.zero(clients[id], obj.head, obj.body);
				}
			}
		} catch (err) {
			console.log("err+", err);
		}
	});

	ws.on("close", function() {
		console.log("соединение закрыто " + id);
		delete clients[id];
	});
});
