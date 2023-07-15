function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

module.exports = ({ dimensions, div, canvas, particleSize, yOffset = 0 }) => {
	const commands = [];

	const ctx = canvas.getContext("2d");

	const xW = dimensions * div;
	const yW = (canvas.height / canvas.width) * (dimensions * div);

	for (let y = yW; y > 0; y--) {
		commands.push(`kill @e[tag=row-${y}]`);
		for (let x = 0; x < xW; x++) {
			const { data } = ctx.getImageData(
				(x / xW) * canvas.width,
				(y / yW) * canvas.height,
				1,
				1
			);

			const r = Math.round(data[0]);
			const g = Math.round(data[1]);
			const b = Math.round(data[2]);

			const pos = `~ ~${yW / div - y / div - yOffset} ~${
				x / div - dimensions / 2
			}`;
			const rgb = rgbToHex(r, g, b);

			if (data[3] === 0) continue;

			// Configuration stuff
			const scale = 0.4;

			commands.push(
				`summon text_display ${pos} {Rotation:[90F,0F],Tags:["RGB","${rgb.slice(
					1
				)}","row-${y}"],text:'{"text":"⬛","color":"${rgb}"}',background:0,transformation:{translation:[0f,0f,0f],left_rotation:[0f,0f,0f,1f],scale:[${scale}f,${scale}f,${scale}f],right_rotation:[0f,0f,0f,1f]}}`
			);

			// commands.push(
			// 	`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1 normal`
			// );
		}
	}

	return commands;
};
