const { Noise } = require("noisejs");

const noise = new Noise(Math.random());

module.exports = (noiseOffset = 0) => {
	const commands = [];

	const circularMap = true;
	let offset = 2;
	let steppingSize;
	let circular;
	let width;
	let length;
	let m;
	let particleSize;
	if (circularMap) {
		offset = 3;
		steppingSize = 0.2;
		particleSize = 1.4;
		circular = true;
		width = 8;
		length = 8;
		m = 1.5;
	} else {
		steppingSize = 0.2;
		particleSize = 1.5;
		circular = false;
		width = 12.9;
		length = 6.9;
		m = 0.4;
	}

	const noiseDivider = 5;
	const waterTreshold = -0.6 * m;
	const prefix = "^";

	for (let x = 0; x < width; x += steppingSize) {
		for (let y = 0; y < length; y += steppingSize) {
			let value = noise.simplex2(
				x / noiseDivider,
				(y + noiseOffset) / noiseDivider
			);

			let relYPos = Math.floor(value * m * 100) / 100; // From -5 to +5 when `m` is 5

			// let data = [
			// 	(x / width) * 255,
			// 	((value + 1) / 2) * 255,
			// 	(y / length) * 255,
			// ];

			let data = [0, ((value + 1) / 2) * 255, 0];

			if (relYPos < waterTreshold) {
				data = [128, 128, 255];
			} else if (relYPos < waterTreshold + 0.1) {
				data = [235, 223, 188];
			} else if (relYPos > 0.6 * m) {
				data = [255, 255, 255];
			} else if (relYPos > 0.5 * m) {
				data = [128, 128, 128];
			}

			const r = data[0] / 255;
			const g = data[1] / 255;
			const b = data[2] / 255;
			const rgb = `${r} ${g} ${b}`;

			let xP = Math.floor(x * 100) / 100;
			let yP = Math.floor(y * 100) / 100;

			const rX = xP - width / 2;
			const rY = yP - length / 2;

			if (!isInEllipse(rX, rY, width, length) && circular) continue;

			if (data[3] === 0) continue;

			if (relYPos < waterTreshold) {
				for (let w = relYPos; w < waterTreshold; w += steppingSize) {
					const pos = `${prefix}${rX} ${prefix}${w + offset} ${prefix}${rY}`;
					commands.push(
						`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1`
					);
				}
			} else {
				const pos = `${prefix}${rX} ${prefix}${
					relYPos + offset
				} ${prefix}${rY}`;
				commands.push(
					`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1`
				);
			}
		}
	}

	return { commands, functionName: "map" };
};

function isInEllipse(x, y, width, length) {
	return Math.sqrt(x * x + y * y) < width / 2;
}
