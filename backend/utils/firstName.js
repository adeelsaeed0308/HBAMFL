module.exports = function fn(n) {
  let spaceIndex = n.indexOf(' ');
  if (spaceIndex == -1) spaceIndex = n.length;
  return n.slice(0, spaceIndex);
};
