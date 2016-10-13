# Структура Документа Заказа

```json
{
    "head":"setOrder",
    "body": {
        "order": [
			{
				"id": 1234,
				"date": 12345,
				"number": 234234,
				"point": 12212,
				"urlitso": 434,
				"organization": 3,
				"sogl": 1233,
				"items": [
					{
						"item": 22,
						"skl_id": 2,
						"ed": 2,
						"amount": 12,
						"price": 12.45,
						"discount": 1.50
					},
					{
						"item": 23,
						"skl_id": 5,
						"ed": 4,
						"amount": 24,
						"price": 50.00,
						"discount": 5.50
					}
				]

			}
		]
    }
}
```
