


CREATE TEMP TABLE tpl (
  pl_id INTEGER,
  pl_exid TEXT,
  pl_name		VARCHAR(50),
  pl_type		INTEGER,
  pl_active BOOLEAN,
  pl_mtime  TIMESTAMP,
  updt BOOLEAN,
  ins BOOLEAN
);


INSERT INTO tpl(
SELECT
    pl.pl_id,
    t.*,
    NOW()                                                                                  AS pl_mtime,
    ((pl.pl_name <> t.pl_name) OR (pl.pl_type <> t.pl_type) OR (pl.pl_active <> t.pl_active)) AS updt,
    pl_id ISNULL                                                                           AS ins
  FROM pricelist pl
    RIGHT JOIN (
                 VALUES ('БАЗА                +HORTEX', 'СКЛАД 1', 0, TRUE),
                   ('СКЛАД 10 ОБЛАСТЬ', 'СКЛАД 1 ОБЛАСТЬ', 1, TRUE),
                   ('СКЛАД-ПЕТРОВА-1', 'СКЛАД-ПЕТРОВА-1', 1, FALSE),
                   ('СКЛАД 6 ОПТ', 'СКЛАД 6 ОПТ', 1, TRUE)) AS t(pl_exid, pl_name, pl_type, pl_active)
      ON t.pl_exid = pl.pl_exid
);

INSERT INTO pricelist (pl_exid, pl_name, pl_type, pl_active, pl_mtime)
                 SELECT pl_exid, pl_name, pl_type, pl_active, pl_mtime FROM tpl WHERE (ins= TRUE);

UPDATE pricelist AS pl SET pl_exid=t.pl_exid, pl_name=t.pl_name,
                pl_type=t.pl_type, pl_active=t.pl_active, pl_mtime=t.pl_mtime  FROM (
                SELECT pl_id, pl_exid,pl_name,pl_type,pl_active,pl_mtime FROM tpl
               WHERE (updt = TRUE)) AS t WHERE pl.pl_id = t.pl_id;
                 DROP TABLE tpl;

SELECT * FROM tpl;


DROP TABLE tp;
CREATE TABLE tp (
  p_id       	INTEGER,
  pl_id			INTEGER,
  i_id			INTEGER,
  p_date_b		TIMESTAMP,
  p_date_e		TIMESTAMP,
  p_cn 			INTEGER,
  p_active   	BOOLEAN,
  p_mtime    	TIMESTAMP,
  updt      BOOLEAN,
  ins       BOOLEAN
);

INSERT INTO tp(SELECT p.p_id, pl.pl_id,i.i_id, t.p_date_b, t.p_date_e, t.p_cn, t.p_active, now() AS p_mtime,
  ((p.p_date_b <> t.p_date_b) OR (p.p_date_e <> t.p_date_e) OR (p.p_cn <> t.p_cn) OR (p.p_active <> t.p_active)) AS updt,
  ((p.p_id ISNULL) AND (pl.pl_id NOTNULL) AND (i.i_id NOTNULL )) AS ins
FROM pricelist pl RIGHT JOIN (SELECT pl_exid, i_exid, p_date_b :: TIMESTAMP, p_date_e :: TIMESTAMP, p_cn, p_active
                              FROM (VALUES
                                ('БАЗА                +', '#Ll', '20151216', '21500101', 2951, TRUE),
                                ('БАЗА               +1', '#Lm', '20151215', '21500101', 2951, TRUE),
                                ('БАЗА                +', '***', '20151215', '21500101', 2951, TRUE),
                                ('БАЗА                +3-Й ХЛАДОКОМБИНАТ', '#Lm', '20151215', '21500101', 2951, TRUE)
                                   ) AS t(pl_exid, i_exid, p_date_b, p_date_e, p_cn, p_active)) AS t
    ON pl.pl_exid = t.pl_exid
  LEFT JOIN items i ON t.i_exid = i.i_exid
  LEFT JOIN price p ON p.pl_id = pl.pl_id AND p.i_id = i.i_id);

SELECT * FROM tp;
INSERT INTO price (pl_id, i_id, p_date_b, p_date_e, p_cn,p_active, p_mtime)
                 SELECT pl_id, i_id, p_date_b, p_date_e, p_cn, p_active, p_mtime FROM tp WHERE (ins= TRUE);

