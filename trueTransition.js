var
    useCss = true,
    vendors = [
        'Webkit',
        'Moz',
        'O',
        'ms'
],
    props = [
        'transition',
        // 'transitionDelay',
        'transform',
        // 'transformOrigin',
        'filter'
    ];

var style = document.createElement('div').style;

function initProperty(v) {
    if (v in style) return v;
    for (let i = 0; i < vendors.length; ++i) {
        let str = vendors[i] + v.charAt(0).toUpperCase() + v.substr(1);
        if (str in style) return str;
    }
}

for (let i = 0; i < props.length; ++i) {
    props[i] = initProperty(props[i])
}

/////////////////////////////////////////////////////////////

function CurveVisualizer(canvas) {
    let ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height,
        { oX, oY, iX, iY, rt, sw, firstLineColor, secondLineColor } = 0;

    function flush() {
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(oX, oY, iX, iY);
        ctx.lineWidth = .5;
        ctx.strokeStyle = '#000';
    }

    function drawLines(x, y) {
        ctx.fillStyle = firstLineColor;
        ctx.fillRect(x, 10, 1, h - 20);
        ctx.fillStyle = secondLineColor;
        ctx.fillRect(10, y, w - 20, 1);
    }

    this.clear = () => {
        ctx.beginPath();
        flush();
        drawLines(oX + iX / 2, h - oY - iY / 2);
    };

    this.init = (rotate, swap, x = 50, y = 50) => {
        rt = !!rotate; sw = !!swap;
        sw ? (firstLineColor  = '#f00') && (secondLineColor = '#000') :
             (firstLineColor  = '#000') && (secondLineColor = '#f00');
        iX = (w - 2 * (oX = x));
        iY = (h - 2 * (oY = y));
        this.clear();
    };

    this.draw = (x, y) => {
        let X = oX + iX * x, Y = h - oY - iY * y, d = !rt - rt, m = X;
        X = rt * w + d * X;
        Y = rt * h + d * Y;
        X = !sw * X || Y;
        Y = !sw * Y || m;
        flush();
        drawLines(X, Y);
        ctx.lineTo(X, Y);
        ctx.stroke();
        ctx.moveTo(X, Y);
    };

    this.init();
    return this;
}

function bezier(p, f) {
    if (p.length < 2) return p[0];
    let P = [];
    for (let i = 0; i < p.length - 1; ++i) {
        P[i] = [
            p[i][0] + (p[i + 1][0] - p[i][0]) * f,
            p[i][1] + (p[i + 1][1] - p[i][1]) * f];
    }
    return bezier(P, f);
}

function serializeCssValue(value) {
    if (typeof value == 'number') return [value];
    if (value == 'auto') return [0];
    var parts = value.match(/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/);
    // var parts = value.match(/^([+-]?(?:\d+|\d*\.\d+))/);
    // var parts = value.match(/^[+-]?(?:\d+|\d*\.\d+)/);
    return [+parts[1], parts[2]];
}

// var curve = new CurveVisualizer(document.getElementById('myCanvas'));

