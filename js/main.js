import Controller from './controller.js';

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

// Currently assuming square proportions.
const SIZE = 500;

let scale = 1;
let lastTime;
let controller;
let mousePosition = {x: 0, y: 0};

function init() {
	lastTime = Date.now();
	controller = new Controller();

	handleResize();
	// Set up event listeners.
	window.addEventListener('resize', handleResize);
	// We can handle these all the same really.
	document.addEventListener('mousemove', (evt) => updateMousePosition(evt));
	document.addEventListener('mousedown', (evt) => updateMousePosition(evt));
	document.addEventListener('mouseup',   (evt) => updateMousePosition(evt));

	document.addEventListener('touchmove',  (evt) => updateTouchPosition(evt));
	document.addEventListener('touchstart', (evt) => updateTouchPosition(evt));
	document.addEventListener('touchend',   (evt) => updateTouchPosition(evt));

	// Kick off the update loop
	window.requestAnimationFrame(everyFrame);
}

// TODO: Make tweak this to allow frame skipping for slow computers. Maybe.
function everyFrame() {
	update();
	render();
	requestAnimationFrame(everyFrame);
}

function update() {
	let curTime = Date.now();
	let dt = (curTime - lastTime) / 1000;
	controller.update(dt, mousePosition);
	lastTime = curTime;
}

function render() {
	// Clear the previous frame
	context.resetTransform();
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Set origin to middle and scale canvas
	context.translate(canvas.width / 2, canvas.height / 2);
	context.scale(scale, scale);

	controller.render(context);
}

function handleResize(evt) {
	let pixelRatio = window.devicePixelRatio || 1;
	let width = window.innerWidth;
	let height = window.innerHeight;

	canvas.width = width * pixelRatio;
	canvas.height = height * pixelRatio;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';

	// Math.max -> no borders (will cut off edges of the thing)
	// Math.min -> show all (with borders)
	// There are other options too :)
	scale = Math.max(canvas.width, canvas.height) / SIZE;

	render();
}

function updateMousePosition(evt) {
	mousePosition = screenPointToNormalisedPoint({
		x: evt.clientX,
		y: evt.clientY,
	});
}

function updateTouchPosition(evt) {
	if (evt.touches.length > 0) {
		mousePosition = screenPointToNormalisedPoint({
			x: evt.touches[0].clientX,
			y: evt.touches[0].clientY,
		});
	}
}

// scale/translate
function screenPointToNormalisedPoint(point) {
	let pixelRatio = window.devicePixelRatio || 1;
	return {
		x: (pixelRatio * point.x - canvas.width  / 2) / scale,
		y: (pixelRatio * point.y - canvas.height / 2) / scale,
	}
}

init();