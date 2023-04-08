const Rcon = require("modern-rcon");

const rconClients = [];
let scanRconClient;

let i = 0;

let world = [];

(async () => {
	for (let i = 0; i < 15; i++) {
		const rcon = new Rcon("localhost", "hello");
		rconClients.push(rcon);
		await rcon.connect();
	}

	const rcon2 = new Rcon("localhost", "hello");
	scanRconClient = rcon2;
	await rcon2.connect();

	await populateWorld();

	dewIt();
})();

async function populateWorld() {
	// From -320 63 -252 to -280 106 -204

	// let startX = -320;
	// let endX = -280;

	// let startY = 80;
	// let endY = 106;

	// let startZ = -252;
	// let endZ = -204;

	//From -540 62 -556 to -595 77 -522

	let startX = -595;
	let endX = -540;

	let startY = 62;
	let endY = 77;

	let startZ = -556;
	let endZ = -522;

	for (let x = startX; x < endX; x++) {
		for (let y = startY; y < endY; y++) {
			for (let z = startZ; z < endZ; z++) {
				const block = await testBlock(x, y, z);
				if (block === "empty") continue;
				world.push({
					x,
					y,
					z,
					block,
				});
			}
		}
	}
}

async function testBlock(x, y, z) {
	let t = await scanRconClient.send(
		`loot spawn ${x} ${y} ${z} mine ${x} ${y} ${z}`
	);
	if (!t.includes("Dropped 0")) {
		await scanRconClient.send(
			`kill @e[type=item,x=${x},y=${y},z=${z},distance=..2]`
		);
	}
	return t.split(" ").pop().split(/:|\//).pop();
}

function worldToParticles() {
	let commands = [];

	const prefix = "~";
	const particleSize = 1;

	let smallestX = Infinity;
	let largestX = -Infinity;
	let smallestY = Infinity;
	let largestY = -Infinity;
	let smallestZ = Infinity;
	let largestZ = -Infinity;

	for (const block of world) {
		if (block.x < smallestX) smallestX = block.x;
		if (block.x > largestX) largestX = block.x;
		if (block.y < smallestY) smallestY = block.y;
		if (block.y > largestY) largestY = block.y;
		if (block.z < smallestZ) smallestZ = block.z;
		if (block.z > largestZ) largestZ = block.z;
	}

	let unknownBlocks = [];

	for (const block of world) {
		const blockColors = {
			grass_block: [0, 200, 0],
			grass: [100, 200, 100],
			oak_log: [255, 150, 0],
			dirt: [150, 75, 0],
			redstone_block: [255, 0, 0],
			cobblestone: [128, 128, 128],
			sand: [196, 164, 61],
			sandstone: [150, 140, 40],
			clay: [194, 178, 128],
			water: [0, 0, 200],
			ice: [100, 100, 255],
			blue_ice: [50, 50, 255],
			packed_ice: [50, 50, 255],
			coal_ore: [0, 0, 0],
			gravel: [128, 128, 128],
			stone: [200, 200, 200],
			granite: [200, 200, 200],
			snow_block: [255, 255, 255],
			// snow: [255, 255, 255],
			spruce_log: [150, 75, 0],
			spruce_leaves: [0, 255, 0],
		};
		let data = blockColors[block.block];

		if (!data) {
			if (!unknownBlocks.includes(block.block)) unknownBlocks.push(block.block);
			continue;
		}

		const r = data[0] / 255;
		const g = data[1] / 255;
		const b = data[2] / 255;
		const rgb = `${r} ${g} ${b}`;

		const d = 5;
		let w = largestX - smallestX;
		let h = largestZ - smallestZ;
		const rX = (block.x - smallestX) / d - w / d / 2;
		const rY = (block.y - smallestY) / d;
		const rZ = (block.z - smallestZ) / d - h / d / 2;

		const pos = `${prefix}${rX} ${prefix}${rY} ${prefix}${rZ}`;
		commands.push(
			`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 20 1`
		);
	}

	console.log(unknownBlocks);

	return {
		commands,
	};
}

async function dewIt() {
	// const { commands } = mapStuff(i);
	// i += 0.1;

	const now = Date.now();
	const { commands } = worldToParticles();

	//

	//

	//

	//

	let commandsPerClient = commands.length / rconClients.length + 1;
	let sequences = [];

	let c = Object.assign([], commands);
	while (c.length > 0) {
		sequences.push(c.splice(0, commandsPerClient));
	}

	await Promise.all(
		rconClients.map(async (client, i) => {
			const sequence = sequences[i];
			if (!sequence) return;
			for (const command of sequence) {
				await client.send(
					`execute as @e[type=armor_stand] at @s run ${command}`
				);
			}
		})
	);

	const diff = Date.now() - now;

	setTimeout(dewIt, Math.max(0, 50 - diff));
}
