

DROP TABLE public.links_countragent_delivery_point;
DROP TABLE public.delivery_points;
DROP TABLE public.countragents;
DROP TABLE public.address;
DROP TABLE public.countragent_types;

--Струтура адресов
CREATE TABLE public.address (
    adr_id          SERIAL PRIMARY KEY      , -- идентификатор записи
    adr_postindex   VARCHAR(12)             , -- почтовый индекс
    adr_str         TEXT                    , -- строковое представление адреса без индекса
    adr_fias        VARCHAR(50)             , -- код ФИАС
    adr_kladr       VARCHAR(25)             , -- код КЛАДР
    adr_geo         point                   , -- подтвержденные координаты (точкой)
    adr_json        JSONB                   , -- json по структуре https://dadata.ru/suggestions/usage/#question-party-update-frequency
    adr_info        TEXT                    , -- примечание
    adr_active      BOOLEAN DEFAULT TRUE    ,
    adr_mtime       TIMESTAMP DEFAULT now()   -- время изменения
);

CREATE TABLE public.countragent_types (
    cat_id          SERIAL PRIMARY KEY      ,
    cat_name        TEXT      DEFAULT ''               ,
    cat_mtime       TIMESTAMP DEFAULT now()                   -- время изменения
);

INSERT INTO public.countragent_types (cat_id, cat_name) VALUES
    (1, 'Юр. лицо'),
    (2, 'ИП'),
    (3, 'Физ. лицо'),
    (4, 'Иностранное юр лицо'),
    (5, 'Обособленное подразделение');

--Cтрутура (Контрагенты)
CREATE TABLE public.countragents (
    ca_id           SERIAL PRIMARY KEY                      , -- идентификатор контрагента
    ca_exid         TEXT   DEFAULT ''                                  , -- внешний код
    ca_type         INTEGER REFERENCES countragent_types    , -- Юр. лицо, ИП, Физ. лицо, Иностранное юр лицо, Обособленное подразделение
    ca_opf          TEXT   DEFAULT ''                                  , -- ОПФ
    ca_head         INTEGER REFERENCES countragents         , -- Головной контрагент
    ca_name         TEXT        DEFAULT ''                           , -- наименование
    ca_prn          TEXT        DEFAULT ''                             , -- наименование для печати
    ca_info         TEXT        DEFAULT ''                            , -- описание
    ca_inn          VARCHAR(25) DEFAULT ''                     , -- ИНН
    ca_kpp          VARCHAR(25) DEFAULT ''                             , -- КПП
    ca_okved        VARCHAR(25) DEFAULT ''                             , -- ОКВЕД
    ca_ogrn         VARCHAR(25) DEFAULT ''                             , -- ОГРН
    adr_id          INTEGER REFERENCES address              , -- ссылка на юридический адрес
    ca_client       BOOLEAN DEFAULT TRUE                    , -- Клиент (0, 1)
    ca_supplier     BOOLEAN DEFAULT FALSE                   , -- Поставщик (0, 1)
    ca_carrier      BOOLEAN DEFAULT FALSE                   , -- Перевозчик (0, 1)
    ca_active       BOOLEAN DEFAULT TRUE                    ,
    ca_mtime        TIMESTAMP DEFAULT now()                   -- время изменения
);


-- Структура точек доставки
CREATE TABLE public.delivery_points (
    dp_id           SERIAL PRIMARY KEY                   , -- идентификатор точки доставки (торговой точки) (тип: число)
    dp_exid         TEXT          DEFAULT ''                        , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
    dp_name         VARCHAR(100)  DEFAULT ''                        , -- наименование товара (тип: строка)
    dp_prn          VARCHAR(100)  DEFAULT ''                        , -- наименование для печати (тип: строка)
    dp_info         TEXT          DEFAULT ''                        , -- описание (тип: строка)
    adr_id          INTEGER REFERENCES address           , -- ссылка на фактический адрес
    dp_client       BOOLEAN DEFAULT TRUE                 , -- Клиент (0, 1)**********
    dp_supplier     BOOLEAN DEFAULT FALSE                , -- Поставщик (0, 1)*********
    dp_carrier      BOOLEAN DEFAULT FALSE                , -- Перевозчик (0, 1)***********
    dp_active       BOOLEAN DEFAULT TRUE                 ,
    dp_mtime        TIMESTAMP DEFAULT now()                -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
);

-- Струтура cвязи Контрагентов и Точек доставки
CREATE TABLE public.links_countragent_delivery_point (
    lcp_id          SERIAL PRIMARY KEY                      , -- идентификатор записи
    ca_id           INTEGER REFERENCES countragents         , -- идентификатор контрагента
    dp_id           INTEGER REFERENCES delivery_points      , -- идентификатор точки доставки
    lcp_active      BOOLEAN DEFAULT TRUE                    , -- состояние
    lcp_mtime       TIMESTAMP DEFAULT now()                   -- время изменения
);
