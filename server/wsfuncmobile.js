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
