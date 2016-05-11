;+function($) {
    $.extend($.easing, {
        defs: {
            easeIn: [.42, 0],
            elastic: {
                amplitude: 1,
                frequency: 3,
                decay:     8
            },
            move: {
                azi: 0,
                radius: 0
            }
        },
        bezier: (f, p) => {
            if (p.length < 2) return p[0]; let P = [];
            for (let i = 0; i < p.length - 1; ++i) {
                P[i] = [p[i][0] + (p[i + 1][0] - p[i][0]) * f,
                        p[i][1] + (p[i + 1][1] - p[i][1]) * f];
            }
            return bezier(P, f);
        },
        quadBezier0: (f, p) => {
            return [(1 - p[0]) * f, (1 - p[1]) * f];
        },
        quadBezier1: (f, p) => {
            return [(p[0] - 1) * f, (p[1] - 1) * f];
        },
        cubicBezier: (f, p) => {
            // return bezier(f, [[0, 0], [p[0], p[1]], [p[2], p[3]], [1, 1]])
            return bezier(f, [[0, 0], ...p, [1, 1]])
        },
        easeIn: (f) => {
            return $.easing.quadBezier0(f, $.easing.defs.easeIn)
        },
        easeInElastic: (f, p = $.easing.defs.elastic) => {
            return p.amplitude * Math.cos(p.frequency * f * 2 * Math.PI) / Math.exp(p.decay * (1 - f))
        },
        easeOutElastic: (f, p = $.easing.defs.elastic) => {
            return 1 - $.easing.easeInElastic(f, p)
        },
        easeOutBounce: (f) => {
            return  f < 1   / 2.75 ? 7.5625 *  f                  * f :
                    f < 2   / 2.75 ? 7.5625 * (f -= 1.5   / 2.75) * f + .75 :
                    f < 2.5 / 2.75 ? 7.5625 * (f -= 2.25  / 2.75) * f + .9375 :
                                     7.5625 * (f -= 2.625 / 2.75) * f + .984375;
        },
        easeOutExpo: (f) => {
            return 1 - !~~f * Math.pow(2, -10 * f);
        }
    });
}(trueDom);