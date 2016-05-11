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
