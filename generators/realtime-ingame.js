const blockColors = {
	// glass_pane: [255, 255, 255],
	// glass: [255, 255, 255],
	repeating_command_block: [160, 32, 240],
	// chain_command_block: [160, 160, 240],
	// netherite_block: [100, 100, 100],
	// glowstone: [150, 140, 40],
	// stripped_dark_oak_log: [150, 75, 0],
	dirt: [200, 100, 0],
	grass_block: [0, 255, 0],
	// dark_oak_slab: [120, 50, 0],
	// dark_oak_planks: [120, 50, 0],
	// spruce_planks: [170, 100, 0],
	// dark_oak_stairs: [120, 50, 0],
	oak_log: [120, 50, 0],
	jungle_log: [120, 50, 0],
	// dark_oak_trapdoor: [100, 40, 0],
	// azalea_leaves: [100, 255, 100],
	oak_leaves: [100, 255, 100],
	// flowering_azalea_leaves: [255, 100, 200],
	water: [100, 100, 255],
	stone: [200, 200, 200],
	// stone_slab: [128, 128, 128],
	vine: [128, 255, 128],
	// black_concrete: [0, 0, 0],
	// bookshelf: [255, 255, 25],
};

module.exports = async () => {
	let commands = [];
	let scanCommands = [];

	const particleSize = 3;
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
						rX / d
					} ~${rY / d + 15} ~${rZ / d}`
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
