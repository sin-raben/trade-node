DROP TABLE IF EXISTS trade.people_link;
DROP TABLE IF EXISTS trade.people;
DROP TABLE IF EXISTS trade.people_link_type;
DROP TABLE IF EXISTS trade.post_peoples;

DROP TABLE IF EXISTS trade.ki_link;
DROP TABLE IF EXISTS trade.any_type;
DROP TABLE IF EXISTS trade.ki_value;
DROP TABLE IF EXISTS trade.ki_kind;
DROP TABLE IF EXISTS trade.ki_types;

DROP TABLE IF EXISTS trade.organization;
CREATE TABLE trade.organization (
  org_id     SERIAL PRIMARY KEY,
  org_exid   TEXT,
  org_name   TEXT,
  org_short  TEXT,
  org_full   TEXT,
  org_inn    TEXT,
  org_kpp    TEXT,
  org_ogrn   TEXT,
  org_okpo   TEXT,
  org_active BOOLEAN   DEFAULT TRUE,
  org_mtime  TIMESTAMP DEFAULT now()
);


CREATE TABLE trade.post_peoples (
  pp_id     SERIAL PRIMARY KEY,
  pp_exid   TEXT,
  pp_name   TEXT, --наименование должности
  pp_active BOOLEAN   DEFAULT TRUE,
  pp_mtime  TIMESTAMP DEFAULT now()
);


CREATE TABLE trade.people (
  p_id        SERIAL PRIMARY KEY,
  p_exid      TEXT,
  p_name      TEXT,
  p_F         TEXT, --фамилия
  p_I         TEXT, --имя
  p_O         TEXT, --отчество
  p_sex       BOOLEAN, --пол
  p_birthdate TIMESTAMP, --дата рождения
  p_active    BOOLEAN   DEFAULT TRUE,
  --тонна прочих реквизитов
  p_mtime     TIMESTAMP DEFAULT now()
);


CREATE TABLE trade.any_type (
  at_id     SERIAL PRIMARY KEY,
  at_name   TEXT,
  at_active BOOLEAN DEFAULT TRUE
);

INSERT INTO trade.any_type (at_id, at_name) VALUES
  (1, 'Организации'),
  (2, 'Контрагенты'),
  (3, 'Точки доставки'),
  (4, 'Люди');

CREATE TABLE trade.ki_types (
  kit_id     SERIAL PRIMARY KEY,
  kit_name   TEXT,
  kit_active BOOLEAN   DEFAULT TRUE,
  kit_mtime  TIMESTAMP DEFAULT now()
);
INSERT INTO trade.ki_types (kit_id, kit_name) VALUES
  (1, 'Адрес'),
  (2, 'Телефон'),
  (3, 'Электронная почта'),
  (4, 'Сайт'),
  (5, 'Мгновенные сообщения'),
  (6, 'Социальные  сети');


CREATE TABLE trade.ki_kind (
  kik_id     SERIAL PRIMARY KEY,
  kit_id     INTEGER REFERENCES trade.ki_types,
  kik_name   TEXT, --наименование вида информации
  kik_active BOOLEAN   DEFAULT TRUE,
  kik_mtime  TIMESTAMP DEFAULT now()
);

INSERT INTO trade.ki_kind (kik_id, kit_id, kik_name) VALUES
  (1, 1, 'Адрес юридический'),
  (2, 1, 'Адрес фактический'),
  (3, 1, 'Адрес доставки'),
  (4, 1, 'Адрес почтовый'),
  (5, 2, 'Мобильный'),
  (6, 2, 'Рабочий'),
  (7, 2, 'Внутрений'),
  (8, 2, 'Домашний'),
  (9, 3, 'Рабочая'),
  (10, 3, 'Домашняя');


CREATE TABLE trade.ki_value (
  kiv_id     SERIAL PRIMARY KEY,
  kiv_exid   TEXT,
  kik_id     INTEGER REFERENCES trade.ki_kind,
  kiv_valiue TEXT, -- значение контактной информации
  kiv_active BOOLEAN   DEFAULT TRUE,
  kiv_mtime  TIMESTAMP DEFAULT now()
);

CREATE TABLE trade.ki_link (
  kil_id     SERIAL PRIMARY KEY,
  at_id      INTEGER REFERENCES trade.any_type,
  any_id     INTEGER,
  kiv_id     INTEGER REFERENCES trade.ki_value,
  kil_active BOOLEAN   DEFAULT TRUE,
  kil_mtime  TIMESTAMP DEFAULT now()
);

--типы связей
CREATE TABLE trade.people_link_type (
  plt_id     SERIAL PRIMARY KEY,
  plt_exid   TEXT, --внешний ключ
  plt_name   TEXT, --наименование связи
  at_id      INTEGER REFERENCES trade.any_type, --связанный с людьми справочник
  plt_active BOOLEAN   DEFAULT TRUE,
  plt_mtime  TIMESTAMP DEFAULT now()
);

--связь людей и других объектов по типу
CREATE TABLE trade.people_link (
  pl_id     SERIAL PRIMARY KEY,
  plt_id    INTEGER REFERENCES trade.people_link_type,
  pp_id     INTEGER REFERENCES trade.post_peoples,
  p_id      INTEGER REFERENCES trade.people,
  any_id    INTEGER, --идентификатор объекта в зависимости от типа
  pl_date_b TIMESTAMP,
  pl_date_e TIMESTAMP,
  pl_active BOOLEAN   DEFAULT TRUE,
  pl_mtime  TIMESTAMP DEFAULT now()
);


DROP TABLE IF EXISTS trade.sync_token;
DROP TABLE IF EXISTS trade.token;
DROP TABLE IF EXISTS trade.users;


CREATE TABLE trade.users (
  u_id         SERIAL PRIMARY KEY, --
  u_login      VARCHAR(40) UNIQUE, -- логин
  u_pass       TEXT, -- пароль
  --u_count       INTEGER DEFAULT 1,  -- количество устройств
  p_id         INTEGER REFERENCES trade.people, -- ссылка на человека
  u_permission INTEGER, -- ссылка на права доступа
  u_mtime      TIMESTAMP DEFAULT now()
);


CREATE TABLE trade.token (
  t_id    SERIAL PRIMARY KEY,
  u_id    INTEGER REFERENCES trade.users, -- ссылка на полльзователя
  t_name  TEXT, -- текстовый идентификатор токена
  t_key   TEXT, -- ключ токена
  t_info  JSONB, -- информация об устройстве
  t_fcm   TEXT, /*Firebase cloud message - токен приложения*/
  t_type  INT       DEFAULT 0, /*(1- мобильный, 2 - веб вход локальный, 3 - веб вход глобальный, )*/
  t_mtime TIMESTAMP DEFAULT now(),
  UNIQUE (u_id, t_name)
);
/*t_info = {
    "type": "mobile",
    "name": "", // Браузер или Мобильное устройство // Xaiomi Redmi Note 3 Pro
    "desc": "Домашний вход", //
}*/



CREATE TABLE trade.sync_token (
  st_id     BIGSERIAL PRIMARY KEY,
  t_id      INTEGER REFERENCES trade.token,
  st_table  TEXT, --имя запроса на синхронизацию
  st_stime  TIMESTAMP DEFAULT now(), /*начало синхронизации*/
  st_etime  TIMESTAMP DEFAULT now(), /*окончание синхронизации*/
  st_result BOOLEAN                 /*состояние синхронизации*/
);


/*
CREATE SCHEMA trade;

SHOW search_path;
SET search_path TO trade,public;

*/


--SELECT oid FROM pg_class WHERE relname = 'items'
