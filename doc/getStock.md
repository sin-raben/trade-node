# Структура запроса номенклатуры `getStocks`

**Предварительная авторизация обязательна.**

Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```json
{
    "head":"getStocks",
    "body": {
        "stores": "all",
        "storeLink": "all",
        "stocks": "all"
    }
}
```

Ответ сервера клиенту представляет собой JSON:

```json
{
    "head":"getStocks",
    "body": {
        "stores": [{
                "sr_id": 1,
                "sr_name": "Склад 1 общий",
                "sr_type": 1, //простой
                "sr_active": true,
                "sr_mtime": 1471529365
            }, {
                "sr_id": 1,
                "sr_name": "Склад город по договору",
                "sr_type": 0, //составной
                "sr_active": true,
                "sr_mtime": 1471529365
            }],
        "storeLink": [{
                "srl_id": 1,
                "srl_parent": 1,
                "srl_child": 1,
                "srl_sort": 10,
                "srl_active": true,
                "srl_mtime": 1471529365
            }],
        "stocks": [{
                "i_id": 1,
                "sr_id": 1,
                "sk_value": 10,
                "sk_active": true,
                "sk_mtime": 1471529365
            }]
    }
}
```

Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```json
{
    "head":"setStocks",
    "body": {
        "stores": [{
                "sr_exid": "1",
                "sr_name": "Склад 1 общий",
                "sr_type": 1,
                "sr_active": true
            }],
        "storeLink": [{
                "srl_exparent": "1",
                "srl_exchild": "1",
                "srl_sort": 10,
                "srl_active": true
            }],
        "stocks": [{
                "i_exid": "1",
                "sr_exid": "1",
                "sc_value": 10,
                "sc_active": true
            }]
    }
}
```

где поля имеют следующие значения:

## Структура массива объектов содержащих основную информацию о товаре/услуге `items`

- `i_id` - идентификатор товара (тип: число)
- `i_exid` - внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
- `i_name` - наименование товара (тип: строка)
- `i_prn` - наименование для печати (тип: строка)
- `i_info` - описание (тип: строка)
- `i_img` - изображение товара (тип: строка)
- `i_service` - признак услуги (тип: булево)
- `i_producer` - производитель (тип: число)
- `int_id` - ставка НДС (тип: число, ссылка на талицу ставок)
- `i_new` - признак создания
- `i_active` - признак существования
- `i_mtime` - время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
- `i_mtime_i` - время изменения товара _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)

где коды ставок НДС соответствуют следующим ставкам:

1. НДС: 0%
2. НДС: 10%
3. НДС: 18%
4. Без НДС

## Структура массива типов групп товаров `itemsGroupType`

перечисленны все группы, категории, подкатегории

- `igt_id` - идентификатор типа группы товаров (тип: число)
- `igt_exid` - внешний код, используется для синхронизации, _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
- `igt_priority` - приоритет (более обощенные типы предпочительны и имеют меньшее значение приоритета)
- `igt_agent` - признак отображения в меню торгового представителя (тип: булево)
- `igt_name` - наименование типа группы товаров (тип: строка)
- `igt_new` - признак создания
- `igt_active` - признак существования
- `igt_mtime` - время изменения типа информации о товаре _в посылаемом на мобильное приложение ответе - необязателен_ (тип: строка)
- `igt_mtime_i` - время изменения типа информации о товаре _в посылаемом на мобильное приложение ответе - необязателен_ (тип: число)