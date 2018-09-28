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
		const numSquares = 8;
		const size = this.size;
		const linePoints = 5;
		for (let iy = 0; iy < numSquares; iy ++) {
			const minY = slurp(-size, size, iy / numSquares);
			const maxY = slurp(-size, size, (iy + 1) / numSquares);
			for (let ix = 0; ix < numSquares; ix ++) {
				const minX = slurp(-size, size, ix / numSquares);
				const maxX = slurp(-size, size, (ix + 1) / numSquares);

				if ((ix + iy) % 2 == 0) {
					continue;
				}

				this.adjustedMoveTo(context, minY, minX);
				for (let i = 0; i < linePoints; i ++) {
					const lineAmt = i / linePoints;
					// this.adjustedLineTo(context, minY, slurp(minX, maxX, lineAmt);
				}
				this.adjustedLineTo(context, maxY, maxX);
				this.adjustedLineTo(context, maxY, minX);
				this.adjustedLineTo(context, minY, minX);
			}
		}
		context.fillStyle = 'black';
		context.fill('evenodd');
	}

	adjustedLine(context, start, end, numPoints) {
		for (let i = 0; i <= linePoints; i ++) {
			const amt = i / linePoints;
			// line = 
			this.adjustedLineTo(context, maxY, maxX);
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