UPDATE price AS p SET p_date_b=t.p_date_b, p_date_e=t.p_date_e,
                p_cn=t.p_cn, p_active=t.p_active, p_mtime=t.p_mtime  FROM (
                SELECT p_id, p_date_b, p_date_e, p_cn, p_active, p_mtime FROM tp
               WHERE (updt = TRUE)) AS t WHERE p.p_id = t.p_id;
DROP TABLE tp;

CREATE TEMP TABLE tpll (
	pl_parent	 INTEGER,
	pl_child	 INTEGER,
	pll_prior	 INTEGER,
  pll_active BOOLEAN,
  pll_mtime  TIMESTAMP,
  updt       BOOLEAN,
  ins        BOOLEAN
);

INSERT INTO tpll (
  SELECT
    pll.pl_parent AS lpl_parent,
    pll.pl_child AS lpl_child,
    plp.pl_id                                                            AS pl_parent,
    plc.pl_id                                                            AS pl_child,
    t.pll_prior,
    t.pll_active,
    CASE WHEN pll.pll_active NOTNULL THEN now() ELSE pll.pll_mtime END AS pll_mtime,
    ((pll.pll_prior <> t.pll_prior) OR (pll.pll_active <> t.pll_active)) AS updt,
    (pll.pl_parent ISNULL OR pll.pl_child ISNULL) AND (plp.pl_id NOTNULL AND plc.pl_id NOTNULL )                           AS ins
  FROM pricelist plp
  RIGHT JOIN (VALUES
    ('БАЗА','БАЗА                +ТОМИ-МОЛ',1, true),
    ('БАЗА','БАЗА                +ТОМСК.ПРОД.КОМПАНИЯ',1, true),
    ('БАЗА','БАЗА',1, true)
                                            ) AS t(pl_exparent, pl_exchild, pll_prior, pll_active) ON plp.pl_exid=t.pl_exparent
LEFT JOIN pricelist plc ON plc.pl_exid=t.pl_exchild
LEFT JOIN pricelist_link pll ON pll.pl_parent=plp.pl_id AND pll.pl_child=plc.pl_id);

INSERT INTO pricelist_link (pl_parent,pl_child,pll_prior,pll_active, pll_mtime ) SELECT pl_parent,pl_child,pll_prior,pll_active,pll_mtime FROM tpll WHERE (ins=TRUE);
UPDATE pricelist_link AS pll SET pll_prior=t.pll_prior,pll_active=t.pll_active FROM (SELECT * FROM tpll WHERE (updt=TRUE )) AS t WHERE pll.pl_parent=t.pl_parent AND pll.pl_child=t.pl_child
DROP TABLE tpll;

DROP TABLE tca;
CREATE TEMP TABLE tca (
  ca_id       INTEGER,
  ca_exid     TEXT,
  cat_id      INTEGER,
  ca_head     INTEGER,
  ca_name     TEXT,
  ca_prn      TEXT,
  ca_info     TEXT,
  ca_inn      VARCHAR(25),
  ca_kpp      VARCHAR(25),
  ca_client   BOOLEAN,
  ca_supplier BOOLEAN,
  ca_carrier  BOOLEAN,
  ca_active   BOOLEAN,
  ca_mtime    TIMESTAMP,
  updt        BOOLEAN,
  ins         BOOLEAN
);

INSERT INTO tca (
SELECT ca.ca_id, t.ca_exid, t.cat_id, ch.ca_id, t.ca_name, t.ca_prn, t.ca_info, t.ca_inn, t.ca_kpp, t.ca_client, t.ca_supplier, t.ca_carrier, t.ca_active,
  CASE WHEN ca.ca_active NOTNULL THEN now() ELSE ca.ca_mtime END AS ca_mtime, ((ca.cat_id <> t.cat_id) OR (ca.ca_head <> ch.ca_id) OR (ca.ca_name <> t.ca_name) OR (ca.ca_prn <> t.ca_prn) OR (ca.ca_info <> t.ca_info) OR (ca.ca_client <> t.ca_client) OR (ca.ca_supplier <> t.ca_supplier) OR (ca.ca_carrier <> t.ca_carrier) OR (ca.ca_active <> t.ca_active)) AS updt,
  (ca.ca_id ISNULL) AS ins FROM (VALUES
  ('181278A0', 1, '', 'ФОРС ТРЭЙД', 'ФОРС ТРЭЙД ООО', '', '6168008931', '616801001', TRUE, FALSE, FALSE, TRUE),
  ('181278A1', 1, '', 'ФОРС ТРЭЙД2', 'ФОРС ТРЭЙД ООО 2', '', '6168008930', '616801000', TRUE, FALSE, FALSE, TRUE)
     ) AS t(ca_exid, cat_id, ca_exhead, ca_name, ca_prn, ca_info, ca_inn, ca_kpp, ca_client, ca_supplier, ca_carrier, ca_active)
  LEFT JOIN countragents ca ON (ca.ca_exid = t.ca_exid)
  LEFT JOIN countragents ch ON (ch.ca_exid = t.ca_exhead));


