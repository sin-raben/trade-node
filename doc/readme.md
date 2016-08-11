
#####Таблица последних синхронизаций

######TABLE sync

- `user` - пользователь
- `token` -идентификатор устройства
- `table` - идентификатор (имя таблицы)
- `sync_time_begin` - дата последней синхронизации (начало)

| user    | token    | table          | sync_time_begin |
| :------ | :------- | :------        | :-------------- |
| gofman  | gofman-1 | Item           | 2016-08-11 12:00|
| gofman  | gofman-1 | item_Groups    | 2016-08-11 12:02|
| gofman  | gofman-2 | Item           | 2016-08-09 12:00|
| zsg     | zsg-1    | Item           | 2016-08-09 12:00|

TABLE items
- `i_id` - идентификатор товара (тип: число)
- `i_name` - наименование товара (тип: строка)
- `i_mtime` -время изменения товара;

| i_id    | i_name         |i_mtime          |
| :------ | :------------- |:--------------- |
| 1       | Мороженка      |2015-08-11 10:00 |
| 1       | Творожок       |2016-08-11 13:00 |
| 1       | Рулетик        |2016-08-10 10:00 |

Для первого устройства
```SQL
SELECT * FROM items JOIN sync ON sync_time_begin < i_mtime WHERE token='gofman-1' and table= 'Item';
```
Для второго устройства
```SQL
SELECT * FROM items JOIN sync ON sync_time_begin < i_mtime WHERE token='gofman-2' and table= 'Item';
```
Для меня
```SQL
SELECT * FROM items JOIN sync ON sync_time_begin < i_mtime WHERE token='zsg-1' and table= 'Item';
```
