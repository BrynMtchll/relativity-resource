const px = 1000;

// speed of light
const c = 299792458;

// rest length
const L0 = 56;

// rest mass
const M0 = 1995806;

// mass / energy
const E = m => m * c**2;

// lorentz
const γ = v => Math.sqrt(1 - ((v/c)**2));

// length contraction
const γ1 = (l, v) => l * γ(v);

// time dilation / relativistic mass
const γ2 = (t, v) => t / γ(v);

// relativistic kinetic energy
const RKE = v => (E(M0) / γ(v)) - E(M0);

const PLUTO = 7500000000000;
const ANDROMEDA = 2.4001874e+19;

const msToMps = v => v / 1609.344;
const msToMph = v => v * 2.237;

const times = {
	real: 0,
	relativistic: 0
};

class SRStar {
	constructor(x,y,r) {
		this.pos = {
			x, y
		};
		this.r = r;
	}
}

let timerReal = false;
let timerRelative = false;
let tick = false;

const canvas = $("#c")[0];
const ctx = canvas.getContext("2d");
const ship = $("#ship")[0];
const input = $("#velocity")[0];
const table = $("#table")[0];
const buttons = $("#buttons")[0];
const tbody = table.tBodies[0];


canvas.width = $("#c").parent().width();
canvas.height =  $("#c").parent().height();

ctx.fillStyle = 'rgba(0,0,0,0.9)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let SRStars = [];

renderBackground();

window.addEventListener("resize", e => {
	canvas.width = canvas.parent().width();
	canvas.height = canvas.parent().height();
	
	renderBackground();
});

buttons.addEventListener("click", e => {
	const btn = e.target.closest("button");
	
	if ( btn ) {
		const v = parseFloat(btn.dataset.value);
		
		ship.style.transition = `transform 500ms ease 0ms`;
		input.value = v * c;
		update();
		change();
	}
})




function renderBackground() {
	SRStars = [];
	for ( let i = 0; i < 200; i++ ) {
		SRStars.push(new SRStar(rand(0, canvas.width), rand(0, canvas.height), rand(1,3)));
	}	
}

input.max = c;
input.value = 0.5 * c;

input.oninput = update;
input.onchange = change;

update();
setTimer();

function update() {
	const v = parseInt(input.value, 10);
	
	setVelocity(v);
	setLength(v);
	setMass(v);
	setEnergy(v);
}

function change(e) {
	tbody.rows[0].cells[4].firstElementChild.classList.remove("running");
	tbody.rows[1].cells[4].firstElementChild.classList.remove("running");
	
	setTimeout(setTimer, 200);
}

function setTimer() {
	const v = parseInt(input.value, 10);
	
	times.real = 0;
	times.relativistic = 0;
	
	clearInterval(timerReal);
	clearInterval(timerRelative);
	
	timerReal = setInterval(() => {
		renderTime(tbody.rows[0].cells[4], times.real, "earth", 1000);
		times.real += 10;
	}, 10);
	
	var factor;
	
	const dilate = () => {
			factor = γ2(1, v);
		
			renderTime(tbody.rows[1].cells[4], times.relativistic, "ship", factor === Infinity ? 10000000 : (factor * 1000).toFixed(4));
		
			timerRelative = setInterval(function () {
					times.relativistic += 10;
					clearInterval(timerRelative);
					dilate();
			}, factor === Infinity ? 10000000 : factor * 10);
	}
	
	dilate();
	
	tbody.rows[2].cells[4].innerHTML = `Time dilation factor: ${factor.toFixed(2)}`;
	
	if ( v > 0 ) {
		tbody.rows[4].cells[0].innerHTML = `1yr on ship = ${factor.toFixed(2)} yrs on Earth | Time to Andromeda as seen from Earth: ${years(ANDROMEDA / v)}yrs | Time to Andromeda as experienced on ship: ${years((ANDROMEDA / v) / factor)}yrs`;
	}
}

function pad(num) {
    return ("0"+num).slice(-2);
}
function years(s) {
	return round(s / 60 / 60 / 24 / 365.25);
}
function hhmmss(secs) {
	var years = secs / 60 / 60 / 24 / 365.25;
	var days = secs / 60 / 60 / 24 / 365.25;
  var minutes = Math.floor(secs / 60);
  secs = secs%60;
  var hours = Math.floor(minutes/60)
  minutes = minutes%60;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

function get_random_color() {
    var h = rand(1, 360);
    var s = rand(0, 100);
    var l = rand(0, 100);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function renderTime(cell, ms, str, interval) {
	const clock = cell.firstElementChild;
	
	const time = moment(ms).format("mm:ss.SS");
	
	cell.lastElementChild.innerHTML = `${time} on ${str}`;
	cell.firstElementChild.classList.add("running");
	
	clock.firstElementChild.style.animationDuration = `${interval}ms`;
}

function setVelocity(v) {
	tbody.rows[0].cells[0].innerHTML = `${round(v/c, 8)} c`;
	tbody.rows[1].cells[0].innerHTML = `${round(v)} ms<sup>-1</sup>`;
	tbody.rows[2].cells[0].innerHTML = `${round(msToMph(v))} mph</sup>`;
}

function setLength(v) {
	const L = γ1(L0, v);
	
	ship.style.transform = `scale(${L / L0}, 1)`;
	
	tbody.rows[0].cells[1].innerHTML = `${round(L, 4)} m`;
	tbody.rows[1].cells[1].innerHTML = `${round(L / L0 * 100)} %`;
}

function setMass(v) {
	const M = γ2(M0, v);
	
	tbody.rows[0].cells[2].innerHTML = `${sciNum(M)} kg`;
	tbody.rows[1].cells[2].innerHTML = `${round(M / M0 * 100)} %`;
}

function setEnergy(v) {
	const M = γ2(M0, v);
	tbody.rows[0].cells[3].innerHTML = `Kinetic: ${sciNum(RKE(v))} j`;
}

function round(n, p = 2) {
	return parseFloat(n.toFixed(p)).toLocaleString(undefined, {maximumFractionDigits:p});
}

function sciNum(n) {
	const num = n.toExponential().split("e+");
	return num[0] === "Infinity" ? "∞" : `${parseFloat(num[0]).toFixed(4)} x 10<sup>${num[1]}</sup>`;
}


let v = 0;

function start() {
	if ( v <= c) {
		requestAnimationFrame(start);
		v+=50000;
		input.value = v;
		update();
	}
}


function animateSRStars() {
	const v = parseInt(input.value, 10);
	tick = requestAnimationFrame(animateSRStars);
	
	ctx.fillStyle = "#000";
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	for ( const star of SRStars ) {
		
		const inc = (v/c) * star.r * 40;
		
		if ( star.pos.x <= 0 ) {
			star.pos.x = rand(canvas.width, canvas.width * 1.5);
			star.pos.y = rand(0, canvas.height);
		}
		
		star.pos.x -= inc;

		ctx.beginPath();

		ctx.fillStyle = `rgba(255,255,255,${1.2-v/c})`;
		// ctx.fillStyle = v/c > 0.75 ? get_random_color() : `rgba(255,255,255,0.4)`;
		ctx.fillRect( star.pos.x, star.pos.y, Math.max(star.r, inc) , star.r );		
		// ctx.ellipse(star.pos.x, star.pos.y, star.r, Math.max(star.r, inc), Math.PI / 2, 0, 2 * Math.PI)
		ctx.fill();		
		ctx.closePath();

	}
}

animateSRStars();

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}