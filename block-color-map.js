const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const folder = "./textures/block/";

const files = fs
	.readdirSync(folder)
	.map((fileName) => folder + fileName)
	.filter((path) => path.endsWith(".png"));
console.log(files);

(async () => {
	let blocks = await Promise.all(
		files.map(async (path) => {
			if (
				path.includes("_top") ||
				path.includes("_bottom") ||
				path.includes("_front") ||
				path.includes("_back") ||
				path.includes("_conditional") ||
				path.includes("_end") ||
				path.includes("_base") ||
				path.includes("_lit") ||
				path.includes("_inner") ||
				path.includes("_inside") ||
				path.includes("_empty") ||
				path.includes("_dead") ||
				path.includes("_moist") ||
				path.includes("_on") ||
				path.includes("_bloom") ||
				path.includes("_corner") ||
				path.includes("structure_block") ||
				path.includes("_off") ||
				path.includes("_occupied") ||
				path.includes("_lock") ||
				path.includes("_flow") ||
				path.includes("chiseled_bookshelf") ||
				path.match(/\d/) ||
				path.includes("bamboo_") ||
				path.includes("particle") ||
				path.includes("cherry") ||
				path.includes("debug") ||
				path.includes("mosaic") ||
				path.includes("dried_kelp") ||
				path.includes("item_frame") ||
				path.includes("comparator") ||
				path.includes("repeater") ||
				path.includes("daylight") ||
				path.includes("tnt") ||
				path.includes("_snow")
			)
				return null;

			const img = await loadImage(path);
			const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			const data = Array.from(
				ctx.getImageData(0, 0, canvas.width, canvas.height).data
			);
			let colors = [];
			while (data.length > 0) {
				colors.push(data.splice(0, 4));
			}
			if (colors.find((t) => t[3] !== 255)) return null;

			// Get average
			let r = 0;
			let g = 0;
			let b = 0;
			for (const [r1, g1, b1] of colors) {
				r += r1;
				g += g1;
				b += b1;
			}
			let avgR = r / colors.length;
			let avgG = g / colors.length;
			let avgB = b / colors.length;

			let block = path
				.split("/")
				.pop()
				.split(".")[0]
				.replace(/_sides?|_outside|_still/g, "");

			if (block === "magma" || block === "snow") block = `${block}_block`;

			return {
				block,
				rgb: [Math.round(avgR), Math.round(avgG), Math.round(avgB)],
			};
		})
	);
	blocks = blocks.filter(Boolean);
	console.log(blocks);
	fs.writeFileSync("blocks.json", JSON.stringify(blocks));
})();
