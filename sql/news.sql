CREATE TABLE trade.news (
  n_id    SERIAL PRIMARY KEY,
  n_date  TIMESTAMP,
  n_title TEXT,
  n_text  TEXT,
  n_data  JSONB,
  n_type  INTEGER

);

CREATE TABLE trade.links_news (
  ln_id    SERIAL PRIMARY KEY,
  n_id     INTEGER REFERENCES trade.news,
  at_id    INTEGER REFERENCES trade.any_type,
  any_id   INTEGER,
  ln_mtime TIMESTAMP DEFAULT NOW()
);

--CREATE TABLE trade.news_result ()