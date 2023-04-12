const { createCanvas, loadImage } = require("canvas");

module.exports = async (src = "./images/jip-transparent.png") => {
	const commands = [];
	const blocks = require("../blocks.json").filter(
		(t) =>
			t.block !== "lava" &&
			t.block !== "lectern" &&
			!t.block.includes("shulker")
	);

	const img = await loadImage(src);
	const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	const width = 100;

	const height = Math.floor((width / img.naturalWidth) * img.naturalHeight);

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			console.log(x, y);
			const data = ctx.getImageData(
				(x / width) * canvas.width,
				(y / height) * canvas.height,
				1,
				1
			).data;
			let block = "air";

			if (data[3] === 255) {
				const blockDistances = blocks
					.map((t) => {
						const distR = Math.abs(data[0] - t.rgb[0]);
						const distG = Math.abs(data[1] - t.rgb[1]);
						const distB = Math.abs(data[2] - t.rgb[2]);
						const dist = Math.sqrt(distR ** 2 + distG ** 2 + distB ** 2);

						return {
							...t,
							dist,
						};
					})
					.sort((a, b) => a.dist - b.dist);
				block = blockDistances[0].block;
			}

			let suffix = "";
			if (block.includes("_slab")) suffix = "[type=double]";
			if (block.includes("_trapdoor")) suffix = "[open=true]";

			commands.push(`setblock ~${x} ~${height - y} ~ ${block}${suffix}`);
		}
	}

	return [
		{
			commands,
			functionName: "image-to-blocks",
		},
	];
};
