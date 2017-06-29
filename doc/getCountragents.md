# Структура запроса номенклатуры `getCountragents`


Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```json
{
    "head":"getCountragents",
    "body": {
        "countragents" : "all",
        "deliveryPoints" : "all",
        "address" : "all",
        "linksCountragentDeliveryPoint" : "all"
    }
}
```
wsm("getCountragents",{"countragents" : "all","deliveryPoints" : "all","address" : "all","linksCountragentDeliveryPoint" : "all"});

setCountragents
```json
{
    "head":"setCountragents",
    "body": {
        "countragents" : [{
            "ca_exid": "093432A60",
            "cat_id": 1,
            "ca_exhead": "",
            "ca_name": "ФАКТОРИНГОВАЯ КОМПАНИЯ 'ЛАЙФ'",
            "ca_prn": "ООО 'ФАКТОРИНГОВАЯ КОМПАНИЯ 'ЛАЙФ'",
            "ca_info": "",
            "ca_inn": "7743658843",
            "ca_kpp": "774301001",
            "ca_client": false,
            "ca_supplier": true,
            "ca_carrier": false,
            "ca_active": true
        }, {
            "ca_exid": "0949BFC50",
            "cat_id": 2,
            "ca_exhead": "",
            "ca_name": "ХАНТИМИРОВ А.Р.",
            "ca_prn": "ИП 'ХАНТИМИРОВ А.Р.'",
            "ca_info": "",
            "ca_inn": "616200402751",
            "ca_kpp": "",
            "ca_client": false,
            "ca_supplier": false,
            "ca_carrier": false,
            "ca_active": true
        }],
        "deliveryPoints" : [{
            "dp_exid": "2K",
            "dp_name": "СЛАВИЯ ООО-ТАГАНРОГ",
            "dp_prn": "СЛАВИЯ ООО-ТАГАНРОГ",
            "dp_client": true,
            "dp_supplier": false,
            "dp_carrier": false,
            "dp_active": true
        }, {
            "dp_exid": "2L",
            "dp_name": "ЗОЛОТОЙ БЕРЕГ ООО-ТАГАНРОГ",
            "dp_prn": "ЗОЛОТОЙ БЕРЕГ ООО-ТАГАНРОГ",
            "dp_client": true,
            "dp_supplier": false,
            "dp_carrier": false,
            "dp_active": true
        }],
        "adress": [{
            "any_exid": "093432A60",
            "adrt_id": 1,
            "adr_str": "344015 РОСТОВСКАЯ ОБЛ.Г.РОСТОВ-НА-ДОНУ УЛ.ЗОРГЕ 37/1 КВ.7",
            "adr_active": true
            }],
        "linksCountragentDeliveryPoint": [{
            "ca_exid": "D970F6FC0",
            "dp_exid": "$",
            "lcp_active": true
        }, {
            "ca_exid": "FBF8648E0",
            "dp_exid": "1",
            "lcp_active": true
        }]
    }
}
```

# Структура клиентов
Структура клиентов должна быть представлена составными клиентами (ЮрЛицоми, включающим в себя все точки доставки) и непосредственно точками доставки. Но это потом.

## Струтура `kon.json` (Контрагенты)
- `ca_id` - идентификатор контрагента
- `ca_type` - Юр. лицо, ИП, Физ. лицо, Иностранное юр лицо, Обособленное подразделение
- `ca_head` - Головной контрагент
- `ca_name` - наименование
- `ca_prn` - наименование для печати
- `ca_info` - описание
- `ca_inn` - ИНН
- `ca_kpp` - КПП
- `ca_okved` - ОКВЕД
- `ca_ogrn` - ОГРН
- `adr_id` - ссылка на юридический адрес
- `ca_client` - Клиент (0, 1)
- `ca_supplier` - Поставщик (0, 1)
- `ca_carrier` - Перевозчик (0, 1)
- `ca_user` - Кто изменял
- `ca_mtime` - время изменения

## Струтура `delivery_point.json` (Партнеры) (Точки Доставки)
- `dp_id` - идентификатор точки доставки
- `dp_name` - наименование
- `dp_prn` - наименование для печати
- `dp_info` - описание
- `adr_id` - ссылка на фактический адрес
- `dp_client` - Клиент (0, 1)**********
- `dp_supplier` - Поставщик (0, 1)*********
- `dp_carrier` - Перевозчик (0, 1)***********
- `dp_user` - Кто изменял
- `dp_mtime` - время изменения

## Струтура `links_countragent_delivery_point.json` (Связи Контрагентов и Точек доставки)
- `lcp_id` - идентификатор записи
- `ca_id` - идентификатор контрагента
- `dp_id` - идентификатор точки доставки
- `lcp_active` - состояние
- `lcp_mtime` - время изменения

## Струтура `adr.json` (Структура адресов)
- `adr_id` - идентификатор записи
- `adr_str` - строковое представление адреса
- `adr_geo` - координаты
- `adr_qc_geo` - подтвержденность координат
- `adr_info` - примечание
- `adr_data` - JSON данные, которые содержат фсё
- `adr_mtime` - время изменения
