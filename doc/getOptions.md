# Структура запроса настроек мобильного приложения `getOptions`

Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```json
{
    "head": "getOptions",
    "body": {
        "all": true,
        "coord": true,
        "items": true,
        "countragents": true,
        "documents": true
    }
}
```

Ответ сервера клиенту представляет собой JSON:

```json
{
    "head": "getOptions",
    "body": {
        "options": [
            {
                "o_id" : 1,
                "o_data" : "Строка в формате JSON",
            }
        ]   
    }
}
```

