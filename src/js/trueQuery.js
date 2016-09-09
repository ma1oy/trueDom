;var TrueQuery; var $ = TrueQuery = (function(window) {
    "use strict";

    // if (!Element.prototype.closest) TrueQuery.loadScript('polyfills/closest');
    // if (!Element.prototype.matches) TrueQuery.loadScript('polyfills/matches');

    let undefined, document = window.document, performance = window.performance, emptyArray = [], emptyObject = {};
    const
        _load  = Symbol('load'),
        _query = Symbol('query'),
        _func  = Symbol('function');

    let T = {
        version: '1.0.0',
        symbols: {
            load: _load,
            query: _query,
            selector: _func
        },
        default: {
            context: document,
            selector: 'querySelector',
            polyfillsPath: '/js/polyfills',
            each: {
                closest: true,
                css: true,
                wrap: false
            },
            own: {
                each: false,
                map: false
            }
        },
        lastQuery: false,
        lastInstance: false,
        noop: () => {},
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: (str) => str.replace(/^-ms-/, 'ms-').replace(/-+([A-Za-z])/g, (all, letter) => letter.toUpperCase()),

        extend: Object.assign,
        forOwn: (items, callback) => {
            for (let key in items)
                if (items.hasOwnProperty(key)) callback(items[key], key, items);
        },
        forAll: (items, callback) => {
            for (let key in items) //noinspection JSUnfilteredForInLoop
                callback(items[key], key, items);
        },
        forEach: (items, callback) => items.forEach(callback),
        forOwnBreak: (items, callback) => {
            for (let key in items) //noinspection JSUnfilteredForInLoop
                if (callback(items[key], key, items) === false) break;
        },
        forAllBreak: (items, callback) => {
            for (let key in items) //noinspection JSUnfilteredForInLoop
                if (callback(items[key], key, items) === false) break;
        },
        forEachBreak: (items, callback) => {
            for (let index = 0; index < items.length; ++index) {
                if (callback(items[index], index, items) === false) break;
            }
        },
        each: (items, callback, own = T.default.own.each) => {
            let _callback = (value, key) => callback.call(value, value, key, items);
            T.isArray(items) ?
                T.forEachBreak(items, _callback) :
                own ? T.forOwnBreak(items, _callback) : T.forAllBreak(items, _callback);
            return items;
        },
        map: (items, callback, own = T.default.own.map) => {
            let out = [], newValue, _callback = (value, key) => {
                if ((newValue = callback(value, key, items)) != null) out.push(newValue);
            };
            T.isArray(items) ?
                T.forEach(items, _callback) :
                own ? T.forOwn(items, _callback) : T.forAll(items, _callback);
            // Flatten any nested arrays
            return emptyArray.concat([], out);
        },
        isString: item => typeof item == 'string',
        isNumeric: null,
        isEmpty: item => {
            //noinspection LoopStatementThatDoesntLoopJS
            for (let name in item) return false;
            return true;
        },
        isArray: Array.isArray,
        isObject: item => item instanceof Object,
        isInstance: item => item instanceof TrueQueryInstance,
        isFunction: item => typeof item == 'function',
        isWindow: item => item != null && item === window,

        toArray: item => [].slice.call(item),

        hasSpace: str => /\s/g.test(str),

        speedTest(callback, precision = 5, iterations = 10000) {
            let allTime = 0;
            for (let i = 0; i < precision; ++i) {
                let start = performance.now();
                for (let i = 0; i < iterations; ++i) {
                    callback();
                }
                allTime += performance.now() - start;
            }
            return allTime / precision;
        }
    };

    class TrueQueryInstance {
        constructor(selector, context) {
            if (!selector) {
                // TODO: return empty TrueQuery object
            }
            if (T.isString(selector)) {
                // if (T.lastQuery === (selector = selector.trim()) && T.lastInstance) {
                //     return TrueQuery.extend(this, TrueQuery.lastInstance);
                // }
                // this.setSelector(TrueQuery.default.selector)[_query] = selector;
                if (T.hasSpace(selector)) {
                    this.setSelector(T.default.selector)[_query] = selector;
                } else {
                    let firstChar = selector[0];
                    firstChar === '<' ? T.noop() : // TODO: create DOM
                        this.setSelector(
                            firstChar === '#' ? 'getElementById' :
                            firstChar === '.' ? 'getElementsByClassName' :
                                                'getElementsByTagName')[_query] = selector;
                }
                // T.lastQuery = selector;
                this[_load] = () => {
                    let selection = context[this[_func]](selector),
                        length = this.length = selection.length;
                    if (selection instanceof NodeList || selection instanceof HTMLCollection) {
                        for (let index = 0; index < length; ++index) {
                            this[index] = selection[index];
                        }
                    } else {
                        this[0] = selection;
                    }
                    this[_load] = T.noop;
                    this[_func] = T.default.selector;
                    // return T.lastInstance = this;
                    return this;
                };
            } else if (T.isInstance(selector)) {
                return selector;
            }
        }

        [Symbol.iterator]() {
            this[_load]();
            let iteration = -1;
            return { next: () => ++iteration < this.length ? { value: this[iteration] } : { done: true } };
        }

        setSelector(selectFunctionName) {
            this[_func] = selectFunctionName;
            return this;
        }

        get one() {
            this.setSelector('querySelector');
            return this;
        }

        get all() {
            this.setSelector('querySelectorAll');
            return this;
        }

        each(callback) {
            let iteration = -1;
            for (let item of this) {
                // console.log(this.iteration);
                // console.log(item);
                if (callback.call(item, ++iteration, item, this) === false) break;
            }
            // for (let key in items) {
            //     if (callback.call(items[key], items[key], key, items) === false) break;
            // }
            return this;
        }

        closest(selector, context) {
            this.constructor(selector, context);
            let node = this;
            if (context) {
                while (node && node != context) {
                    if (node.matches(selector)) return node;
                    else node = node.parentElement;
                }
            } else {
                this.constructor(window.Element.closest(selector));
            }
            return this;
        }

        toArray() {
            return T.toArray(this);
        }

        type() {
            this[_query] = `input[type=${this[_query]}]`;
            return this.setSelector('querySelectorAll')
        }

        css(attr, value) {
            this[_load]();

            if (attr) {
                if (value) {
                    // str, str | str, int | str, function
                } else {
                    //str arr obj
                }
            } else {

            }

            this[0].style[attr] = value;
            // this[0][1].style[attr] = val;
            return this;
        }

        load() {
            this[_load]();
            return this;
        }
    }


    T = Object.assign(function TrueQuery(selector, context = T.default.context) {
        if (T.lastQuery === (selector = selector.trim()) && T.lastInstance) {
            return TrueQuery.lastInstance;
        }
        T.lastQuery = selector;
        return T.lastInstance = new TrueQueryInstance(selector, context);
    }, T);
    // TrueQuery.fn = TrueQuery.prototype = TrueQueryInstance.prototype;
    T.fn = TrueQueryInstance.prototype;
    return T;
})(window);

