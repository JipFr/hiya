const { createCanvas, loadImage } = require("canvas");

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

module.exports = async (src = "./images/jip-hot.jpeg") => {
	// const commands = ["kill @e[tag=RGB]"];
	const commands = [];

	// summon text_display 0 0 80 {Rotation:[90F,0F],Tags:["RGB","0000CC" ],text:'{"text":"⬛","color":"#0000CC"}',background:0}

	const img = await loadImage(src);
	const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	const width = 100;

	const height = Math.floor((width / img.naturalWidth) * img.naturalHeight);

	for (let y = height; y > 0; y--) {
		commands.push(`kill @e[tag=row-${y}]`);
		for (let x = 0; x < width; x++) {
			console.log(x, y);
			// Get colo
			const data = ctx.getImageData(
				(x / width) * canvas.width,
				(y / height) * canvas.height,
				1,
				1
			).data;
			const rgb = rgbToHex(data[0], data[1], data[2]);

			// No empty stuff
			if (data[3] === 0) continue;
			const treshold = 240;
			if (data[0] > treshold && data[1] > treshold && data[2] > treshold)
				continue;

			// Configuration stuff
			const scale = 0.1;
			const d = 60;

			commands.push(
				`summon text_display ~ ~${(height - y) / d} ~${
					x / d - 0.8
				} {Rotation:[90F,0F],Tags:["RGB","${rgb.slice(
					1
				)}","row-${y}"],text:'{"text":"⬛","color":"${rgb}"}',background:0,transformation:{translation:[0f,0f,0f],left_rotation:[0f,0f,0f,1f],scale:[${scale}f,${scale}f,${scale}f],right_rotation:[0f,0f,0f,1f]}}`
			);
		}
	}

	return [
		{
			commands,
			functionName: "text-display-img",
		},
	];
};
