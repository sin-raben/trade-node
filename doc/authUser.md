
### Запрос
```json
{
	"head":"authUser",
	"body":{
		"idToken": "gofman-1",
		"authData":{
			"login": "gofman",
			"password": "1"
		},
		"clientInfo": {}
	}
}

```
### Ответ
при успешной авторизации:
```json
{
	"result": true,
}
```
в случае ошибки:
```json
{
	"result": false,
	"error": {
		"code": 12,
		"message": "kmvdcklbv"
	}
}
```
