if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }

        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. Если n >= len, вернём -1.
        if (n >= len) {
            return -1;
        }

        /////////////////////////////// (n<0?-n:n)
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// MATH
// function ceil(v) { return v > ~~v ? ~~++v : ~~v }
function ceil(v) { return v > (v = ~~v) ? ++v : v }
function floor(v) { return v < (v = ~~v) ? --v : v }
function abs(v) { return v < 0 ? -v : v }
// function round(v) { return v - ~~v < .5 ? ~~v : ~~++v }
// function round(v) { return v - ~~v > -.5 ? ~~v : ~~--v }
function round(v) {
    var a = ~~v, b = v - a;
    return v < 0 ? b > -.5 ? a : --a : b < .5 ? a : ++a;
}
function sign(v) { return v > 0 ? 1 : -1 }
function trunc(v) { return ~~v }

var $ = function(v) {
    // this.v = v;

    this.in = function(m) {
        // var v = this.v;
        for (var i = 0; i < m.length; ++i) if (m[i] == v) return true;
        return false;
    };

    return this;
};

$.test = function(f, n) {
    n = n || 1000000;
    var s = Date.now();
    for (var i = 0; i < n; ++i) f();
    var e = Date.now();
    return e - s;
};

Array.prototype.has = function(v, i) {
    i = i || false;
    // var c = s ? function(a, b) { return a == b } : function(a, b) { return a === b };
    // for (var i = 0; i < this.length; ++i) if (c(this[i], v)) return true;
    for (var j = 0; j < this.length; ++j) if (this[j] == v) return i ? j : true;
    return false;
};
