"use strict";

// JSON
var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);

request.onreadystatechange = function() {
    if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.responseText);
        } else {
            // Error :(
        }
    }
};

request.send();
request = null;

// POST
var request = new XMLHttpRequest();
request.open('POST', '/my/url', true);
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send(data);

// REQUEST
var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);

request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.responseText;
        } else {
            // Error :(
        }
};

request.send();
request = null;
