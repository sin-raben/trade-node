/*jshint esversion: 6,
undef: true,
unused: true,
devel: true,
browser: true
*/
/*global L, wsFunInp, wsFunOut */
/*exported initMap, onClick */
/*devel: true ///не ругаться на console и алерт*/
var socket;

var mymap;
var markers;

var session = {
    map: {},
    modeLspClick: "popupPoint", //popupPoint, removePoint
    activePoint: null,
    tt_map: {},
    flPanel: {}
};
console.log("session", session);
var onClick = {
    lspElement: function(id) {
        if (session.modeLspClick === "removePoint") {
            if (confirm(`Вы действительно ходите удалить ${session.tt_map[id].obj.name}`)) {
                wsFunOut.removeTT(id);
            }
            onClick.tpnlRemove();
            return;
        }
        if (session.modeLspClick === "popupPoint") {
            popupPoint(id);
            return;
        }
    },
    mapMarkPop: function(id) {
        console.log("arg", id);
        //прокрутить список до элемента
        scrollToElement("ls-" + id);
        openFormPoint(id);
    },
    tpnlCreate: function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            //console.log("position", position);
            openFormPoint("", position.coords.latitude, position.coords.longitude);
        }, function(err) {
            openFormPoint("", 40, 40);
            var mess;
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    mess = "Посетитель не дал доступ к сведениям о местоположении";
                    break;
                case err.POSITION_UNAVAILABLE:
                    mess = "Невозможно получить сведения о местоположении";
                    break;
                case err.TIMEOUT:
                    mess = "Истёк таймаут, в течение которого должны быть получены данные о местоположении";
                    break;
                default:
                    mess = "Возникла ошибка '" + err.message + "' с кодом " + err.code;
            }
            console.log("mess", mess);
        }, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: true
        });

    },
    tpnlRemove: function() {
        var btn = document.getElementById('buttontpnlRemove');
        if (btn.classList.contains("btn-default")) {
            session.modeLspClick = "removePoint";
        } else {
            session.modeLspClick = "popupPoint";
        }
        btn.classList.toggle("btn-default");
        btn.classList.toggle("btn-primary");
    },
    tpnlFilter: function(btn) {
        console.log("btn", btn);
    },
    tpnlMDragg: function(btn) {
        'use  strict';
        if (btn.classList.contains("btn-primary")) {
            //выключить перетягивание
            for (var prop in session.tt_map) {
                try {
                    session.tt_map[prop].marker.dragging.enable();
                } catch (err) {
                    //console.log("prop", prop);
                    session.tt_map[prop].marker.options.draggable = true;
                }


            }
        } else {
            for (var pr in session.tt_map) {
                try {
                    session.tt_map[pr].marker.dragging.disable();
                } catch (err) {
                    //console.log("pr", pr);
                    session.tt_map[pr].marker.options.draggable = false;
                }

            }
        }
        btn.classList.toggle("btn-default");
        btn.classList.toggle("btn-primary");
    },
    tpnlInput: function(input) {
        filterTT({
            name: input.value
        });
        //фильтрация
        console.log("input.value", input.value);
    },
    tpnlFindLS: function(btn) {
        console.log("btn", btn);
    },
    fmGetCoord: function() {
        var adrStr = document.getElementById("inputAdr3").value;
        var lat = document.getElementById("inputCoord31");
        var lon = document.getElementById("inputCoord32");

        fetch(`https://nominatim.openstreetmap.org/search?q=${adrStr}&format=json`)
            .then(function(value) {
                return value.json();
            })
            .then(function(arr) {
                if (arr[0]) {
                    lat.value = arr[0].lat;
                    lon.value = arr[0].lon;
                    console.log("arr", arr);
                } else {
                    console.log("не удалось определить координаты");
                }

            });
    },
    fmGetAdrr: function() {
        var lat = +document.getElementById("inputCoord31").value;
        var lon = +document.getElementById("inputCoord32").value;
        var adrStr = document.getElementById("inputAdr3");
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(function(value) {
                return value.json();
            })
            .then(function(obj) {
                    console.log("arr", obj);
                    adrStr.value = obj.display_name;
                    console.log("arr", obj);
                }

            );
    },
    fmCloseWin: function() {
        document.getElementById("fff").parentNode.remove();
    },
    fmSaveData: function(id) {
        var obj;
        if (session.tt_map[id]) {
            obj = session.tt_map[id].obj;
        } else {
            obj = {
                name: "",
                adr: "",
                coord: {
                    lat: 0,
                    lon: 0
                },
                info: "",
                type: 0,
                json: {},
            };
        }

        var el = document.forms.fff.elements;
        var mod = false;
        if (obj.name != el.inputName3.value) {
            console.log("изменено поле name", obj.name, el.inputName3.value);
            obj.name = el.inputName3.value;
            mod = true;
        }
        if (obj.adr != el.inputAdr3.value) {
            console.log("изменено поле adr", obj.adr, el.inputAdr3.value);
            obj.adr = el.inputAdr3.value;
            mod = true;
        }
        if ((obj.coord.lat != el.inputCoord31.value) || (obj.coord.lon != el.inputCoord32.value)) {
            console.log("изменено поле coord", [obj.coord.lat, obj.coord.lon], [el.inputCoord31.value, el.inputCoord32.value]);
            obj.coord.lat = +el.inputCoord31.value;
            obj.coord.lon = +el.inputCoord32.value;
            mod = true;
        }
        if (obj.info != el.inputInfo3.value) {
            console.log("изменено поле info", obj.info, el.inputInfo3.value);
            obj.info = el.inputInfo3.value;
            mod = true;
        }
        if (obj.type != el.inputType3.value) {
            console.log("изменено поле type", obj.type, el.inputType3.value);
            obj.type = +el.inputType3.value;
            mod = true;
        }
        if (mod) {
            wsFunOut.saveTT(obj);
        }
    }
};

