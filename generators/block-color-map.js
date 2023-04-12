module.exports = () => {
	const commands = [];
	const blocks = require("../blocks.json");

	console.log(blocks);
	for (const block of blocks) {
		const d = 4;
		const rX = Math.floor(block.rgb[0] / d);
		const rY = Math.floor(block.rgb[1] / d);
		const rZ = Math.floor(block.rgb[2] / d);
		commands.push(`setblock ~${rX} ~${rY} ~${rZ} ${block.block}`);
		commands.push(`setblock ~${rX + 1} ~${rY} ~${rZ} barrier keep`);
		commands.push(`setblock ~${rX - 1} ~${rY} ~${rZ} barrier keep`);
		commands.push(`setblock ~${rX} ~${rY} ~${rZ + 1} barrier keep`);
		commands.push(`setblock ~${rX} ~${rY} ~${rZ - 1} barrier keep`);
		commands.push(`setblock ~${rX} ~${rY - 1} ~${rZ} barrier keep`);
		commands.push(`setblock ~${rX} ~${rY} ~${rZ} barrier keep`);
	}

	const clearCommands = commands.map((t) =>
		t.replace(/barrier/, "air").replace(/ keep/g, "")
	);

	return [
		{
			commands,
			functionName: "block-color-map",
		},
		{
			commands: clearCommands,
			functionName: "block-color-map-clear",
		},
	];
};
