const fs = require("fs");
const screenshot = require("screenshot-desktop");
const picture = require("./picture");

module.exports = async () => {
	const displays = await screenshot.listDisplays();

	setInterval(async () => {
		await screenshot({
			screen: displays[displays.length - 1].id,
			filename: "images/screen.png",
		});

		if (!fs.existsSync("./images/screen.png")) return;

		const { commands } = await picture("images/screen.png");

		fs.writeFileSync(
			`./data/jip/functions/picture.mcfunction`,
			commands.join("\n")
		);
	}, 100);

	return { commands: [], functionName: "" };
};
