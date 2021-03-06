DROP TABLE IF EXISTS trade.item_Units;
DROP TABLE IF EXISTS trade.item_Unit_Types;
DROP TABLE IF EXISTS trade.item_Metric_Types;
DROP TABLE IF EXISTS trade.link_Item_Group;
DROP TABLE IF EXISTS trade.item_Groups;
DROP TABLE IF EXISTS trade.item_Group_Types;
DROP TABLE IF EXISTS trade.items CASCADE;
DROP TABLE IF EXISTS trade.item_NDS_Types;


-- ==================СОЗДАНИЕ ТАБЛИЦ=====================
--Структура списка ставок НДС
CREATE TABLE trade.item_NDS_Types (
  int_id    SERIAL PRIMARY KEY, -- идентификатор ставки НДС
  int_name  VARCHAR(20), -- наименование ставки
  int_value INTEGER, -- значение для расчетов
  int_mtime TIMESTAMP DEFAULT now()                     -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
);

COMMENT ON TABLE trade.item_NDS_Types IS 'Ставки НДС';
COMMENT ON COLUMN trade.item_NDS_Types.int_id IS 'идентификатор ставки НДС';

INSERT INTO trade.item_NDS_Types (int_id, int_name, int_value) VALUES
  (1, 'НДС: 0%', 00),
  (2, 'НДС: 10%', 10),
  (3, 'НДС: 18%', 18),
  (4, 'Без НДС', 00);

-- Структура массива объектов содержащих основную информацию о товаре/услуге `items`
CREATE TABLE trade.items (
  i_id       SERIAL PRIMARY KEY, -- идентификатор товара (тип: число)
  i_exid     TEXT UNIQUE, -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
  i_name     VARCHAR(100), -- наименование товара (тип: строка)
  i_prn      VARCHAR(100), -- наименование для печати (тип: строка)
  i_info     TEXT, -- описание (тип: строка)
  i_img      TEXT, -- изображение товара (тип: строка)
  i_service  BOOLEAN, -- признак услуги (тип: булево)
  int_id     INTEGER REFERENCES item_NDS_Types, -- ставка НДС (тип: число)
  i_active   BOOLEAN   DEFAULT TRUE,
  i_mtime    TIMESTAMP DEFAULT now()                   -- время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)

);

--Структура массива типов групп товаров `itemsGroupType` перечисленны все группы, категории, подкатегории
CREATE TABLE trade.item_Group_Types (
  igt_id       SERIAL PRIMARY KEY, -- идентификатор типа группы товаров (тип: число)
  igt_exid     TEXT UNIQUE, -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
  igt_name     VARCHAR(50) UNIQUE, -- наименование типа группы товаров (тип: строка)
  igt_priority INTEGER,
  igt_agent    BOOLEAN, -- признак отображения в меню торгового представителя (тип: булево)
  igt_active   BOOLEAN   DEFAULT TRUE,
  igt_mtime    TIMESTAMP DEFAULT now() -- время изменения типа информации о товаре _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число  )
);

-- Структура массива групп товаров `itemsGroup`
CREATE TABLE trade.item_Groups (
  ig_id     SERIAL PRIMARY KEY, -- идентификатор значения группы товаров (тип: число)                 ,
  igt_id    INTEGER REFERENCES item_Group_Types, -- тип спойства (тип: число)
  ig_exid   TEXT, -- внешний код
  ig_value  VARCHAR(50), -- значение (тип: строка)
  ig_active BOOLEAN   DEFAULT TRUE,
  ig_mtime  TIMESTAMP DEFAULT now() -- время изменения  информации о товаре (тип: число)
);


CREATE TABLE trade.link_Item_Group (
  lig_id     SERIAL PRIMARY KEY, -- идентификатор типа (тип: число)
  i_id       INTEGER REFERENCES items,
  ig_id      INTEGER REFERENCES item_Groups,
  igt_id     INTEGER REFERENCES item_Group_Types,
  lig_active BOOLEAN   DEFAULT TRUE,
  lig_mtime  TIMESTAMP DEFAULT now() -- время изменения связи (тип: число)
);

