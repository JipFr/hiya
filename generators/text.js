const fs = require("fs");
const { createCanvas } = require("canvas");
const imageToParticles = require("./util/imageToParticles");

module.exports = async () => {
	const commands = [];

	const background = "black"; // Set to undefined for transparent
	const color = "lime";

	// const rows =
	// 	"We are the Borg. Lower your shields and surrender your ships. We will add your biological and technological distinctiveness to our own. Your culture will adapt to service us. Resistance is futile."
	// 		.split(/\./)
	// 		.map((t) => t.trim())
	// 		.filter(Boolean);
	const rows = ["Don't resist."];

	for (let row = 0; row < rows.length; row++) {
		const string = rows[row].toUpperCase();
		const canvas = createCanvas(string.length * 300, 320);
		const ctx = canvas.getContext("2d");

		ctx.font = "500px Monospace";

		if (background) {
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		ctx.fillStyle = color;
		ctx.fillText(string, 0, canvas.height - 20);

		console.log(canvas.width, canvas.height);
		// To particles
		const div = 10;
		const dimensions = string.length;
		const particleSize = 0.5;

		commands.push(
			...imageToParticles({
				dimensions,
				div,
				particleSize,
				canvas,
				yOffset: (rows.length - row - 1) * -1.5,
			})
		);
	}

	return { commands, functionName: "text" };
};
