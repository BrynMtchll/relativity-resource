class Ball {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.radius = 30;
      this.vx = 0;
      this.vy = 0;
      this.color = 'rgb(136, 0, 95)';
    }
  
    draw(ctx) {
      ctx.lineWidth = this.lineWidth;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  
    getBounds() {
        // console.log(this.x - this.radius, " ", this.y - this.radius, " ", this.radius*2)
      return {
        x: this.x - this.radius,
        y: this.y - this.radius,
        width: this.radius * 2,
        height: this.radius * 2
      };
    }
}
captureMouse = function (element) {
    let mouse = {x: 0, y: 0, event: null},
        offsetLeft = element.offsetLeft;
    element.addEventListener('mousemove', function (event) {
        let offsetTop = element.getBoundingClientRect().top + $(window).scrollTop();
        let x, y;
        x = event.pageX;
        y = event.pageY;
        x -= offsetLeft;
        y -= offsetTop;
        mouse.x = x;
        mouse.y = y;
        mouse.event = event;
    }, false);

    return mouse;  
};  

containsPoint = function (rect, x, y) {
    return !(x < rect.x ||
            x > rect.x + rect.width ||
            y < rect.y ||
            y > rect.y + rect.height
            );
};

const FPS = 60, PPM = 377.952;
let mc = document.getElementById('motion-canvas'),
    mctx = mc.getContext('2d'),
    mouse = captureMouse(mc),
    ball = new Ball(),
    vx = 0,
    vy = 0,
    bounce = -0.8,
    gravity = 0,
    isMouseDown = false,
    oldx, oldy, oldvx, oldvy,
    ms;

mc.width = mc.clientWidth;
mc.height = mc.clientHeight;
ball.x = mc.width / 2;
ball.y = mc.height / 2;

let cleft = 0,
    cright = mc.width,
    ctop = 0,
    cbottom = mc.height;

// 37.7952 pixels per cm or 
// 377.952 pixels per metre`
// 1 m/s = 377.952px / s 
// = 1360.6272px / hr

// x pixels every frame, frame is a 60th of a second
// pixels * 60 / 377.952
mc.addEventListener('mousedown', function () {
    if (containsPoint(ball.getBounds(), mouse.x, mouse.y)) {
    isMouseDown = true;
    oldx = ball.x;
    oldy = ball.y;
    mc.addEventListener('mouseup', onMouseUp, false);
    mc.addEventListener('mousemove', onMouseMove, false);
    mc.addEventListener('mouseout', onMouseOut, false);
    }
}, false);
    
function onMouseUp () {
    isMouseDown = false;
    mc.removeEventListener('mouseup', onMouseUp, false);
    mc.removeEventListener('mousemove', onMouseMove, false);
}

function onMouseOut() {
    mc.removeEventListener('mouseup', onMouseUp, false);
    mc.removeEventListener('mousemove', onMouseMove, false);
    updatePos();
}

function onMouseMove (event) {
    ball.x = mouse.x;
    ball.y = mouse.y;
}

function dragPos () {
    oldvx = vx, oldvy = vy;
    vx = ball.x - oldx;
    vy = ball.y - oldy;
    track();

    oldx = ball.x;
    oldy = ball.y;
}

let bounced = false;
const INTERVAL = 1;

function track() {
    let ms, kmph, vxms, vyms, angle, axmss, aymss, amss, oldvxms, oldvyms, anglea;

    let dx = ball.x - oldx, dy = ball.y - oldy;
    let diag = Math.sqrt((dx*dx) + (dy*dy));
    ms = (diag*FPS/PPM).toFixed(2);

    kmph = (ms*3.6).toFixed(2);

    angle = Math.round(Math.atan2(dy, dx) * 180/Math.PI);
    if (angle < 0) angle = 360 + angle;


    vxms = vx*FPS/PPM, vyms = -vy*FPS/PPM;
    oldvxms = oldvx*FPS/PPM, oldvyms = -oldvy*FPS/PPM;
    let dvxms = vxms-oldvxms, dvyms = vyms-oldvyms;
    amss = Math.sqrt(((dvxms)*(dvxms)) + ((dvyms)*(dvyms)));
    amss = amss.toFixed(2);
    axmss = (dvxms).toFixed(2);
    aymss = (dvyms).toFixed(2);

    anglea = Math.round(Math.atan2(dvyms, dvxms) * 180/Math.PI);

    // console.log(vy, oldvy, aymss);
    if (bounced) {
        aymss = 0, axmss = 0, amss = 0;
    }
    $("#s-measure-m").html(ms);
    $("#s-measure-km").html(kmph);
    $("#neg-s-gauge").css("width", `${-ms*100/30}%`);
    $("#pos-s-gauge").css("width", `${ms*100/30}%`);
    $("#v-measure-x").html(vxms.toFixed(2));
    $("#v-measure-y").html(vyms.toFixed(2));
    $("#v-measure-l").html(ms);
    $("#v-measure-r").html(angle);
    $("#needle").css("transform", `rotate(${(angle-270)}deg`);
    $("#neg-v-gauge-x").css("width", `${-vxms*100/30}%`);
    $("#neg-v-gauge-y").css("width", `${-vyms*100/30}%`);
    $("#neg-v-gauge-deg").css("width", `${-ms*100/30}%`);
    $("#pos-v-gauge-x").css("width", `${vxms*100/30}%`);
    $("#pos-v-gauge-y").css("width", `${vyms*100/30}%`);
    $("#pos-v-gauge-deg").css("width", `${ms*100/30}%`);

    $("#a-measure-x").html(axmss);
    $("#a-measure-y").html(aymss);
    $("#a-measure-l").html(amss);
    $("#a-measure-r").html(anglea);
    $("#neg-a-gauge-x").css("width", `${-axmss*100/5}%`);
    $("#neg-a-gauge-y").css("width", `${-aymss*100/5}%`);
    $("#pos-a-gauge-x").css("width", `${axmss*100/5}%`);
    $("#pos-a-gauge-y").css("width", `${aymss*100/5}%`);
    $("#pos-a-gauge-deg").css("width", `${amss*100/5}%`);
}

function updatePos () {
    bounced = false;
    oldvx = vx;
    oldvy = vy;
    oldx = ball.x;
    oldy = ball.y;
    vy += gravity;
    ball.x += vx;
    ball.y += vy;
    //boundary detect and bounce
    
    if (ball.x + ball.radius > cright) {
        ball.x = cright - ball.radius;
        vx *= bounce;
        bounced = true;
    } else if (ball.x - ball.radius < cleft) {
        ball.x = cleft + ball.radius;
        vx *= bounce;
        bounced = true;
    }
    if (ball.y + ball.radius > cbottom) {
        ball.y = cbottom - ball.radius;
        vy *= bounce;
        bounced = true;
    } else if (ball.y - ball.radius < ctop) {
        ball.y = ctop + ball.radius;
        vy *= bounce;
        bounced = true;
    }
    track();
}

function drawFrame () {
    window.requestAnimationFrame(drawFrame, mc);
    mctx.clearRect(0, 0, mc.width, mc.height);
    
    if (isMouseDown) {
        dragPos();
    } else {
        updatePos();
    }
    ball.draw(mctx);
};
let gravitySlider = document.getElementById("gravity-slider")
    gravitySlider.addEventListener('input', () => {
        gravity = parseFloat(gravitySlider.value)*PPM/FPS;
});
drawFrame();