
DROP TABLE item_Units;
DROP TABLE item_Unit_Types;
DROP TABLE item_Metric_Types;
DROP TABLE link_Item_Group
DROP TABLE item_Groups;
DROP TABLE item_Group_Types;
DROP TABLE items;

DROP TABLE item_NDS_Types;

-- ==================СОЗДАНИЕ ТАБЛИЦ=====================
--Структура списка ставок НДС
CREATE TABLE public.item_NDS_Types (
    int_id    SERIAL PRIMARY KEY                        , -- идентификатор ставки НДС
    int_name  VARCHAR(20)                               , -- наименование ставки
    int_value INTEGER                                   , -- значение для расчетов
    int_mtime TIMESTAMP DEFAULT now()                     -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
);

COMMENT ON TABLE    public.item_NDS_Types           IS 'Ставки НДС';
COMMENT ON COLUMN   public.item_NDS_Types.int_id    IS 'идентификатор ставки НДС';

INSERT INTO item_NDS_Types  (int_id, int_name, int_value)
                    VALUES  (1,     'НДС: 0%',  00),
                            (2,     'НДС: 10%', 10),
                            (3,     'НДС: 18%', 18),
                            (4,     'Без НДС',  00);

-- Структура массива объектов содержащих основную информацию о товаре/услуге `items`
CREATE TABLE public.items (
    i_id        SERIAL PRIMARY KEY                      , -- идентификатор товара (тип: число)
    i_exid      TEXT UNIQUE                             , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
    i_name      VARCHAR(100)                            , -- наименование товара (тип: строка)
    i_prn       VARCHAR(100)                            , -- наименование для печати (тип: строка)
    i_info      TEXT                                    , -- описание (тип: строка)
    i_img       TEXT                                    , -- изображение товара (тип: строка)
    i_service   BOOLEAN                                 , -- признак услуги (тип: булево)
    i_producer  INTEGER                                 , -- производитель (тип: число)
    int_id      INTEGER REFERENCES item_NDS_Types       , -- ставка НДС (тип: число)
    i_mtime     TIMESTAMP DEFAULT now()                   -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)

);


--Структура массива типов групп товаров `itemsGroupType` перечисленны все группы, категории, подкатегории
CREATE TABLE public.item_Group_Types (
    igt_id      SERIAL PRIMARY KEY                      , -- идентификатор типа группы товаров (тип: число)
    igt_exid    TEXT UNIQUE                             , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
    igt_agent   BOOLEAN                                 , -- признак отображения в меню торгового представителя (тип: булево)
    igt_name    VARCHAR(50)                             , -- наименование типа группы товаров (тип: строка)
    igt_mtime   TIMESTAMP DEFAULT now()                   -- время изменения типа информации о товаре _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число  )
);

-- Структура массива групп товаров `itemsGroup`
CREATE TABLE public.item_Groups (
    ig_id     SERIAL PRIMARY KEY                        , -- идентификатор значения группы товаров (тип: число)                 ,
    igt_id    INTEGER REFERENCES item_Group_Types       , -- тип спойства (тип: число)
    ig_exid   TEXT UNIQUE                               , -- внешний код, используется для синхронизации
    ig_value  VARCHAR(50)                               , -- значение (тип: строка)
    ig_mtime  TIMESTAMP DEFAULT now()                    -- время изменения  информации о товаре (тип: число)
);


CREATE TABLE public.link_Item_Group (
    i_id        INTEGER REFERENCES items                ,
    ig_id       INTEGER REFERENCES item_Groups          ,
    igt_id      INTEGER REFERENCES item_Group_Types     ,
    lig_mtime   TIMESTAMP DEFAULT now()                 , -- время изменения связи (тип: число)
    PRIMARY KEY (i_id, igt_id)
);


