
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

====>>>>
```javascript
	{
		head,
		body:{
			idToken,
			authData:/*{
				login,
				pass
			}*/,		в виде зашифрованной строки, ключ шифрования - token_key
			clientInfo
		}
```
<<<<====(если все верно)
```json
	{
		head,
		body:{
			result: true,
			/*authData:{
				token_key - новое значение
			},*/в виде зашифрованной строки, ключ шифрования - старое значение token_key
		}

	}

	<<<<====(если нет токена)
	```json
	{
		head,
		body:{
			result: false,
			error: "не найден токен, обратитесь к администратору"	
		}

	}
	<<<<====(если не верен ключ токена)
	```json
	{
		head,
		body:{
			result: false,
			error: "ошибка шифрования, обратитесь к администратору"
		}
	}
	<<<<====(если не верен логин пароль)
	```json
	{
		head,
		body:{
			result: false,
			error: "ошибка авторизации"
		}
	}
	```
	пока заглушка в виде нешифрованного запроса