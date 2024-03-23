const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameNoSpaces: String,
    country: {
      type: String,
      required: true,
    },
    notes: String,
    order: {
      type: String,
    },
    attachments: [String],
    brandPriceSheets: [
      {
        brand: String,
        attachments: [String],
      },
    ],
  },
  // do not allow to populate unselected fields. This works together with the 'disallowedSelection' option in the advancedQuery middleware so if I pass in a field that you cant select, you should also not be able to populate that field
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

VendorSchema.virtual("vendorRequests", {
  justOne: false,
  localField: "_id",
  foreignField: "vendor",
  ref: "VendorRequest",
  match: {
    deleted: false,
  },
});

VendorSchema.virtual("users", {
  justOne: false,
  localField: "_id",
  foreignField: "vendor",
  ref: "User",
  match: {
    deleted: false,
  },
});

VendorSchema.virtual("contacts", {
  justOne: false,
  localField: "_id",
  foreignField: "vendor",
  ref: "VendorContact",
});

VendorSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("Vendor", VendorSchema);