-- `length` - мера длинны, `area` - мера площади, `volume` - мера объема, `quantity` - количествеенная характеристика, `bulk` - мера веса
CREATE TABLE public.item_Metric_Types (
    imt_id    SERIAL PRIMARY KEY                        , -- идентификатор метрики
    imt_value VARCHAR(20)                               , -- наименование метрики
    imt_mtime TIMESTAMP DEFAULT now()                     -- время изменения  информации о товаре (тип: число)
);

INSERT INTO item_Metric_Types   (imt_id, imt_value)
                        VALUES  (1, 'мера длинны'       ),
                                (2, 'мера площади'      ),
                                (3, 'мера объёма'       ),
                                (4, 'мера веса'         ),
                                (5, 'мера количества'   );

-- Структура массива типов единиц измерения `itemsUnitType`
CREATE TABLE public.item_Unit_Types (
    iut_id     SERIAL PRIMARY KEY                   , -- идентификатор типа (тип: число)
    iut_exid   TEXT UNIQUE                          , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
    iut_name   VARCHAR(10)                          , -- наименование единицы измерения (тип: строка)
    imt_id     INTEGER REFERENCES item_Metric_Types , -- способ отпуска товара (тип: строка)
    iut_okei   INTEGER                              , -- код ОКЕИ (тип: число)
    iut_mtime  TIMESTAMP DEFAULT now()                -- время изменения  информации _в посылаемом на мобильное приложение ответе - необязателен_(тип: число)
);

-- Структура массива значений единиц измерения `itemsUnit`
CREATE TABLE public.item_Units (
    i_id      INTEGER REFERENCES items              , -- идентификатор товара (тип: число)
    iut_id    INTEGER REFERENCES item_Unit_Types    , -- единица измерения (тип: число)
    iu_ean    VARCHAR(15)                           , -- штрих-код (тип: строка)
    iu_krat   INTEGER                               , -- кратность (тип: число)
    iu_num    INTEGER                               , -- числитель коэффициента (тип: число)
    iu_denum  INTEGER                               , -- знаменатель коэффициента (тип: число)
    iu_gros   INTEGER                               , -- масса брутто в г
    iu_net    INTEGER                               , -- масса нетто в г
    iu_length INTEGER                               , -- длина в мм
    iu_width  INTEGER                               , -- ширина в мм
    iu_height INTEGER                               , -- высота в мм
    iu_area   INTEGER                               , -- площадь в мм:2
    iu_volume BIGINT                                , -- объем (мм:3)
    iu_agent  BOOLEAN                               , -- признак отображения в меню торгового представителя (тип: булево)
    iu_base   BOOLEAN                               , -- признак базовой единицы измерения (тип: булево)
    iu_main   BOOLEAN                               , -- признак основной единицы измерения (тип: булево)
    iu_mtime  TIMESTAMP DEFAULT now()               , -- время изменения  информации _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
    PRIMARY KEY (i_id, iut_id)                        --ключ
);

/*
SELECT ig_item, ig_exid, i_id, igt_id FROM items_Group AS ig RIGHT OUTER JOIN (
        SELECT * FROM (SELECT i_id FROM items WHERE i_exid='#') as i ,
                      (SELECT igt_id FROM items_group_type WHERE igt_exid='A->ATR') as igt
      ) as igt on (ig.ig_type = igt.igt_id) and (igt.i_id= ig.ig_item) ;

SELECT i.i_id, ig.ig_exid, igt.igt_id FROM
        items as i
        LEFT JOIN items_group ig ON ( i.i_id = ig.ig_item )
        JOIN items_group_type igt ON ( ig.ig_type = igt.igt_id AND igt.igt_exid = 'A->ATR')
      WHERE
        i.i_exid = '#';
/**/
--SELECT iu_item, iu_type, i_id, iut_id FROM items_unit AS iu RIGHT OUTER JOIN (SELECT * FROM (SELECT i_id FROM items  WHERE i_exid = '#') AS i, (SELECT iut_id  FROM items_unit_type  WHERE iut_exid = 'шт') AS iut) AS iut ON (iu.iu_type = iut.iut_id) AND (iut.i_id = iu.iu_item);
