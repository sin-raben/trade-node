## Структура запроса на создание людей `setPeople`

**Предварительная авторизация обязательна.**

JSON:

```json
{
    "organization": [{
        "org_exid": "D8D3B87E",
        "org_name": "ПОЛАЙС",
        "org_short": "ООО 'Полайс'",
        "org_full": "ООО 'Полайс'",
        "org_inn": "6168046060",
        "org_kpp": "616801001",
        "org_okpo": "57484970",
        "org_active": true
    }, {
        "org_exid": "811DE165",
        "org_name": "РЫБАКОВ",
        "org_short": "ИП Рыбаков Н.В.",
        "org_full": "ИП Рыбаков Н.В.",
        "org_inn": "612201678096",
        "org_kpp": "",
        "org_okpo": "",
        "org_active": true
    }],
    "post_peoples": [{
        "pp_exid": "2D22E513",
        "pp_name": "ВОДИТЕЛЬ",
        "sr_active": true
    }, {
        "pp_exid": "B2E78365",
        "pp_name": "ТОРГОВЫЙ ПРЕДСТАВИТЕЛЬ",
        "sr_active": true
    }],
    "people": [ {
        "p_exid": "1CB8FF77",
        "p_name": "Иванов Алексей",
        "p_f": "Иванов",
        "p_i": "Алексей",
        "p_o": "Петрович",
        "p_sex": true,
        "p_active": true
    }],
    "people_link_type": [{
        "plt_exid": "6B7DA65F",
        "plt_name": "Постоянный сотрудник",
        "at_id": 1,
        "plt_active": true
    }],
    "people_link": [ {
        "plt_exid": "6B7DA65F",
        "pp_exid": "B2E78365",
        "p_exid": "1CB8FF77",
        "any_exid": "D8D3B87E",
        "plt_active": true
    }],
    "ki_value ": [{
        "kiv_exid": "17D93EF5",
        "kik_id": 5,
        "kiv_valiue": "81812924189",
        "kiv_active": true
    }],
    "ki_link": [ {
        "at_id": 4,
        "any_exid": "1CB8FF77",
        "kiv_exid": "17D93EF5",
        "kil_active": true
    }]
}
```

## Структура запроса на создание контактной информации `setKI`

JSON:

```json
{
    "setKI":{
        "ki_value":[{
            "kiv_exid": "777",
            "kik_id": 5,
            "kiv_valiue": "89286134647",
            "kiv_active": true
        }],
        "ki_link":[{
            "at_id": 2,
            "any_exid": "fdsa",
            "kiv_exid": "777",
            "kil_active": true
        }],

    }
}
```
## Структура запроса на создание контактной информации `setOrg`
```json
{
    "organization": [{
        "org_exid": "D8D3B87E",
        "org_name": "ПОЛАЙС",
        "org_short": "ООО 'Полайс'",
        "org_full": "ООО 'Полайс'",
        "org_inn": "6168046060",
        "org_kpp": "616801001",
        "org_okpo": "57484970",
        "org_active": true
    }, {
        "org_exid": "811DE165",
        "org_name": "РЫБАКОВ",
        "org_short": "ИП Рыбаков Н.В.",
        "org_full": "ИП Рыбаков Н.В.",
        "org_inn": "612201678096",
        "org_kpp": "",
        "org_okpo": "",
        "org_active": true
    }]
}
```


результат пока

```json
{"result": true}
```
