const { Noise } = require("noisejs");
const noise = new Noise(Math.random());

module.exports = () => {
	const commands = [];

	const steppingSize = 1;
	const width = 300;
	const length = 300;

	const prefix = "^";

	for (let x = 0; x < width; x += steppingSize) {
		for (let y = 0; y < length; y += steppingSize) {
			let value = noise.simplex2(x / 50, y / 50);

			const m = 15;

			let relYPos = Math.floor((value * 100 * m) / 100); // From -5 to +5 when `m` is 5

			let block = "grass_block";
			let waterTreshold = -0.6 * m;
			if (relYPos < waterTreshold) {
				block = "water";
			} else if (relYPos > 0.5 * m) {
				block = "cobblestone";
			}

			if (relYPos < waterTreshold) {
				for (let w = relYPos; w < waterTreshold; w++) {
					const pos = `${prefix}${x - width / 2} ${prefix}${w} ${prefix}${
						y - length / 2
					}`;
					commands.push(`setblock ${pos} water`);
				}
			} else {
				const pos = `${prefix}${x - width / 2} ${prefix}${relYPos} ${prefix}${
					y - length / 2
				}`;
				commands.push(`setblock ${pos} ${block}`);
			}

			commands.push(
				`fill ${prefix}${x - width / 2} ${prefix}${relYPos - 1} ${prefix}${
					y - length / 2
				} ${prefix}${x - width / 2} ${prefix}${relYPos - 3} ${prefix}${
					y - length / 2
				} dirt`
			);
		}
	}

	return { commands, functionName: "worldgen" };
};
