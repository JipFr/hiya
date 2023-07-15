const { Noise } = require("noisejs");

const noise = new Noise(Math.random());

module.exports = (noiseOffset = 0) => {
	const commands = ["kill @e[tag=map]"];

	let offset = 3;
	let steppingSize = 0.1;
	let circular = false;
	let width = 3;
	let length = 3;
	let m = 2;

	const noiseDivider = 5;
	const waterTreshold = -0.6 * m;
	const prefix = "^";

	for (let x = 0; x < width; x += steppingSize) {
		for (let y = 0; y < length; y += steppingSize) {
			let value = noise.simplex2(
				x / noiseDivider,
				(y + noiseOffset) / noiseDivider
			);

			let relYPos = Math.round(value * m * 200) / 200;
			// let relYPos = Math.round(value * m * 100) / 100; // From -5 to +5 when `m` is 5

			let block = "grass_block";

			if (relYPos < waterTreshold) {
				block = "lapis_block";
			} else if (relYPos < waterTreshold + 0.1) {
				block = "sand";
			} else if (relYPos > 0.6 * m) {
				block = "snow_block";
			} else if (relYPos > 0.5 * m) {
				block = "stone";
			}

			let xP = Math.floor(x * 100) / 100;
			let yP = Math.floor(y * 100) / 100;

			const rX = xP - width / 2;
			const rY = yP - length / 2;

			if (!isInEllipse(rX, rY, width, length) && circular) continue;

			const scale = steppingSize;
			if (relYPos < waterTreshold) {
				relYPos = waterTreshold;
			}
			const pos = `${prefix}${rX} ${prefix}${relYPos + offset} ${prefix}${rY}`;
			commands.push(
				`summon minecraft:block_display ${pos} {Tags:["map"],block_state:{Name:"minecraft:${block}"},transformation:{translation:[0f,0f,0f],left_rotation:[0f,0f,0f,1f],scale:[${scale}f,${scale}f,${scale}f],right_rotation:[0f,0f,0f,1f]}}`
			);

			const pos2 = `${prefix}${rX} ${prefix}${
				relYPos + offset - steppingSize
			} ${prefix}${rY}`;
			if (block === "grass_block") block = "dirt";
			commands.push(
				`summon minecraft:block_display ${pos2} {Tags:["map"],block_state:{Name:"minecraft:${block}"},transformation:{translation:[0f,0f,0f],left_rotation:[0f,0f,0f,1f],scale:[${scale}f,${scale}f,${scale}f],right_rotation:[0f,0f,0f,1f]}}`
			);
		}
	}

	return { commands, functionName: "map-display" };
};

function isInEllipse(x, y, width, length) {
	return Math.sqrt(x * x + y * y) < width / 2;
}
