import { slurp } from "./util";
import { EHOSTUNREACH } from "constants";

export default class Controller {

	constructor() {

	}

	update(dt) {
		// TODO: Some updating logic
	}

	/**
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		const numSquares = 8;
		const size = 200;
		for (let iy = 0; iy < numSquares; iy ++) {
			const minY = slurp(-size, size, iy / numSquares);
			const maxY = slurp(-size, size, (iy + 1) / numSquares);
			for (let ix = 0; ix < numSquares; ix ++) {
				const minX = slurp(-size, size, ix / numSquares);
				const maxX = slurp(-size, size, (ix + 1) / numSquares);

				if ((ix + iy) % 2 == 0) {
					continue;
				}

				context.beginPath();
				context.fillStyle = 'black';
				adjustedMoveTo(context, minY, minX);
				adjustedLineTo(context, minY, maxX);
				adjustedLineTo(context, maxY, maxX);
				adjustedLineTo(context, maxY, minX);
				context.closePath();
				context.fill();
			}
		}
	}

}

function adjustedMoveTo(context, x, y) {
	let adjusted = adjustPoint({x: x, y: y});
	context.moveTo(adjusted.x, adjusted.y);
}

function adjustedLineTo(context, x, y) {
	let adjusted = adjustPoint({x: x, y: y});
	context.lineTo(adjusted.x, adjusted.y);
}

// stolen from https://www.xarg.org/2017/07/how-to-map-a-square-to-a-circle/
function adjustPoint(point) {
	let r = Math.sqrt(point.x * point.x + point.y * point.y);
	let theta = Math.atan2(point.y, point.x);

	let normalisingFactor = 1;
	if (Math.abs(point.x) > Math.abs(point.y)) {
		normalisingFactor = Math.abs(Math.cos(theta));
	}
	else {
		normalisingFactor = Math.abs(Math.sin(theta));
	}

	return {
		x: normalisingFactor * r * Math.cos(theta),
		y: normalisingFactor * r * Math.sin(theta),
	}
}