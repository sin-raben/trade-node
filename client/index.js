var WebSocket = require('ws');
var ws = new WebSocket('ws://pol-ice.ru:8890');
var argv = process.argv;

var path = "H:\\POLICE\\OUT\\JSON\\";
var name = argv[2];
var job = require(path + argv[3]);
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
    ws.send(st);
};
var iArr = 0;
var authUser = {
    "idToken": "gofman-1",
    "authData": {
        "login": "gofman",
        "password": "1"
    }
};

var ArrMessage = [
    function() {
        console.log('authUser', authUser);
        wsm("authUser", authUser);
    },
    function() {
        console.log('setItems');
        wsm(name, job);
    }
];
ws.onopen = function open() {
    ArrMessage[0]();
};

ws.onmessage = function(data, flags) {
    var obj;
    try {
        obj = JSON.parse(data.data);
        if (obj.body.result === true) {
            iArr = iArr + 1;
            if (ArrMessage.length > iArr) {
                ArrMessage[iArr]();
            } else {
                ws.close();
            }
        } else {
            ws.close();
        }
    } catch (err) {
        console.log('error JSON req');
        ws.close();
    }
    console.log('obj', obj);

    // Flags.binary будет установлен, если двоичные данные получены.
    // Flags.masked будет установлен, если данные были замаскированы.
};
