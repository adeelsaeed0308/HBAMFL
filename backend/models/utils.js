const mongoose = require("mongoose");

const ObjectOptional = (ref) => ({
  index: true,
  ref,
  type: mongoose.Types.ObjectId,
  set(v) {
    if (v === "") return undefined;
    return v;
  },
  required: false,
});

const ObjectRequired = (ref) => ({ ...ObjectOptional(ref), required: true });

module.exports = { ObjectOptional, ObjectRequired };
