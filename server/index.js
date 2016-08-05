/*jshint node:true, esversion: 6 */
"use strict";
var WebSocketServer = new require('ws');
var fs = require('fs');
var wsfunc = require('./wsfunc').fun;

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


function wsm(client, head, body) {
    var ob = {
        "head": head,
        "body": body
    };
    var st = JSON.stringify(ob);
    //console.log("st", st);
    client.send(st);
}

// подключенные клиенты
var clients = {};


// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
    port: 8890
});
webSocketServer.on('connection', function(ws) {

    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);

    ws.on('message', function(message) {
        //console.log('+получено сообщение ' + message);
        var obj;
        try {
          obj = JSON.parse(message);
        } catch (err) {
            wsm(clients[id],"error", {"err": ""+err});
        }

        try {
            if (obj.head && obj.body) {
                if (wsfunc[obj.head]) {
                    wsfunc[obj.head](clients[id], obj.body).then((ret) => {
                        wsm(clients[id], obj.head, ret);
                    });
                } else {
                    console.log('err', wsfunc);
                    wsfunc.zero(clients[id], obj.head, obj.body);
                }
            }
        } catch (err) {
            console.log("err+", err);
        }
    });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });

});
