const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const VendorContact = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
  },
  // do not allow to populate unselected fields. This works together with the 'disallowedSelection' option in the advancedQuery middleware so if I pass in a field that you cant select, you should also not be able to populate that field
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

VendorContact.index(
  { vendor: 1 },
  {
    partialFilterExpression: {
      deleted: { $eq: false },
    },
  }
);

VendorContact.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("VendorContact", VendorContact);