-- `length` - мера длинны, `area` - мера площади, `volume` - мера объема, `quantity` - количествеенная характеристика, `bulk` - мера веса
CREATE TABLE trade.item_Metric_Types (
  imt_id     SERIAL PRIMARY KEY, -- идентификатор метрики
  imt_value  VARCHAR(20) UNIQUE, -- наименование метрики
  imt_active BOOLEAN   DEFAULT TRUE,
  imt_mtime  TIMESTAMP DEFAULT now()                     -- время изменения  информации о товаре (тип: число)
);

INSERT INTO trade.item_Metric_Types (imt_id, imt_value) VALUES
  (1, 'мера длинны'),
  (2, 'мера площади'),
  (3, 'мера объёма'),
  (4, 'мера веса'),
  (5, 'мера количества');

-- Структура массива типов единиц измерения `itemsUnitType`
CREATE TABLE trade.item_Unit_Types (
  iut_id     SERIAL PRIMARY KEY, -- идентификатор типа (тип: число)
  iut_exid   TEXT UNIQUE, -- внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
  iut_name   VARCHAR(10) UNIQUE, -- наименование единицы измерения (тип: строка)
  imt_id     INTEGER REFERENCES item_Metric_Types, -- способ отпуска товара (тип: строка)
  iut_okei   INTEGER, -- код ОКЕИ (тип: число)
  iut_active BOOLEAN   DEFAULT TRUE,
  iut_mtime  TIMESTAMP DEFAULT now()                -- время изменения  информации _в посылаемом на мобильное приложение ответе - необязателен_(тип: число)
);

-- Структура массива значений единиц измерения `itemsUnit`
CREATE TABLE trade.item_Units (
  iu_id     SERIAL PRIMARY KEY, -- идентификатор записи (тип: число)
  i_id      INTEGER REFERENCES items, -- идентификатор товара (тип: число)
  iut_id    INTEGER REFERENCES item_Unit_Types, -- единица измерения (тип: число)
  iu_ean    VARCHAR(15), -- штрих-код (тип: строка)
  iu_krat   INTEGER, -- кратность (тип: число)
  iu_num    INTEGER, -- числитель коэффициента (тип: число)
  iu_denum  INTEGER, -- знаменатель коэффициента (тип: число)
  iu_gros   INTEGER, -- масса брутто в г
  iu_net    INTEGER, -- масса нетто в г
  iu_length INTEGER, -- длина в мм
  iu_width  INTEGER, -- ширина в мм
  iu_height INTEGER, -- высота в мм
  iu_area   INTEGER, -- площадь в мм:2
  iu_volume BIGINT, -- объем (мм:3)
  iu_agent  BOOLEAN, -- признак отображения в меню торгового представителя (тип: булево)
  iu_base   BOOLEAN, -- признак базовой единицы измерения (тип: булево)
  iu_main   BOOLEAN, -- признак основной единицы измерения (тип: булево)
  iu_active BOOLEAN   DEFAULT TRUE,
  iu_mtime  TIMESTAMP DEFAULT now(), -- время изменения  информации _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)
  UNIQUE (i_id, iut_id)                               --ограничение уникальности
);



/*INSERT INTO link_Item_Group (i_id, igt_id, ig_id)
SELECT i_id, igt_id, ig_id FROM
    items as i
    CROSS JOIN (
    SELECT ig.igt_id, ig_id FROM
      item_groups AS ig
      JOIN item_group_types AS igt ON igt.igt_id=ig.igt_id
    WHERE igt.igt_exid = 'A->ATR' AND ig.ig_value = 'ВЕДРО'
    )  as ig
  WHERE i.i_exid = '#';*/

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
