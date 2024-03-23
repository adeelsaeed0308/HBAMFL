const bcrypt = require("bcryptjs");
async function genPass(pass) {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(pass, salt);
  return password;
}
module.exports = genPass;
