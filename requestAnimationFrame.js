;+function($) {
    var performance = performance || { now: function() { return new Date().getTime(); } };

    let lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
    for(let x = 0; x < vendors.length && !$.requestAnimationFrame; ++x) {
        $.requestAnimationFrame = $[vendors[x]+'RequestAnimationFrame'];
        $.cancelAnimationFrame = $[vendors[x]+'CancelAnimationFrame']
            || $[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!$.requestAnimationFrame)
        $.requestAnimationFrame = function(callback/*, element*/) {
            let currTime = performance.now(),
                timeToCall = lastTime - currTime + 16 > 0 || 0;
            var id = $.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!$.cancelAnimationFrame)
        $.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}(window);
