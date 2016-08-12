DROP TABLE Users;

CREATE TABLE public.Users (
  u_id         SERIAL PRIMARY KEY,
  u_login      VARCHAR(20) UNIQUE,
  u_pass       TEXT,
  pl_id        INTEGER,
  u_permission INTEGER

);

DROP TABLE people;
CREATE TABLE public.people (
  pl_id   SERIAL PRIMARY KEY,
  pl_name VARCHAR(100),
  pl_post INTEGER,
  pl_F    TEXT,
  pl_I    TEXT,
  pl_O    TEXT
);

