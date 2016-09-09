;+function(w) {
    w.performance = w.performance || { now: function() { return new Date().getTime(); } };

    let vendors = ['ms', 'moz', 'webkit', 'o'],
        lastTime = 0;

    for(let x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
        w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
        w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame']
            || w[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!w.requestAnimationFrame)
        w.requestAnimationFrame = callback => {
            let currTime = w.performance.now(),
                timeToCall = lastTime > currTime - 16 || 0;
            lastTime = currTime + timeToCall;
            return w.setTimeout(() => callback(lastTime), timeToCall);
        };

    if (!w.cancelAnimationFrame)
        w.cancelAnimationFrame = id => clearTimeout(id);
}(window);
