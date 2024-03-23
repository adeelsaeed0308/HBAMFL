const removeSpaces = (value = "") => value?.replace?.(/ /g, "") || "";

module.exports = removeSpaces;
