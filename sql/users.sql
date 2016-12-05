DROP TABLE IF EXISTS trade.ki_types;
CREATE TABLE trade.ki_types (
    kit_id      SERIAL PRIMARY KEY,
    kit_name    TEXT,
    kit_mtime   TIMESTAMP DEFAULT now()
);
INSERT INTO trade.ki_types(kit_id, kit_name) VALUES
    (1, 'Адрес'),
    (2, 'Телефон'),
    (3, 'Электронная почта'),
    (4, 'Сайт'),
    (5, 'Мгновенные сообщения'),
    (6, 'Социальные  сети');

DROP TABLE IF EXISTS trade.ki_kind;
CREATE TABLE trade.ki_kind (
    kik_id      SERIAL PRIMARY KEY,
    kit_id      INTEGER REFERENCES trade.ki_types,
    kik_name    TEXT,                       --наименование вида информации
    kik_mtime   TIMESTAMP DEFAULT now()
);

INSERT INTRO trade.ki_kind(kik_id, kit_id, kik_name) VALUES
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

DROP TABLE IF EXISTS trade.ki_value;
CREATE TABLE trade.ki_value (
    kiv_id      SERIAL PRIMARY KEY,
    kik_id      INTEGER REFERENCES trade.ki_kind,
    kiv_valiue  TEXT,                       -- значение контактной информации
    kik_mtime   TIMESTAMP DEFAULT now()
);

DROP TABLE IF EXISTS trade.post_peoples;
CREATE TABLE trade.post_peoples (
    pp_id       SERIAL PRIMARY KEY,
    pp_name     TEXT, --наименование должности
    pp_mtime    TIMESTAMP DEFAULT now()
);

DROP TABLE IF EXISTS trade.people;
CREATE TABLE trade.people (
    p_id         SERIAL PRIMARY KEY,
    p_name    мин
    pp_id         INTEGER REFERENCES trade.post_peoples,
    p_F          TEXT, --фамилия
    p_I          TEXT, --имя
    p_O          TEXT, --отчество
    --пол
    --дата рождения
    --тонна прочих реквизитов
    p_mtime      TIMESTAMP DEFAULT now()
);

DROP TABLE IF EXISTS trade.ki_catalog;
CREATE TABLE trade.ki_catalog (
    kic_id  SERIAL PRIMARY KEY,
    kic_name TEXT
    );

INSERT INTO trade.ki_catalog (kic_id, kic_name) VALUES
(1, 'Организации'),
(2, 'Контрагенты'),
(3, 'Точки доставки'),
(4, 'Люди');



DROP TABLE IF EXISTS trade.ki_link;
CREATE TABLE trade.ki_link (
    kil_id      SERIAL PRIMARY KEY,
    kic_id      INTEGER REFERENCES trade.ki_catalog,
    any_id      INTEGER,
    kiv_id      INTEGER REFERENCES trade.ki_value,
    kik_mtime   TIMESTAMP DEFAULT now()
);

DROP TABLE IF EXISTS trade.people_link_type;
CREATE TABLE trade.people_link_type (
    plt_id      SERIAL PRIMARY KEY,
    plt_name    TEXT,                  --наименование связи
    plt_obj     TEXT,                  --связанный с людьми справочник
    plt_mtime   TIMESTAMP DEFAULT now()

);

DROP TABLE IF EXISTS trade.people_link;
CREATE TABLE trade.people_link (
    pl_id      SERIAL PRIMARY KEY,
    plt_id     INTEGER REFERENCES trade.people_link_type,
    p_id       INTEGER REFERENCES trade.people,
    any_id      INTEGER,            --идентификатор объекта в зависимости от типа
    pl_mtime   TIMESTAMP DEFAULT now()

);

DROP TABLE IF EXISTS trade.users;
CREATE TABLE trade.users (
    u_id          SERIAL PRIMARY KEY,
    u_login       VARCHAR(30) UNIQUE,
    u_pass        TEXT,
    p_id          INTEGER REFERENCES trade.people,
    u_permission  INTEGER,                  -- ссылка на права доступа
    u_mtime       TIMESTAMP DEFAULT now()
);

DROP TABLE IF EXISTS trade.token;
CREATE TABLE trade.token (
    t_id          SERIAL PRIMARY KEY,
    u_id          INTEGER REFERENCES trade.users,
    t_name        VARCHAR(100),
    t_key         TEXT,
    t_mtime       TIMESTAMP DEFAULT now(),
    UNIQUE (u_id, t_name)
);

DROP TABLE IF EXISTS trade.sync_token;
CREATE TABLE trade.sync_token (
    st_id       BIGSERIAL PRIMARY KEY,
    t_id        INTEGER REFERENCES trade.token,
    st_tableoid INTEGER,
    st_record   INTEGER,
    st_mtime    TIMESTAMP DEFAULT now()
);

--SELECT oid FROM pg_class WHERE relname = 'items'
