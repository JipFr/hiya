const fs = require("fs");
const Rcon = require("modern-rcon");

process.on("uncaughtException", (err) => {
	console.log(err);
});

const rconClients = [];
let scanRconClients = [];

let i = 0;
let rconClientIndex = 0;
let isScanning = false;
let knownBlocks = JSON.parse(fs.readFileSync("./map.json", "utf-8") || "[]");
let world = [];

const blockColors = {
	grass_block: [0, 200, 0],
	// grass: [150, 255, 150],
	oak_log: [255, 150, 0],
	oak_planks: [255, 150, 0],
	stipped_oak_log: [255, 200, 50],
	dirt: [150, 75, 0],
	redstone_block: [255, 0, 0],
	cobblestone: [128, 128, 128],
	mossy_cobblestone: [128, 128, 128],
	sand: [196, 164, 61],
	oak_stairs: [196, 164, 61],
	dirt_path: [196, 164, 61],
	sandstone: [150, 140, 40],
	clay: [194, 178, 128],
	water: [0, 127, 255],
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
	bedrock: [0, 0, 0],
	white_terracotta: [200, 200, 200],
	glass_pane: [255, 255, 255],
};
const whitelistedBlocks = [
	"oak_leaves",
	"oak_log",
	"grass_block",
	"birch_leaves",
	"birch_log",
	// "water",
];

(async () => {
	for (let i = 0; i < 30; i++) {
		const rcon = new Rcon("localhost", "hello");
		const rcon2 = new Rcon("localhost", "hello");
		rconClients.push(rcon);
		scanRconClients.push(rcon2);
		await rcon.connect();
		await rcon2.connect();
	}

	console.time("World");
	await populateWorld();
	console.timeEnd("World");

	// setInterval(populateWorld, 5e3);

	dewIt();
})();

