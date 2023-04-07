module.exports = () => {
	const commands = [];

	const div = 2;
	const dimensions = 15;
	const size = 3;

	const xW = dimensions * div;
	const yW = dimensions * div;
	const zW = dimensions * div;

	for (let x = 0; x < xW; x++) {
		for (let y = 0; y < yW; y++) {
			for (let z = 0; z < zW; z++) {
				const xPos = x / div - dimensions / 2;
				const yPos = y / div;
				const zPos = z / div - dimensions / 2;

				const altYPos = yPos - 2;

				let dist = Math.sqrt(xPos * xPos + zPos * zPos + altYPos * altYPos);
				if (Math.round(dist) !== Math.round((dimensions - 0.1) / 2)) continue;

				const pos = `^${xPos} ^${yPos} ^${zPos}`;
				const rgb = `${x / xW} ${y / yW} ${z / zW}`;

				commands.push(
					`particle minecraft:dust ${rgb} ${size} ${pos} 0 0 0 20 1 force`
				);
			}
		}
	}

	return { commands, functionName: "colorsphere" };
};
