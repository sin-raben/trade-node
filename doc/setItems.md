# Структура запроса номенклатуры `setItems`

**Предварительная авторизация обязательна.**

Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```json
{
    "items": [{
        "i_exid": "#L1",
        "i_name": "А.АНАНАСЫ КРУЖ ГП.565Г",
        "i_prn": "А.АНАНАСЫ КРУЖ ГП.565Г",
        "i_info": "",
        "i_img": "",
        "i_service": false,
        "int_id": 1,
        "i_active": true
    }],
    "itemsGroupType": [{
        "igt_exid": "A->CAT",
        "igt_name": "Категория",
        "igt_agent": true,
        "igt_active": true
    }],
    "itemsGroup": [{
        //"i_exid": "#JV",
        "igt_exid": "A->ATR",
        "ig_exid": "АССОРТИ ИЗ МОРЕПРОД.",
        "ig_value": "АССОРТИ ИЗ МОРЕПРОД.",
        "ig_active": true
    }],
    "linkItemGroup": [{
        "i_exid": "wm",
        "igt_exid": "A->CAT",
        "ig_exid": "МОРОЖЕНОЕ",
        "lig_active": true
    }],
    "itemsUnitType": [{
        "iut_exid": "кг",
        "iut_name": "кг",
        "imt_id": 4,
        "iut_okei": 102,
        "iut_active": true
    }],
    "itemsUnit": [{
        "i_exid": "#L1",
        "iut_exid": "шт",
        "iu_ean": "",
        "iu_krat": 0,
        "iu_num": 1.000,
        "iu_denum": 1.000,
        "iu_gros": 565,
        "iu_net": 565,
        "iu_length": 0,
        "iu_width": 0,
        "iu_height": 0,
        "iu_area": 0,
        "iu_volume": 0,
        "iu_agent": true,
        "iu_base": true,
        "iu_main": false,
        "iu_active": true
    }]
}
```
результат  пока
```JSON
{"result": true}
```
