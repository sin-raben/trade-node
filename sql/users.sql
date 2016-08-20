
DROP TABLE post_peoples;
CREATE TABLE public.post_peoples (
    pp_id       SERIAL PRIMARY KEY,
    pp_name     TEXT,
    pp_mtime    TIMESTAMP DEFAULT now()
);

DROP TABLE people;
CREATE TABLE public.people (
    pl_id         SERIAL PRIMARY KEY,
    pl_name       VARCHAR(100),
    pp_id         INTEGER REFERENCES post_peoples,
    pl_F          TEXT, --фамилия
    pl_I          TEXT, --имя
    pl_O          TEXT, --отчество
    --пол
    --дата рождения
    --тонна прочих реквизитов
    pl_mtime      TIMESTAMP DEFAULT now()
);

DROP TABLE Users;
CREATE TABLE public.users (
    u_id          SERIAL PRIMARY KEY,
    u_login       VARCHAR(30) UNIQUE,
    u_pass        TEXT,
    pl_id         INTEGER REFERENCES people,
    u_permission  INTEGER, -- ссылка на права доступа
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
