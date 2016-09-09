"use strict";

//JSON
var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
    } else {
        // We reached our target server, but it returned an error

    }
};

request.onerror = function() {
    // There was a connection error of some sort
};

request.send();

// POST like in ie8

// REQUEST
var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
    } else {
        // We reached our target server, but it returned an error

    }
};

request.onerror = function() {
    // There was a connection error of some sort
};

request.send();
