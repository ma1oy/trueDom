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
        oX = 0, oY = 0, iX = 0, iY = 0, hor = 0, dir = 0, firstLineColor = 0, secondLineColor = 0, getPosition = 0;

    function flush() {
        // ctx.fillStyle = '#fff';
        ctx.clearRect(0, 0, w, h);
        // ctx.fillStyle = '#DDD';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(oX, oY, iX, iY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
    }

    function drawLines(x, y) {
        ctx.fillStyle = firstLineColor;
        ctx.fillRect(x, 10, 1, h - 20);
        ctx.fillStyle = secondLineColor;
        ctx.fillRect(10, y, w - 20, 1);
    }

    this.clear = function() {
        ctx.beginPath();
        flush();
        let startX = 0, startY = 0;
        hor ? dir ? (startX = oX) && (startY = h - oY) : (startX = w - oX) && (startY = h - oY) :
              dir ? (startX = oX) && (startY =     oY) : (startX =     oX) && (startY = h - oY);
        drawLines(startX, startY);
        ctx.moveTo(startX, startY);
    };

    this.init = function(horizontal, direction, x, y) {
        x = x || 20; y = y || 20;
        hor = horizontal;
        // dir = direction >= 0 ? 1 : 0;
        dir = direction ? direction > 0 ? 1 : 0 : 1;
        if (hor) {
            firstLineColor  = '#f00';
            secondLineColor = '#000';
            getPosition = dir ?
                function(x, y) { return [    oX + iX * y, h - oY - iY * x]; } :
                function(x, y) { return [w - oX - iX * y, h - oY - iY * x]; };
        }
        else {
            firstLineColor  = '#000';
            secondLineColor = '#f00';
            getPosition = dir ?
                function(x, y) { return [oX + iX * x,     oY + iY * y]; } :
                function(x, y) { return [oX + iX * x, h - oY - iY * y]; };
        }
        iX = (w - 2 * (oX = x));
        iY = (h - 2 * (oY = y));
        this.clear();
    };

    this.draw = function (xy) {
        flush();
        xy = getPosition(xy[0], xy[1]);
        drawLines(xy[0], xy[1]);
        ctx.lineTo(xy[0], xy[1]);
        ctx.stroke();
        ctx.moveTo(xy[0], xy[1]);
    };

    this.init();
    return this;
}

function bezier(points, factor) {
    var newPoints = [];
    function calc(points) {
        if (points.length < 2) return true;
        newPoints = [];
        for (let i = 0; i < points.length - 1; ++i) {
            newPoints[i] = [
                points[i][0] + (points[i + 1][0] - points[i][0]) * factor,
                points[i][1] + (points[i + 1][1] - points[i][1]) * factor];
            // console.log(newCoords[i][1]);
        }
        calc(newPoints);
    }
    calc(points);
    return newPoints[0];
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

    function calcFrame(time) {
        timePassed = time - start;
        timePassed < duration ? requestAnimationFrame(nextFrame) : timePassed = duration;
        i = 0;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                let coord = bezier([[0, 0], [.42, 0], [.58, 1], [1, 1]], timePassed / duration);
                drawCurve(coord);
                cssStyle[property] = startValues[i] + delta[i] * coord[1] + serializedEndValues[i][1];
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
var curve2 = new CurveVisualizer(document.getElementById('curve2'));
curve2.init(1);

var o1 = document.querySelector('.list');
document.querySelector('.animate').addEventListener('click', function (e) {
    o1.style.marginLeft = 0;
    curve1.clear();
    curve2.clear();
    animate(o1, { marginLeft: 100 }, 1000, function(coord) { curve1.draw(coord); curve2.draw(coord); });
});

var o2 = document.querySelector('.jqer');
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