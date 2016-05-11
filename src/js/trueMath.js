'use strict';

const Math = {
    abs:   (v) => v < 0 ? -v : v,
    ceil:  (v) => ~~v + (v > ~~v),
    floor: (v) => ~~v - (v < ~~v),
    round: (v) => v < 0 ? M.roundN(v) : M.roundP(v),
    roundN:(v) => ~~v - !(~~v - v < .5),
    roundP:(v) => ~~v + !(v - ~~v < .5),
    sign:  (v) => v < 0 ? -1 : 1,
    trunc: (v) => ~~v
};

export default Math;

// const Math = {
//     abs:   (v) => v < 0 ? -v : v,
//     // abs:   (v) => M.sign(v) * v,
//
//     // ceil:  (v) => v > (v = ~~v) ? ++v : v,
//     // floor: (v) => v < (v = ~~v) ? --v : v,
//
//     ceil:  (v) => ~~v + (v > ~~v),
//     floor: (v) => ~~v - (v < ~~v),
//
//     // round: (v) => { let a = ~~v, b = v - a; return v < 0 ? b > -.5 ? a : --a : b < .5 ? a : ++a },
//     round: (v) => v < 0 ? M.roundN(v) : M.roundP(v),
//     // nround:(v) => v - (v = ~~v) > -.5 ? v : --v,
//     // pround:(v) => v - (v = ~~v) <  .5 ? v : ++v,
//
//     roundN:(v) => ~~v - !(~~v - v < .5),
//     roundP:(v) => ~~v + !(v - ~~v < .5),
//
//     sign:  (v) => v < 0 ? -1 : 1,
//     trunc: (v) => ~~v
// };
