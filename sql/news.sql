
DROP TABLE IF EXISTS trade.links_news;
DROP TABLE IF EXISTS trade.news_action;
DROP TABLE IF EXISTS trade.news;
--список новостей

CREATE TABLE trade.news (
  n_id      SERIAL PRIMARY KEY,
  n_date    TIMESTAMP,
  n_title   TEXT,
  n_text    TEXT,
  n_data    JSONB,
  n_type    INTEGER

);
-- связи новостей с теми кто их может видеть
CREATE TABLE trade.links_news (
  ln_id     SERIAL PRIMARY KEY,
  n_id      INTEGER REFERENCES trade.news,
  at_id     INTEGER REFERENCES trade.any_type,
  any_id    INTEGER,
  ln_mtime  TIMESTAMP DEFAULT NOW()
);

--результат взаимодействия пользователя с новостью
CREATE TABLE trade.news_action (
  na_id     SERIAL PRIMARY KEY,
  n_id      INTEGER REFERENCES trade.news,
  u_id      INTEGER REFERENCES trade.users,
  na_action INTEGER,
  na_data   JSONB,
  na_mtime  TIMESTAMP DEFAULT NOW()
  
);