const fs = require("fs");

const generators = [
	// require("./generators/colorcube"),
	// require("./generators/colorcircle"),
	// require("./generators/picture"),
	// require("./generators/screenshare"),
	// require("./generators/text"),
	// require("./generators/gif"),
	require("./generators/3dmap"),
	// require("./generators/depthmap"),
	// require("./generators/worldgen"),
	// require("./generators/stupid-circle"),
	// require("./generators/waterplatform"),
	require("./generators/realtime-ingame"),
];

(async () => {
	for (const gen of generators) {
		const data = await gen();

		let arr = data;
		if (!Array.isArray(data)) arr = [data];

		for (const { commands, functionName } of arr) {
			if (!functionName) continue;

			let dir = functionName.split("/").slice(0, -1).filter(Boolean);
			for (let i = 0; i < dir.length; i++) {
				let path = dir.slice(0, i + 1).join("/");
				console.log(path);
				const fullPath = `./data/jip/functions/${path}`;
				if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
			}

			fs.writeFileSync(
				`./data/jip/functions/${functionName}.mcfunction`,
				commands.join("\n")
			);
		}
	}
})();
