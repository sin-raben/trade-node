DROP TABLE stocks;
DROP TABLE link_store_groups;
DROP TABLE store_groups;
DROP TABLE stores;

-- ==================СОЗДАНИЕ ТАБЛИЦ=====================
--Структура списка элементарных складов
CREATE TABLE public.stores (
  sr_id			SERIAL PRIMARY KEY, 	-- идентификатор элементарного склада
  sr_exid		TEXT, 					-- внешний идентификатор элементарного склада
  sr_name		VARCHAR(50), 			-- наименование склада
  sr_active		BOOLEAN DEFAULT TRUE, 	-- активность
  sr_mtime		TIMESTAMP DEFAULT now()  -- время изменения
);

--Структура списка групповых складов
CREATE TABLE public.store_groups (
  srg_id		SERIAL PRIMARY KEY, 	-- идентификатор группового склада
  srg_exid		TEXT, 					-- внешний идентификатор группового склада
  srg_name		VARCHAR(50), 			-- наименование склада
  srg_active	BOOLEAN DEFAULT TRUE, 	-- активность
  srg_mtime		TIMESTAMP DEFAULT now()	-- время изменения
);

--Структура связи элементарных и групповых складов
CREATE TABLE public.link_store_groups (
  lsg_id		SERIAL PRIMARY KEY, 				-- идентификатор связи складов
  sr_id			INTEGER REFERENCES stores,			-- идентификатор элементарного склада
  srg_id     	INTEGER REFERENCES store_groups, 	-- идентификатор группового склада
  lsg_sort		INTEGER DEFAULT 0,					-- приоритет
  lsg_active 	BOOLEAN DEFAULT TRUE, 				-- активность
  lsg_mtime 	TIMESTAMP DEFAULT now()				-- время изменения
);

--Структура связи элементарных и групповых складов
CREATE TABLE public.stocks (
  sk_id			SERIAL PRIMARY KEY, 				-- идентификатор связи складов
  sr_id			INTEGER REFERENCES stores,			-- идентификатор элементарного склада
  i_id     		INTEGER REFERENCES items, 			-- идентификатор товара
  sk_value		INTEGER DEFAULT 0,					-- приоритет
  sk_active 	BOOLEAN DEFAULT TRUE, 				-- активность
  sk_mtime 		TIMESTAMP DEFAULT now()				-- время изменения
);
