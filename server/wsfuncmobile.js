/*eslint no-console: 0, "quotes": [0, "single"], module: 0, globals:[0, "obj"]*/
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
/*jshint node:true, esversion: 6 */
"use strict";
var pgp = require('pg-promise')({
	// Initialization Options
});
//var co = require('co');
var cn = 'postgres://postgres:postgres@localhost:5432/office';
var db = pgp(cn);

var wsfunc = {

	authUserМ: function (client, obj) {
		//TODO FUN authUser
		return new Promise(function (resolve, reject) {
			try {
				console.log("obj", obj);
				db.query(`SELECT t.t_id,t.t_name,t.t_key,u.u_login,u.u_pass from trade.token t
  							LEFT JOIN trade.users u ON t.u_id = u.u_id where t_name=$1;`,
					obj.idToken).then((token) => {
						if (token[0]) {
							//t_id: 7, t_key: '1', u_login: 'gofman', u_pass: '1'
							//console.log("token[0]", token[0]);
							client.idToken = token[0].t_name;
							client.user = token[0].u_login;
							client.t_id = token[0].t_id;
							if ((token[0].u_login === obj.authData.login) && (token[0].u_pass === obj.authData.password)) {
								resolve({ "result": true });
							} else {
								resolve({ "result": false });
							}
						} else {
							resolve({ "result": false });
							console.error(obj.idToken + " нет такого токена");
						}
					}).catch((error) => {
						console.log("error1", error);
						reject(error);
					});/**/
			} catch (err) {
				console.log("errA", err);
			}

		});
	},
	setFCM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			//console.log(obj, client);
			db.query(`UPDATE trade.token AS t SET t_fcm=$1, t_mtime = NOW()
			 WHERE t.t_name=$2;`, [obj.token, client.idToken]).then(
				(value) => {
					resolve({});
				});
		});
	},
	getNewsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			//console.log(obj, client);
			db.query(`SELECT n.*
				FROM trade.news n
				JOIN trade.links_news ln ON (n.n_id = ln.n_id) AND (ln.at_id = 4)
				JOIN trade.token t ON (ln.any_id = t.u_id)
				JOIN trade.sync_token st
					ON (st.st_table = 'getNewsM') AND (t.t_id = st.t_id) AND (st.st_stime <= n.n_date) AND (st.st_result = TRUE)
				WHERE (t.t_name = $1);`, [client.idToken]).then(
				(value) => {
					db.one(`INSERT INTO trade.sync_token (t_id, st_table, st_stime, st_etime, st_result) VALUES
  						($1,'getNewsM',now(),null, FALSE ) RETURNING trade.sync_token.st_id`, [client.t_id]).then(
						(st_id) => {
							var sync = +st_id.st_id;
							resolve({ "data": value, sync });
						}
						);

				});

		});
	},
	setSync: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			console.log(obj);
			db.query(`UPDATE trade.sync_token st SET
				st_result = $1,
				st_etime = now()
				WHERE (st.st_id=$2) AND(st.st_table=$3)`, [obj.result, obj.id, obj.name]).then(
				(value) => {
					resolve({});
				});

		});
	},
	setLogCoord: function (client, obj) {
		//TODO FUN setLogCoord
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			console.log("obj", obj);
			var coord,
				res;
			var vr = (value) => {
				console.log("value", value);
			};
			var ve = (err) => {
				console.log("err", err);
			};
			for (var i = 0; i < obj.points.length; i++) {
				coord = "(" + obj.points[i].coord.lat + "," + obj.points[i].coord.lon + ")";
				res = {
					"idToken": client.idToken,
					"coord": coord,
					"time": new Date(obj.points[i].time * 1000),
					"token": client.t_id,
					"event": obj.points[i].event
					//"atime": new Date()
				};
				try {
					db.query("INSERT INTO trade.log_coords (lc_coord, lc_time, lc_token,lc_event) VALUES (${coord}, ${time}, ${token}, ${event});", res).then(vr, ve);
				} catch (err) { reject(err); }
				console.log("setLogCoord", res);
			}

			resolve({ "result": true });
		});
	},
	getLogCoord: function (client, obj) {
		//TODO FUN getLogCoord
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			try {
				db.query(`SELECT lc_coord, lc_token,lc_event, extract(epoch from lc_time)::integer as time 
					FROM  trade.log_coords as c ORDER BY time;`, obj).then((value) => {
						resolve(value);
					});
			} catch (err) { reject(err); }
		});
	},
	setCalls: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			var st = "", arr = [];

			for (var i = 0; i < obj.calls.length; i++) {
				let call = obj.calls[i];
				arr.push(client.t_id);
				arr.push(call.lc_stime);
				arr.push(call.lc_billsec);
				arr.push(call.lc_phone);
				arr.push(call.lc_name);
				if (i !== 0) st = st + ",";
				st = st + "$" + (i + 1) + ", $" + (i + 2) + ", $" + (i + 3) + ",$" + (i + 4) + ",$" + (i + 5);

			}
			db.query(`INSERT INTO trade.log_coords (t_id, lc_stime, lc_billsec, lc_phone, lc_name) VALUES (` + st + `);`, arr).then(
				(value) => {
					resolve({});
				});

		});
	},
	getItemsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
						i_id,
						i_name,
						i_prn,
						i_service,
						int_id,
						i_active,
						extract(epoch from i_mtime)::integer as i_mtime
					from trade.items`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}

		});
	},
	getItemGroupTypesM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					igt_id,
					igt_name,
					igt_agent,
					igt_active,
					extract(epoch from igt_mtime)::integer as igt_mtime
				from trade.item_Group_Types;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getItemGroupsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					ig_id,
					igt_id,
					ig_value,
					ig_active,
					extract(epoch from ig_mtime)::integer as ig_mtime
				from trade.item_Groups`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getLinkItemGroupsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					lig_id,
					i_id,
					ig_id,
					igt_id,
					lig_active,
					extract(epoch from lig_mtime)::integer as lig_mtime
				from trade.link_Item_Group`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getItemUnitTypesM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					iut_id,
					iut_name,
					imt_id,
					iut_okei,
					iut_active,
					extract(epoch from iut_mtime)::integer as iut_mtime
				from trade.item_Unit_Types`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getItemUnitsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					iu_id,
					i_id,
					iut_id,
					iu_ean,
					iu_krat,
					iu_num,
					iu_denum,
					iu_gros,
					iu_net,
					iu_length,
					iu_width,
					iu_height,
					iu_area,
					iu_volume,
					iu_agent,
					iu_base,
					iu_main,
					iu_active,
					extract(epoch from iu_mtime)::integer as iu_mtime
				from trade.item_Units`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getItemsSearchM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT i.i_id, concat_ws(' ', ig1.ig_value, ig2.ig_value, ig3.ig_value, i_name) as value FROM items i
					LEFT JOIN link_item_group lig1 ON (i.i_id = lig1.i_id) AND (lig1.igt_id=1)
					LEFT JOIN item_groups ig1 ON lig1.ig_id = ig1.ig_id
					LEFT JOIN link_item_group lig2 ON (i.i_id = lig2.i_id) AND (lig2.igt_id=2)
					LEFT JOIN item_groups ig2 ON lig2.ig_id = ig2.ig_id
					LEFT JOIN link_item_group lig3 ON (i.i_id = lig3.i_id) AND (lig3.igt_id=3)
					LEFT JOIN item_groups ig3 ON lig3.ig_id = ig3.ig_id;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getCountragentsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					ca_id,
					cat_id,
					ca_head,
					ca_name,
					ca_prn,
					ca_inn,
					ca_kpp,
					ca_client,
					ca_supplier,
					ca_carrier,
					ca_active,
					extract(epoch from ca_mtime)::integer as ca_mtime
					from trade.countragents;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getDeliveryPointsM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					dp_id,
					dp_name,
					dp_prn,
					dp_client,
					dp_supplier,
					dp_carrier,
					dp_active,
					extract(epoch from dp_mtime)::integer as dp_mtime
				from trade.delivery_points`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getAddressM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					adr_id,
					any_id,
					adrt_id,
					adr_str,
					adr_geo,
					adr_json->'nominatim'->'display_name' as display_name
				FROM trade.address a`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getLinksCountragentDeliveryPointM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					lcp_id,
					ca_id,
					dp_id,
					lcp_active,
					extract(epoch from lcp_mtime)::integer as lcp_mtime
				from trade.links_countragent_delivery_point`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getCountragentsSearchM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					dp.dp_id,
					concat_ws(' ', dp.dp_name, dp.dp_info, ca.ca_name,
					ca.ca_info, ca.ca_inn, adr.adr_str,
					(adr.adr_json->'nominatim'->'display_name') )as value
				FROM trade.delivery_points dp
				LEFT JOIN trade.links_countragent_delivery_point lcdp ON dp.dp_id = lcdp.dp_id
				LEFT JOIN trade.countragents ca ON ca.ca_id=lcdp.ca_id
				LEFT JOIN trade.address adr ON (adr.any_id=dp.dp_id) AND (adr.adrt_id=3)`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPricelistM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
						pl_id,
						pl_name,
						pl_type,
						pl_active,
						extract(epoch from pl_mtime)::integer as pl_mtime
					FROM trade.pricelist`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPriceM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
						p_id,
						pl_id,
						i_id,
						extract(epoch from p_date_b)::bigint::REAL as p_date_b,
						extract(epoch from p_date_e)::bigint::REAL as p_date_e,
						p_cn,
						p_active,
						extract(epoch from p_mtime)::integer as p_mtime
					FROM trade.price`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPricelistLinkM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  pl_parent,
				  pl_child,
				  pll_prior,
				  pll_active,
				  extract(epoch from pll_mtime)::integer as pll_mtime
				FROM trade.pricelist_link;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPricelistSearchM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
						pl_id,
						pl_name as value
					FROM trade.pricelist;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getStoresM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					sr_id,
					sr_name,
					sr_active,
					sr_type,
					extract(epoch from sr_mtime)::integer as sr_mtime
				FROM trade.stores;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getStoreLinkM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					srl_id,
					srl_parent,
					srl_child,
					srl_sort,
					srl_active,
					extract(epoch from srl_mtime)::integer as srl_mtime
				FROM trade.store_link`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getStocksM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
					sc_id,
					sr_id,
					i_id,
					sc_amount,
					sc_active,
					extract(epoch from sc_mtime)::integer as sc_mtime
				FROM trade.stocks`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getStoresSearchM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
						sr_id,
						sr_name as value
					FROM trade.stores`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPeopleM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  p_id,
				  p_name,
				  p_f,
				  p_i,
				  p_o,
				  p_sex,
				  p_active,
				  extract(epoch from p_mtime)::integer as p_mtime
				FROM trade.people;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPeopleLinkM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  pl_id,
				  plt_id,
				  pp_id,
				  p_id,
				  any_id,
				  extract(epoch from pl_date_b)::BIGINT as pl_date_b,
				  extract(epoch from pl_date_e)::BIGINT as pl_date_e,
				  pl_active,
				  extract(epoch from pl_mtime)::integer as pl_mtime
				FROM trade.people_link;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getPeopleLinkTypeM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  plt_id,
				  plt_name,
				  at_id,
				  plt_active,
				  extract(epoch from plt_mtime)::integer as plt_mtime
				FROM trade.people_link_type;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getOrganizationM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  org_id,
				  org_name,
				  org_short,
				  org_full,
				  org_inn,
				  org_kpp,
				  org_active,
				  extract(epoch from org_mtime)::integer as org_mtime
				FROM trade.organization;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getAnyTypeM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  *
				FROM trade.any_type;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getKiValueM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  kiv_id,
				  kik_id,
				  kiv_valiue,
				  kiv_active,
				  extract(epoch from kiv_mtime)::integer as kiv_mtime
				FROM trade.ki_value;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getKiKindM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  kik_id,
				  kit_id,
				  kik_name,
				  kik_active,
				  extract(epoch from kik_mtime)::integer as kik_mtime
				FROM trade.ki_kind;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getKiTypesM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  kit_id,
				  kit_name,
				  kit_active,
				  extract(epoch from kit_mtime)::integer as kit_mtime
				FROM trade.ki_types;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	getKiLinkM: function (client, obj) {
		return new Promise(function (resolve, reject) {
			if (!(client.idToken)) {
				resolve({ "result": false });
				return;
			}
			if (obj.fullsync === true) {
				db.query(`SELECT
				  kil_id,
				  at_id,
				  any_id,
				  kiv_id,
				  kil_active,
				  extract(epoch from kil_mtime)::integer as kil_mtime
				FROM trade.ki_link;`, {})
					.then((value) => {
						resolve({ "data": value });
					});
			} else {
				resolve([{ "error": "Пока не добавленна частичная синхронизация" }]);
			}
		});
	},
	statusSync: function (client, obj) {
		console.log('statusSync', obj);

		return new Promise(function (resolve, reject) {
			resolve({});
			//{ getItemsM: true }

			/*if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  kil_id,
				  at_id,
				  any_id,
				  kiv_id,
				  kil_active,
				  extract(epoch from kil_mtime)::integer as kil_mtime
				FROM trade.ki_link;`, {})
				.then((value) => {
					resolve({"data": value});
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}*/
		});
	},
};






exports.fun = wsfunc;
