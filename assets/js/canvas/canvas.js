var canvas = document.getElementById("cas");
var ctx = canvas.getContext("2d");

resize();
window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

var RAF = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var warea = {x: null, y: null, max: 20000};
window.onmousemove = function (e) {
    e = e || window.event;

    warea.x = e.clientX;
    warea.y = e.clientY;
};
window.onmouseout = function (e) {
    warea.x = null;
    warea.y = null;
};


var dots = [];
for (var i = 0; i < 300; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var xa = Math.random() * 2 - 1;
    var ya = Math.random() * 2 - 1;

    dots.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        max: 6000
    })
}


setTimeout(function () {
    animate();
}, 100);


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    var ndots = [warea].concat(dots);

    dots.forEach(function (dot) {


        dot.x += dot.xa;
        dot.y += dot.ya;


        dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1;
        dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1;


        ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);


        for (var i = 0; i < ndots.length; i++) {
            var d2 = ndots[i];

            if (dot === d2 || d2.x === null || d2.y === null) continue;

            var xc = dot.x - d2.x;
            var yc = dot.y - d2.y;


            var dis = xc * xc + yc * yc;


            var ratio;


            if (dis < d2.max) {


                if (d2 === warea && dis > (d2.max / 2)) {
                    dot.x -= xc * 0.03;
                    dot.y -= yc * 0.03;
                }


                ratio = (d2.max - dis) / d2.max;


                ctx.beginPath();
                ctx.lineWidth = ratio / 2;
                ctx.strokeStyle = 'rgba(0,0,0,' + (ratio + 0.2) + ')';
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(d2.x, d2.y);
                ctx.stroke();
            }
        }


        ndots.splice(ndots.indexOf(dot), 1);
    });

    RAF(animate);
}

