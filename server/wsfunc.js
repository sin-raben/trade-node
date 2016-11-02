/*jshint node:true, esversion: 6 */
"use strict";
var pgp = require('pg-promise')({
    // Initialization Options
});

var cn = 'postgres://postgres:postgres@localhost:5432/office';
//var cn = 'postgres://postgres:postgres@192.168.0.1:5432/office';
var db = pgp(cn);

var wsfunc = {
    getServers: function(client, obj) {
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
                    ]
                };
                resolve(d);
            } catch (err) {
                console.log('errA', err);
            }

        });
    },
    authUser: function(client, obj) {
        return new Promise(function(resolve, reject) {
            try {
                console.log('obj', obj);
                db.query("SELECT t.idtoken,t.keytoken,u.login,u.pass from wp_tokens t LEFT JOIN wp_users u ON t.login = u.login where idToken=$1", obj.idToken).then((token) => {
                    if (token[0]) {
                        console.log('token[0]', token[0]);
                        client.idToken = token[0].idtoken;
                        client.user = token[0].login;
                        if ((token[0].login === obj.authData.login) && (token[0].pass === obj.authData.password)) {
                            resolve({"result": true});
                        } else {
                            resolve({"result": false});
                        }
                    } else {
                        resolve({"result": false});
                        console.error(obj.idToken + " нет такого токена");
                    }
                }).catch((error) => {
                    console.log('error1', error);
                });/**/
            } catch (err) {
                console.log('errA', err);
            }

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
    setItems: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.items) {
                obj.items.forEach(elem => {
                    db.query("INSERT INTO items (i_exid, i_name, i_prn, i_info, i_img, i_service, int_id)" +
                        " VALUES (${i_exid}, ${i_name}, ${i_prn}, ${i_info}, ${i_img}, ${i_service}, ${int_id});",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, '\n\n\n', err);
                    });
                });
            }
            if (obj.itemsGroupType) {
                obj.itemsGroupType.forEach(elem => {
                    db.query("INSERT INTO item_Group_Types (igt_exid, igt_agent, igt_name)" +
                        " VALUES (${igt_exid}, ${igt_agent}, ${igt_name});",
                    elem).then((value) => {
                        //добавлено
                    }, (err) => {
                        console.log('err', elem, '\n\n\n', err);
                    });
                });
            }
            if (obj.itemsGroup) {
                obj.itemsGroup.forEach(elem => {
                    db.query("INSERT INTO item_groups (igt_id, ig_exid, ig_value) SELECT igt.igt_id, t.ig_exid, t.ig_value FROM item_group_types AS igt " +
                        "CROSS JOIN (VALUES (${ig_exid}, ${ig_value})) AS t (ig_exid, ig_value) WHERE igt.igt_exid = ${igt_exid};",
                    elem).then((value) => {
                        //добавлено
                    }, (err) => {
                        console.log('err', elem, '\n\n\n', err);
                    });
                });
            }
            if (obj.linkItemGroup) {
                obj.linkItemGroup.forEach(elem => {
                    db.query("INSERT INTO link_Item_Group (i_id, igt_id, ig_id) SELECT i_id, igt_id, ig_id FROM items as i " +
                        "CROSS JOIN (SELECT ig.igt_id, ig_id FROM item_groups AS ig JOIN item_group_types AS igt ON igt.igt_id=ig.igt_id " +
                        "WHERE igt.igt_exid = ${igt_exid} AND ig.ig_exid = ${ig_exid}) as ig WHERE i.i_exid = ${i_exid};",
                    elem).then((value) => {
                        //добавлено
                    }, (err) => {
                        console.log('err', elem, '\n\n\n', err);
                    });
                });
            }
            if (obj.itemsUnitType) {
                obj.itemsUnitType.forEach(elem => {
                    db.query("INSERT INTO item_Unit_Types (iut_exid, iut_name, imt_id, iut_okei) " +
                        "VALUES (${iut_exid}, ${iut_name}, ${imt_id}, ${iut_okei});",
                    elem).then((value) => {
                        //добавлено
                    }, (err) => {
                        console.log('err', elem, '\n\n\n', err);
                    });
                });
            }
            if (obj.itemsUnit) {

                obj.itemsUnit.forEach(elem => {
                    db.query("INSERT INTO item_units " +
                        "(i_id, iut_id, iu_ean, iu_krat, iu_num, iu_denum, iu_gros, iu_net, " +
                        "iu_length, iu_width, iu_height, iu_area, iu_volume, iu_agent, iu_base, iu_main) " +
                        "SELECT i.i_id, iut.iut_id, iu_ean, iu_krat, iu_num, iu_denum, iu_gros, iu_net, " +
                        "       iu_length, iu_width, iu_height, iu_area, iu_volume, iu_agent, iu_base, iu_main FROM items as i " +
                        "CROSS JOIN item_unit_types as iut " +
                        "CROSS JOIN (VALUES(${iu_ean}, ${iu_krat}, ${iu_num}, ${iu_denum}, ${iu_gros}, ${iu_net}, " +
                        "    ${iu_length}, ${iu_width}, ${iu_height}, ${iu_area}, ${iu_volume}, ${iu_agent}, ${iu_base}, ${iu_main})) " +
                        "    AS t (iu_ean, iu_krat, iu_num, iu_denum, iu_gros, iu_net, " +
                        "    iu_length, iu_width, iu_height, iu_area, iu_volume, iu_agent, iu_base, iu_main) " +
                        "WHERE i.i_exid = ${i_exid} AND iut.iut_exid = ${iut_exid};",
                    elem).then((value) => {
                        //добавлено
                    }, (err) => {
                        console.log('err', elem, '\n\n\n', err);
                    });
                });
            }
            resolve({"result": true});
        });
    },
    getItems: function(client, obj) {
        return new Promise(function(resolve, reject) {
            console.log("title", obj);
            var tov = {};
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            try {
                var pr = [];
                var nm = [];
                if (obj.items === "all") {
                    pr.push(db.query("SELECT i_id,i_name,i_prn,i_service,int_id,i_active, extract(epoch from i_mtime)::integer as i_mtime from items", {}));
                    nm.push("items");
                }
                if (obj.itemGroupTypes === "all") {
                    pr.push(db.query("SELECT igt_id, igt_name, igt_agent, igt_active, extract(epoch from igt_mtime)::integer as igt_mtime from item_Group_Types;", {}));
                    nm.push("itemGroupTypes");
                }
                if (obj.itemGroups === "all") {
                    pr.push(db.query("SELECT ig_id,igt_id,ig_value,ig_active, extract(epoch from ig_mtime)::integer as ig_mtime from item_Groups", {}));
                    nm.push("itemGroups");
                }
                if (obj.linkItemGroups === "all") {
                    pr.push(db.query("SELECT lig_id,i_id,ig_id,igt_id,lig_active, extract(epoch from lig_mtime)::integer as lig_mtime from link_Item_Group", {}));
                    nm.push("linkItemGroups");
                }
                if (obj.itemUnitTypes === "all") {
                    pr.push(db.query("SELECT iut_id,iut_name,imt_id,iut_okei,iut_active, extract(epoch from iut_mtime)::integer as iut_mtime from item_Unit_Types", {}));
                    nm.push("itemUnitTypes");
                }
                if (obj.itemUnits === "all") {
                    pr.push(db.query("SELECT iu_id,i_id, iut_id, iu_ean,iu_krat, iu_num, iu_denum,iu_gros, iu_net, iu_length, iu_width, iu_height, iu_area, iu_volume, " +
                        "iu_agent, iu_base, iu_main, iu_active, extract(epoch from iu_mtime)::integer as iu_mtime from item_Units", {}));
                    nm.push("itemUnits");
                }
                if (obj.itemsSearch === "all") {
                    pr.push(db.query("SELECT i.i_id, concat_ws(' ', ig1.ig_value, ig2.ig_value, ig3.ig_value, i_name) as value FROM items i " +
                        "LEFT JOIN link_item_group lig1 ON (i.i_id = lig1.i_id) AND (lig1.igt_id=1) " +
                        "LEFT JOIN item_groups ig1 ON lig1.ig_id = ig1.ig_id " +
                        "LEFT JOIN link_item_group lig2 ON (i.i_id = lig2.i_id) AND (lig2.igt_id=2) " +
                        "LEFT JOIN item_groups ig2 ON lig2.ig_id = ig2.ig_id " +
                        "LEFT JOIN link_item_group lig3 ON (i.i_id = lig3.i_id) AND (lig3.igt_id=3) " +
                        "LEFT JOIN item_groups ig3 ON lig3.ig_id = ig3.ig_id;", {}));
                    nm.push("itemsSearch");
                }
                Promise.all(pr).then((value) => {
                    for (let i = 0; i < nm.length; i++) {
                        let arr = value[i];
                        arr.forEach(elem => {
                            for (let prop in elem) {
                                if (elem[prop] === null)
                                    delete elem[prop];
                                }
                            });
                        tov[nm[i]] = arr;
                    }
                    console.log("tov");
                    resolve(tov);
                }, (err) => {
                    console.log('err all', err);
                });
                //var tov = require('../db/tov');

            } catch (err) {
                console.log("err", err);
                reject(err);
            }

        });
    },
    setCountragents: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.countragents) {
                console.log(' set countragents');
                obj.countragents.forEach(elem => {
                    db.query("INSERT INTO countragents (ca_exid, ca_type, ca_opf, ca_name, ca_prn, ca_info, ca_inn, ca_kpp, ca_client, ca_supplier, ca_carrier)" +
                        " VALUES (${ca_exid}, ${ca_type}, ${ca_opf}, ${ca_name}, ${ca_prn}, ${ca_info}, ${ca_inn}, ${ca_kpp}, ${ca_client}, ${ca_supplier}, ${ca_carrier})",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });
            }
            if (obj.deliveryPoints) {
                console.log(' set deliveryPoints');
                obj.deliveryPoints.forEach(elem => {
                    db.query("INSERT INTO delivery_points (dp_exid, dp_name, dp_prn, dp_client, dp_supplier, dp_carrier)" +
                        " VALUES (${dp_exid}, ${dp_name}, ${dp_prn}, ${dp_client}, ${dp_supplier}, ${dp_carrier})",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });
            }
            if (obj.linksCountragentDeliveryPoints) {
                console.log(' set linksCountragentDeliveryPoints');
                obj.linksCountragentDeliveryPoints.forEach(elem => {
                    db.query("INSERT INTO links_countragent_delivery_point (ca_id, dp_id) " +
                        " SELECT ca.ca_id, dp.dp_id FROM delivery_points as dp, countragents as ca WHERE ca.ca_exid=${ca_exid} and dp.dp_exid=${dp_exid}",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });
            }
            resolve({"result": true});
        });
    },
    getCountragents: function(client, obj) {
        return new Promise(function(resolve, reject) {
            console.log("title", obj);
            var tov = {};
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            try {
                var pr = [];
                var nm = [];
                if (obj.countragents === "all") {
                    pr.push(db.query("SELECT ca_id, ca_type, ca_opf, ca_head, ca_name, ca_prn, ca_inn, ca_kpp, adr_id, ca_client, ca_supplier, ca_carrier, ca_active, " +
                        "extract(epoch from ca_mtime)::integer as ca_mtime from countragents", {}));
                    nm.push("countragents");
                }
                if (obj.deliveryPoints === "all") {
                    pr.push(db.query("SELECT dp_id, dp_name, dp_prn, adr_id,dp_client, dp_supplier, dp_carrier, dp_active, " +
                        "extract(epoch from dp_mtime)::integer as dp_mtime from delivery_points", {}));
                    nm.push("deliveryPoints");
                }
                if (obj.address === "all") {
                    pr.push(db.query("SELECT *, extract(epoch from adr_mtime)::integer as adr_mtime from address", {}));
                    nm.push("address");
                }
                if (obj.linksCountragentDeliveryPoint === "all") {
                    pr.push(db.query("SELECT lcp_id, ca_id, dp_id, lcp_active, " +
                        "extract(epoch from lcp_mtime)::integer as lcp_mtime from links_countragent_delivery_point", {}));
                    nm.push("linksCountragentDeliveryPoint");
                }

                Promise.all(pr).then((value) => {
                    for (let i = 0; i < nm.length; i++) {
                        let arr = value[i];
                        arr.forEach(elem => {
                            for (let prop in elem) {
                                if (elem[prop] === null)
                                    delete elem[prop];
                                }
                            });
                        tov[nm[i]] = arr;
                    }
                    console.log("getCountragents");
                    resolve(tov);
                }, (err) => {
                    console.log('err all', err);
                });
                //var tov = require('../db/tov');

            } catch (err) {
                console.log("err", err);
                reject(err);
            }

        });
    },
    setPrices: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.pricelist) {
                obj.pricelist.forEach(elem => {
                    db.query("INSERT INTO pricelist (pl_exid, pl_name, pl_type, pl_active)" +
                        " VALUES (${pl_exid}, ${pl_name}, ${pl_type}, ${pl_active});",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });
            }
            if (obj.price) {

                obj.price.forEach(elem => {

                    db.query("INSERT INTO price (i_id, pl_id, p_date_b, p_date_e, p_cn) " +
                        "SELECT  i.i_id, pl.pl_id, ${p_date_b}::timestamp as p_date_b, ${p_date_e}::timestamp as p_date_e, ${p_cn} as p_cn " +
                        "FROM items i, pricelist pl WHERE i.i_exid = ${i_exid} AND pl_exid = ${pl_exid}",
                    elem).then((value) => {

                        // console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });
            }
            if (obj.pricelistLink) {
                console.log('1', 1);
                obj.pricelistLink.forEach(elem => {
                    db.query("INSERT INTO pricelist_link (pl_parent, pl_child, pll_prior) " +
                        " SELECT pl1.pl_id as pl_parent, pl2.pl_id as pl_child, ${pll_prior} as pll_prior FROM  pricelist pl1, pricelist pl2 " +
                        " WHERE pl1.pl_exid = ${pl_exparent} AND pl2.pl_exid = ${pl_exchild}",
                    elem).then((value) => {

                        console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });
            }

            resolve({"result": true});
        });
    },
    getPrices: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            try {
                var price = {};
                var pr = [];
                var nm = [];
                if (obj.pricelist === "all") {
                    console.log(1);
                    pr.push(db.query("SELECT pl_id,pl_name,pl_type,pl_active, extract(epoch from pl_mtime)::integer as pl_mtime FROM pricelist", {}));
                    nm.push("pricelist");
                }
                if (obj.price === "all") {
                    console.log(2);
                    pr.push(db.query("SELECT p_id,pl_id,i_id,extract(epoch from p_date_b)::bigint::REAL as p_date_b, extract(epoch from p_date_e)::bigint::REAL as p_date_e, " +
                        "p_cn,p_active, extract(epoch from p_mtime)::integer as p_mtime FROM price", {}));
                    nm.push("price");
                }
                if (obj.pricelistLink === "all") {
                    console.log(3);
                    pr.push(db.query("SELECT * FROM pricelist_link;", {}));
                    nm.push("pricelistLink");
                }
                Promise.all(pr).then((value) => {
                    for (let i = 0; i < nm.length; i++) {
                        let arr = value[i];
                        arr.forEach(elem => {
                            for (let prop in elem) {
                                if (elem[prop] === null)
                                    delete elem[prop];
                                }
                            });
                        price[nm[i]] = arr;
                    }
                    console.log("price");
                    resolve(price);
                }, (err) => {
                    console.log('err all', err);
                });
                //var tov = require('../db/tov');

            } catch (err) {
                console.log("err", err);
                reject(err);
            }
        });
    },
    setStocks: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.stores === "all") {
                console.log("set stores");
                obj.stores.forEach(elem => {
                    db.query("INSERT INTO stores (sr_exid, sr_name, sr_active)" +
                        " VALUES (${sr_exid}, ${sr_name}, ${sr_active} );",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });/**/
            }
            if (obj.storeGroups === "all") {
                console.log("set storeGroups");
                obj.storeGroups.forEach(elem => {
                    db.query("INSERT INTO store_groups (srg_exid, srg_name, srg_active)" +
                        " VALUES (${srg_exid}, ${srg_name}, ${srg_active} );",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });/**/
            }
            if (obj.linkStoreGroups === "all") {
                console.log("set linkStoreGroups");
                obj.linkStoreGroups.forEach(elem => {
                    db.query("INSERT INTO link_store_groups (sr_id, srg_id, lsg_sort, lsg_active)" +
                        " SELECT sr_id, srg_id, ${lsg_sort} AS lsg_sort, ${lsg_active} AS lsg_active FROM stores AS st, store_groups AS sg " +
                        " WHERE st.sr_exid = ${sr_exid} and sg.srg_exid = ${srg_exid};",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });/**/
            }
            if (obj.stocks === "all") {
                console.log("set stocks");
                obj.stocks.forEach(elem => {
                    db.query("INSERT INTO stocks (i_id, sr_id, sk_value, sk_active) " +
                        " SELECT i_id, sr_id, ${sk_value} as sk_value, ${sk_active} as sk_active FROM items as i, stores as sr " +
                        " WHERE i.i_exid=${i_exid} AND sr.sr_exid=${sr_exid}",
                    elem).then((value) => {
                        //console.log('value', value);
                    }, (err) => {
                        console.log('err', elem, err);
                    });
                });/**/
            }

            resolve({"result": true});
        });
    },
    getStocks: function(client, obj) {
        return new Promise(function(resolve, reject) {
            console.log("title", obj);
            var tov = {};
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            try {
                var pr = [];
                var nm = [];
                if (obj.stores === "all") {
                    pr.push(db.query("SELECT sr_id, sr_name, sr_active, " +
                        " extract(epoch from sr_mtime)::integer as sr_mtime FROM stores;", {}));
                    nm.push("stores");
                }
                if (obj.storeGroups === "all") {
                    pr.push(db.query("SELECT srg_id, srg_name, srg_active, " +
                        " extract(epoch from srg_mtime)::integer as srg_mtime FROM store_groups;", {}));
                    nm.push("storeGroups");
                }
                if (obj.linkStoreGroups === "all") {
                    pr.push(db.query("SELECT lsg_id, srg_id, sr_id, lsg_sort, lsg_active, " +
                        " extract(epoch from lsg_mtime)::integer as lsg_mtime FROM link_store_groups;", {}));
                    nm.push("linkStoreGroups");
                }
                if (obj.stocks === "all") {
                    pr.push(db.query("SELECT sk_id, sr_id, i_id, sk_active, " +
                        " extract(epoch from sk_mtime)::integer as sk_mtime FROM stocks;", {}));
                    nm.push("stocks");
                }

                Promise.all(pr).then((value) => {
                    for (let i = 0; i < nm.length; i++) {
                        let arr = value[i];
                        arr.forEach(elem => {
                            for (let prop in elem) {
                                if (elem[prop] === null)
                                    delete elem[prop];
                                }
                            });
                        tov[nm[i]] = arr;
                    }
                    console.log("getStocks");
                    resolve(tov);
                }, (err) => {
                    console.log('err all', err);
                });
                //var tov = require('../db/tov');

            } catch (err) {
                console.log("err", err);
                reject(err);
            }

        });
    },
    setLogCoord: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            console.log('obj', obj);
            var coord,
                res;
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
                    db.query("INSERT INTO wp_coords (coord, time, token) VALUES (${coord}, ${time}, ${idToken});", res).then(vr, ve);
                } catch (err) {}
                console.log('setLogCoord', res);
            }

            resolve({"result": true});
        });
    },
    getLogCoord: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            try {
                db.query("SELECT coord, token, extract(epoch from time)::integer as time FROM  wp_coords as c ORDER BY time;", obj).then((value) => {
                    resolve(value);
                });
            } catch (err) {}
        });
    }
};

exports.fun = wsfunc;
