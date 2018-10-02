import { slurp, easeInOut } from "./util";

// Because I'm a weird nerd it's easier to generate this via code than to draw it because I can't deal with the lines being off
function generateDrop(steps=30, ratio=0.5) {
	const points = []
	for (let i = 0; i < steps; i ++) {
		const amt = (i / steps);
		const angle = slurp(0, 2 * Math.PI, amt) - 0.5 * Math.PI;
		let radiusAmt = slurp(-1, 1, amt);
		radiusAmt = Math.pow(radiusAmt, 8);
		const radius = slurp(ratio, 1, radiusAmt);

		points.push({
			x: radius * Math.cos(angle),
			y: radius * Math.sin(angle),
		});
	}
	return points;
}

export default class Controller {

	constructor() {
		this.size = 200;
		this.animAmt = 0;
		this.period = 8;
	}

	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		const thingo = generateDrop();
		context.beginPath();
		context.strokeStyle = 'black';
		thingo
			.map(p => ({x: 100 * p.x, y: 100 * p.y}))
			.forEach((point, i) => {
				if (i == 0) {
					context.moveTo(point.x, point.y);
				}
				else {
					context.lineTo(point.x, point.y);
				}
			});
		context.closePath();
		context.stroke();
		return;

		// context.beginPath();
		// context.strokeStyle = 'black';
		// const numSquares = 12;
		// const size = this.size;
		// for (let ix = 0; ix <= numSquares; ix ++) {
		// 	for (let iy = 0; iy <= numSquares; iy ++) {
		// 		adjustedPath(
		// 			context,
		// 			drop.map(p => {
		// 				return {
		// 					x: p.x + ix,
		// 					y: p.y + iy
		// 				}
		// 			})
		// 		);
		// 	}
			
		// 	this.adjustedLine(
		// 		context,
		// 		{x: x, y: -size},
		// 		{x: x, y: size},
		// 		5 * numSquares,
		// 		true,
		// 	)
		// }
		// 	const y = slurp(-size, size, iy / numSquares);
			
		// 	this.adjustedLine(
		// 		context,
		// 		{x: -size, y: y},
		// 		{x: size, y: y},
		// 		5 * numSquares,
		// 		true,
		// 	)
		// }
		// context.stroke();
	}

	adjustedPath(context, points, numPoints = 5) {
		this.adjustedMoveTo(context, points[0].x, points[0].y);
		for (let i = 0; i < points.length; i ++) {
			const nextI = (i + 1) % points.length;
			this.adjustedLine(context, points[i], points[nextI], numPoints)
		}
	}
	adjustedLine(context, start, end, numPoints = 5, moveAtStart=false) {
		if (moveAtStart) {
			this.adjustedMoveTo(context, start.x, start.y);
		}
		for (let i = 1; i <= numPoints; i ++) {
			const amt = i / numPoints;
			const x = slurp(start.x, end.x, amt);
			const y = slurp(start.y, end.y, amt);
			this.adjustedLineTo(context, x, y);
		}
	}

	adjustedMoveTo(context, x, y) {
		let adjusted = this.adjustPoint({x: x, y: y});
		context.moveTo(adjusted.x, adjusted.y);
	}
	
	adjustedLineTo(context, x, y) {
		let adjusted = this.adjustPoint({x: x, y: y});
		context.lineTo(adjusted.x, adjusted.y);
	}
	
	adjustPoint(point) {
		let r = Math.sqrt(point.x * point.x + point.y * point.y);
		let theta = Math.atan2(point.y, point.x);
	
		let normalisingFactor = 1;
		if (Math.abs(point.x) > Math.abs(point.y)) {
			normalisingFactor = Math.abs(Math.cos(theta));
		}
		else {
			normalisingFactor = Math.abs(Math.sin(theta));
		}
		// Just normalise here
		r *= normalisingFactor;

		return {
			x: r * Math.cos(theta),
			y: r * Math.sin(theta),
		}
	}
}