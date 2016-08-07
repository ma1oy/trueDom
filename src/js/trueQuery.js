"use strict";

const [load, query, selector] = [Symbol('load'), Symbol('query'), Symbol('selector')];

class TrueQuery {
    constructor(queryStr, context) {
        this[selector] = $.default.selector;
        this[query] = queryStr;
        // this.__context__ = ctx;
        TrueQuery.query === queryStr && TrueQuery.selection ?
            [this[0], this[load]] = [TrueQuery.selection, () => this] :
            [TrueQuery.query, this[load]] = [queryStr, () => {
//--------------
                console.log('load');
                TrueQuery.selection = this[0] = context[this[selector]](this[query]);
                this[load] = () => this;
                return this;
            }];
    }

    setSelector(functionName) {
        this[selector] = functionName;
        return this;
    }

    limit(value) {
        this[query] = 'querySelectorAll';
        value == 1 ? this[query] = 'querySelector' : value > 1 ? this.__limit__ = value : 0;
    }

    type() {
        this[query] = `input[type=${this[query]}]`;
        return this.setSelector('querySelectorAll')
    }

    css(attr, val) {
        this[load]();
        // this[Symbol.for('load')]();
        // console.log(attr + val);
        this[0][0].style[attr] = val;
        return this;
    }
}

let $ = (query, context = $.default.context) => new TrueQuery(query, context);
$.fn = $.prototype = TrueQuery.prototype;

$.symbols = {
    load: load,
    query: query,
    selector: selector
};

$.default = {
    context: document,
    selector: 'querySelectorAll'
};

$.fn.hello = function () {
    this[load]();
    console.log('hello');
    return this;
};

console.dir(TrueQuery);
console.log($('body').css('background', 'green'));
