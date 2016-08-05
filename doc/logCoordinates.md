# Структура файла логирования координат устройства

**Предварительная авторизация обязательна.**

Данный запрос передаётся клиентом серверу и имеет следующую структуру.

```
var obj = {
    "head":"setLogCoord",
    "body": {
        "points": [{
            "coord": {
                "lat": 0.000,
                "lon": 0.000
            },
            "time": 1000
        }, {
            "coord": {
                "lat": 0.000,
                "lon": 0.000
            },
            "time": 1000
        }]
    }
}
```

Ответ сервера клиенту представляет собой

```
var obj = {
    "head":"setLogCoord",
    "body": {
        "result" : true
    }
}
```
wsm("autchUser",{"idToken": "gofman-1", "criptoPass":{"login": "gofman", "pass": "1"}});
wsm("setLogCoord",{"points": [{"coord": {"lat": 0.000,"lon": 0.000},"time": 1000}, {"coord": {"lat": 0.000,"lon": 0.000},"time": 1000}]});
