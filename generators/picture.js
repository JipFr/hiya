const { createCanvas, loadImage } = require("canvas");
const imageToParticles = require("./util/imageToParticles");

module.exports = async (src = "./images/unnamed.png") => {
	const img = await loadImage(src);

	const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
	const ctx = canvas.getContext("2d");

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	// To particles

	// Small

	// const div = 50;
	// const dimensions = 2;
	// const particleSize = 0.2;

	// Big

	const div = 10;
	const dimensions = 3;
	const particleSize = 0.7;

	const commands = imageToParticles({
		dimensions,
		div,
		particleSize,
		canvas,
	});

	return { commands, functionName: "picture" };
};