function filterTT(obj) {
    console.log("obj", obj);
    var prop;
    if (obj.name) {
        if (obj.name !== "") {
            for (prop in session.tt_map) {
                if (~(session.tt_map[prop].obj.name.toUpperCase()).indexOf(obj.name.toUpperCase())) {

                    session.tt_map[prop].lpi.classList.remove("hidden");
                } else {
                    session.tt_map[prop].lpi.classList.add("hidden");
                }
            }
        } else {
            for (prop in session.tt_map) {
                session.tt_map[prop].lpi.classList.remove("hidden");
            }
        }

    }
}


// event.type должен быть keypress
function getChar(event) {
    if (event.which === null) { // IE
        if (event.keyCode < 32) return null; // спец. символ
        return String.fromCharCode(event.keyCode);
    }

    if (event.which !== 0 && event.charCode !== 0) { // все кроме IE
        if (event.which < 32) return null; // спец. символ
        return String.fromCharCode(event.which); // остальные
    }

    return null; // спец. символ
}

function scrollToElement(theElement) {
    theElement = document.getElementById(theElement);

    var interfase = document.getElementById("list-point-block");
    if (theElement.scrollIntoView) {
        if (theElement.previousElementSibling && theElement.previousElementSibling.previousElementSibling && theElement.previousElementSibling.previousElementSibling.previousElementSibling){
            theElement.previousElementSibling.previousElementSibling.previousElementSibling.scrollIntoView();
        }else {
            theElement.scrollIntoView();
        }


    } else {
        var selectedPosX = 0;
        var selectedPosY = 0;

        var intS = interfase.scrollTop;
        var intH = interfase.offsetHeight;
        while (theElement !== null) {
            selectedPosX += theElement.offsetLeft;
            selectedPosY += theElement.offsetTop;
            theElement = theElement.offsetParent;
        }
        //console.log("selectedPosX selectedPosY theElement", selectedPosX, selectedPosY, intS, intH, theElement);
        if ((intS + 50 > selectedPosY) || (intS + intH < selectedPosY)) {
            try {
                interfase.scrollTo(selectedPosX, selectedPosY - intH / 2);
            } catch (err) {
                console.log("err", err);
            }

        }
    }


}

