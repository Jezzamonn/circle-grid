import { slurp } from "./util";

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
		context.fillStyle = 'black';
		for (let iy = 0; iy < numSquares; iy ++) {
			const minY = slurp(-size, size, iy / numSquares);
			const maxY = slurp(-size, size, (iy + 1) / numSquares);
			for (let ix = 0; ix < numSquares; ix ++) {
				const minX = slurp(-size, size, ix / numSquares);
				const maxX = slurp(-size, size, (ix + 1) / numSquares);

				if ((ix + iy) % 2 == 0) {
					continue;
				}

				context.rect(minX, minY, maxX - minX, maxY - minY);
			}
		}
		context.fill();
	}

}
