const fs = require("fs");

const generators = [
	// require("./generators/colorcube"),
	// require("./generators/colorcircle"),
	// require("./generators/picture"),
	// require("./generators/screenshare"),
	// require("./generators/text"),
	require("./generators/gif"),
	// require("./generators/3dmap"),
	// require("./generators/stupid-circle"),
	// require("./generators/waterplatform"),
];

(async () => {
	for (const gen of generators) {
		const { commands, functionName } = await gen();

		if (!functionName) continue;

		console.log(commands);

		fs.writeFileSync(
			`./data/jip/functions/${functionName}.mcfunction`,
			commands.join("\n")
		);
	}
})();
