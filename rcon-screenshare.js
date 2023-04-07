const fs = require("fs");
const screenshot = require("screenshot-desktop");
const picture = require("./generators/picture");

const Rcon = require("modern-rcon");

const rconClients = [];

const mapStuff = require("./generators/colorcircle");

let i = 0;

(async () => {
	for (let i = 0; i < 30; i++) {
		const rcon = new Rcon("localhost", "hello");
		rconClients.push(rcon);
		await rcon.connect();
	}

	dewIt();
})();

async function dewIt() {
	const displays = await screenshot.listDisplays();

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

	// const { commands } = mapStuff(i);

	// i += 0.1;
	// let now = Date.now();
	let commandsPerClient = commands.length / rconClients.length + 1;
	let sequences = [];

	let c = Object.assign([], commands);
	while (c.length > 0) {
		sequences.push(c.splice(0, commandsPerClient));
	}

	await Promise.all(
		rconClients.map(async (client, i) => {
			const sequence = sequences[i];
			for (const command of sequence) {
				await client.send(
					`execute as @e[type=armor_stand] at @s run ${command}`
				);
			}
		})
	);

	// let now2 = Date.now();
	// let diff = now2 - now;

	// setTimeout(() => {
	// 	dewIt(commands);
	// }, Math.max(100 - diff, 0));

	// for (command of commands) {
	// 	await rcon.send(`execute as @e[type=armor_stand] at @s run ${command}`);
	// }

	dewIt();
}
