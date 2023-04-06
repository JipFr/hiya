module.exports = () => {
	const commands = [];

	let isTrue = true;
	let x = 0;
	let y = 0;
	let rot = 0;
	let i = 0;
	while (isTrue && i < 1e3) {
		console.log(i, Math.floor(x), Math.floor(y));

		commands.push(`setblock ~${x} ~ ~${y} tnt`);

		x += 3 * Math.cos(rot);
		y += 3 * Math.sin(rot);

		rot += 0.3;

		i++;
	}

	return { commands, functionName: "bad-circle" };
};
