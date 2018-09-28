import { slurp, easeInOut } from "./util";
import { EHOSTUNREACH } from "constants";

export default class Controller {

	constructor() {
		this.size = 200;
		this.animAmt = 0;
		this.period = 7;
	}

	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		context.beginPath();
		context.fillStyle = 'black';
		const numSquares = 8;
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
	
	// stolen from https://www.xarg.org/2017/07/how-to-map-a-square-to-a-circle/
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
		let rAmt = r / this.size;
		let spinAmt = slurp(-1, 1, rAmt) * easeInOut(this.animAmt);
		let spinAngle = 4 * Math.PI * spinAmt;
	
		return {
			x: r * Math.cos(theta + spinAngle),
			y: r * Math.sin(theta + spinAngle),
		}
	}
}