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
                db.query("SELECT t.idtoken,t.keytoken,u.login,u.pass from wp_tokens t " +
                    "LEFT JOIN wp_users u ON t.login = u.login where idToken=$1",
                obj.idToken).then((token) => {
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
            /*if (obj.items) {
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
            resolve({"result": true});*/

            var itemsF = function(arr) {
                let it = [];
                let q = `CREATE TEMP TABLE ti (
                            i_id INTEGER,
                            i_exid TEXT,
                            i_name VARCHAR(100),
                            i_prn VARCHAR(100),
                            i_info TEXT,
                            i_img TEXT,
                            i_service BOOLEAN,
                            int_id INTEGER,
                            i_active BOOLEAN,
                            updt BOOLEAN,
                            ins BOOLEAN
                        );
                        INSERT INTO ti(SELECT
                            i.i_id,
                            t.*,
                            ((t.i_name<>i.i_name) OR (t.i_prn<>i.i_prn) OR (t.i_info<>i.i_info)
                            OR (t.i_img<>i.i_img) OR (t.i_service<>i.i_service)
                            OR (t.int_id<>i.int_id) OR (t.i_active<>i.i_active)) AS updt,
                            (i.i_id ISNULL ) AS ins
                        FROM (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 8 + 1) + ",$" + (i * 8 + 2) + ",$" + (i * 8 + 3) + ",$" + (i * 8 + 4);
                    q = q + ",$" + (i * 8 + 5) + ",$" + (i * 8 + 6) + ",$" + (i * 8 + 7) + ",$" + (i * 8 + 8) + ")";
                    it.push(elem.i_exid);
                    it.push(elem.i_name);
                    it.push(elem.i_prn);
                    it.push(elem.i_info);
                    it.push(elem.i_img);
                    it.push(elem.i_service);
                    it.push(elem.int_id);
                    it.push(elem.i_active);
                });
                q = q + ` ) AS t(i_exid, i_name, i_prn, i_info, i_img, i_service, int_id, i_active)
                    LEFT JOIN items i ON (i.i_exid=t.i_exid));
                INSERT INTO items(i_exid, i_name, i_prn, i_info, i_img, i_service, int_id,i_active)
                    SELECT i_exid, i_name, i_prn, i_info, i_img, i_service, int_id,i_active FROM ti WHERE ti.ins=TRUE;
                UPDATE items AS i SET
                    i_name=t.i_name, i_prn=t.i_prn,
                    i_info=t.i_info, i_img=t.i_img,
                    i_service=t.i_service, int_id=t.int_id,
                    i_active=t.i_active, i_mtime=now()
                FROM (
                    SELECT * FROM ti WHERE updt=TRUE
                ) AS t WHERE (t.i_id=i.i_id);
                DROP TABLE ti;`;
                return [q, it];
            };
            var itemsGroupTypeF = function(arr) {
                let igt = [];
                let q = `CREATE TEMP TABLE tigt (
                    igt_id INTEGER,
                    igt_exid TEXT,
                    igt_name VARCHAR(50),
                    igt_priority INTEGER,
                    igt_agent BOOLEAN,
                    igt_active BOOLEAN,
                    updt BOOLEAN,
                    ins BOOLEAN
                );
                INSERT INTO tigt (
                SELECT
                    igt.igt_id,
                    t.*,
                    ((t.igt_name<>igt.igt_name) OR (t.igt_priority<>igt.igt_priority) OR
                    (t.igt_agent<>igt.igt_agent) OR (t.igt_active<>igt.igt_active)) AS updt,
                    (igt.igt_id ISNULL ) AS ins
                FROM (VALUES `;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 5 + 1) + ",$" + (i * 5 + 2) + ",$" + (i * 5 + 3);
                    q = q + ",$" + (i * 5 + 4) + ",$" + (i * 5 + 5) + ")";
                    igt.push(elem.igt_exid);
                    igt.push(elem.igt_name);
                    igt.push(elem.igt_priority);
                    igt.push(elem.igt_agent);
                    igt.push(elem.igt_active);
                });
                q = q + ` ) AS t(igt_exid, igt_name, igt_priority, igt_agent, igt_active)
                LEFT JOIN item_group_types igt ON igt.igt_exid=t.igt_exid);
                INSERT INTO item_group_types (igt_exid, igt_name, igt_priority, igt_agent,  igt_active)
                    SELECT igt_exid, igt_name, igt_priority, igt_agent, igt_active FROM tigt WHERE (ins=TRUE);
                UPDATE item_group_types igt SET
                    igt_exid=t.igt_exid, igt_name=t.igt_name,
                    igt_priority=t.igt_priority, igt_agent=t.igt_agent,
                    igt_active=t.igt_active, igt_mtime=now()
                FROM (
                    SELECT * FROM tigt WHERE (updt=TRUE)
                ) AS t WHERE (t.igt_id=igt.igt_id);
                DROP TABLE tigt;`;
                return [q, igt];
            };
            var itemsGroupF = function(arr) {
                let ig = [];
                let q = `CREATE TEMP TABLE tig (
                    ig_id     INTEGER,
                    igt_id    INTEGER,
                    ig_exid   TEXT,
                    ig_value  VARCHAR(50),
                    ig_active BOOLEAN,
                    updt BOOLEAN,
                    ins BOOLEAN
                );
                INSERT INTO tig (
                    SELECT
                        ig.ig_id, igt.igt_id, t.ig_exid, t.ig_value, t.ig_active,
                        ((t.ig_value <> ig.ig_value) OR (t.ig_active <> ig.ig_active)) AS updt,
                        ((ig.ig_id ISNULL) AND (igt.igt_id NOTNULL))                   AS ins
                    FROM (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    ig.push(elem.igt_exid);
                    ig.push(elem.ig_exid);
                    ig.push(elem.ig_value);
                    ig.push(elem.ig_active);
                });
                q = q + `) AS t(igt_exid, ig_exid, ig_value, ig_active)
                        LEFT JOIN item_group_types igt ON (igt.igt_exid = t.igt_exid)
                        LEFT JOIN item_groups ig ON (ig.ig_exid = t.ig_exid)
                    );
                    INSERT INTO item_groups(igt_id, ig_exid, ig_value, ig_active)
                        SELECT igt_id, ig_exid, ig_value, ig_active FROM tig WHERE (ins=TRUE);
                    UPDATE item_groups ig SET
                        igt_id=t.igt_id, ig_exid=t.ig_exid,
                        ig_value=t.ig_value, ig_active=t.ig_active,
                        ig_mtime=now()
                    FROM (
                       SELECT * FROM tig WHERE (updt=TRUE)
                    ) AS t WHERE (t.ig_id=ig.ig_id);
                    DROP TABLE tig;`;
                return [q, ig];
            };
            var linkItemGroupF = function(arr) {
                let lig = [];
                let q = `CREATE TEMP TABLE tlig (
                    lig_id INTEGER,
                    i_id INTEGER,
                    ig_id INTEGER,
                    igt_id INTEGER,
                    lig_active BOOLEAN,
                    updt BOOLEAN,
                    ins BOOLEAN
                );
                INSERT INTO tlig (
                    SELECT
                        lig.lig_id, i.i_id,
                        ig.ig_id, igt.igt_id,
                        t.lig_active,
                        ((ig.ig_id<>lig.ig_id)OR(t.lig_active<>lig.lig_active)) AS updt,
                        (lig.lig_id ISNULL AND (i.i_id NOTNULL )AND (igt.igt_id NOTNULL )) AS ins
                    FROM (VALUES `;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    lig.push(elem.i_exid);
                    lig.push(elem.igt_exid);
                    lig.push(elem.ig_exid);
                    lig.push(elem.lig_active);
                });
                q = q + `) AS t(i_exid, igt_exid, ig_exid, lig_active)
                LEFT JOIN items AS i ON t.i_exid=i.i_exid
                LEFT JOIN item_group_types igt ON t.igt_exid=igt.igt_exid
                LEFT JOIN item_groups ig ON t.ig_exid=ig.ig_exid
                LEFT JOIN link_item_group lig ON (i.i_id=lig.i_id) AND (igt.igt_id=lig.igt_id));
                INSERT INTO link_item_group(i_id,ig_id,igt_id,lig_active)
                    SELECT i_id,ig_id,igt_id,lig_active FROM tlig WHERE (ins);

                UPDATE link_item_group AS lig SET
                    ig_id=t.ig_id, lig_active=t.lig_active,
                    lig_mtime=now()
                FROM (
                    SELECT * FROM tlig WHERE (updt=TRUE)
                ) AS t WHERE (t.lig_id=lig.lig_id);

                DROP TABLE tlig;`;
                return [q, lig];
            };
            var itemsUnitTypeF = function(arr) {
                let iut = [];
                let q = `CREATE TEMP TABLE tiut (
                  iut_id     INTEGER,
                  iut_exid   TEXT,
                  iut_name   VARCHAR(10),
                  imt_id     INTEGER,
                  iut_okei   INTEGER,
                  iut_active BOOLEAN,
                  updt BOOLEAN,
                  ins BOOLEAN
                );

                INSERT INTO tiut(SELECT
                  iut.iut_id,
                  t.*,
                  ((iut.iut_name<>t.iut_name)OR(imt.imt_id<>t.imt_id)OR
                   (iut.iut_okei<>t.iut_okei)OR(iut.iut_active<>t.iut_active)) as updt,
                  (iut_id ISNULL AND (imt.imt_id NOTNULL )) as ins
                FROM (VALUES `;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    let j = i * 5;
                    q = q + "($" + (j + 1) + ",$" + (j + 2) + ",$" + (j + 3) + ",$" + (j + 4) + ",$" + (j + 5) + ")";
                    iut.push(elem.iut_exid);
                    iut.push(elem.iut_name);
                    iut.push(elem.imt_id);
                    iut.push(elem.iut_okei);
                    iut.push(elem.iut_active);
                });
                q = q + `) AS t(iut_exid,iut_name,imt_id,iut_okei,iut_active)
                  LEFT JOIN item_unit_types iut ON iut.iut_exid=t.iut_exid
                  LEFT JOIN item_metric_types imt ON t.imt_id=imt.imt_id);
                INSERT INTO item_unit_types(iut_exid,iut_name,imt_id,iut_okei,iut_active)
                  SELECT iut_exid,iut_name,imt_id,iut_okei,iut_active FROM tiut WHERE (ins);
                UPDATE item_unit_types AS iut SET
                  iut_name=t.iut_name,imt_id=t.imt_id,
                  iut_okei=t.iut_okei,iut_active=t.iut_active
                FROM (
                    SELECT * FROM tiut WHERE (updt)
                ) AS t WHERE iut.iut_id=t.iut_id;
                DROP TABLE tiut;`;
                return [q, iut];
            };
            var itemsUnitF = function(arr) {
                let iu = [];
                let q = ` CREATE TEMP TABLE tiu (
                  iu_id     INTEGER,
                  i_id      INTEGER,
                  iut_id    INTEGER,
                  iu_ean    VARCHAR(15),
                  iu_krat   INTEGER,
                  iu_num    INTEGER,
                  iu_denum  INTEGER,
                  iu_gros   INTEGER,
                  iu_net    INTEGER,
                  iu_length INTEGER,
                  iu_width  INTEGER,
                  iu_height INTEGER,
                  iu_area   INTEGER,
                  iu_volume BIGINT,
                  iu_agent  BOOLEAN,
                  iu_base   BOOLEAN,
                  iu_main   BOOLEAN,
                  iu_active BOOLEAN,
                  updt      BOOLEAN,
                  ins       BOOLEAN
                );
                INSERT INTO tiu(SELECT
                  iu.iu_id,
                  i.i_id,
                  iut.iut_id,
                  t.iu_ean, t.iu_krat, t.iu_num, t.iu_denum, t.iu_gros, t.iu_net,
                  t.iu_length, t.iu_width, t.iu_height, t.iu_area, t.iu_volume,
                  t.iu_agent, t.iu_base, t.iu_main, t.iu_active,
                  (iu.iu_ean <> t.iu_ean) OR (iu.iu_krat <> t.iu_krat) OR
                  (iu.iu_num <> t.iu_num) OR (iu.iu_denum <> t.iu_denum) OR
                  (iu.iu_gros <> t.iu_gros) OR (iu.iu_net <> t.iu_net) OR
                  (iu.iu_length <> t.iu_length) OR (iu.iu_width <> t.iu_width) OR
                  (iu.iu_height <> t.iu_height) OR (iu.iu_area <> t.iu_area) OR
                  (iu.iu_volume <> t.iu_volume) OR (iu.iu_agent <> t.iu_agent) OR
                  (iu.iu_base <> t.iu_base) OR (iu.iu_main <> t.iu_main) OR
                  (iu.iu_active <> t.iu_active) AS updt,
                  (iu.iu_id ISNULL AND i.i_id NOTNULL AND iut.iut_id NOTNULL)   AS ins
                FROM (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    iu.push(elem.i_exid);
                    iu.push(elem.iut_exid);
                    iu.push(elem.iu_ean);
                    iu.push(elem.iu_krat);
                    iu.push(elem.iu_num);
                    iu.push(elem.iu_denum);
                    iu.push(elem.iu_gros);
                    iu.push(elem.iu_net);
                    iu.push(elem.iu_length);
                    iu.push(elem.iu_width);
                    iu.push(elem.iu_height);
                    iu.push(elem.iu_area);
                    iu.push(elem.iu_volume);
                    iu.push(elem.iu_agent);
                    iu.push(elem.iu_base);
                    iu.push(elem.iu_main);
                    iu.push(elem.iu_active);
                    let j = i * 17;
                    for (let ii = 1; ii <= 17; ii++) {
                        if (ii === 1) {
                            q = q + "($" + (j + ii);
                        } else {
                            q = q + ",$" + (j + ii);
                        }
                    }
                    q = q + ")";

                });
                q = q + ` ) AS t(i_exid, iut_exid, iu_ean, iu_krat, iu_num, iu_denum,
                     iu_gros, iu_net, iu_length, iu_width, iu_height, iu_area,
                     iu_volume, iu_agent, iu_base, iu_main, iu_active)
                  LEFT JOIN items i ON i.i_exid = t.i_exid
                  LEFT JOIN item_unit_types iut ON iut.iut_exid = t.iut_exid
                  LEFT JOIN item_units iu ON (iu.iut_id = iut.iut_id) AND (iu.i_id = i.i_id));

                INSERT INTO item_units (i_id, iut_id, iu_ean, iu_krat, iu_num, iu_denum, iu_gros, iu_net, iu_length, iu_width, iu_height, iu_area, iu_volume, iu_agent, iu_base, iu_main, iu_active)
                    SELECT i_id, iut_id, iu_ean, iu_krat, iu_num, iu_denum, iu_gros, iu_net, iu_length, iu_width, iu_height, iu_area, iu_volume, iu_agent, iu_base, iu_main, iu_active
                    FROM tiu WHERE ins;

                UPDATE item_units AS iu SET
                  iu_ean=t.iu_ean,iu_krat=t.iu_krat,iu_num=t.iu_num,iu_denum=t.iu_denum,iu_gros=t.iu_gros,iu_net=t.iu_net,iu_length=t.iu_length,iu_width=t.iu_width,iu_height=t.iu_height,iu_area=t.iu_area,iu_volume=t.iu_volume,iu_agent=t.iu_agent,iu_base=t.iu_base,iu_main=t.iu_main,iu_active=t.iu_active
                FROM (
                    SELECT * FROM tiu WHERE updt=TRUE
                ) AS t WHERE iu.iu_id=t.iu_id;
                DROP TABLE tiu;`;
                return [q, iu];
            };
            db.task(function * (t) {
                if (obj.items) {
                    console.log('start i', new Date(), obj.items.length);
                    for (let i = 0; i < obj.items.length; i = i + 100) {
                        let a = obj.items.slice(i, i + 100);
                        let [q,
                            arr] = itemsF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end i', new Date());
                }
                if (obj.itemsGroup) {
                    console.log('start ig', new Date(), obj.itemsGroup.length);
                    for (let i = 0; i < obj.itemsGroup.length; i = i + 100) {
                        let a = obj.itemsGroup.slice(i, i + 100);
                        let [q,
                            arr] = itemsGroupF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end ig', new Date());
                }
                if (obj.itemsGroupType) {
                    console.log('start igt', new Date(), obj.itemsGroupType.length);
                    for (let i = 0; i < obj.itemsGroupType.length; i = i + 100) {
                        let a = obj.itemsGroupType.slice(i, i + 100);
                        let [q,
                            arr] = itemsGroupTypeF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end igt', new Date());
                }
                if (obj.linkItemGroup) {
                    console.log('start lig', new Date(), obj.linkItemGroup.length);
                    for (let i = 0; i < obj.linkItemGroup.length; i = i + 100) {
                        let a = obj.linkItemGroup.slice(i, i + 100);
                        let [q,
                            arr] = linkItemGroupF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end lig', new Date());
                }
                if (obj.itemsUnitType) {
                    console.log('start iut', new Date(), obj.itemsUnitType.length);
                    for (let i = 0; i < obj.itemsUnitType.length; i = i + 100) {
                        let a = obj.itemsUnitType.slice(i, i + 100);
                        let [q,
                            arr] = itemsUnitTypeF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end iut', new Date());
                }
                if (obj.itemsUnit) {
                    console.log('start iu', new Date(), obj.itemsUnit.length);
                    for (let i = 0; i < obj.itemsUnit.length; i = i + 100) {
                        let a = obj.itemsUnit.slice(i, i + 100);
                        let [q,
                            arr] = itemsUnitF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end iu', new Date());
                }
                return Promise.resolve(true);
            }).then(function(r) {
                resolve({"result": true});
            }).catch(function(err) {
                console.log("Gen err", err);
                resolve({"result": false});
            });/**/
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
                    pr.push(db.query("SELECT igt_id, igt_name, igt_agent, igt_active, " +
                        "extract(epoch from igt_mtime)::integer as igt_mtime from item_Group_Types;", {}));
                    nm.push("itemGroupTypes");
                }
                if (obj.itemGroups === "all") {
                    pr.push(db.query("SELECT ig_id,igt_id,ig_value,ig_active, " +
                        "extract(epoch from ig_mtime)::integer as ig_mtime from item_Groups", {}));
                    nm.push("itemGroups");
                }
                if (obj.linkItemGroups === "all") {
                    pr.push(db.query("SELECT lig_id,i_id,ig_id,igt_id,lig_active, " +
                        "extract(epoch from lig_mtime)::integer as lig_mtime from link_Item_Group", {}));
                    nm.push("linkItemGroups");
                }
                if (obj.itemUnitTypes === "all") {
                    pr.push(db.query("SELECT iut_id,iut_name,imt_id,iut_okei,iut_active, " +
                        "extract(epoch from iut_mtime)::integer as iut_mtime from item_Unit_Types", {}));
                    nm.push("itemUnitTypes");
                }
                if (obj.itemUnits === "all") {
                    pr.push(db.query("SELECT iu_id,i_id, iut_id, iu_ean,iu_krat, iu_num, iu_denum, " +
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
            /*if (obj.countragents) {
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
            }*/
            var countragentsF = function(arr) {
                let ca = [];
                let q = `CREATE TEMP TABLE tca (
                    ca_id INTEGER, ca_exid TEXT,
                    cat_id INTEGER, ca_head INTEGER,
                    ca_name TEXT, ca_prn TEXT,
                    ca_info TEXT, ca_inn VARCHAR(25),
                    ca_kpp VARCHAR(25), ca_client BOOLEAN,
                    ca_supplier BOOLEAN, ca_carrier BOOLEAN,
                    ca_active BOOLEAN, updt BOOLEAN, ins BOOLEAN );
                INSERT INTO tca (
                    SELECT
                        ca.ca_id, t.ca_exid,
                        t.cat_id, ch.ca_id,
                        t.ca_name, t.ca_prn,
                        t.ca_info, t.ca_inn,
                        t.ca_kpp, t.ca_client,
                        t.ca_supplier, t.ca_carrier, t.ca_active,
                        ((ca.cat_id <> t.cat_id) OR (ca.ca_head <> ch.ca_id) OR (ca.ca_name <> t.ca_name)
                        OR (ca.ca_prn <> t.ca_prn) OR (ca.ca_info <> t.ca_info) OR
                        (ca.ca_client <> t.ca_client) OR (ca.ca_supplier <> t.ca_supplier) OR
                        (ca.ca_carrier <> t.ca_carrier) OR (ca.ca_active <> t.ca_active)) AS updt,
                        (ca.ca_id ISNULL) AS ins
                    FROM (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 12 + 1) + ",$" + (i * 12 + 2) + ",$" + (i * 12 + 3) + ",$" + (i * 12 + 4);
                    q = q + ",$" + (i * 12 + 5) + ",$" + (i * 12 + 6) + ",$" + (i * 12 + 7) + ",$" + (i * 12 + 8);
                    q = q + ",$" + (i * 12 + 9) + ",$" + (i * 12 + 10) + ",$" + (i * 12 + 11) + ",$" + (i * 12 + 12) + ")";
                    ca.push(elem.ca_exid);
                    ca.push(elem.cat_id);
                    ca.push(elem.ca_exhead);
                    ca.push(elem.ca_name);
                    ca.push(elem.ca_prn);
                    ca.push(elem.ca_info);
                    ca.push(elem.ca_inn);
                    ca.push(elem.ca_kpp);
                    ca.push(elem.ca_client);
                    ca.push(elem.ca_supplier);
                    ca.push(elem.ca_carrier);
                    ca.push(elem.ca_active);
                });
                q = q + `) AS t(ca_exid, cat_id, ca_exhead, ca_name, ca_prn, ca_info,
                    ca_inn, ca_kpp, ca_client, ca_supplier, ca_carrier, ca_active)
                LEFT JOIN countragents ca ON (ca.ca_exid = t.ca_exid)
                LEFT JOIN countragents ch ON (ch.ca_exid = t.ca_exhead));

                INSERT INTO countragents
                        (ca_exid, cat_id, ca_head, ca_name, ca_prn,
                        ca_info, ca_inn, ca_kpp, ca_client,
                        ca_supplier, ca_carrier, ca_active)
                    SELECT
                        ca_exid, cat_id, ca_head, ca_name, ca_prn, ca_info, ca_inn,
                        ca_kpp, ca_client, ca_supplier, ca_carrier, ca_active
                    FROM tca WHERE (ins = TRUE);

                UPDATE countragents AS ca SET
                    cat_id = t.cat_id, ca_head = t.ca_head, ca_name = t.ca_name,
                    ca_prn = t.ca_prn, ca_info = t.ca_info, ca_inn = t.ca_inn,
                    ca_kpp = t.ca_kpp, ca_client = t.ca_client, ca_supplier = t.ca_supplier,
                    ca_carrier = t.ca_carrier, ca_active = t.ca_active, ca_mtime = now()
                FROM (
                    SELECT * FROM tca WHERE (updt = TRUE)
                ) AS t WHERE ca.ca_id = t.ca_id;
                DROP TABLE tca;`;

                return [q, ca];
            };
            var deliveryPointsF = function(arr) {
                let dp = [];
                let q = `CREATE TEMP TABLE tdp(
                    dp_id INTEGER, dp_exid TEXT, dp_name VARCHAR(100),
                    dp_prn VARCHAR(100), dp_info TEXT,
                    dp_client BOOLEAN, dp_supplier BOOLEAN,
                    dp_carrier BOOLEAN, dp_active BOOLEAN,
                    updt BOOLEAN, ins BOOLEAN
                );
                INSERT INTO tdp(
                    SELECT dp.dp_id,t.*,
                    ((dp.dp_name<>t.dp_name) OR (dp.dp_prn<>t.dp_prn) OR
                    (dp.dp_info<>t.dp_info)OR (dp.dp_client<>t.dp_client) OR
                    (dp.dp_supplier<>t.dp_supplier)OR (dp.dp_carrier<>t.dp_carrier) OR
                    (dp.dp_active <> t.dp_active)) AS updt,
                    dp_id ISNULL AS ins
                 FROM (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 8 + 1) + ",$" + (i * 8 + 2) + ",$" + (i * 8 + 3) + ",$" + (i * 8 + 4);
                    q = q + ",$" + (i * 8 + 5) + ",$" + (i * 8 + 6) + ",$" + (i * 8 + 7) + ",$" + (i * 8 + 8) + ")";
                    dp.push(elem.dp_exid);
                    dp.push(elem.dp_name);
                    dp.push(elem.dp_prn);
                    dp.push(elem.dp_info);
                    dp.push(elem.dp_client);
                    dp.push(elem.dp_supplier);
                    dp.push(elem.dp_carrier);
                    dp.push(elem.dp_active);
                });
                q = q + `) AS t(dp_exid, dp_name, dp_prn, dp_info, dp_client,
                    dp_supplier, dp_carrier, dp_active)
                    LEFT JOIN delivery_points dp ON (dp.dp_exid=t.dp_exid));
                INSERT INTO delivery_points (
                    dp_exid, dp_name, dp_prn, dp_info, dp_client, dp_supplier, dp_carrier, dp_active)
                    SELECT dp_exid, dp_name, dp_prn, dp_info, dp_client, dp_supplier, dp_carrier, dp_active
                FROM tdp WHERE tdp.ins=TRUE ;
                UPDATE delivery_points AS dp SET
                    dp_name=t.dp_name, dp_prn=t.dp_prn,
                    dp_info=t.dp_info, dp_client= t.dp_client,
                    dp_supplier=t.dp_supplier, dp_carrier=t.dp_carrier,
                    dp_active=t.dp_active, dp_mtime=now()
                FROM (
                    SELECT * FROM tdp WHERE updt=TRUE
                ) AS t WHERE t.dp_id=dp.dp_id;
                DROP TABLE tdp;`;
                return [q, dp];
            };
            var addressF = function(arr) {
                let adr = [];
                let q = `CREATE TEMP TABLE tadr (
                    adr_id INTEGER, any_id INTEGER,
                    adrt_id INTEGER, adr_str TEXT,
                    adr_fias VARCHAR(50), adr_geo point,
                    adr_json JSONB, adr_active BOOLEAN,
                    updt BOOLEAN, ins BOOLEAN);
                INSERT INTO tadr (adr_id,any_id,adrt_id,adr_str,adr_active,updt,ins)
                SELECT
                    adr.adr_id, t.*,
                    ((t.adr_str<>adr.adr_str)OR(t.adr_active<>adr.adr_active)) AS updt,
                    (adr.adr_id ISNULL)AND(t.any_id NOTNULL) AS ins
                FROM(
                    SELECT
                        CASE WHEN cau.ca_id NOTNULL THEN cau.ca_id
                             WHEN caf.ca_id NOTNULL THEN caf.ca_id
                             WHEN dp.dp_id  NOTNULL THEN dp.dp_id ELSE NULL END  as any_id,
                        t.adrt_id,
                        t.adr_str,
                        t.adr_active
                    FROM (VALUES
                    `;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    adr.push(elem.any_exid);
                    adr.push(elem.adrt_id);
                    adr.push(elem.adr_str);
                    adr.push(elem.adr_active);
                });
                q = q + `) AS t(any_exid, adrt_id, adr_str, adr_active)
                        LEFT JOIN countragents cau ON ((t.any_exid=cau.ca_exid) AND (t.adrt_id=1))
                        LEFT JOIN countragents caf ON ((t.any_exid=caf.ca_exid)AND(t.adrt_id=2))
                        LEFT JOIN delivery_points dp ON ((t.any_exid=dp.dp_exid)AND(t.adrt_id=3))
                    ) AS t
                    LEFT JOIN address adr ON ((t.any_id=adr.any_id)AND(t.adrt_id=adr.adrt_id));
                    INSERT INTO address (any_id,adrt_id,adr_str,adr_active)
                        SELECT any_id,adrt_id,adr_str,adr_active FROM tadr WHERE (ins=TRUE);
                    UPDATE address AS adr SET
                        adr_str=t.adr_str, adr_active=t.adr_active, adr_mtime=now()
                        FROM (
                            SELECT * FROM tadr WHERE updt=TRUE
                        ) AS t WHERE (t.adr_id=adr.adr_id);
                    DROP TABLE tadr;`;
                return [q, adr];
            };
            var linksCountragentDeliveryPointsF = function(arr) {
                let lcp = [];
                let q = ` CREATE TEMP TABLE tlcp (
                    lcp_id INTEGER, ca_id INTEGER,
                    dp_id INTEGER, lcp_active BOOLEAN,
                    updt BOOLEAN, ins BOOLEAN);
                INSERT INTO tlcp(
                    SELECT lcp.lcp_id ,ca.ca_id,dp.dp_id,t.lcp_active,
                    (t.lcp_active<>lcp.lcp_active) AS updt,
                    (lcp.lcp_id ISNULL ) AS ins
                FROM (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 3 + 1) + ",$" + (i * 3 + 2) + ",$" + (i * 3 + 3) + ")";
                    lcp.push(elem.ca_exid);
                    lcp.push(elem.dp_exid);
                    lcp.push(elem.lcp_active);
                });
                q = q + `) AS t(ca_exid,dp_exid,lcp_active)
                LEFT JOIN countragents ca ON (t.ca_exid=ca.ca_exid)
                LEFT JOIN delivery_points dp ON (t.dp_exid=dp.dp_exid)
                LEFT JOIN links_countragent_delivery_point lcp ON ((ca.ca_id=lcp.ca_id)AND(dp.dp_id=lcp_id)));
                INSERT INTO links_countragent_delivery_point(ca_id,dp_id,lcp_active)
                    SELECT ca_id,dp_id,lcp_active FROM tlcp WHERE ins=TRUE;
                UPDATE links_countragent_delivery_point AS lcp SET
                    lcp_active=t.lcp_active,lcp_mtime=now()
                FROM (
                    SELECT * FROM tlcp WHERE updt=TRUE
                ) AS t WHERE (t.lcp_id=lcp.lcp_id);
                DROP TABLE tlcp;`;
                return [q, lcp];
            };
            db.task(function * (t) {
                if (obj.countragents) {
                    console.log('start ca', new Date(), obj.countragents.length);
                    for (let i = 0; i < obj.countragents.length; i = i + 100) {
                        let a = obj.countragents.slice(i, i + 100);
                        let [q,
                            arr] = countragentsF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end ca', new Date());
                }
                if (obj.deliveryPoints) {
                    console.log('start dp', new Date(), obj.deliveryPoints.length);
                    for (let i = 0; i < obj.deliveryPoints.length; i = i + 100) {
                        let a = obj.deliveryPoints.slice(i, i + 100);
                        let [q,
                            arr] = deliveryPointsF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end dp', new Date());
                }
                if (obj.address) {
                    console.log('start adr', new Date(), obj.address.length);
                    for (let i = 0; i < obj.address.length; i = i + 100) {
                        let a = obj.address.slice(i, i + 100);
                        let [q,
                            arr] = addressF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end adr', new Date());
                }
                if (obj.linksCountragentDeliveryPoints) {
                    console.log('start lcp', new Date(), obj.linksCountragentDeliveryPoints.length);
                    for (let i = 0; i < obj.linksCountragentDeliveryPoints.length; i = i + 100) {
                        let a = obj.linksCountragentDeliveryPoints.slice(i, i + 100);
                        let [q,
                            arr] = linksCountragentDeliveryPointsF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end lcp', new Date());
                }
                return Promise.resolve(true);
            }).then(function(r) {
                resolve({"result": true});
            }).catch(function(err) {
                console.log("Gen err", err);
                resolve({"result": false});
            });/**/
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
                    pr.push(db.query(`SELECT
                    ca_id, cat_id, ca_head, ca_name, ca_prn, ca_inn, ca_kpp,
                    ca_client, ca_supplier, ca_carrier, ca_active,
                    extract(epoch from ca_mtime)::integer as ca_mtime
                    from countragents;`, {}));
                    nm.push("countragents");
                }
                if (obj.deliveryPoints === "all") {
                    pr.push(db.query(`SELECT
                    dp_id, dp_name, dp_prn, dp_client, dp_supplier, dp_carrier,
                    dp_active, extract(epoch from dp_mtime)::integer as dp_mtime
                    from delivery_points`, {}));
                    nm.push("deliveryPoints");
                }
                if (obj.address === "all") {
                    pr.push(db.query(`SELECT
                    a.adr_id,a.any_id,adrt_id,adr_str,adr_geo,
                    a.adr_json->'nominatim'->'display_name' as display_name
                    FROM address a;`, {}));
                    nm.push("address");
                }
                if (obj.linksCountragentDeliveryPoint === "all") {
                    pr.push(db.query(`SELECT
                    lcp_id, ca_id, dp_id, lcp_active,
                    extract(epoch from lcp_mtime)::integer as lcp_mtime
                    from links_countragent_delivery_point`, {}));
                    nm.push("linksCountragentDeliveryPoint");
                }
                if (obj.CountragentsSearch==="all") {
                    pr.push(db.query(`SELECT
                    dp.dp_id,
                    concat_ws(' ', dp.dp_name, dp.dp_info, ca.ca_name, ca.ca_info,
                    ca.ca_inn, ca.ca_kpp, adr.adr_str,(adr.adr_json->'nominatim'->'display_name') )as value
                    FROM delivery_points dp
                    LEFT JOIN links_countragent_delivery_point lcdp ON dp.dp_id = lcdp.dp_id
                    LEFT JOIN countragents ca ON ca.ca_id=lcdp.ca_id
                    LEFT JOIN address adr ON (adr.any_id=dp.dp_id) AND (adr.adrt_id=3)`, {}));
                    nm.push("CountragentsSearch");

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
    setAdressGeoDaData: function(client, obj) {
        return new Promise(function(resolve, reject) {
            co(function * () {
                console.log('start adrrrr', new Date(), obj);
                console.log(obj);
                var adrarr = yield db.query(`SELECT adr_id,adr_str FROM address a WHERE (a.adr_json ISNULL)AND(adr_str<>'') LIMIT $1; `, [obj.length]);
                var dd = require('./dadata');
                for (let i = 0; i < adrarr.length; i++) {
                    if (i % 10 === 0)
                        console.log(i);
                    var el = adrarr[i];
                    var jsonb = yield dd.adress(el.adr_str);
                    if (jsonb === undefined) {
                        jsonb = {};
                    }
                    yield db.none(`UPDATE address SET adr_json = $2::JSONB, adr_mtime=now() WHERE adr_id=$1; `, [el.adr_id, JSON.stringify(jsonb)]);
                }
                console.log('end adrrrr', new Date());
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
    setAdressGeoNominatim: function(client, obj) {
        var nominatim = require('nominatim-client');
        var nominatimr = function(t) {
            return new Promise(function(resolve, reject) {
                var query = {
                    q: t,
                    addressdetails: '1'
                };
                nominatim.search(query, function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    //data = data.1;
                    if (data.length > 0) {
                        var result = data[0];
                        if (result.licence)
                            delete result.licence;
                        if (result.icon)
                            delete result.icon;
                        resolve(result);
                    } else {
                        resolve();
                    }
                });
            });
        };
        return new Promise(function(resolve, reject) {
            co(function * () {
                console.log('start adrrrr', new Date(), obj);
                var adrarr = yield db.query(`SELECT adr_id,
                  (adr_json->'data'->'region')||(adr_json->'data'->'area')||(adr_json->'data'->'city') ||
                  (adr_json->'data'->'city_district') ||(adr_json->'data'->'settlement')||
                  (adr_json->'data'->'settlement') ||(adr_json->'data'->'street') ||
                  (adr_json->'data'->'house')||(adr_json->'data'->'flat') AS ar
                FROM address
                WHERE (adr_json->'data'->'house' NOTNULL) AND (adr_json->'nominatim' ISNULL )  LIMIT $1; `, [obj.length]);

                //console.log(adrarr);

                for (let i = 0; i < adrarr.length; i++) {
                    if (i % 10 === 0)
                        console.log(i);
                    if (adrarr[i].ar[7] !== null) {
                        let o = yield nominatimr(adrarr[i].ar.join(","));

                        //console.log("o", adrarr[i].ar.join(","), o);
                        if (o) {
                            yield db.none(`UPDATE address SET adr_json = adr_json || $2::JSONB, adr_mtime=now() WHERE adr_id=$1; `, [
                                adrarr[i].adr_id,
                                JSON.stringify({"nominatim": o})
                            ]);
                        }
                    }

                }

                console.log('end adrrrr', new Date());

                return Promise.resolve(adrarr.length);
            }).then(function(r) {
                console.log('r', r);
                resolve({"result": true, "aa": r});
            }).catch(function(err) {
                console.log("Gen err", err);
                resolve({"result": false});
            });/**/

        });

    },
    setAdressGeoYandex: function(client, obj) {
        var ya = require('./geocodeya');
        return new Promise(function(resolve, reject) {
            co(function * () {
                console.log('start adrrrr', new Date(), obj);
                var adrarr = yield db.query(`SELECT adr_id,
                  (adr_json->'data'->'region')||(adr_json->'data'->'area')||(adr_json->'data'->'city') ||
                  (adr_json->'data'->'city_district') ||(adr_json->'data'->'settlement')||
                  (adr_json->'data'->'settlement') ||(adr_json->'data'->'street') ||
                  (adr_json->'data'->'house')||(adr_json->'data'->'flat') AS ar
                FROM address
                WHERE (adr_json->'data'->'house' NOTNULL) AND (adr_json->'yandex' ISNULL) LIMIT $1; `, [obj.length]);

                //console.log(adrarr);

                for (let i = 0; i < adrarr.length; i++) {
                    if (i % 10 === 0)
                        console.log(i);
                    if (adrarr[i].ar[7] !== null) {
                        let m = yield ya.geocode(adrarr[i].ar.join(","));
                        //console.log('m', m);
                        if (m) {
                            yield db.none(`UPDATE address SET adr_json = adr_json || $2::JSONB, adr_mtime=now() WHERE adr_id=$1; `, [
                                adrarr[i].adr_id,
                                JSON.stringify({"yandex": m})
                            ]);
                        }
                    }

                }

                console.log('end adrrrr', new Date());

                return Promise.resolve(adrarr.length);
            }).then(function(r) {
                console.log('r', r);
                resolve({"result": true, "aa": r});
            }).catch(function(err) {
                console.log("Gen err", err);
                resolve({"result": false});
            });/**/

        });

    },
    setPrices: function(client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            var pricelistF = function(arr) {
                let pl = [];
                let q = ` CREATE TEMP TABLE tpl (
                    pl_id INTEGER, pl_exid TEXT, pl_name VARCHAR(50), pl_type INTEGER,
                    pl_active BOOLEAN, updt BOOLEAN, ins BOOLEAN);
                    INSERT INTO tpl(
                        SELECT pl.pl_id, t.*,
                        ((pl.pl_name <> t.pl_name) OR (pl.pl_type <> t.pl_type) OR (pl.pl_active <> t.pl_active)) AS updt,
                        pl_id ISNULL AS ins
                    FROM pricelist pl RIGHT JOIN ( VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    pl.push(elem.pl_exid);
                    pl.push(elem.pl_name);
                    pl.push(elem.pl_type);
                    pl.push(elem.pl_active);
                });
                q = q + `) AS t(pl_exid, pl_name, pl_type, pl_active) ON t.pl_exid = pl.pl_exid);
                INSERT INTO pricelist (pl_exid, pl_name, pl_type, pl_active)
                    SELECT pl_exid, pl_name, pl_type, pl_active FROM tpl WHERE (ins= TRUE);
                UPDATE pricelist AS pl SET
                    pl_exid=t.pl_exid, pl_name=t.pl_name,pl_type=t.pl_type,
                    pl_active=t.pl_active, pl_mtime=now()
                FROM (
                    SELECT pl_id, pl_exid,pl_name,pl_type,pl_active FROM tpl WHERE (updt = TRUE)
                ) AS t WHERE pl.pl_id = t.pl_id;
                DROP TABLE tpl;`;
                return [q, pl];
            };
            var priceF = function(arr) {
                let p = [];
                let q = ` CREATE TABLE tp (
                    p_id INTEGER, pl_id INTEGER, i_id INTEGER,
                    p_date_b TIMESTAMP, p_date_e TIMESTAMP,
                    p_cn INTEGER, p_active BOOLEAN,
                    updt BOOLEAN, ins BOOLEAN);
                    INSERT INTO tp(
                        SELECT
                            p.p_id, pl.pl_id, i.i_id,
                            t.p_date_b, t.p_date_e,
                            t.p_cn, t.p_active,
                            ((p.p_date_b <> t.p_date_b) OR (p.p_date_e <> t.p_date_e) OR
                            (p.p_cn <> t.p_cn) OR (p.p_active <> t.p_active)) AS updt,
                            ((p.p_id ISNULL) AND (pl.pl_id NOTNULL) AND (i.i_id NOTNULL)) AS ins
                        FROM pricelist pl
                        RIGHT JOIN (
                            SELECT
                                pl_exid, i_exid,
                                p_date_b :: TIMESTAMP,
                                p_date_e :: TIMESTAMP,
                                p_cn, p_active
                            FROM (VALUES `;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 6 + 1) + ",$" + (i * 6 + 2) + ",$" + (i * 6 + 3);
                    q = q + ",$" + (i * 6 + 4) + ",$" + (i * 6 + 5) + ",$" + (i * 6 + 6) + ")";
                    p.push(elem.pl_exid);
                    p.push(elem.i_exid);
                    p.push(elem.p_date_b);
                    p.push(elem.p_date_e);
                    p.push(elem.p_cn);
                    p.push(elem.p_active);
                    //console.log('p', elem, p.slice(-6));
                });
                q = q + ` ) AS t(pl_exid, i_exid, p_date_b, p_date_e, p_cn, p_active)) AS t
                    ON pl.pl_exid = t.pl_exid LEFT JOIN items i ON t.i_exid = i.i_exid
                    LEFT JOIN price p ON p.pl_id = pl.pl_id AND p.i_id = i.i_id);
                    INSERT INTO price (pl_id, i_id, p_date_b, p_date_e, p_cn, p_active)
                        SELECT pl_id, i_id, p_date_b, p_date_e, p_cn, p_active FROM tp WHERE (ins= TRUE);
                    UPDATE price AS p SET
                        p_date_b=t.p_date_b, p_date_e=t.p_date_e,
                        p_cn=t.p_cn, p_active=t.p_active, p_mtime=now()
                    FROM (
                        SELECT p_id, p_date_b, p_date_e, p_cn, p_active FROM tp WHERE (updt = TRUE)
                    ) AS t WHERE p.p_id = t.p_id;
                    DROP TABLE tp;`;
                return [q, p];
            };
            var pricelistLinkF = function(arr) {
                let pll = [];
                let q = `CREATE TEMP TABLE tpll (
                        pl_parent INTEGER, pl_child INTEGER,
                        pll_prior INTEGER, pll_active BOOLEAN,
                        updt BOOLEAN, ins BOOLEAN);
                    INSERT INTO tpll (
                        SELECT
                            plp.pl_id AS pl_parent, plc.pl_id AS pl_child,
                            t.pll_prior, t.pll_active,
                            ((pll.pll_prior<>t.pll_prior)OR(pll.pll_active<>t.pll_active)) AS updt,
                            (pll.pl_parent ISNULL OR pll.pl_child ISNULL) AND (plp.pl_id NOTNULL AND plc.pl_id NOTNULL) AS ins
                        FROM pricelist plp RIGHT JOIN (VALUES`;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    pll.push(elem.pl_exparent);
                    pll.push(elem.pl_exchild);
                    pll.push(elem.pll_prior);
                    pll.push(elem.pll_active);
                });
                q = q + `) AS t(pl_exparent, pl_exchild, pll_prior, pll_active) ON plp.pl_exid=t.pl_exparent
                LEFT JOIN pricelist plc ON plc.pl_exid=t.pl_exchild
                LEFT JOIN pricelist_link pll ON pll.pl_parent=plp.pl_id AND pll.pl_child=plc.pl_id);
                INSERT INTO pricelist_link (pl_parent,pl_child,pll_prior,pll_active)
                    SELECT pl_parent,pl_child,pll_prior,pll_active FROM tpll WHERE (ins=TRUE);
                UPDATE pricelist_link AS pll SET
                    pll_prior=t.pll_prior, pll_active=t.pll_active, pll_mtime=now()
                FROM (
                    SELECT * FROM tpll WHERE (updt=TRUE)
                ) AS t WHERE pll.pl_parent=t.pl_parent AND pll.pl_child=t.pl_child;

                DROP TABLE tpll;`;

                return [q, pll];
            };

            db.task(function * (t) {
                if (obj.pricelist) {
                    console.log('start pl', new Date(), obj.pricelist.length);
                    for (let i = 0; i < obj.pricelist.length; i = i + 100) {
                        let a = obj.pricelist.slice(i, i + 100);
                        let [q,
                            arr] = pricelistF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end pl', new Date());
                }
                if (obj.price) {
                    console.log('start p', new Date(), obj.price.length);
                    for (let i = 0; i < obj.price.length; i = i + 100) {
                        let a = obj.price.slice(i, i + 100);
                        let [q,
                            arr] = priceF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end p', new Date());
                }
                if (obj.pricelistLink) {
                    console.log('start pll', new Date(), obj.pricelistLink.length);
                    for (let i = 0; i < obj.pricelistLink.length; i = i + 100) {
                        let a = obj.pricelistLink.slice(i, i + 100);
                        let [q,
                            arr] = pricelistLinkF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end pll', new Date());
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
                    //console.log(1);
                    pr.push(db.query("SELECT pl_id,pl_name,pl_type,pl_active, extract(epoch from pl_mtime)::integer as pl_mtime FROM pricelist", {}));
                    nm.push("pricelist");
                }
                if (obj.price === "all") {
                    //console.log(2);
                    pr.push(db.query("SELECT p_id,pl_id,i_id,extract(epoch from p_date_b)::bigint::REAL as p_date_b, " +
                        "extract(epoch from p_date_e)::bigint::REAL as p_date_e, " +
                        "p_cn,p_active, extract(epoch from p_mtime)::integer as p_mtime FROM price", {}));
                    nm.push("price");
                }
                if (obj.pricelistLink === "all") {
                    //console.log(3);
                    pr.push(db.query("SELECT * FROM pricelist_link;", {}));
                    nm.push("pricelistLink");
                }
                if (obj.pricelistSearch === "all") {
                    //console.log(3);
                    pr.push(db.query("SELECT pl_id,pl_name as value FROM pricelist;", {}));
                    nm.push("pricelistSearch");
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
                let q = `CREATE TEMP TABLE tsr (
                sr_id INTEGER, sr_exid TEXT, sr_name VARCHAR(50),
                sr_type smallint, sr_active BOOLEAN,
                updt BOOLEAN, ins BOOLEAN);
                INSERT INTO tsr(
                    SELECT
                        sr.sr_id, t.*,
                        ((sr.sr_name <> t.sr_name) OR (sr.sr_type <> t.sr_type) OR (sr.sr_active <> t.sr_active)) as updt,
                        sr_id ISNULL  as ins FROM stores sr RIGHT JOIN (VALUES `;
                arr.forEach((elem, i) => {
                    if (i !== 0)
                        q = q + ", ";
                    q = q + "($" + (i * 4 + 1) + ",$" + (i * 4 + 2) + ",$" + (i * 4 + 3) + ",$" + (i * 4 + 4) + ")";
                    sr.push(elem.sr_exid);
                    sr.push(elem.sr_name);
                    sr.push(elem.sr_type);
                    sr.push(elem.sr_active);
                });
                q = q + `) AS t(sr_exid, sr_name, sr_type, sr_active) ON t.sr_exid = sr.sr_exid);
                INSERT INTO stores (sr_exid, sr_name, sr_type, sr_active)
                    SELECT sr_exid,sr_name,sr_type,sr_active FROM tsr WHERE (ins= TRUE);
                UPDATE stores AS sr SET
                    sr_exid=t.sr_exid, sr_name=t.sr_name,
                    sr_type=t.sr_type, sr_active=t.sr_active, sr_mtime=now()
                FROM (
                    SELECT sr_id, sr_exid,sr_name,sr_type,sr_active,sr_mtime FROM tsr  WHERE (updt = TRUE)
                ) AS t WHERE sr.sr_id = t.sr_id;
                DROP TABLE tsr;`;
                return [q, sr];
            };
            var storeLinkF = function(arr) {
                let srl = [];
                let q = `CREATE TEMP TABLE tsrl (
                    srl_id INTEGER, srl_parent INTEGER,
                    srl_child INTEGER, srl_sort INTEGER, srl_active BOOLEAN,
                    updt BOOLEAN, ins BOOLEAN);
                INSERT INTO tsrl(
                    SELECT
                        srl.srl_id, s2.sr_id AS srl_parent, s1.sr_id AS srl_child,
                        t.srl_sort, t.srl_active,
                        ((srl.srl_sort <> t.srl_sort) OR (srl.srl_active <> t.srl_active)) as updt,
                        ((srl_id ISNULL) AND (s1.sr_id NOTNULL) AND (s2.sr_id NOTNULL)) AS ins
                    FROM stores s1 RIGHT JOIN ( VALUES`;
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
                q = q + ` ) AS t(srl_exparent, srl_exchild, srl_sort, srl_active) ON t.srl_exchild=s1.sr_exid
                LEFT JOIN stores AS s2 ON t.srl_exparent=s2.sr_exid
                LEFT JOIN store_link AS srl ON srl.srl_parent=s2.sr_id AND srl.srl_child=s1.sr_id);
                INSERT INTO store_link (srl_parent, srl_child, srl_sort, srl_active)
                    SELECT srl_parent, srl_child, srl_sort, srl_active FROM tsrl WHERE (ins= TRUE);
                UPDATE store_link AS srl SET
                    srl_parent=t.srl_parent, srl_child=t.srl_child,
                    srl_sort=t.srl_sort, srl_active=t.srl_active,
                    srl_mtime=now()
                FROM (
                    SELECT srl_id, srl_parent, srl_child, srl_sort, srl_active FROM tsrl WHERE (updt = TRUE)
                ) AS t WHERE srl.srl_id = t.srl_id;
                DROP TABLE tsrl;`;
                return [q, srl];
            };
            var stocksF = function(arr) {
                let sc = [];
                let q = `CREATE TEMP TABLE tsc (
                    sc_id INTEGER, sr_id INTEGER, i_id INTEGER,
                    sc_amount INTEGER, sc_active BOOLEAN,
                    updt BOOLEAN, ins BOOLEAN);
                INSERT INTO tsc (
                    SELECT sc.sc_id, sr.sr_id, i.i_id, t.sc_amount, t.sc_active,
                    ((sc.sc_amount <> t.sc_amount) OR (sc.sc_active <> t.sc_active)) AS updt,
                    ((sc_id ISNULL) AND (sr.sr_id NOTNULL) AND (i.i_id NOTNULL)) AS ins
                FROM stores sr RIGHT JOIN (VALUES `;
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
                q = q + `) AS t(i_exid, sr_exid, sc_amount, sc_active) ON sr.sr_exid = t.sr_exid
                LEFT JOIN items i ON i.i_exid = t.i_exid
                LEFT JOIN stocks sc ON sc.sr_id = sr.sr_id AND sc.i_id = i.i_id);
                INSERT INTO stocks (i_id, sr_id, sc_amount, sc_active)
                    SELECT i_id, sr_id, sc_amount, sc_active FROM tsc WHERE (ins= TRUE);
                UPDATE stocks AS sc SET
                    i_id=t.i_id, sr_id=t.sr_id,
                    sc_amount=t.sc_amount, sc_active=t.sc_active,
                    sc_mtime=now()
                FROM (
                    SELECT sc_id, i_id, sr_id, sc_amount, sc_active, sc_mtime FROM tsc WHERE (updt = TRUE)
                ) AS t WHERE sc.sc_id = t.sc_id;
                DROP TABLE tsc;`;
                return [q, sc];
            };

            db.task(function * (t) {

                if (obj.stores) {
                    console.log('start sr', new Date(), obj.stores.length);
                    for (let i = 0; i < obj.stores.length; i = i + 100) {
                        let a = obj.stores.slice(i, i + 100);
                        let [q,
                            arr] = storesF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end sr', new Date());
                }
                if (obj.storeLink) {
                    console.log('start srl', new Date(), obj.storeLink.length);
                    for (let i = 0; i < obj.storeLink.length; i = i + 100) {
                        let a = obj.storeLink.slice(i, i + 100);
                        let [q,
                            arr] = storeLinkF(a);
                        yield t.none(q, arr);
                    }
                    console.log('end srl', new Date());
                }
                if (obj.stocks) {
                    console.log('start sc', new Date(), obj.stocks.length);

                    for (let i = 0; i < obj.stocks.length; i = i + 100) {
                        let a = obj.stocks.slice(i, i + 100);
                        let [q,
                            arr] = stocksF(a);
                        yield t.none(q, arr);
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
                if (obj.storesSearch === "all") {
                    pr.push(db.query("SELECT sr_id, sr_name as value FROM stores", {}));
                    nm.push("storesSearch");
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
