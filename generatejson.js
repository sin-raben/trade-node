/*jshint node:true, esversion: 6 */
'use strict';
var fs = require('fs');
var ar = [];
var el = {
    "prfOrg": "pol-ice",
    "key": "000001",
    "name": "Вкусное мороженое",
    "info": "Полезно-бесполезная информация",
    "img": "/img/000001.jpg",
    "cat": "Мороженое",
    "grp": "Наше",
    "edb": "шт",
    "edo": "кор",
    "blk": 10,
    "krt": 10,
    "vesb": 200,
    "veso": 2000,
    "nds": 10,
    "eanb": "",
    "eano": "",
    "atime": "Mon Mar 14 2016 15:59:01 GMT+0300 (MSK)",
    "mtime": "Mon Mar 14 2016 15:59:01 GMT+0300 (MSK)"
};
for (let i = 0; i < 3000; i++) {
    var tov = {
        "prfOrg": "pol-ice",
        "key": "000001",
        "name": "Вкусное мороженое",
        "info": "Полезно-бесполезная информация",
        "img": "/img/000001.jpg",
        "cat": "Мороженое",
        "grp": "Наше",
        "edb": "шт",
        "edo": "кор",
        "blk": 10,
        "krt": 10,
        "vesb": 200,
        "veso": 2000,
        "nds": 10,
        "eanb": "",
        "eano": "",
        "atime": "Mon Mar 14 2016 15:59:01 GMT+0300 (MSK)",
        "mtime": "Mon Mar 14 2016 15:59:01 GMT+0300 (MSK)"
    };

    tov.key = ("00000000000" + i).slice(-5);
    tov.name = ("Название этого замечательного Продукта")+("0000" + i).slice(-5);

    ar.push(tov);

}
var s = JSON.stringify(ar);
fs.writeFileSync('./mobile/db/toov.json', s);
