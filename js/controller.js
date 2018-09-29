import { slurp, easeInOut } from "./util";
import { EHOSTUNREACH } from "constants";

export default class Controller {

	constructor() {
		this.size = 500;
		this.animAmt = 0;
		this.period = 10;
		this.center = {x: 0, y: 0};
	}

	update(dt, mousePosition) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;

		this.center = mousePosition;
	}

	/**
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		context.beginPath();
		context.fillStyle = 'black';
		const numSquares = 32;
		const size = this.size;
		for (let iy = 0; iy < numSquares; iy ++) {
			const minY = slurp(-size, size, iy / numSquares);
			const maxY = slurp(-size, size, (iy + 1) / numSquares);
			for (let ix = 0; ix < numSquares; ix ++) {
				const minX = slurp(-size, size, ix / numSquares);
				const maxX = slurp(-size, size, (ix + 1) / numSquares);

				if ((ix + iy) % 2 == 0) {
					continue;
				}

				this.adjustedPath(context, [
					{x: minX, y: minY},
					{x: maxX, y: minY},
					{x: maxX, y: maxY},
					{x: minX, y: maxY},
				]);
			}
		}
		context.fill();
	}

	adjustedPath(context, points, numPoints = 5) {
		this.adjustedMoveTo(context, points[0].x, points[0].y);
		for (let i = 0; i < points.length; i ++) {
			const nextI = (i + 1) % points.length;
			this.adjustedLine(context, points[i], points[nextI], numPoints)
		}
	}
	adjustedLine(context, start, end, numPoints = 5) {
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
		point.x -= this.center.x;
		point.y -= this.center.y;
		let r = Math.sqrt(point.x * point.x + point.y * point.y);
		let theta = Math.atan2(point.y, point.x);
	
		let normalisingFactor = 1;
		if (Math.abs(point.x) > Math.abs(point.y)) {
			normalisingFactor = Math.abs(Math.cos(theta));
		}
		else {
			normalisingFactor = Math.abs(Math.sin(theta));
		}
		
		r *= normalisingFactor;
		let rAmt = r / this.size;
	
		return {
			x: r * Math.cos(theta) + this.center.x,
			y: r * Math.sin(theta) + this.center.y,
		}
	}
}