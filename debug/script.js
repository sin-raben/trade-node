/*jshint browser: true, undef: true, unused: true, devel: true, esversion: 6, -W097 */
/*global  */
/*exported submitRequest, setRequest */
/*devel: true ///не ругаться на console и алерт*/
"use strict";
var socket;
var ff;
var request = []; //массив запросов
var response = []; //массив ответов
//отправить объект на сервер
var wsm = function(head, body) {

    var ob = {
        head: "",
        body: {}
    };
    if ((typeof body) === "string") {
        body = JSON.parse(body);
    }
    ob.head = head;
    ob.body = body;
    var st = JSON.stringify(ob);
    console.log('Заголовок:', head, '\nТело:', body, '\nСтрока запроса к серверу: ', st);
    socket.send(st);
    var div = document.createElement('div');
    div.classList.add("log-request");
    var bod = JSON.stringify(ob.body);
    if (bod.length > 200) {
        bod = body.slice(0, 200) + "...";
    }
    bod = bod.replace(/,"/g, ', "');

    div.innerHTML = `<span class="response-head">${ob.head}</span><span class="response-body">${bod}</span>`;
    var d = document.getElementById('response');
    d.appendChild(div);
    request.push({obj: ob, string: st});
};
var setRequest = function(el) {
    var span = el.getElementsByTagName('span');
    ff = span;
    document.getElementById("request-head").value = span[0].innerText.trim();
    document.getElementById("request-body").value = span[1].innerText.trim();
};

var submitRequest = function() {
    var head = document.getElementById("request-head").value;
    var body = document.getElementById("request-body").value;
    wsm(head, body);
};
var saveFile = function(dom, head, body) {

    var csvData = 'data:application/json;charset=utf-8,' + encodeURIComponent(body);
    dom.href = csvData;
    dom.target = '_blank';
    dom.download = head+'.json';

};


window.onload = function() {
    //document.forms.log_form.login.value = localStorage.login;
    if (!window.WebSocket) {
        document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
    }
    socket = new WebSocket("ws://pol-ice.ru:8890/");

    socket.onopen = function() {
        console.log("Соединение установлено");
    };
    socket.onclose = function(event) {
        if (event.wasClean) {
            alert('Соединение закрыто чисто');
        } else {
            alert('Обрыв соединения'); // например, "убит" процесс сервера
        }
        alert('Код: ' + event.code + ' причина: ' + event.reason);
    };

    socket.onmessage = function(event) {
        //alert("Получены данные " + event.data);
        var message = event.data;
        //s = message;
        console.log("event.data", message);
        var obj;
        try {
            obj = JSON.parse(message);
        } catch (err) {
            console.log('err', err);
        }

        try {
            if (obj.head && obj.body) {
                console.log('ответ', obj.head, obj.body);
                var div = document.createElement('div');
                div.classList.add("log-response");
                var body = JSON.stringify(obj.body);
                if (body.length > 500) {
                    body = body.slice(0, 500) + "...";
                }
                body = body.replace(/,"/g, ', "');
                var a = document.createElement('a');
                a.innerHTML = "*";
                a.onclick = function () {saveFile(a,obj.head, message);};
                div.innerHTML = `<span class="response-head">${obj.head}</span><span class="response-body">${body}</span>`;
                div.appendChild(a);
                var d = document.getElementById('response');
                d.appendChild(div);
                response.push({obj: obj, string: message});
            }
        } catch (err) {
            console.log("err+", err);
        }
    };

    socket.onerror = function(error) {
        alert("Ошибка " + error.message);
    };

};
