;var TrueQuery; var $ = TrueQuery = function(window) {
    "use strict";

    let undefined, document = window.document, performance = window.performance, emptyArray = [], emptyObject = {};
    const
        _load  = Symbol('load'),
        _query = Symbol('query'),
        _func  = Symbol('function');


    let TrueQuery = Object.assign(
        function TrueQuery(selector, context = TrueQuery.default.context) {
            return new TrueQueryInstance(selector, context);
        }, {
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
                    css: true,
                    wrap: false
                }
            },
            lastQuery: false,
            lastInstance: false,
            extend: Object.assign,
            noop: () => {},
            isString: item => typeof item == 'string',
            isNumeric: null,
            isEmpty: item => {
                for (let name in item) if(item.hasOwnProperty(name)) return false;
                return true;
            },
            isArray: Array.isArray,
            isObject: item => item instanceof Object,
            isFunction: item => typeof item == 'function',
            isWindow: item => item != null && item === window,
            toArray: item => [].slice.call(item),

            hasSpace: str => /\s/g.test(str),

            speedTest(callback, iterations) {
                let start = performance.now();
                for (let i = 0; i < iterations; ++i) {
                    callback();
                }
                return performance.now() - start;
            }
        });

    class TrueQueryInstance {
        constructor(selector, context) {
            if (!selector) {
                // TODO: return empty TrueQuery object
            }
            if (TrueQuery.isString(selector)) {
                if (TrueQuery.lastQuery === (selector = selector.trim()) && TrueQuery.lastInstance) {
                    return TrueQuery.extend(this, TrueQuery.lastInstance);
                }
                // this.setSelector(TrueQuery.default.selector)[_query] = selector;
                if (TrueQuery.hasSpace(selector)) {
                    this.setSelector(TrueQuery.default.selector)[_query] = selector;
                } else {
                    let firstChar = selector[0];
                    firstChar === '<' ? TrueQuery.noop() : // TODO: create DOM
                        this.setSelector(
                            firstChar === '#' ? 'getElementById' :
                            firstChar === '.' ? 'getElementsByClassName' :
                                                'getElementsByTagName')[_query] = selector;
                }
                TrueQuery.lastQuery = selector;
                this[_load] = () => {
                    let selection = context[this[_func]](selector),
                        length = this.length = selection.length;
                    // console.dir(selection);
                    if (selection instanceof NodeList || selection instanceof HTMLCollection) {
                        for (let index = 0; index < length; ++index) {
                            this[index] = selection[index];
                        }
                    } else {
                        this[0] = selection;
                    }
                    this[_load] = $.noop;
                    return TrueQuery.lastInstance = this;
                };
            }
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

        toArray() {
            return TrueQuery.toArray(this);
        }

        type() {
            this[_query] = `input[type=${this[_query]}]`;
            return this.setSelector('querySelectorAll')
        }

        css(attr, val) {
            this[_load]();
            this[0].style[attr] = val;
            // this[0][1].style[attr] = val;
            return this;
        }

        load() {
            this[_load]();
            return this;
        }
    }

    // TrueQuery.fn = TrueQuery.prototype = TrueQueryInstance.prototype;
    TrueQuery.fn = TrueQueryInstance.prototype;
    return TrueQuery;
}(window);

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

let t = TrueQuery('.list ul > li');
let speed = $.speedTest(function () {
    // document.querySelectorAll('ul');
    // document.querySelectorAll('li');
    // TrueQuery('.list ul > li').load();
    // TrueQuery('.jq > ul li').load();
    // jQuery('.list ul > li');
    t.css('background', 'red');
    // jQuery('.jq > ul li');
    // document.querySelector('ul li');
    // document.querySelector('ul').querySelector('li');
}, 10000);
console.log(speed);
document.querySelector('li ~ li').style.background = 'red';

// 1. ~ + не разрывать по пробелах // [\s>]\w+[^>]\w*[\s>]
// 2. не разрывать по пробелах и > в ' или "
// 3. разрывать по пробелах и >
