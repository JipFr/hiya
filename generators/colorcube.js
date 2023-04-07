module.exports = () => {
	const commands = [];

	const div = 3;
	const dimensions = 5;
	const size = 2;

	const xW = dimensions * div;
	const yW = dimensions * div;
	const zW = dimensions * div;

	for (let x = 0; x < xW; x++) {
		for (let y = 0; y < yW; y++) {
			for (let z = 0; z < zW; z++) {
				if (
					!(
						z === 0 ||
						z === zW - 1 ||
						y === 0 ||
						y === yW - 1 ||
						x === 0 ||
						x === xW - 1
					)
				)
					continue;

				const pos = `^${x / div - dimensions / 2} ^${y / div} ^${
					z / div - dimensions / 2
				}`;
				const rgb = `${x / xW} ${y / yW} ${z / zW}`;

				commands.push(
					`particle minecraft:dust ${rgb} ${size} ${pos} 0 0 0 20 1 force`
				);
			}
		}
	}

	return { commands, functionName: "colorcube" };
};
