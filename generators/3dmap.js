const { Noise } = require("noisejs");
const noise = new Noise(Math.random());

module.exports = () => {
	const commands = [];

	const steppingSize = 1;
	const width = 300;
	const length = 300;

	for (let x = 0; x < width; x += steppingSize) {
		for (let y = 0; y < length; y += steppingSize) {
			let value = noise.simplex2(x / 50, y / 50);

			const m = 15;

			let relYPos = Math.floor((value * 100 * m) / 100); // From -5 to +5 when `m` is 5

			const particleSize = 2;

			let data = [128, 255, 128];
			let waterTreshold = -0.6 * m;
			if (relYPos < waterTreshold) {
				data = [128, 128, 255];
			} else if (relYPos > 0.5 * m) {
				data = [128, 128, 128];
			}

			const r = data[0] / 255;
			const g = data[1] / 255;
			const b = data[2] / 255;
			const rgb = `${r} ${g} ${b}`;

			if (data[3] === 0) continue;

			if (relYPos < waterTreshold) {
				const pos = `^${x - width / 2} ^${relYPos - 1} ^${y - length / 2}`;
				commands.push(
					`particle minecraft:dust .5 .5 .5 ${particleSize} ${pos} 0 0 0 20 1 normal`
				);
				for (let w = relYPos; w < waterTreshold; w++) {
					const pos = `^${x - width / 2} ^${w} ^${y - length / 2}`;
					commands.push(
						`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1 normal`
					);
				}
			} else {
				const pos = `^${x - width / 2} ^${relYPos} ^${y - length / 2}`;
				commands.push(
					`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1 normal`
				);
			}

			// commands.push(
			// 	`setblock ~${Math.floor(x - width / 2)} ~${Math.floor(
			// 		value
			// 	)} ~${Math.floor(y - length / 2)} grass_block`
			// );
		}
	}

	return { commands, functionName: "map" };
};
