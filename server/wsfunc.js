/*jshint node:true, esversion: 6 */
"use strict";
var pgp = require('pg-promise')({
    // Initialization Options
});

var cn = 'postgres://postgres:postgres@localhost:5432/office';
//var cn = 'postgres://postgres:postgres@192.168.0.1:5432/office';
var db = pgp(cn);

var wsfunc = {
    getServers: function (client, obj) {
        return new Promise(function(resolve, reject) {
            try {
                var d = {
                    "SyncConnection": [
                  {
                    "ID": 1,
                    "Organization": "Полайс 1",
                    "Protocol": "ws",
                    "Host": "pol-ice.ru",
                    "Port": 8890,
                    "Path": "/ws",
                    "ConnectionTimeout": 5000,
                    "Compression": false,
                    "Description": "Настройка подключения к серверу синхронизации"
                  }
              ]};
              resolve(d);
            } catch (err) {
                console.log('errA', err);
            }

        });
    },
    authUser: function(client, obj) {
        return new Promise(function(resolve, reject) {
            try {
                db.query("SELECT t.idtoken,t.keytoken,u.login,u.pass from wp_tokens t LEFT JOIN wp_users u ON t.login = u.login where idToken=$1", obj.idToken)
                    .then((token) => {
                        if (token[0]) {
                            console.log('token[0]', token[0]);
                            client.idToken = token[0].idtoken;
                            client.user = token[0].login;
                            if ((token[0].login === obj.authData.login) && (token[0].pass === obj.authData.password)) {
                                resolve({
                                    "result": true
                                });
                            } else {
                                resolve({
                                    "result": false
                                });
                            }
                        } else {
                            resolve({
                                "result": false
                            });
                            console.error(obj.idToken + " нет такого токена");
                        }
                    })
                    .catch((error) => {
                        console.log('error1', error);
                    }); /**/
            } catch (err) {
                console.log('errA', err);
            }

        });
    },
    setLogCoord: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({
                    "result": false
                });
                return;
            }
            console.log('obj', obj);
            var coord, res;
            var vr = (value) => {
                console.log('value', value);
            };
            var ve = (err) => {
                console.log('err', err);
            };
            for (var i = 0; i < obj.points.length; i++) {
                coord = "(" + obj.points[i].coord.lat + "," + obj.points[i].coord.lon + ")";
                res = {
                    "idToken": client.idToken,
                    "coord": coord,
                    "time": new Date(obj.points[i].time * 1000)
                        //"atime": new Date()
                };
                try {
                    db.query("INSERT INTO wp_coords (coord, time, token) VALUES (${coord}, ${time}, ${idToken});", res)
                        .then(vr, ve);
                } catch (err) {

                }
                console.log('setLogCoord', res);
            }

            resolve({
                "result": true
            });
        });
    },
    updateToken: function(client, obj) {
        return new Promise(function(resolve, reject) {
            //
        });
    },
    zero: function(id, head, str) {
        console.log("error", "Метод " + str + " не найден");
    },
    wsm: function(client, head, body) {
        try {
            var ob = {
                "head": head,
                "body": body
            };
            var st = JSON.stringify(ob);
            client.send(st);
        } catch (err) {
            console.log('err', err);
        }

    },
    getItems: function(client, obj) {
        return new Promise(function(resolve, reject) {
            console.log("title", obj);
            var tov = {};
            if (!(client.idToken)) {
                resolve({
                    "result": false
                });
                return;
            }
            try {
                var pr = [];
                var nm = [];
                if (obj.items === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from i_mtime)*1000 as i_mtime_i from items", {}));
                    nm.push("items");
                }
                if (obj.itemGroupTypes === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from igt_mtime)*1000 as igt_mtime_i from item_Group_Types", {}));
                    nm.push("itemGroupTypes");
                }
                if (obj.itemGroups === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from ig_mtime)*1000 as ig_mtime_i from item_Groups", {}));
                    nm.push("itemGroups");
                }
                if (obj.linkItemGroups === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from lig_mtime)*1000 as lig_mtime_i from link_Item_Group", {}));
                    nm.push("linkItemGroups");
                }
                if (obj.itemUnitTypes === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from iut_mtime)*1000 as iut_mtime_i from item_Unit_Types", {}));
                    nm.push("itemUnitTypes");
                }
                if (obj.itemUnits === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from iu_mtime)*1000 as iu_mtime_i from item_Units", {}));
                    nm.push("itemUnits");
                }
                Promise.all(pr).then((value) => {
                    for (let i = 0; i < nm.length; i++) {
                        tov[nm[i]] = value[i];
                    }
                    console.log("tov");
                    resolve(tov);
                },(err)=>{
                    console.log('err all', err);
                });
                //var tov = require('../db/tov');


            } catch (err) {
                console.log("err", err);
                reject(err);
            }

        });
    },
    getCountragents: function(client, obj) {
        return new Promise(function(resolve, reject) {
            console.log("title", obj);
            var tov = {};
            if (!(client.idToken)) {
                resolve({
                    "result": false
                });
                return;
            }
            try {
                var pr = [];
                var nm = [];
                if (obj.countragents === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from ca_mtime)*1000 as ca_mtime_i from countragents", {}));
                    nm.push("countragents");
                }
                if (obj.deliveryPoints === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from dp_mtime)*1000 as dp_mtime_i from delivery_points", {}));
                    nm.push("deliveryPoints");
                }
                if (obj.address === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from adr_mtime)*1000 as adr_mtime_i from address", {}));
                    nm.push("address");
                }
                if (obj.linksCountragentDeliveryPoint === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from lcp_mtime)*1000 as lcp_mtime_i from links_countragent_delivery_point", {}));
                    nm.push("linksCountragentDeliveryPoint");
                }

                Promise.all(pr).then((value) => {
                    for (let i = 0; i < nm.length; i++) {
                        tov[nm[i]] = value[i];
                    }
                    console.log("tov");
                    resolve(tov);
                },(err)=>{
                    console.log('err all', err);
                });
                //var tov = require('../db/tov');


            } catch (err) {
                console.log("err", err);
                reject(err);
            }

        });
    },
    getLogCoord: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({
                    "result": false
                });
                return;
            }
            try {
                db.query("SELECT coord, token, extract(epoch from time)*1000 as time FROM  wp_coords as c ORDER BY time;", obj)
                    .then((value) => {
                        resolve(value);
                    });
            } catch (err) {

            }
        });
    },

};

exports.fun = wsfunc;
