const blockColors = {
	// grass_block: [0, 200, 0],
	// // grass: [150, 255, 150],
	// oak_log: [255, 150, 0],
	// oak_planks: [255, 150, 0],
	// stipped_oak_log: [255, 200, 50],
	// dirt: [150, 75, 0],
	// redstone_block: [255, 0, 0],
	// cobblestone: [128, 128, 128],
	// mossy_cobblestone: [128, 128, 128],
	// sand: [196, 164, 61],
	// oak_stairs: [196, 164, 61],
	// dirt_path: [196, 164, 61],
	// sandstone: [150, 140, 40],
	// clay: [194, 178, 128],
	// water: [0, 127, 255],
	// ice: [100, 100, 255],
	// blue_ice: [50, 50, 255],
	// packed_ice: [50, 50, 255],
	// coal_ore: [0, 0, 0],
	// gravel: [128, 128, 128],
	// stone: [200, 200, 200],
	// granite: [200, 200, 200],
	// snow_block: [255, 255, 255],
	// snow: [255, 255, 255],
	// spruce_log: [150, 75, 0],
	// spruce_leaves: [0, 255, 0],
	// birch_log: [170, 85, 30],
	// birch_leaves: [100, 200, 100],
	// oak_leaves: [50, 255, 50],
	// deepslate: [100, 100, 100],
	// bedrock: [0, 0, 0],
	// white_terracotta: [200, 200, 200],
	glass_pane: [255, 255, 255],
	glass: [255, 255, 255],
	repeating_command_block: [160, 32, 240],
	// chain_command_block: [160, 160, 240],
	netherite_block: [100, 100, 100],
	glowstone: [150, 140, 40],
	stripped_dark_oak_log: [150, 75, 0],
	dirt: [200, 100, 0],
	grass_block: [0, 255, 0],
	dark_oak_slab: [120, 50, 0],
	dark_oak_planks: [120, 50, 0],
	spruce_planks: [170, 100, 0],
	dark_oak_stairs: [120, 50, 0],
	dark_oak_trapdoor: [100, 40, 0],
	azalea_leaves: [100, 255, 100],
	flowering_azalea_leaves: [255, 100, 200],
	water: [100, 100, 255],
	stone: [200, 200, 200],
	stone_slab: [128, 128, 128],
	vine: [128, 255, 128],
	black_concrete: [0, 0, 0],
	bookshelf: [255, 255, 25],
};

module.exports = async () => {
	let commands = [];
	let scanCommands = [];

	const particleSize = 2;
	const d = 3;
	const size = 30;

	for (const [block, rgbValues] of Object.entries(blockColors)) {
		const rgb = [
			rgbValues[0] / 255,
			rgbValues[1] / 255,
			rgbValues[2] / 255,
		].join(" ");

		const pos = "~ ~ ~";
		const particle = `particle minecraft:dust ${rgb} ${particleSize} ${pos} 0 0 0 1 1 normal`;

		scanCommands.push(
			`execute if block ~ ~ ~ ${block} at @e[tag=particle,limit=1] run ${particle}`
		);
	}

	commands.push(
		`execute as @e[type=armor_stand,tag=!particle] at @s unless entity @e[type=armor_stand,tag=particle,distance=..${size}] run summon minecraft:armor_stand ~ ~ ~ {Tags:["particle"],NoGravity:1b,Marker:1b, Invisible:1b}`
	);

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			for (let z = 0; z < size; z++) {
				const rX = x - size / 2;
				const rY = y - size / 2;
				const rZ = z - size / 2;

				// Teleport Armor Stand to particle position
				commands.push(
					`execute as @e[type=armor_stand,tag=!particle] at @s run teleport @e[tag=particle,limit=1] ~${
						rX / d + 3
					} ~${rY / d + 3} ~${rZ / d}`
				);

				commands.push(
					`execute as @e[type=armor_stand,tag=!particle] at @s positioned ~${rX} ~${rY} ~${rZ} run function jip:realtime-ingame-check`
				);
			}
		}
	}

	return [
		{
			commands,
			functionName: "realtime-ingame-map",
		},
		{
			commands: scanCommands,
			functionName: "realtime-ingame-check",
		},
	];
};
