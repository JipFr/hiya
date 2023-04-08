const Rcon = require("modern-rcon");

const rconClients = [];
let scanRconClients = [];

let i = 0;
let rconClientIndex = 0;
let isScanning = false;

let world = [];

const blockColors = {
	grass_block: [0, 200, 0],
	grass: [150, 255, 150],
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
	birch_log: [170, 85, 30],
	birch_leaves: [100, 200, 100],
	oak_leaves: [50, 255, 50],
	deepslate: [100, 100, 100],
};

(async () => {
	for (let i = 0; i < 60; i++) {
		const rcon = new Rcon("localhost", "hello");
		const rcon2 = new Rcon("localhost", "hello");
		rconClients.push(rcon);
		scanRconClients.push(rcon2);
		await rcon.connect();
		await rcon2.connect();
	}

	await populateWorld();

	// setInterval(populateWorld, 5e3);

	dewIt();
})();

async function populateWorld() {
	if (isScanning) return false;
	isScanning = true;

	// From -320 63 -252 to -280 106 -204

	// let startX = -320;
	// let endX = -280;

	// let startY = 80;
	// let endY = 106;

	// let startZ = -252;
	// let endZ = -204;

	//From -540 62 -556 to -595 77 -522

	// let startX = -595;
	// let endX = -540;

	// let startY = 62;
	// let endY = 77;

	// let startZ = -556;
	// let endZ = -501;

	let playerData = (
		await scanRconClients[0].send(
			`/data get entity @e[type=minecraft:armor_stand,limit=1]`
		)
	)
		.split("entity data: ")
		.pop();
	const pos = playerData.split("Pos: [").pop().split("],")[0];
	const [x, y, z] = pos.split(", ").map((t) => Number(t.split(".")[0]));

	let r = 30;

	const startX = Math.floor(x - r);
	const endX = Math.floor(x + r);
	const startY = Math.floor(y - r / 2);
	const endY = Math.floor(y + r * 2);
	const startZ = Math.floor(z - r);
	const endZ = Math.floor(z + r);

	let newWorld = [];

	let coords = [];

	// Get blocks for every position
	for (let x = startX; x < endX; x++) {
		for (let y = startY; y < endY; y++) {
			for (let z = startZ; z < endZ; z++) {
				coords.push({ x, y, z });
			}
		}
	}

	coords = coords
		.sort((a, b) => a.x - b.x)
		.sort((a, b) => a.y - b.y)
		.sort((a, b) => a.z - b.z);

	let coordsPerClient = coords.length / scanRconClients.length + 1;
	let sequences = [];

	while (coords.length > 0) {
		sequences.push(coords.splice(0, coordsPerClient));
	}

	await Promise.all(
		sequences.map(async (sequence, i) => {
			for (const { x, y, z } of sequence) {
				const block = await testBlock(x, y, z, i);
				if (block === "empty" || !blockColors[block]) continue;
				newWorld.push({
					x,
					y,
					z,
					block,
				});
			}
		})
	);

	// Filter so there's only one for each XY
	const onlyTop = false;
	if (onlyTop) {
		let xzMap = {};
		for (const block of newWorld) {
			const key = `${block.x}-${block.z}`;
			if (!xzMap[key]) xzMap[key] = [];
			xzMap[key].push(block);
			xzMap[key] = xzMap[key].sort((a, b) => b.y - a.y);
		}

		const whitelistedBlocks = [
			"oak_leaves",
			"oak_log",
			"grass_block",
			"birch_leaves",
			"birch_log",
		];

		newWorld = newWorld.filter((block) => {
			const key = `${block.x}-${block.z}`;
			console.log(xzMap[key][0].y === block.y);
			return (
				xzMap[key][0].y === block.y || whitelistedBlocks.includes(block.block)
			);
		});
	}

	newWorld = newWorld.filter((t) => blockColors[t.block]);

	world = newWorld;
	console.log(world);

	isScanning = false;
}

async function testBlock(x, y, z, i) {
	const scanRconClient = scanRconClients[i % scanRconClients.length];
	let t = await scanRconClient.send(
		`loot spawn ${x} ${y} ${z} mine ${x} ${y} ${z}`
	);
	let block = t.split(" ").pop().split(/:|\//).pop();
	if (!t.includes("Dropped 0")) {
		await scanRconClient.send(
			`kill @e[type=item,x=${x},y=${y},z=${z},distance=..2]`
		);
	} else {
		// const waterTest = await scanRconClient.send(
		// 	`/execute if block ${x} ${y} ${z} water`
		// );
		// const isWater = !waterTest.includes("Test failed");
		// if (isWater) block = "water";
	}

	if (blockColors[block]) {
		console.log(t, x, y, z);
	}

	return block;
}

function worldToParticles() {
	let commands = [];

	const prefix = "~";
	const particleSize = 1.5;

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
			`particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 0 1`
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

	setTimeout(dewIt, Math.max(0, 100 - diff));
}
