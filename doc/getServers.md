# Структура запроса серверов синхронизации `getServers`

Данный запрос передаётся клиентом серверу и имеет следующую структуру.

` `
```json
{
    "head":"getServers",
    "body": {
        "idToken": "484238420040204323",
    }
}
```

Ответ сервера клиенту представляет собой JSON:

```json
{
  "BeginConnection": {
    "Protocol": "ws",
    "Host": "pol-ice.ru",
    "Port": 8890,
    "Path": "/ws",
    "Description": "Начальное подключение к серверу который отдаст параметры подключения к серверам синхронизации прописывается жестко в программе"
  },
  "SyncConnection": [
    {
      "Protocol": "ws",
      "Host": "pol-ice.ru",
      "Port": 8890,
      "Path": "/ws",
      "ConnectionTimeout": 5000,
      "Compression": false,
      "Description": "Настройка подключения к серверу синхронизации"
    }
  ]
}
```
