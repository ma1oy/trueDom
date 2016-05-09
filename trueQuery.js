var trueQuery = function(query) {

    var t = this, broodSelector = ' ', childrenSelector = '>', firstChild = ':first-child', childNumber = 1;

    t.deep = false;
    t.query = query;
    t.node = document;

    t.get = function() {
        // return pre;
        return t.node = t.deep || false ? t.node.querySelectorAll(t.query) : t.node.querySelector(t.query);
    };

    t.deep = function (v) {
        t.deep = v;
        return t;
    };

    t.eq = function(i) {
        t.query += ':nth-child(' + (i + 1) + ')';
        return t;
    };

    t.child = function(query) {
        t.deep = false;
        t.query += broodSelector + query;
        return t;
    };

    t.children = function(query, deep) {
        t.query += deep || false ? broodSelector + query : childrenSelector + query;
        return t;
    };

    t.animate = function() {
        //
    };

    return t;
};

trueQuery.test = function(f, n) {
    n = n || 1000000;
    var s = Date.now();
    for (var i = 0; i < n; ++i) f();
    var e = Date.now();
    return e - s;
};

+function($) {
    // $.fn.trueSlider = function() {
        //
    // };
    // console.log($('.list').children('li').eq(2).children('ul').node);

    console.log($('.list').children('li').eq(2).children('ul').get());

    // console.log(trueQuery.test(function() {
    //     var v = $('.list').children('li').eq(2).children('ul').get();
        // var v = $('.list:first-child > li:nth-child(3) > ul').get();
    // }), 10000);
}(trueQuery);
