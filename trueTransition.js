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

function abs(v) { return v < 0 ? -v : v }

function CurveVisualizer(canvas) {
    let ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height, oX, oY, iX, iY, getPosition;

    function flush() {
        // ctx.fillStyle = '#fff';
        ctx.clearRect(0, 0, w, h);
        // ctx.fillStyle = '#DDD';
        ctx.strokeRect(oX, oY, iX, iY);
    }

    function drawLines(x, y) {
        ctx.fillStyle = "#f00";
        ctx.fillRect(x, 10, 1, h - 20);
        ctx.fillStyle = "#000";
        ctx.fillRect(10, y, w - 20, 1);
    }

    this.clear = function() {
        ctx.beginPath();
        flush();
        drawLines(oX, oY);
        ctx.moveTo(oX, oY);
    };

    this.setField = function(x, y, horizontal) {
        getPosition = horizontal ?
            function(x, y) { return [oX + iX * y, h - oY - iY * x]; } :
            function(x, y) { return [oX + iX * x,     oY + iY * y]; };
        iX = (w - 2 * (oX = x));
        iY = (h - 2 * (oY = y));
        this.clear();
    };
    this.setField(20, 20, 1);

    this.draw = function (coord) {
        flush();
        coord = getPosition(coord[0], coord[1]);
        drawLines(coord[0], coord[1]);
        ctx.lineTo(coord[0], coord[1]);
        ctx.stroke();
        ctx.moveTo(coord[0], coord[1]);
    };

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
        drawCurve = draw || function() {};

    let computedStyle = getComputedStyle(object),
        start = performance.now(), timePassed = 0, i = 0,
        startValues = [], serializedEndValues = [], delta = [];

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

var curve = new CurveVisualizer(document.getElementById('myCanvas'));

var o1 = document.querySelector('.list');
document.querySelector('.animate').addEventListener('click', function (e) {
    o1.style.marginLeft = 0;
    curve.clear();
    animate(o1, { marginLeft: 100 }, 1000, function(coord) {curve.draw(coord)});
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