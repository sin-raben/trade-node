/*jshint node:true, esversion: 6 */
'use strict';
//http://nominatim.openstreetmap.org/search?q=22&format=json
//https://geocode-maps.yandex.ru/1.x/?format=json&geocode=&results=2

var http = require('https');

const API_ENDPOINT = 'geocode-maps.yandex.ru';

var global = {};

var to_encode_uri = function(params, done) {
    params.format = params.format || 'json';
    //params.useragent = params.useragent || 'NodeJS request';

    var params_query = [];

    for (let i in global) {
        params_query.push(i + '=' + encodeURIComponent(global[i]));
    }

    for (let i in params) {
        params_query.push(i + '=' + encodeURIComponent(params[i]));
    }

    return params_query.join('&');
};

var query = function(path, done) {

    http.get({
        host: API_ENDPOINT,
        path: path
    }, function(res) {
        var output = '';

        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            try {
                done(false, output, path);
            } catch (e) {
                done(e, output, path);
            }
        });
    }).on('error', function(e) {
        done(e, null, path, null);
    });
};

var query_done = function(params, done) {
    return function(err, data, path) {
        if (err) {
            return done(err);
        }

        if (params.format == 'json') {
            data = JSON.parse(data);
        }

        done(false, data, path);
    };
};

module.exports = {
    global: function(globals, value) {
        global = globals;
    },

    search: function(params, done) {
        query('/1.x/?' + to_encode_uri(params), query_done(params, done));
    },
    geocode: function(text) {
        var params = {
            geocode: text,
            addressdetails: '1'
        };
        params.format = params.format || 'json';
        var params_query = [];

        for (let i in params) {
            params_query.push(i + '=' + encodeURIComponent(params[i]));
        }

        var path = '/1.x/?' + params_query.join('&');
        return new Promise(function(resolve, reject) {

            http.get({
                host: API_ENDPOINT,
                path: path
            }, function(res) {
                var output = '';

                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                    output += chunk;
                });

                res.on('end', function() {
                    var a = JSON.parse(output);
                    try {
                        var b = a.response.GeoObjectCollection.featureMember[0].GeoObject;
                        delete b.metaDataProperty.GeocoderMetaData.AddressDetails;
                        b.metaData = b.metaDataProperty.GeocoderMetaData;
                        delete b.metaDataProperty;
                        b.coord = {
                            lat: 0,
                            lon: 0
                        };
                        [b.coord.lon, b.coord.lat] = b.Point.pos.split(" ");
                        resolve(b);
                    } catch (e) {
                        resolve();
                    }

                });
            }).on('error', function(e) {
                reject(e);
            });
        });
    }
};
