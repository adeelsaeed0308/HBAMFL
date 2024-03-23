const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const VendorBrandSchema = new mongoose.Schema(
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
    code: {
      type: String,
      required: true,
    },
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

VendorBrandSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("VendorBrand", VendorBrandSchema);
