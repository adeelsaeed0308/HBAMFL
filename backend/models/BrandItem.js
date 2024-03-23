const mongoose = require("mongoose");
const { ErrorResponse } = require("../utils/errors");

const BrandItemSchema = new mongoose.Schema(
  {
    category: String,
    barcode: String,
    sku: String,
    description: String,
    size: String,
    unitsPerCase: Number,
    MSRP: Number,
    wholesalePrice: Number,
    costPrice: Number,
    brand: {
      index: true,
      required: true,
      ref: "Brand",
      type: mongoose.Types.ObjectId,
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

BrandItemSchema.pre("validate", function (next) {
  // not sure if this is needed, but sometimes, the scoping is messed up
  const that = this;

  let valid1 = ["barcode", "sku", "description"].find(
    (e) => e in that && that[e]
  );
  let valid2 = ["MSRP", "costPrice"].find((e) => e in that && that[e]);

  if (!valid1) {
    next(
      new ErrorResponse(
        "Must have one of these: Sku,Barcode or Description",
        400
      )
    );
  } else if (!valid2) {
    next(new ErrorResponse("Must have either CostPrice or MSRP", 400));
  } else {
    next();
  }
});

module.exports = mongoose.model("BrandItem", BrandItemSchema);
