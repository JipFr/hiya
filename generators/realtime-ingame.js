const blockColors = {
	// glass_pane: [255, 255, 255],
	// glass: [255, 255, 255],
	// repeating_command_block: [160, 32, 240],
	// chain_command_block: [160, 160, 240],
	netherite_block: [100, 100, 100],
	glowstone: [150, 140, 40],
	stripped_dark_oak_log: [150, 75, 0],
	dark_oak_slab: [120, 50, 0],
	dark_oak_planks: [120, 50, 0],
	spruce_planks: [170, 100, 0],
	dark_oak_stairs: [120, 50, 0],
	dark_oak_trapdoor: [100, 40, 0],
	azalea_leaves: [100, 255, 100],
	// cobblestone: [100, 100, 100],
	// mossy_cobblestone: [100, 130, 100],
	// flowering_azalea_leaves: [255, 100, 200],
	dirt: [200, 100, 0],
	grass_block: [0, 255, 0],
	oak_log: [120, 50, 0],
	jungle_log: [120, 50, 0],
	coal_ore: [128, 128, 128],
	granite: [200, 100, 100],
	andesite: [100, 100, 100],
	diorite: [200, 200, 200],
	sea_lantern: [255, 255, 255],
	// deepslate: [150, 150, 150],
	oak_leaves: [100, 255, 100],
	jungle_leaves: [90, 255, 90],
	bamboo: [90, 255, 90],
	water: [100, 100, 255],
	stone: [200, 200, 200],
	// sand: [245, 218, 98],
	// glowstone: [255, 255, 255],
	// sandstone: [200, 200, 60],
	// obsidian: [0, 0, 50],
	powered_rail: [255, 200, 200],
};

module.exports = async () => {
	let scanCommands = [];

	const particleSize = 1.5;
	const limit = 20;
	const stepper = 0.2;

	for (const [block, rgbValues] of Object.entries(blockColors)) {
		const rgb = [
			rgbValues[0] / 255,
			rgbValues[1] / 255,
			rgbValues[2] / 255,
		].join(" ");

		const pos = "~ ~10 ~";
		const particle = `particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 1 1 normal`;

		scanCommands.push(
			`execute if block ~ ~ ~ ${block} at @e[type=armor_stand,tag=particle,limit=1] run ${particle}`
		);
	}

	const armorStandPos = `~-${(limit * stepper) / 2} ~-${
		(limit * stepper) / 2
	} ~-${(limit * stepper) / 2}`;

	const run = {
		functionName: "newmap/run",
		commands: [
			// Init
			"scoreboard objectives add map dummy",
			`scoreboard players set limit map ${limit}`,
			"scoreboard players set y map 0",
			`execute as @s at @s unless entity @e[type=armor_stand,tag=particle] run summon minecraft:armor_stand ${armorStandPos} {Tags:["particle"],NoGravity:1b,Invisible:1b,Marker:1b}`,

			// Initialise
			`execute positioned ~-${limit / 2} ~-${limit / 2} ~-${
				limit / 2
			} run function jip:newmap/y`,

			// Reset
			`execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~ ~-${
				limit * stepper
			}`,
			`execute at @s run teleport @e[type=armor_stand,tag=particle,limit=1] ${armorStandPos}`,
		],
	};

	const z = {
		functionName: "newmap/z",
		commands: [
			// Teleport further ahead
			`execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~ ~${stepper}`,

			// Reset value for next func
			"scoreboard players set x map 0",
			"function jip:newmap/x",

			// Teleport X back
			`execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~-${
				limit * stepper
			} ~ ~`,

			// Check if another level of recursion should happen
			"scoreboard players add z map 1",
			"execute if score z map < limit map positioned ~ ~ ~1 run function jip:newmap/z",
		],
	};

	const y = {
		functionName: "newmap/y",
		commands: [
			// Teleport further ahead
			`execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~${stepper} ~`,

			// Reset value for next vunc
			"scoreboard players set z map 0",
			"function jip:newmap/z",

			// TP back on Z-axis
			`execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~ ~-${
				limit * stepper
			}`,

			// Check if another level of recursion should happen
			"scoreboard players add y map 1",
			"execute if score y map < limit map positioned ~ ~1 ~ run function jip:newmap/y",
		],
	};

	const x = {
		functionName: "newmap/x",
		commands: [
			// Teleport further ahead
			`execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~${stepper} ~ ~`,

			// RUN PARTICLE CHECK
			"function jip:realtime-ingame-check",

			// Check if another level of recursion should happen
			"scoreboard players add x map 1",
			"execute if score x map < limit map positioned ~1 ~ ~ run function jip:newmap/x",
		],
	};

	return [
		run,
		x,
		y,
		z,
		{
			commands: scanCommands,
			functionName: "realtime-ingame-check",
		},
	];
};
