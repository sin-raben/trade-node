/*jshint node:true, esversion: 6 */
"use strict";
var pgp = require('pg-promise')({
    // Initialization Options
});
var co = require('co');
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
                db.query("SELECT t.idtoken,t.keytoken,u.login,u.pass from wp_tokens t "+
                "LEFT JOIN wp_users u ON t.login = u.login where idToken=$1", obj.idToken).then((token) => {
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
                    pr.push(db.query("SELECT iu_id,i_id, iut_id, iu_ean,iu_krat, iu_num, iu_denum, "+
                        " iu_gros, iu_net, iu_length, iu_width, iu_height, iu_area, iu_volume, " +
                        " iu_agent, iu_base, iu_main, iu_active, extract(epoch from iu_mtime)::integer as iu_mtime from item_Units", {}));
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
                    db.query("INSERT INTO countragents (ca_exid, ca_type, ca_opf, ca_name, " +
                        " ca_prn, ca_info, ca_inn, ca_kpp, ca_client, ca_supplier, ca_carrier)" +
                        " VALUES (${ca_exid}, ${ca_type}, ${ca_opf}, ${ca_name}, " +
                        " ${ca_prn}, ${ca_info}, ${ca_inn}, ${ca_kpp}, ${ca_client}, ${ca_supplier}, ${ca_carrier})",
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
                    pr.push(db.query("SELECT ca_id, ca_type, ca_opf, ca_head, ca_name, ca_prn, ca_inn, ca_kpp, adr_id, ca_client, ca_supplier, " +
                        " ca_carrier, ca_active, extract(epoch from ca_mtime)::integer as ca_mtime from countragents", {}));
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
                    pr.push(db.query("SELECT p_id,pl_id,i_id,extract(epoch from p_date_b)::bigint::REAL as p_date_b, "+
                    "extract(epoch from p_date_e)::bigint::REAL as p_date_e, " +
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
            var storesF = function(arr) {
                let sr = [];
                let q = "CREATE TEMP TABLE tsr (sr_id INTEGER, sr_exid TEXT, sr_name VARCHAR(50), " +
                " sr_type smallint, sr_active BOOLEAN, sr_mtime TIMESTAMP, updt BOOLEAN, ins BOOLEAN);" +
                " INSERT INTO tsr( SELECT s.sr_id, t.*, NOW() AS sr_mtime, " +
                "((s.sr_name <> t.sr_name) OR (s.sr_type <> t.sr_type) OR (s.sr_active <> t.sr_active)) as updt, " +
                " sr_id ISNULL  as ins FROM stores s RIGHT JOIN ( VALUES ";
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    sr.push(elem.sr_exid);
                    sr.push(elem.sr_name);
                    sr.push(elem.sr_type);
                    sr.push(elem.sr_active);
                });
                q = q + ") AS t(sr_exid, sr_name, sr_type, sr_active) ON t.sr_exid = s.sr_exid);";
                q = q + " INSERT INTO stores (sr_exid, sr_name, sr_type, sr_active, sr_mtime)" +
                " SELECT sr_exid,sr_name,sr_type,sr_active,sr_mtime FROM tsr WHERE (ins= TRUE);";
                q = q + " UPDATE stores AS sr SET sr_exid=t.sr_exid, sr_name=t.sr_name, " +
                " sr_type=t.sr_type, sr_active=t.sr_active, sr_mtime=t.sr_mtime  FROM (" +
                " SELECT sr_id, sr_exid,sr_name,sr_type,sr_active,sr_mtime FROM tsr " +
                " WHERE (updt = TRUE)) AS t WHERE sr.sr_id = t.sr_id;";
                q = q + " DROP TABLE tsr;";
                return [q, sr];
            };
            var storeLinkF = function(arr) {

                let srl = [];
                let q = "CREATE TEMP TABLE tsrl ( srl_id INTEGER, srl_parent INTEGER, srl_child INTEGER, " +
                " srl_sort INTEGER, srl_active BOOLEAN, srl_mtime TIMESTAMP, updt BOOLEAN, ins BOOLEAN); ";
                q = q + " INSERT INTO tsrl(" +
                " SELECT srl.srl_id, s2.sr_id AS srl_parent, s1.sr_id AS srl_child, t.srl_sort, t.srl_active," +
                " NOW() AS srl_mtime, ((srl.srl_sort <> t.srl_sort) OR (srl.srl_active <> t.srl_active)) as updt, " +
                " ((srl_id ISNULL) AND (s1.sr_id NOTNULL) AND (s2.sr_id NOTNULL)) AS ins FROM stores s1 " +
                " RIGHT JOIN ( VALUES ";
                //console.log('obj.storeLink', obj.storeLink);
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + " ($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ") ";
                    srl.push(elem.srl_exparent);
                    srl.push(elem.srl_exchild);
                    srl.push(elem.srl_sort);
                    srl.push(elem.srl_active);
                });
                q = q + " ) AS t(srl_exparent, srl_exchild, srl_sort, srl_active) ON t.srl_exchild=s1.sr_exid " +
                " LEFT JOIN stores AS s2 ON t.srl_exparent=s2.sr_exid " +
                " LEFT JOIN store_link AS srl ON srl.srl_parent=s2.sr_id AND srl.srl_child=s1.sr_id); ";
                q = q + " INSERT INTO store_link (srl_parent, srl_child, srl_sort, srl_active, srl_mtime)" +
                " SELECT srl_parent, srl_child, srl_sort, srl_active, srl_mtime FROM tsrl WHERE (ins= TRUE);";
                q = q + " UPDATE store_link AS srl SET srl_parent=t.srl_parent, srl_child=t.srl_child, " +
                " srl_sort=t.srl_sort, srl_active=t.srl_active, srl_mtime=t.srl_mtime FROM (" +
                " SELECT srl_id, srl_parent, srl_child, srl_sort, srl_active, srl_mtime FROM tsrl " +
                " WHERE (updt = TRUE)) AS t WHERE srl.srl_id = t.srl_id;";
                q = q + " DROP TABLE tsrl;";
                return [q, srl];
            };
            var stocksF = function(arr) {
                let sc = [];
                let q = "CREATE TEMP TABLE tsc ( sc_id INTEGER, sr_id INTEGER, i_id INTEGER, "+
                " sc_amount INTEGER, sc_active BOOLEAN, sc_mtime TIMESTAMP, updt BOOLEAN, ins BOOLEAN); ";
                q = q + " INSERT INTO tsc (SELECT sc.sc_id, sr.sr_id, i.i_id, t.sc_amount, "+
                "t.sc_active, NOW() AS sc_mtime, "+
                " ((sc.sc_amount <> t.sc_amount) OR (sc.sc_active <> t.sc_active)) AS updt, "+
                "((sc_id ISNULL) AND (sr.sr_id NOTNULL) AND (i.i_id NOTNULL)) AS ins "+
                " FROM stores sr RIGHT JOIN (VALUES ";
                //console.log('obj.storeLink', obj.storeLink);
                arr.forEach((elem, i) => {
                        if (i !== 0)
                            q = q + ", ";
                        q = q + " ($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ") ";
                        sc.push(elem.i_exid);
                        sc.push(elem.sr_exid);
                        sc.push(elem.sc_amount);
                        sc.push(elem.sc_active);

                });
                q = q + ") AS t(i_exid, sr_exid, sc_amount, sc_active) ON sr.sr_exid = t.sr_exid "+
                " LEFT JOIN items i ON i.i_exid = t.i_exid "+
                " LEFT JOIN stocks sc ON sc.sr_id = sr.sr_id AND sc.i_id = i.i_id);";
                q = q + " INSERT INTO stocks (i_id, sr_id, sc_amount, sc_active, sc_mtime) "+
                " SELECT i_id, sr_id, sc_amount, sc_active, sc_mtime FROM tsc WHERE (ins= TRUE);";
                q = q + " UPDATE stocks AS sc SET i_id=t.i_id, sr_id=t.sr_id, "+
                " sc_amount=t.sc_amount, sc_active=t.sc_active, sc_mtime=t.sc_mtime FROM ("+
                " SELECT sc_id, i_id, sr_id, sc_amount, sc_active, sc_mtime FROM tsc"+
                " WHERE (updt = TRUE)) AS t WHERE sc.sc_id = t.sc_id; ";
                q = q + " DROP TABLE tsc;";
                return [q, sc];
            };

            db.task(function *(t) {

                if (obj.stores) {
                    console.log('start sr', new Date(), obj.stores.length);
                    for (let i = 0; i < obj.stores.length; i=i+100) {
                        let a = obj.stores.slice(i, i+100);
                        let [q,arr] = storesF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end sr', new Date());
                }
                if (obj.storeLink) {
                    console.log('start srl', new Date(), obj.storeLink.length);
                    for (let i = 0; i < obj.storeLink.length; i=i+100) {
                        let a = obj.storeLink.slice(i, i+100);
                        let [q,arr] = storeLinkF(a);
                        yield t.none(q,arr);
                    }
                    console.log('end srl', new Date());
                }
                if (obj.stocks) {
                    console.log('start sc', new Date(), obj.stocks.length);

                    for (let i = 0; i < obj.stocks.length; i=i+100) {
                        let a = obj.stocks.slice(i, i+100);
                        let [q, arr] = stocksF(a);
                        yield t.none(q,arr);
                    }

                    console.log('end sc', new Date());
                }
                return Promise.resolve(true);
            }).then(function(r) {
                console.log('r', r);
                resolve({"result": true});
            }).catch(function(err) {
                console.log("Gen err", err);
                resolve({"result": false});
            });/**/

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
                    pr.push(db.query("SELECT sr_id, sr_name, sr_active, sr_type, " +
                        " extract(epoch from sr_mtime)::integer as sr_mtime FROM stores", {}));
                    nm.push("stores");
                }
                if (obj.storeLink === "all") {
                    pr.push(db.query("SELECT srl_id, srl_parent, srl_child, srl_sort, srl_active, " +
                        " extract(epoch from srl_mtime)::integer as srl_mtime FROM store_link", {}));
                    nm.push("storeLink");
                }
                if (obj.stocks === "all") {
                    pr.push(db.query("SELECT sc_id, sr_id, i_id, sc_amount, sc_active, " +
                        " extract(epoch from sc_mtime)::integer as sc_mtime FROM stocks", {}));
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
