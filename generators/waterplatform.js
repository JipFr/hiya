module.exports = () => {
	const commands = [];

	const perBlock = 5;

	const width = 3 * perBlock;
	const height = 3 * perBlock;

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			// commands.push(`particle minecraft:ash ~${x / 5} ~ ~${y / 5} 0 0 0 0 1`);
			commands.push(
				`particle minecraft:bubble ~${x / perBlock - width / perBlock / 2} ~ ~${
					y / perBlock - height / perBlock / 2
				} 0 0 0 0 1 force`
			);
		}
	}

	return { commands, functionName: "waterplatform" };
};
