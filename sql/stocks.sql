DROP TABLE stocks;
DROP TABLE store_link;
DROP TABLE stores;

-- ==================СОЗДАНИЕ ТАБЛИЦ=====================
--Структура списка элементарных складов
CREATE TABLE public.stores (
  sr_id			SERIAL PRIMARY KEY, 	-- идентификатор элементарного склада
  sr_exid		TEXT, 					-- внешний идентификатор элементарного склада
  sr_name		VARCHAR(50), 			-- наименование склада
  sr_type       smallint DEFAULT 0,     -- тип склада (0 - составной, 1 - обычный)
  sr_active		BOOLEAN DEFAULT TRUE, 	-- активность
  sr_mtime		TIMESTAMP DEFAULT now() -- время изменения
);

--Структура связи элементарных и групповых складов
CREATE TABLE public.store_link (
  srl_id		SERIAL PRIMARY KEY, 				-- идентификатор связи складов
  srl_parent	INTEGER REFERENCES stores,			-- идентификатор элементарного склада
  srl_child    	INTEGER REFERENCES stores, 	        -- идентификатор группового склада
  srl_sort		INTEGER DEFAULT 0,					-- приоритет
  srl_active 	BOOLEAN DEFAULT TRUE, 				-- активность
  srl_mtime 	TIMESTAMP DEFAULT now()				-- время изменения
);

--Структура связи элементарных и групповых складов
CREATE TABLE public.stocks (
  sc_id			SERIAL PRIMARY KEY, 				-- идентификатор связи складов
  sr_id			INTEGER REFERENCES stores,			-- идентификатор элементарного склада
  i_id     		INTEGER REFERENCES items, 			-- идентификатор товара
  sc_amount		INTEGER DEFAULT 0,					-- приоритет
  sc_active 	BOOLEAN DEFAULT TRUE, 				-- активность
  sc_mtime 		TIMESTAMP DEFAULT now()				-- время изменения
);





