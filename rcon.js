const Rcon = require("modern-rcon");

const rcon = new Rcon("localhost", "hello");

const mapStuff = require("./generators/3dmap");

(async () => {
	await rcon.connect();
	const { commands } = await mapStuff();

	dewIt(commands);
})();

async function dewIt(commands) {
	for (command of commands) {
		await rcon.send(`execute as @e[type=armor_stand] at @s run ${command}`);
	}

	dewIt(commands);
}
