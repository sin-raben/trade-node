DROP TABLE pricelist_link;
DROP TABLE price;
DROP TABLE pricelist;
-- ==================СОЗДАНИЕ ТАБЛИЦ=====================

CREATE TABLE public.pricelist (
  pl_id       SERIAL PRIMARY KEY, 		-- идентификатор прайслиста
  pl_exid		  TEXT,
  pl_name		  VARCHAR(50),				    -- Наименование прайс-листа
  pl_type		  INTEGER DEFAULT 0,      -- Тип прайс-листа (0 - составной, 1 - базовый)
  pl_nds      INTEGER DEFAULT 1,      -- 0-без ндс, 1 - с ндс
  pl_active   BOOLEAN   DEFAULT TRUE,
  pl_mtime    TIMESTAMP DEFAULT now() -- время изменения
);

-- Структура массива объектов содержащих
CREATE TABLE public.price (
  p_id       	SERIAL PRIMARY KEY, -- идентификатор
  pl_id			  INTEGER REFERENCES pricelist,
  i_id			  INTEGER REFERENCES items,
  p_date_b		TIMESTAMP DEFAULT  'infinity'::timestamp without time zone,
  p_date_e		TIMESTAMP DEFAULT  'infinity'::timestamp without time zone,
  p_cn 			  INTEGER,	--цена в копейках за **** единицу
  p_active   	BOOLEAN   DEFAULT TRUE,
  p_mtime    	TIMESTAMP DEFAULT now()                   -- время изменения
);


--Связи Составного прайс-листа и Базового прайс-листа
CREATE TABLE public.pricelist_link (
	pl_parent	INTEGER REFERENCES pricelist,
	pl_child	INTEGER REFERENCES pricelist,
	pll_prior	INTEGER DEFAULT 0,			--Чем больше число тем выше приоритет прайс-листа
  pll_active BOOLEAN DEFAULT TRUE,
  pll_mtime TIMESTAMP DEFAULT now(),
	PRIMARY KEY (pl_parent, pl_child)
);