INSERT INTO countragents (ca_exid, cat_id, ca_head, ca_name, ca_prn, ca_info, ca_inn, ca_kpp, ca_client, ca_supplier, ca_carrier, ca_active) SELECT ca_exid, cat_id, ca_head, ca_name, ca_prn, ca_info, ca_inn, ca_kpp, ca_client, ca_supplier, ca_carrier, ca_active FROM tca WHERE (ins = TRUE);

UPDATE countragents AS ca SET cat_id = t.cat_id, ca_head = t.ca_head, ca_name = t.ca_name, ca_prn = t.ca_prn, ca_info = t.ca_info, ca_inn = t.ca_inn, ca_kpp = t.ca_kpp, ca_client = t.ca_client, ca_supplier = t.ca_supplier, ca_carrier = t.ca_carrier, ca_active = t.ca_active, ca.ca_mtime = t.ca_mtime FROM (SELECT * FROM tca WHERE (updt = TRUE)) AS t WHERE ca.ca_id = t.ca_id;
DROP TABLE tca;

CREATE TEMP TABLE tdp(
    dp_id           INTEGER,
    dp_exid         TEXT,
    dp_name         VARCHAR(100),
    dp_prn          VARCHAR(100),
    dp_info         TEXT,
    dp_client       BOOLEAN,
    dp_supplier     BOOLEAN,
    dp_carrier      BOOLEAN,
    dp_active       BOOLEAN,
    dp_mtime        TIMESTAMP,
    updt        BOOLEAN,
    ins         BOOLEAN
);

INSERT INTO tdp(SELECT
  dp.dp_id,t.*,
  CASE WHEN dp.dp_active NOTNULL THEN now() ELSE dp.dp_mtime END AS dp_mtime,
  ((dp.dp_name<>t.dp_name) OR (dp.dp_prn<>t.dp_prn)OR (dp.dp_info<>t.dp_info)OR (dp.dp_client<>t.dp_client)OR (dp.dp_supplier<>t.dp_supplier)OR (dp.dp_carrier<>t.dp_carrier) OR (dp.dp_active <> t.dp_active)) AS updt,
  dp_id ISNULL AS ins
FROM (VALUES
  ('2K', 'СЛАВИЯ ООО-ТАГАНРОГ', 'СЛАВИЯ ООО-ТАГАНРОГ','', true, false, false, true),
  ('2N', 'СЛАВИЯ ООО-ТАГНРОГ', 'СЛАВИЯ ООО-ТААНРОГ','', true, false, false, true)
              ) AS t(dp_exid, dp_name, dp_prn, dp_info, dp_client, dp_supplier, dp_carrier, dp_active)
LEFT JOIN delivery_points dp ON (dp.dp_exid=t.dp_exid));
INSERT INTO delivery_points (dp_exid, dp_name, dp_prn, dp_info, dp_client, dp_supplier, dp_carrier, dp_active)
    SELECT dp_exid, dp_name, dp_prn, dp_info, dp_client, dp_supplier, dp_carrier, dp_active FROM tdp WHERE tdp.ins=TRUE ;
UPDATE delivery_points AS dp SET dp_name=t.dp_name, dp_prn=t.dp_prn, dp_info=t.dp_info, dp_client= t.dp_client, dp_supplier=t.dp_supplier ,dp_carrier=t.dp_carrier, dp_active=t.dp_active, dp_mtime=t.dp_mtime FROM (SELECT * FROM tdp WHERE updt=TRUE ) AS t WHERE t.dp_id=dp.dp_id;
DROP TABLE tdp;