function openFormPoint(id, lat, lon) {
    var obj;
    if (session.tt_map[id]) {
        obj = session.tt_map[id].obj;
    } else {
        obj = {
            name: "",
            adr: "",
            coord: {
                lat: lat,
                lon: lon
            },
            json: {},
            info: "",
            type: 0,

        };
    }
    var type = new Array(10);
    type[obj.type] = "selected";
    var str = `<div class="fonForm" onclick="onClick.fmCloseWin()"></div>

       <form id="fff" class="panel panel-info col-sm-8 col-md-offset-2">
            <div class="panel-heading">
                <h3 class="panel-title text-center" style="text-align: center;">
                    id: ${obj.id}
                </h3>
            </div>

            <div class="panel-body form-horizontal">
                <div class="form-group">
                    <label for="inputName3" class="col-sm-3 control-label">Наименование торговой точки:</label>
                    <div class="col-sm-9">
                        <div class="col-sm-12">
                            <input type="text" class="form-control" id="inputName3" placeholder="Наименование торговой точки" value="${obj.name}">
                            <!-- <span class="help-block">Наименование торговой точки</span> -->
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputAdr3" class="col-sm-3 control-label">Адрес:</label>
                    <div class="col-sm-9">
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="inputAdr3" placeholder="Адрес" value="${obj.adr}">
                            <!-- <span class="help-block">Адрес торговой точки</span> -->
                        </div>
                        <div class="col-sm-4">
                            <button type="button" name="button" class="col-sm-12 btn btn-primary" onclick="onClick.fmGetCoord(this)">Получить координаты</button>
                        </div>


                    </div>

                </div>
                <div class="form-group">
                    <label for="inputCoord3" class="col-sm-3 control-label">Координаты:</label>
                    <div class="col-sm-9">
                        <div class="col-sm-4">
                            <input type="text" class="form-control" id="inputCoord31" placeholder="Широта" value="${obj.coord.lat}">
                        </div>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" id="inputCoord32" placeholder="Долгота" value="${obj.coord.lon}">
                        </div>
                        <div class="col-sm-4">
                            <button type="button" name="button" class="col-sm-12 btn btn-primary" onclick="onClick.fmGetAdrr(this)">Получить адресс</button>
                        </div>

                        <!-- <span class="help-block">Адрес торговой точки</span> -->
                    </div>

                </div>
                <div class="form-group">
                    <label for="inputInfo3" class="col-sm-3 control-label">Описание:</label>
                    <div class="col-sm-9">
                        <div class="col-sm-12">
                            <textarea id="inputInfo3" class="form-control" rows="3">${obj.info}</textarea>
                            <!-- <span class="help-block">рабочие заметки в произвольной форме</span> -->
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputType3" class="col-sm-3 control-label">Тип торговой точки:</label>
                    <div class="col-sm-9">
                        <div class="col-sm-12">
                            <select id="inputType3" class="form-control" autocomplete="off">
                                <option class="form-control" ${""+type[1]} disabled value="1">Выберете значение:</option>
                                <option class="form-control" ${""+type[2]} value="2">2</option>
                                <option class="form-control" ${""+type[3]} value="3">3</option>
                                <option class="form-control" ${""+type[4]} value="4">4</option>
                                <option class="form-control" ${""+type[5]} value="5">5</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputType3" class="col-sm-3 control-label">Товары:</label>
                    <div class="col-sm-9">
                        <div class="col-sm-12">
                            <div class="list-inline">
                                <div data-id-item="1" class="list-group-item col-sm-12 active" onclick="clickTov(this)">Item 1</div>
                                <div data-id-item="2" class="list-group-item col-sm-12 " onclick="clickTov(this)">Item 2</div>
                                <div data-id-item="3" class="list-group-item col-sm-12" onclick="clickTov(this)">Item 3</div>
                            </div>
                            <!-- <span class="help-block">рабочие заметки в произвольной форме</span> -->
                        </div>

                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-offset-3 col-sm-9">

                        <div class=" col-sm-6">
                            <button class="btn btn-primary col-sm-12" type="button" onclick="onClick.fmSaveData(${obj.id})">Сохранить</button>
                        </div>
                        <div class=" col-sm-6">
                            <button class="btn btn-primary col-sm-12 " type="button" onclick="onClick.fmCloseWin()">Выйти без сохранения</button>
                        </div>

                    </div>
                </div>
            </div>

        </form>`;
    var win = document.createElement("div");
    win.classList.add("windowFormPoint");
    win.innerHTML = str;


    document.body.appendChild(win);

}

function popupPoint(id) {

    if (session.activePoint) {
        session.activePoint.marker.closePopup();
        session.activePoint.lpi.classList.remove("active");
    }

    //прокрутить список до элемента
    scrollToElement("ls-" + id);
    var lpi = session.tt_map[id].lpi;
    var marker = session.tt_map[id].marker;
    var zoom = markers.options.disableClusteringAtZoom || mymap.getZoom();
    mymap.setView(marker.getLatLng(), zoom);
    //console.log("arg", id, zoom);
    //marker.openPopup();

    //сделать активным элемент списка если не активен и инвертировать pupup
    lpi.classList.toggle("active");
    marker.togglePopup();
    session.activePoint = session.tt_map[id];

}


window.onload = function() {
    "use strict";
    //document.forms.log_form.login.value = localStorage.login;
    if (!window.WebSocket) {
        document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }
    socket = new WebSocket("ws://pol-ice.ru:8890");
    socket.onerror = function(error) {
        console.log("error", error);
        alert("Сервер WebSocket не доступен");
    };
    socket.onmessage = function(event) {
        var incomingMessage = event.data;
        var wssOb;
        try {
            wssOb = JSON.parse(incomingMessage);
        } catch (err) {
            console.log("err", err);
            return;
        }
        console.log("mesageWS", incomingMessage);
        if (wsFunInp[wssOb.head]) {
            wsFunInp[wssOb.head](wssOb.body);
        } else {
            wsFunInp.zero(wssOb.head);
        }
    };
    wsm("autchUser",{"idToken": "gofman-1", "criptoPass":{"login": "gofman", "pass": "1"}});
    initMap();
    //
};


function initMap() {
    "use strict";
    /*Подготовка данных*/

    //var markers = [];
    mymap = L.map('mapid').setView([47.505, 41.505], 8);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        attribution: 'Map <a href="http://openstreetmap.org">OSM</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">M</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    markers = L.markerClusterGroup({
        /*iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: '<b>+' + cluster.getChildCount() + '</b>'
            });
        },*/
        maxClusterRadius: 50,
        disableClusteringAtZoom: 15,
        //spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        //zoomToBoundsOnClick: false
    }); /**/
    mymap.addLayer(markers);


    /*L.circle([47.508, 41.11], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(mymap).bindPopup("Кружочек");

    L.polygon([
        [47.509, 41.08],
        [47.503, 41.06],
        [47.51, 41.047]
    ]).addTo(mymap).bindPopup("треуголь");*/

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Координаты клика " + e.latlng.toString())
            .openOn(mymap);
    }

    /**/
    mymap.on('click', onMapClick);

}
