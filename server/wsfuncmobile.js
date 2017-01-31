/*jshint node:true, esversion: 6 */
"use strict";
var pgp = require('pg-promise')({
    // Initialization Options
});
//var co = require('co');
var cn = 'postgres://postgres:postgres@localhost:5432/office';
var db = pgp(cn);

var wsfunc = {
	getItemsM: function (client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.fullsync===true){
                db.query(`SELECT
						i_id,
						i_name,
						i_prn,
						i_service,
						int_id,
						i_active,
						extract(epoch from i_mtime)::integer as i_mtime
					from items`, {})
                .then((value) => {
                    resolve(value);
                });
            } else {
                resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
            }

        });
    },
	getItemGroupTypesM: function (client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.fullsync===true){
                db.query(`SELECT
					igt_id,
					igt_name,
					igt_agent,
					igt_active,
					extract(epoch from igt_mtime)::integer as igt_mtime
				from item_Group_Types;`, {})
                .then((value) => {
                    resolve(value);
                });
            } else {
                resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
            }
        });
    },
	getItemGroupsM: function (client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.fullsync===true){
                db.query(`SELECT
					ig_id,
					igt_id,
					ig_value,
					ig_active,
					extract(epoch from ig_mtime)::integer as ig_mtime
				from item_Groups`, {})
                .then((value) => {
                    resolve(value);
                });
            } else {
                resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
            }
        });
    },
	getLinkItemGroupsM: function (client, obj) {
        return new Promise(function(resolve, reject) {
            if (!(client.idToken)) {
                resolve({"result": false});
                return;
            }
            if (obj.fullsync===true){
                db.query(`SELECT
					lig_id,
					i_id,
					ig_id,
					igt_id,
					lig_active,
					extract(epoch from lig_mtime)::integer as lig_mtime
				from link_Item_Group`, {})
                .then((value) => {
                    resolve(value);
                });
            } else {
                resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
            }
        });
    },
	getItemUnitTypesM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
					iut_id,
					iut_name,
					imt_id,
					iut_okei,
					iut_active,
					extract(epoch from iut_mtime)::integer as iut_mtime
				from item_Unit_Types`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getItemUnitsM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
				from item_Units`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getItemsSearchM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT i.i_id, concat_ws(' ', ig1.ig_value, ig2.ig_value, ig3.ig_value, i_name) as value FROM items i
					LEFT JOIN link_item_group lig1 ON (i.i_id = lig1.i_id) AND (lig1.igt_id=1)
					LEFT JOIN item_groups ig1 ON lig1.ig_id = ig1.ig_id
					LEFT JOIN link_item_group lig2 ON (i.i_id = lig2.i_id) AND (lig2.igt_id=2)
					LEFT JOIN item_groups ig2 ON lig2.ig_id = ig2.ig_id
					LEFT JOIN link_item_group lig3 ON (i.i_id = lig3.i_id) AND (lig3.igt_id=3)
					LEFT JOIN item_groups ig3 ON lig3.ig_id = ig3.ig_id;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getCountragentsM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getDeliveryPointsM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getAddressM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
					adr_id,
					any_id,
					adrt_id,
					adr_str,
					adr_geo,
					adr_json->'nominatim'->'display_name' as display_name
				FROM trade.address a`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getLinksCountragentDeliveryPointM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
					lcp_id,
					ca_id,
					dp_id,
					lcp_active,
					extract(epoch from lcp_mtime)::integer as lcp_mtime
				from trade.links_countragent_delivery_point`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getCountragentsSearchM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPricelistM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
						pl_id,
						pl_name,
						pl_type,
						pl_active,
						extract(epoch from pl_mtime)::integer as pl_mtime
					FROM pricelist`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPriceM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
						p_id,
						pl_id,
						i_id,
						extract(epoch from p_date_b)::bigint::REAL as p_date_b,
						extract(epoch from p_date_e)::bigint::REAL as p_date_e,
						p_cn,
						p_active,
						extract(epoch from p_mtime)::integer as p_mtime
					FROM price`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPricelistLinkM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  pl_parent,
				  pl_child,
				  pll_prior,
				  pll_active,
				  extract(epoch from pll_mtime)::integer as pll_mtime
				FROM pricelist_link;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPricelistSearchM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
						pl_id,
						pl_name as value
					FROM pricelist;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getStoresM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
					sr_id,
					sr_name,
					sr_active,
					sr_type,
					extract(epoch from sr_mtime)::integer as sr_mtime
				FROM stores;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getStoreLinkM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
					srl_id,
					srl_parent,
					srl_child,
					srl_sort,
					srl_active,
					extract(epoch from srl_mtime)::integer as srl_mtime
				FROM store_link`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getStocksM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
					sc_id,
					sr_id,
					i_id,
					sc_amount,
					sc_active,
					extract(epoch from sc_mtime)::integer as sc_mtime
				FROM stocks`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getStoresSearchM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
						sr_id,
						sr_name as value
					FROM stores`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPeopleM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPeopleLinkM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getPeopleLinkTypeM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  plt_id,
				  plt_name,
				  at_id,
				  plt_active,
				  extract(epoch from plt_mtime)::integer as plt_mtime
				FROM trade.people_link_type;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getOrganizationM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getAnyTypeM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  *
				FROM trade.any_type;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getKiValueM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  kiv_id,
				  kik_id,
				  kiv_valiue,
				  kiv_active,
				  extract(epoch from kiv_mtime)::integer as kiv_mtime
				FROM trade.ki_value;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getKiKindM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  kik_id,
				  kit_id,
				  kik_name,
				  kik_active,
				  extract(epoch from kik_mtime)::integer as kik_mtime
				FROM trade.ki_kind;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getKiTypesM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
				resolve({"result": false});
				return;
			}
			if (obj.fullsync===true){
				db.query(`SELECT
				  kit_id,
				  kit_name,
				  kit_active,
				  extract(epoch from kit_mtime)::integer as kit_mtime
				FROM trade.ki_types;`, {})
				.then((value) => {
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
	getKiLinkM: function (client, obj) {
		return new Promise(function(resolve, reject) {
			if (!(client.idToken)) {
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
					resolve(value);
				});
			} else {
				resolve([{"error":"Пока не добавленна частичная синхронизация"}]);
			}
		});
	},
};






exports.fun = wsfunc;