async function populateWorld(override = false) {
	if (isScanning && !override) return false;
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

	let standData = (
		await scanRconClients[0].send(
			`/data get entity @e[type=minecraft:armor_stand,limit=1]`
		)
	)
		.split("entity data: ")
		.pop();
	const pos = standData.split("Pos: [").pop().split("],")[0];
	const [x, y, z] = pos.split(", ").map((t) => Number(t.split(".")[0]));

	async function getPlayerPos() {
		const rcon = new Rcon("localhost", "hello");
		await rcon.connect();
		const res = await rcon.send(`/data get entity @p Pos`);
		console.log(res);
		let playerData = res.split("entity data: ").pop();
		console.log(playerData);
		const [x, y, z] = playerData
			.slice(1, -1)
			.split(", ")
			.map((t) => Number(t.split(".")[0]));
		console.log(x, y, z, playerData);
		return {
			x,
			y,
			z,
			rcon,
		};
	}

	console.log(x, y, z);

	knownBlocks = knownBlocks.filter((t) => t.x);

	let playerPos = await getPlayerPos();
	let int = setInterval(async () => {
		if (isScanning) return;
		playerPos = await getPlayerPos();
		if (!playerPos.z) return;
		let s = 16;
		let shouldScan = false;
		for (let x1 = 0; x1 < s; x1++) {
			for (let y1 = 0; y1 < s; y1++) {
				const rX = Math.floor(playerPos.x + x1 - s / 2);
				const rY = Math.floor(playerPos.y) - 2;
				const rZ = Math.floor(playerPos.z + y1 - s / 2);
				const existingBlockAtLocation = knownBlocks.find(
					(t) => t.x === rX && t.y === rY && t.z === rZ
				);
				if (existingBlockAtLocation) continue;
				shouldScan = true;
				knownBlocks.push({
					x: rX,
					y: rY,
					z: rZ,
				});
			}
		}
		if (!shouldScan) return;
		isScanning = true;
		console.log("t", knownBlocks.length);
		setTimeout(() => {
			console.log("Res");
			clearInterval(int);
			populateWorld(true);
		}, 1e3);
	}, 5e3);

	let newWorld = [];

	console.log("YEE");
	const radius = 20;
	const useNeighbourMethod = true;

	if (useNeighbourMethod) {
		// Get blocks for every position
		if (knownBlocks.length === 0) knownBlocks = [{ x, y: y - 2, z }];
		async function getNeighbouringBlocks() {
			const unknownBlocks = knownBlocks.filter((t) => !t.block && !t.invalid);
			console.log(unknownBlocks.length);
			for (const block of unknownBlocks) {
				const { x, y, z } = block;
				block.block = await testBlock(x, y, z);

				if (blockColors[block.block] && !block.invalid) {
					for (let j = -1; j <= 1; j++) {
						for (let k = -1; k <= 1; k++) {
							// Add surrounding blocks to queue
							for (let i = -1; i <= 1; i++) {
								let rX = x + i;
								let rY = y + j;
								let rZ = z + k;
								const existingBlockAtLocation = knownBlocks.find(
									(t) => t.x === rX && t.y === rY && t.z === rZ
								);
								if (existingBlockAtLocation) continue;
								knownBlocks.push({
									x: rX,
									y: rY,
									z: rZ,
								});
							}
						}
					}
				}
			}
			for (const block of knownBlocks) {
				block.invalid = false;
				// 	let blockAbove = knownBlocks.find(
				// 		(t) => t.x === block.x && t.y === block.y + 3 && t.z === block.z
				// 	);
				// 	block.invalid =
				// 		!!blockAbove &&
				// 		blockAbove.block &&
				// 		!whitelistedBlocks.includes(blockAbove.block) &&
				// 		false;
			}

			knownBlocks = knownBlocks.filter((b) => {
				let rX = Math.abs(x - b.x);
				let rY = Math.abs(y - 2 - b.y);
				let rZ = Math.abs(z - b.z);
				let pX = Math.abs(playerPos.x - b.x);
				let pY = Math.abs(playerPos.y - 1 - b.y);
				let pZ = Math.abs(playerPos.z - b.z);
				return Math.sqrt(pX * pX + pY * pY + pZ * pZ) < radius || b.block;
			});

			newWorld = knownBlocks.filter((t) => t.block !== "empty" && !t.invalid);

			if (knownBlocks.filter((t) => !t.block && !t.invalid).length > 0)
				await getNeighbouringBlocks();
		}
		await getNeighbouringBlocks();
	} else {
		const startX = Math.floor(x - radius);
		const endX = Math.floor(x + radius);
		const startY = Math.floor(y - radius / 2);
		const endY = Math.floor(y + radius * 2);
		const startZ = Math.floor(z - radius);
		const endZ = Math.floor(z + radius);

		// Get blocks for every position
		for (let y = startY; y < endY; y++) {
			for (let z = startZ; z < endZ; z++) {
				for (let x = startX; x < endX; x++) {
					const block = await testBlock(x, y, z);
					if (block === "empty") continue;
					newWorld.push({
						x,
						y,
						z,
						block,
					});
				}
			}
		}
	}

	// Filter so there's only one for each XY
	const onlyTop = true;
	if (onlyTop) {
		let xzMap = {};
		for (const block of newWorld) {
			const key = `${block.x}-${block.z}`;
			if (!xzMap[key]) xzMap[key] = [];
			xzMap[key].push(block);
			xzMap[key] = xzMap[key].sort((a, b) => b.y - a.y);
		}

		newWorld = newWorld.filter((block) => {
			const key = `${block.x}-${block.z}`;
			return (
				xzMap[key][0].y === block.y || whitelistedBlocks.includes(block.block)
			);
		});
	}

	world = newWorld;

	fs.writeFileSync("./map.json", JSON.stringify(knownBlocks));

	isScanning = false;
}

async function testBlock(x, y, z) {
	const scanRconClient =
		scanRconClients[rconClientIndex % scanRconClients.length];
	rconClientIndex++;
	let t = await scanRconClient.send(
		`loot spawn ${x} ${y} ${z} mine ${x} ${y} ${z}`
	);
	let block = t.split(" ").pop().split(/:|\//).pop();
	if (!t.includes("Dropped 0")) {
		await scanRconClient.send(
			`kill @e[type=item,x=${x},y=${y},z=${z},distance=..2]`
		);
	} else {
		const waterTest = await scanRconClient.send(
			`/execute if block ${x} ${y} ${z} water`
		);
		const isWater = !waterTest.includes("Test failed");
		if (isWater) {
			block = "water";
		} else {
			const waterTest = await scanRconClient.send(
				`/execute if block ${x} ${y} ${z} bedrock`
			);
			const isBedrock = !waterTest.includes("Test failed");
			if (isBedrock) block = "bedrock";
		}
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
		let data = Object.assign([], blockColors[block.block]);

		if (!data) {
			if (!unknownBlocks.includes(block.block)) unknownBlocks.push(block.block);
			continue;
		}

		let t = (block.y - smallestY) / (largestY - smallestY);
		// data = [t * 255, t * 255, t * 255];
		data[0] = Math.max(data[0] - t * 50, 0);
		data[1] = Math.max(data[1] - t * 50, 0);
		data[2] = Math.max(data[2] - t * 50, 0);

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

	// console.log(unknownBlocks);

	return {
		commands,
	};
}

async function dewIt() {
	// const { commands } = mapStuff(i);
	// i += 0.1;

	const now = Date.now();
	let { commands } = worldToParticles();

	if (isScanning) commands = [];

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
