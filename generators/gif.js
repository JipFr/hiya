const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const imageToParticles = require("./util/imageToParticles");
const gifFrames = require("gif-frames");
const { execSync } = require("child_process");

module.exports = async () => {
	// const filename = "godzilla-2";
	// const filename = "palpatine";
	const filename = "bad-apple";
	// const filename = "minion";
	// const filename = "smile-2";
	// const filename = "1984";

	const scoreboardName = `gif-${filename}`;

	const basePath = "./images/frames/";

	if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
	execSync(
		`ffmpeg -i ./images/${filename}.gif -vsync 0 ${basePath}frame%d.png`
	);

	const paths = fs
		.readdirSync("./images/frames/")
		.map((fileName) => `${basePath}${fileName}`)
		.sort((a, b) => a.replace(/[^0-9]/g, "") - b.replace(/[^0-9]/g, ""));

	for (const path of paths) {
		const img = await loadImage(path);
		const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// To particles
		const div = 8;
		const dimensions = 8;
		const particleSize = 1;

		const commands = imageToParticles({
			dimensions,
			div,
			particleSize,
			canvas,
		});

		const dir = `./data/jip/functions/gif-${filename}/`;
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);

		fs.writeFileSync(
			`${dir}${paths.indexOf(path)}.mcfunction`,
			commands.join("\n")
		);
		fs.unlinkSync(path);
	}

	const commands = [];

	commands.push(`scoreboard objectives add ${scoreboardName} dummy`);

	const frameDuration = 2;
	let score = 0;
	for (const path of paths) {
		for (let i = 0; i < frameDuration; i++) {
			if (i === 0)
				commands.push(
					`execute as @s[scores={${scoreboardName}=${score}}] run function jip:gif-${filename}/${paths.indexOf(
						path
					)}`
				);
			score++;
		}
	}
	commands.push(
		`scoreboard players set @e[scores={${scoreboardName}=${score}..}] ${scoreboardName} 0`
	);
	commands.push(`scoreboard players add @s ${scoreboardName} 1`);

	return { commands, functionName: `gif-${filename}/main` };
};
