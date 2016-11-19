

DROP TABLE ki_types;
CREATE TABLE public.ki_types (
    kit_id      SERIAL PRIMARY KEY,
    kit_name    TEXT,
    kit_mtime   TIMESTAMP DEFAULT now()
);
INSERT INTRO ki_types(kit_id, kit_name) VALUES
    (1, 'Адрес'),
    (2, 'Телефон'),
    (3, 'Электронная почта'),
    (4, 'Сайт'),
    (5, 'Мгновенные сообщения'),
    (6, 'Социальные  сети');

CREATE TABLE ki_kind (
    kik_id      SERIAL PRIMARY KEY,
    kit_id      INTEGER REFERENCES ki_types,
    kik_name    TEXT,                       --наименование вида информации
    kik_mtime   TIMESTAMP DEFAULT now()
);

INSERT INTRO ki_types(kit_id, kit_name) VALUES
    (1, 1, 'Адрес юридический'),
    (2, 1, 'Адрес фактический'),
    (3, 1, 'Адрес доставки'),
    (4, 1, 'Адрес почтовый'),
    (5, 2, 'Мобильный'),
    (6, 2, 'Рабочий'),
    (7, 2, 'Внутрений'),
    (8, 2, 'Домашний'),
    (9, 3, 'Рабочая'),
    (9, 3, 'Домашняя');

CREATE TABLE ki_value (
    kiv_id      SERIAL PRIMARY KEY,
    kit_id      INTEGER REFERENCES ki_types,
    kik_id      INTEGER REFERENCES ki_kind,
    kiv_valiue  TEXT,                       -- значение контактной информации
    kik_mtime   TIMESTAMP DEFAULT now()
);

DROP TABLE post_peoples;
CREATE TABLE public.post_peoples (
    pp_id       SERIAL PRIMARY KEY,
    pp_name     TEXT, --наименование должности
    pp_mtime    TIMESTAMP DEFAULT now()
);

DROP TABLE people;
CREATE TABLE public.people (
    p_id         SERIAL PRIMARY KEY,
    p_name       VARCHAR(100),
    pp_id         INTEGER REFERENCES post_peoples,
    p_F          TEXT, --фамилия
    p_I          TEXT, --имя
    p_O          TEXT, --отчество
    --пол
    --дата рождения
    --тонна прочих реквизитов
    p_mtime      TIMESTAMP DEFAULT now()
);


CREATE TABLE ki_link (
    kil_id      SERIAL PRIMARY KEY,
    p_id        INTEGER REFERENCES people,
    kiv_id      INTEGER REFERENCES ki_value,
    kik_mtime   TIMESTAMP DEFAULT now()
);

CREATE TABLE people_link_type (
    plt_id      SERIAL PRIMARY KEY,
    plt_name    TEXT,                  --наименование связи
    plt_obj     TEXT,                  --связанный с людьми справочник
    plt_mtime   TIMESTAMP DEFAULT now()

);

CREATE TABLE people_link (
    pl_id      SERIAL PRIMARY KEY,
    plt_id     INTEGER REFERENCES people_link_type,
    p_id       INTEGER REFERENCES people,
    any_id      INTEGER,            --идентификатор объекта в зависимости от типа
    pl_mtime   TIMESTAMP DEFAULT now()

);

DROP TABLE Users;
CREATE TABLE public.users (
    u_id          SERIAL PRIMARY KEY,
    u_login       VARCHAR(30) UNIQUE,
    u_pass        TEXT,
    p_id          INTEGER REFERENCES people,
    u_permission  INTEGER,                  -- ссылка на права доступа
    u_mtime       TIMESTAMP DEFAULT now()
);

DROP TABLE token;
CREATE TABLE public.token (
    t_id          SERIAL PRIMARY KEY,
    u_id          INTEGER REFERENCES Users,
    t_name        VARCHAR(100),
    t_key         TEXT,
    t_mtime       TIMESTAMP DEFAULT now(),
    UNIQUE (u_id, t_name)
);

CREATE TABLE public.sync_token (
    st_id       BIGSERIAL PRIMARY KEY,
    t_id        INTEGER REFERENCES token,
    st_tableoid INTEGER,
    st_record   INTEGER,
    st_mtime    TIMESTAMP DEFAULT now()
);

--SELECT oid FROM pg_class WHERE relname = 'items'
