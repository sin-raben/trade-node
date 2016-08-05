/*jshint node: true, esversion: 6*/
var iconv = require('iconv-lite'),
    Parser = require('node-dbf'),
    fs = require('fs');
/*
Parser.prototype.parseField = function(field, buffer) {
      var value;
      if ((field.type === 'C')&&(this.encodingFunction)) {
          value = (this.encodingFunction(buffer)).trim();
      } else {
          value = (buffer.toString(this.encoding)).trim();
      }
      if (field.type === 'N') {
        value = parseInt(value, 10);
      } else if (field.type === 'F') {
        value = value === +value && value === (value | 0) ? parseInt(value, 10) : parseFloat(value, 10);
      }
      return value;
    };
*/

var parsDBF = function(file) {
    return new Promise(function(resolve, reject) {
        var parser = new Parser('./importsFromTFO/' + file);
        var arr = [];
        parser.on('start', function(p) {
            //console.log('Начало парсинга dBase файла');
        });

        parser.on('header', function(h) {
            //console.log('заголовок dBase файла был прочитан');
            //console.log('h', h);
        });
        parser.on('record', function(record) {
            arr.push(record);

        });

        parser.on('end', function(p) {
            resolve(arr);
            //console.log('Окончание парсинга файла dbase');
        });
        //parser.encoding = "ASCII";
        parser.encodingFunction = function(buffer) {
            return iconv.decode(new Buffer(buffer), 'CP866');
        };
        //console.log('parser', parser);
        parser.parse();

    });
};

var body;
Promise.all([
    parsDBF('OI.dbf'),
    parsDBF('OIG.dbf'),
    parsDBF('OIGT.dbf'),
    parsDBF('OIU.dbf'),
    parsDBF('OIUT.dbf')
]).then(results => {
    body = {
        "items": results[0],
        "itemsGroup": results[1],
        "itemsGroupType": results[2],
        "itemsUnit": results[3],
        "itemsUnitType": results[4]
    };
    fs.writeFile('./db/tov.json', JSON.stringify(body), (err) => {
        if (err) {console.log('err', err);
        }
        if (err) throw err;
        console.log('It\'s saved!');
    });
    console.log('JSON.stringify(body).length');
});
