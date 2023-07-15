const worldName = "Functions text";
const worldPath = `/Users/jip/Library/Application Support/minecraft/saves/${worldName}/`;
const packPath = `${worldPath}datapacks/hiya/`;

// Make sure all folders exists
const basePath = `${packPath}data/jip/functions/`;

module.exports = {
	basePath,
	worldPath,
	worldName,
	packPath,
};
