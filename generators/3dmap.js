const { Noise } = require("noisejs");

module.exports = () => {
	const noise = new Noise(Math.random());
	const commands = [];

	const circular = false;
	const steppingSize = 0.2;
	const width = 8.9;
	const length = 4.9;
	const m = 0.5;
	const particleSize = 1;
	const noiseDivider = 5;
	const offset = 2;
	const waterTreshold = -0.6 * m;
	const prefix = "^";

	for (let x = 0; x < width; x += steppingSize) {
		for (let y = 0; y < length; y += steppingSize) {
			let value = noise.simplex2(x / noiseDivider, y / noiseDivider);

			let relYPos = Math.floor(value * m * 100) / 100; // From -5 to +5 when `m` is 5

			// let data = [128, 255, 128];
			const gV = (y / width) * 128 + 128;
			let data = [0, ((value + 1) / 2) * 200 + 55, 0];

			if (relYPos < waterTreshold) {
				data = [128, 128, 255];
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

			// const dist = Math.sqrt(rX * rX + rY * rY);
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
					`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1 force`
				);
			}
		}
	}

	// Generate trees
	for (let i = 0; i < 3; i++) {
		let isAboveWater = false;
		let x;
		let y;
		let relYPos;
		while (!isAboveWater) {
			x = Math.floor(Math.random() * width * 100) / 100;
			y = Math.floor(Math.random() * length * 100) / 100;
			let value = noise.simplex2(x / noiseDivider, y / noiseDivider);
			relYPos = Math.floor(value * m * 100) / 100;
			isAboveWater = relYPos > waterTreshold;
		}

		const data = [150, 75, 0];
		const r = data[0] / 255;
		const g = data[1] / 255;
		const b = data[2] / 255;
		const rgb = `${r} ${g} ${b}`;

		let xP = Math.floor(x * 100) / 100;
		let yP = Math.floor(y * 100) / 100;

		const rX = xP - width / 2;
		const rY = yP - length / 2;

		for (let t = 0; t < 4; t++) {
			const pos = `${prefix}${rX} ${prefix}${
				relYPos + offset + t / 10
			} ${prefix}${rY}`;
			commands.push(
				`particle minecraft:dust ${rgb} 0.3 ${pos} 0 0 0 20 1 force`
			);
		}
	}

	return { commands, functionName: "map" };
};

function isInEllipse(x, y, width, length) {
	const ellipseDist = (x * x) / width + (y * y) / length;
	return ellipseDist <= 1;
}
