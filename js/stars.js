"use strict";

let sc = document.getElementById('stars-canvas'),
  sctx = sc.getContext('2d'),
  w = sc.width = window.innerWidth,
  h = sc.height = 1200,
    
  hue = 217,
  stars = [],
  count = 0,
  maxStars = 1000;

// Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
// Cache gradient
let sc2 = document.createElement('canvas'),
    sctx2 = sc2.getContext('2d');
    sc2.width = 100;
    sc2.height = 100;
let half = sc2.width/2,
    gradient2 = sctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    sctx2.fillStyle = gradient2;
    sctx2.beginPath();
    sctx2.arc(half, half, half, 0, Math.PI * 2);
    sctx2.fill();

// End cache

function random(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }
  
  if (min > max) {
    let hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x,y) {
  let max = Math.max(x,y),
      diameter = Math.round(Math.sqrt(max*max + max*max));
  return diameter/2;
}

let Star = function() {

  this.orbitRadius = random(maxOrbit(w,h));
  this.radius = random(60, this.orbitRadius) / 12;
  this.orbitX = w / 2;
  this.orbitY = h / 2;
  this.timePassed = random(0, maxStars);
  this.speed = random(this.orbitRadius) / 2000000;
  this.alpha = random(2, 10) / 10;

  count++;
  stars[count] = this;
}

Star.prototype.draw = function() {
  let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
      y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
      twinkle = random(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.5;
  }

  sctx.globalAlpha = this.alpha;
    sctx.drawImage(sc2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (let i = 0; i < maxStars; i++) {
  new Star();
}
let animating = false, animate10 = 0;
const CUT_POINT = 10000;

function onScroll() {
  if ($(window).scrollTop() < CUT_POINT){
    animation();
  }
} 
function animation() {
    sctx.globalCompositeOperation = 'source-over';
    sctx.globalAlpha = 0.8;
    // sctx.createRadialGradient(half, half, 0, half, half, half);
    sctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
    // sctx.fillStyle = 'transparent';
    sctx.fillRect(0, 0, w, h)
  
  sctx.globalCompositeOperation = 'lighter';
  for (let i = 1, l = stars.length; i < l; i++) {
    stars[i].draw();
  };  
  if ($(window).scrollTop() > CUT_POINT){
    animating = false;
    document.addEventListener('scroll', onScroll, false);
  } else {
    document.removeEventListener('scroll', onScroll, false);
    window.requestAnimationFrame(animation);
  }
}
animation();