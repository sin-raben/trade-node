

DROP TABLE public.links_countragent_delivery_point;
DROP TABLE public.delivery_points;
DROP TABLE public.countragents;
DROP TABLE public.address;


--Струтура адресов
CREATE TABLE public.address (
    adr_id          SERIAL PRIMARY KEY      ,-- идентификатор записи
    adr_postindex   VARCHAR(12)             ,-- почтовый индекс
    adr_str         TEXT                    ,-- строковое представление адреса
    adr_fias        VARCHAR(50)             ,-- код ФИАС
    adr_kladr       VARCHAR(25)             ,-- код КЛАДР
    adr_dom         VARCHAR(50)             ,-- дом
    adr_geo         point                   ,-- координаты
    adr_qc_geo      BOOLEAN                 ,-- подтвержденность координат
    adr_info        TEXT                    ,-- примечание
    adr_active      BOOLEAN DEFAULT TRUE,
    adr_mtime       TIMESTAMP DEFAULT now()  -- время изменения
);


--Cтрутура (Контрагенты)
CREATE TABLE public.countragents (
    ca_id           SERIAL PRIMARY KEY              , -- идентификатор контрагента
    ca_type         INTEGER                         , -- Юр. лицо, ИП, Физ. лицо, Иностранное юр лицо, Обособленное подразделение
    ca_opf          TEXT                            , -- ОПФ
    ca_head         INTEGER REFERENCES countragents , -- Головной контрагент
    ca_name         TEXT                            , -- наименование
    ca_prn          TEXT                            , -- наименование для печати
    ca_info         TEXT                            , -- описание
    ca_inn          VARCHAR(25)                     , -- ИНН
    ca_kpp          VARCHAR(25)                     , -- КПП
    ca_okved        VARCHAR(25)                     , -- ОКВЕД
    ca_ogrn         VARCHAR(25)                     , -- ОГРН
    ca_adr          INTEGER REFERENCES address      , -- ссылка на юридический адрес
    ca_client       BOOLEAN DEFAULT TRUE            , -- Клиент (0, 1)
    ca_supplier     BOOLEAN DEFAULT FALSE           , -- Поставщик (0, 1)
    ca_carrier      BOOLEAN DEFAULT FALSE           , -- Перевозчик (0, 1)
    dp_active       BOOLEAN DEFAULT TRUE,
    ca_mtime        TIMESTAMP DEFAULT now()           -- время изменения
);


-- Структура точек доставки
CREATE TABLE public.delivery_points (
    dp_id           SERIAL PRIMARY KEY                   , -- идентификатор точки доставки (торговой точки) (тип: число)
    dp_exid         TEXT                                 , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
    dp_name         VARCHAR(100)                         , -- наименование товара (тип: строка)
    dp_prn          VARCHAR(100)                         , -- наименование для печати (тип: строка)
    dp_info         TEXT                                 , -- описание (тип: строка)
    adr_id          INTEGER REFERENCES address           , -- ссылка на фактический адрес
    dp_client       BOOLEAN DEFAULT TRUE                 , -- Клиент (0, 1)**********
    dp_supplier     BOOLEAN DEFAULT FALSE                , -- Поставщик (0, 1)*********
    dp_carrier      BOOLEAN DEFAULT FALSE                , -- Перевозчик (0, 1)***********
    dp_active       BOOLEAN DEFAULT TRUE,
    dp_mtime        TIMESTAMP DEFAULT now()                -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
);

-- Струтура cвязи Контрагентов и Точек доставки
CREATE TABLE public.links_countragent_delivery_point (
    lcp_id          SERIAL PRIMARY KEY                      ,-- идентификатор записи
    lcp_org         INTEGER                                 ,-- идентификатор организации
    ca_id           INTEGER REFERENCES countragents         ,-- идентификатор контрагента
    dp_id           INTEGER REFERENCES delivery_points      ,-- идентификатор точки доставки
    lcp_active      BOOLEAN DEFAULT TRUE                    ,-- состояние
    lcp_mtime       TIMESTAMP DEFAULT now()                  -- время изменения
);
