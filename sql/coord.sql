CREATE TABLE trade.log_coords 
(
	lc_coord point,
	lc_time timestamp,
	lc_token INTEGER REFERENCES to,
  lc_event INTEGER,
	lc_atime timestamp default now()
);

CREATE TABLE trade.log_calls (
  lc_id SERIAL PRIMARY KEY,
  t_id INTEGER REFERENCES trade.token,
  lc_stime TIMESTAMP,
  lc_billsec INTEGER,
  lc_phone TEXT,
  lc_name TEXT

);