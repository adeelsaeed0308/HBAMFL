const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const Email = new mongoose.Schema(
  {
    sentBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    attachmentContent: {
      type: Buffer,
    },
  },
  // do not allow to populate unselected fields. This works together with the 'disallowedSelection' option in the advancedQuery middleware so if I pass in a field that you cant select, you should also not be able to populate that field
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
    strict: false,
  }
);

Email.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("Email", Email);
