const Code = require("../models/VerificationCodes");

module.exports = async () => {
  try {
    const date = new Date();
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    await Code.deleteMany({ createdAt: { $lte: previous } });
  } catch (e) {
    console.log("Cronjob error:", e?.message);
  }
};
