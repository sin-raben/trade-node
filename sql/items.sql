DROP TABLE items_Unit;
DROP TABLE items_Unit_Type;
DROP TABLE items_Metric_Type;
DROP TABLE items_Group;
DROP TABLE items_Group_Type;
DROP TABLE items;
DROP TABLE items_NDS_Type;






--Структура списка ставок НДС
CREATE TABLE public.items_NDS_Type
    (
        int_id    SERIAL PRIMARY KEY, -- идентификатор ставки НДС
        int_name  VARCHAR(20)        , -- наименование ставки
        int_value INTEGER            , -- значение для расчетов
        int_mtime TIMESTAMP DEFAULT now() -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
    );
COMMENT ON TABLE public.items_NDS_Type IS 'Ставки НДС';
COMMENT ON COLUMN public.items_NDS_Type.int_id IS 'идентификатор ставки НДС';

INSERT INTO items_NDS_Type (int_id, int_name, int_value) VALUES (1,'без НДС', 0), (2, 'НДС: 10%', 10), (3,'НДС: 18', 18);

-- Структура массива объектов содержащих основную информацию о товаре/услуге `items`
CREATE TABLE public.items
    (
        i_id SERIAL PRIMARY KEY                    , -- идентификатор товара (тип: число)
        i_exid text                                 , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
        i_name VARCHAR(100)                         , -- наименование товара (тип: строка)
        i_prn  VARCHAR(100)                         , -- наименование для печати (тип: строка)
        i_info text                                 , -- описание (тип: строка)
        i_img text                                  , -- изображение товара (тип: строка)
        i_krat     INTEGER                          , -- кратность (тип: число)
        i_service  BOOLEAN                          , -- признак услуги (тип: булево)
        i_producer INTEGER                          , -- производитель (тип: число)
        i_nds      INTEGER REFERENCES items_NDS_Type, -- ставка НДС (тип: число)
        i_bed      INTEGER                          , -- базовая единица (тип: число)
        i_mtime TIMESTAMP DEFAULT now() -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
    )
;


--Структура массива типов групп товаров `itemsGroupType` перечисленны все группы, категории, подкатегории
CREATE TABLE public.items_Group_Type
    (
        igt_id SERIAL PRIMARY KEY, -- идентификатор типа группы товаров (тип: число)
        igt_exid text             , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
        igt_agent BOOLEAN         , -- признак отображения в меню торгового представителя (тип: булево)
        igt_name  VARCHAR(50)     , -- наименование типа группы товаров (тип: строка)
        igt_mtime TIMESTAMP DEFAULT now() -- время изменения типа информации о товаре _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
    )
;

-- Структура массива групп товаров `itemsGroup`
CREATE TABLE public.items_Group
    (
        ig_item INTEGER REFERENCES items      , -- товар (тип: число)
        ig_exid text                          , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
        ig_type  INTEGER REFERENCES items_Group_Type, -- тип спойства (тип: число)
        ig_value VARCHAR(50)                   , -- значение (тип: строка)
        ig_mtime TIMESTAMP DEFAULT now()       , -- время изменения  информации о товаре (тип: число)
        PRIMARY KEY (ig_item, ig_type)--ключ
    )
;

-- `length` - мера длинны, `area` - мера площади, `volume` - мера объема, `quantity` - количествеенная характеристика, `bulk` - мера веса
CREATE TABLE public.items_Metric_Type
    (
        imt_id    SERIAL PRIMARY KEY, -- идентификатор метрики
        imt_value VARCHAR(20)        , -- наименование метрики
        imt_mtime TIMESTAMP DEFAULT now() -- время изменения  информации о товаре (тип: число)
    )
;
INSERT INTO items_Metric_Type (imt_id, imt_value) VALUES (1,'мера длинны'), (2, 'мера площади'), (3,'мера объёма'), (4,'мера веса'), (5,'мера количества');
-- Структура массива типов единиц измерения `itemsUnitType`
CREATE TABLE public.items_Unit_Type
    (
        iut_id SERIAL PRIMARY KEY                      , -- идентификатор типа (тип: число)
        iut_exid text                                  , -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
        iut_name   VARCHAR(10)                         , -- наименование единицы измерения (тип: строка)
        iut_metric INTEGER REFERENCES items_Metric_Type, -- способ отпуска товара (тип: строка)
        iut_okei   INTEGER                             , -- код ОКЕИ (тип: число)
        iut_mtime TIMESTAMP DEFAULT now() -- время изменения  информации _в посылаемом на мобильное приложение ответе - необязателен_(тип: число)
    )
;

-- Структура массива значений единиц измерения `itemsUnit`
CREATE TABLE public.items_Unit
    (
        iu_item   INTEGER REFERENCES items          , -- идентификатор товара (тип: число)
        iu_type   INTEGER REFERENCES items_Unit_Type, -- единица измерения (тип: число)
        iu_ean    VARCHAR(15)                       , -- штрих-код (тип: строка)
        iu_num    INTEGER                           , -- числитель коэффициента (тип: число)
        iu_denum  INTEGER                           , -- знаменатель коэффициента (тип: число)
        iu_gros   INTEGER                           , -- масса брутто в г
        iu_net    INTEGER                           , -- масса нетто в г
        iu_length INTEGER                           , -- длина в мм
        iu_width  INTEGER                           , -- ширина в мм
        iu_height INTEGER                           , -- высота в мм
        iu_area   INTEGER                           , -- площадь в мм:2
        iu_volume bigint                            , -- объем (мм:3)
        iu_base   BOOLEAN                           , -- признак базовой единицы измерения (тип: булево)
        iu_mtime TIMESTAMP DEFAULT now()            , -- время изменения  информации _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
        PRIMARY KEY (iu_item, iu_type)--ключ
    )
;

--1
/*SELECT ig_item, ig_exid, i_id, igt_id
  FROM items_Group AS ig RIGHT OUTER JOIN (
                                            SELECT * FROM (SELECT i_id FROM items WHERE i_exid='#') as i , (SELECT igt_id FROM items_group_type WHERE igt_exid='A->ATR') as igt
                                          ) as igt on (ig.ig_type = igt.igt_id) and (igt.i_id= ig.ig_item) ;*/

--SELECT iu_item, iu_type, i_id, iut_id FROM items_unit AS iu RIGHT OUTER JOIN (SELECT * FROM (SELECT i_id FROM items  WHERE i_exid = '#') AS i, (SELECT iut_id  FROM items_unit_type  WHERE iut_exid = 'шт') AS iut) AS iut ON (iu.iu_type = iut.iut_id) AND (iut.i_id = iu.iu_item);
