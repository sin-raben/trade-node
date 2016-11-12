# Структура запроса номенклатуры `getCountragents`


Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```json
{
    "head":"getDocs",
    "body": {
        "docs" : "all",
        "docItems" : "all",
		"":
    }
}
```

```json
"head":"getDocs",
"body": {
	"docs" : [{
		"d_id": 1,
		"d_num": "ГРС0002",
		"d_date": 100500,
		"d_delivery_date": 100600,
		"ca_id": 1,
		"pd_id": 2,
		"org_id": 2,
		"who_id": 10,
		"d_pri": "",
		"d_items": [{
			"d_id": 1,
			"i_id": 21,
			"iut_id": 200,
			"kol": 100,
			"price": 1000,
			"sr_id": 1,
			"pri": ""
		}]
		}],
		"pays": [{
			"d_id": 1,
			"d_num": "ГРС0002",
			"org_id": 2,
			"who_id": 10,
			"type": "по кассе/по банку",
			"d_date": 100500,
			"ca_id": 1,
			"pd_id": 2,
			"pri": "",
			"sum": 100000
		}]

}
```
