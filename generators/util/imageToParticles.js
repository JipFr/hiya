module.exports = ({ dimensions, div, canvas, particleSize, yOffset = 0 }) => {
	const commands = [];

	const ctx = canvas.getContext("2d");

	const xW = dimensions * div;
	const yW = (canvas.height / canvas.width) * (dimensions * div);

	for (let x = 0; x < xW; x++) {
		for (let y = 0; y < yW; y++) {
			const { data } = ctx.getImageData(
				(x / xW) * canvas.width,
				(y / yW) * canvas.height,
				1,
				1
			);

			const r = data[0] / 255;
			const g = data[1] / 255;
			const b = data[2] / 255;

			const pos = `^${x / div - dimensions / 2} ^${
				yW / div - y / div - yOffset
			} ^0`;
			const rgb = `${r} ${g} ${b}`;

			if (data[3] === 0) continue;

			commands.push(
				`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1 normal`
			);
		}
	}

	return commands;
};
