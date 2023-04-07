const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

module.exports = async () => {
	const commands = [];

	const circular = false;
	const steppingSize = 0.2;
	const width = 6.9;
	const length = 12.9;
	const m = 0.4;
	const particleSize = 1.2;
	const offset = 2;
	const prefix = "^";

	const img = await loadImage("./images/europe.png");
	const canvas = createCanvas(
		(width / length) * img.naturalWidth,
		img.naturalWidth
	);
	const ctx = canvas.getContext("2d");
	ctx.translate(canvas.width, canvas.height);
	ctx.rotate(Math.PI / 2);

	ctx.drawImage(img, -canvas.height, -230);

	for (let x = 0; x < width; x += steppingSize) {
		for (let y = 0; y < length; y += steppingSize) {
			let imgData = ctx.getImageData(
				(x / width) * canvas.width,
				(y / length) * canvas.height,
				1,
				1
			).data;
			let value =
				1 - imgData.slice(0, 3).reduce((a, b) => a + b, 0) / (765 / 2);

			if (imgData[3] <= 0) value = -1;

			let relYPos = Math.floor(value * m * 100) / 100; // From -5 to +5 when `m` is 5

			let data = [0, ((value + 1) / 2) * 200 + 55, 0];

			if (imgData[3] <= 0) {
				data = [128, 128, 255];
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

			const pos = `${prefix}${rX} ${prefix}${relYPos + offset} ${prefix}${rY}`;
			commands.push(
				`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1 force`
			);
		}
	}

	return { commands, functionName: "europe" };
};

function isInEllipse(x, y, width, length) {
	const ellipseDist = (x * x) / width + (y * y) / length;
	return ellipseDist <= 1;
}