CREATE TEMP TABLE tadr (
 adr_id INTEGER,
 any_id INTEGER,
 adrt_id INTEGER,
 adr_str TEXT,
 adr_fias VARCHAR(50),
 adr_geo point,
 adr_json JSONB,
 adr_active BOOLEAN,
 adr_mtime TIMESTAMP,
 updt BOOLEAN,
 ins BOOLEAN
);



INSERT INTO tadr (adr_id,any_id,adrt_id,adr_str,adr_active,adr_mtime,updt,ins) SELECT
  adr.adr_id,
  t.*,
  CASE WHEN adr.adr_active NOTNULL THEN now() ELSE adr.adr_mtime END AS adr_mtime,
  ((t.adr_str<>adr.adr_str)OR(t.adr_active<>adr.adr_active)) AS updt,
  (adr.adr_id ISNULL ) AS ins
FROM(SELECT
  CASE WHEN cau.ca_id NOTNULL THEN cau.ca_id WHEN caf.ca_id NOTNULL THEN caf.ca_id WHEN dp.dp_id NOTNULL THEN dp.dp_id ELSE NULL END  as any_id,
  t.adrt_id,
  t.adr_str,
  t.adr_active
FROM (VALUES
  ('00B39294', 1, '346884, Ростовская обл, Батайск г, Воровского ул, д. 61, кв. 1А',true),
  ('00B39294',2,'346884, Ростовская обл, Батайск г, Воровского ул, д. 61, кв. 1',true),
  ('00E54F86',1,'TRIM(V->ADU)',true),
  ('VQ', 3,'346400, Ростовская обл, Новочеркасск г, Ермака пр-кт, д. 44/46',true)
              ) AS t(any_exid, adrt_id, adr_str, adr_active)
  LEFT JOIN countragents cau ON ((t.any_exid=cau.ca_exid) AND (t.adrt_id=1))
LEFT JOIN countragents caf ON ((t.any_exid=caf.ca_exid)AND(t.adrt_id=2))
LEFT JOIN delivery_points dp ON ((t.any_exid=dp.dp_exid)AND(t.adrt_id=3))) AS t
LEFT JOIN address adr ON ((t.any_id=adr.any_id)AND(t.adrt_id=adr.adrt_id));


INSERT INTO address (any_id,adrt_id,adr_str,adr_active) SELECT any_id,adrt_id,adr_str,adr_active FROM tadr WHERE (ins=TRUE);
UPDATE address AS adr SET adr_str=t.adr_str, adr_active=t.adr_active, adr_mtime=t.adr_mtime FROM (SELECT * FROM tadr WHERE updt=TRUE) AS t WHERE (t.updt=TRUE);
DROP TABLE tadr;

CREATE TEMP TABLE tlcp (
 lcp_id INTEGER,
 ca_id INTEGER,
 dp_id INTEGER,
 lcp_active BOOLEAN,
 lcp_mtime TIMESTAMP,
 updt BOOLEAN,
 ins BOOLEAN
);


INSERT INTO tlcp(SELECT
  lcp.lcp_id ,ca.ca_id,dp.dp_id,t.lcp_active,
   CASE WHEN lcp.lcp_active NOTNULL THEN now() ELSE lcp.lcp_mtime END AS lcp_mtime,
  (t.lcp_active<>lcp.lcp_active) AS updt,
  (lcp.lcp_id ISNULL ) AS ins
FROM (VALUES
  ('C9E7F2A7', '#iN', true),
  ('C9E7F2A7', '#iO', true)
              ) AS t(ca_exid,dp_exid,lcp_active)
LEFT JOIN countragents ca ON (t.ca_exid=ca.ca_exid)
LEFT JOIN delivery_points dp ON (t.dp_exid=dp.dp_exid)
LEFT JOIN links_countragent_delivery_point lcp ON ((ca.ca_id=lcp.ca_id)AND(dp.dp_id=lcp_id)));

INSERT INTO links_countragent_delivery_point(ca_id,dp_id,lcp_active)
  SELECT ca_id,dp_id,lcp_active FROM tlcp WHERE ins=TRUE;
UPDATE links_countragent_delivery_point AS lcp SET lcp_active=t.lcp_active,lcp_mtime=t.lcp_mtime FROM (SELECT * FROM tlcp WHERE updt=TRUE ) AS t WHERE (t.lcp_id=lcp.lcp_id)
DROP TABLE tlcp;