function animate(object, properties, duration, draw) {
    let cssStyle = object.style,
        computedStyle = getComputedStyle(object),
        start = performance.now(), drawCurve = draw || function() {},
        startValues = [], serializedEndValues = [], delta = [],
        timePassed = 0, i = 0;

    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            // currentValues[i] = serializeValue(computedStyle.getPropertyValue(property));
            let serializedStartValues = serializeCssValue(computedStyle[property]);
            serializedEndValues[i]    = serializeCssValue(properties[property]);
            startValues[i] = serializedStartValues[0];
            serializedEndValues[i][1] ?
                serializedStartValues[1] != serializedEndValues[i][1] ? startValues[i] = 0 : 0 :
                serializedEndValues[i][1] = serializedStartValues[1];
            delta[i] = serializedEndValues[i][0] - startValues[i];
        }
        ++i;
    }

    var easeInElastic = function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    };

    var easeOutBounce = function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    };

    var measeOutBounce = function (f) {
        return  f < 1   / 2.75 ? 7.5625 *  f                  * f :
                f < 2   / 2.75 ? 7.5625 * (f -= 1.5   / 2.75) * f + .75 :
                f < 2.5 / 2.75 ? 7.5625 * (f -= 2.25  / 2.75) * f + .9375 :
                                 7.5625 * (f -= 2.625 / 2.75) * f + .984375;
    };
    
    var testEase = function(f) { //tension
        let amp = 1, freq = 3, decay = 8; // 6 - 400
        // return specialAbs(Math.cos(f * 10 * (freq - 1 + Math.pow(f, p)) / Math.PI)) * Math.pow(1-f, 4);
        return amp * (Math.cos(freq * f * 2 * Math.PI)) / Math.exp(decay * (1-f));
    };

    function calcFrame(time) {
        timePassed = time - start;
        timePassed < duration ? requestAnimationFrame(nextFrame) : timePassed = duration;
        i = 0;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                // let points = bezier([[0, 0], [.42, 0], [.58, 1], [1, 1]], timePassed / duration);
                let points = bezier([
                    [ 0.0,  0.0],
                    [ 0.5,  0.1],
                    [ 0.7, -0.8],
                    [ 0.7,  2.0],
                    [ 0.8, -2.0],
                    [ 0.8,  2.0],
                    [ 0.9, -2.5],
                    [ 0.9,  1.0],
                    [ 1.0,  1.0]
                ], timePassed / duration);
                drawCurve(timePassed / duration, points[1]);
                cssStyle[property] = startValues[i] + delta[i] * points[1] + serializedEndValues[i][1];

                // let point = easeOutBounce(startValues[i], timePassed, 0, delta[i], duration);
                // let point = easeInElastic(startValues[i], timePassed, 0, delta[i], duration);
                // drawCurve(timePassed / duration, point / delta[i] - startValues[i]);
                // cssStyle[property] = point + serializedEndValues[i][1];

                // let point = measeOutBounce(timePassed / duration);
                // let point = testEase(timePassed / duration);
                // drawCurve(timePassed / duration, point);
                // cssStyle[property] = startValues[i] + delta[i] * point + serializedEndValues[i][1];

                // console.log(point);
            }
            ++i;
        }
    }

    function nextFrame(time) {
        requestAnimationFrame(function nextFrame(time) {
            calcFrame(time);
        })
    }

    requestAnimationFrame(function animate(time) {
        duration += start - time;
        start = time;
        calcFrame(time);
    });
}

var curve1 = new CurveVisualizer(document.getElementById('curve1'));
// curve1.init(0, 1);
var curve2 = new CurveVisualizer(document.getElementById('curve2'));
curve2.init(1, 1);

var o1 = document.querySelector('.list');
var o2 = document.querySelector('.jq');

document.querySelector('.animate').addEventListener('click', function (e) {
    o1.style.marginLeft = 0;
    o2.style.marginRight = 0;
    curve1.clear();
    curve2.clear();
    animate(o1, { marginLeft: 100 }, 1000, function(x, y) { curve1.draw(x, y); curve2.draw(x, y); });
    // animate(o1, { marginLeft: 100 }, 1000, curve1.draw );
    // animate(o2, { marginRight: 100 }, 1000);
});

document.querySelector('.animateJq').addEventListener('click', function (e) {
    o2.style.marginRight = 0;
    $(o2).animate({ marginRight: 100 }, 1000, 'swing');
});

// animate({ paddingLeft: 100/*, paddingTop: '50px'*/ }, 5000, function(timePassed) {});

// jQuery('.jqer').animate({ paddingRight: 100, paddingTop: '50px' }, 5000, 'linear');


// console.log(navigator.userAgent);
// var txt = "";
// txt += "<p>Browser CodeName: " + navigator.appCodeName + "</p>";
// txt += "<p>Browser Name: " + navigator.appName + "</p>";
// txt += "<p>Browser Version: " + navigator.appVersion + "</p>";
// txt += "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>";
// txt += "<p>Browser Language: " + navigator.language + "</p>";
// txt += "<p>Browser Online: " + navigator.onLine + "</p>";
// txt += "<p>Platform: " + navigator.platform + "</p>";
// txt += "<p>User-agent header: " + navigator.userAgent + "</p>";
// document.body.innerHTML = txt;