//return !result || result === "auto" ? 0 : result;

$.fn.hello = function () {
    this[$.symbols.load]();
    console.log('hello');
    return this;
};

console.dir($);
let sel = $('ul').css('background', 'yellow');
console.dir(sel);
console.dir($);

let t = jQuery('.list ul > li');
// let speed = $.speedTest(function () {
    // document.querySelectorAll('ul');
    // document.querySelectorAll('li');
    // TrueQuery('.list ul > li').load();
    // TrueQuery('.jq > ul li').load();
    // jQuery('.list ul > li');
    // jQuery('.jq > ul li');
    // document.querySelector('ul li');
    // document.querySelector('ul').querySelector('li');
// }, 10, 10000);
// console.log(speed);
// console.log($('li'));
// for (let item of $('li')) {
//     console.info(item);
// }

class Test
{
    constructor() {
        this.name = 'Roman';
    }
    hello() { console.log('hello ' + this.name); }
}
let test = new Test;
test.surname = 'Shevchenko';
// test = ['my', 'name', 'is', 'Roman'];
let speed = TrueQuery.speedTest(() => {
    "use strict";
    jQuery('li').each(function(key, value) {
        "use strict";
        return value;
    });
    jQuery('ul');
}, 10);
console.dir(speed);

// 1. ~ + не разрывать по пробелах // [\s>]\w+[^>]\w*[\s>]
// 2. не разрывать по пробелах и > в ' или "
// 3. разрывать по пробелах и >
