const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { differenceInDays } = require("date-fns");
const { ObjectOptional, ObjectRequired } = require("./utils");

const BrandListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameNoSpaces: String,
    image: String,
    category: ObjectRequired("BrandCategory"),
    brand: ObjectOptional("Brand"),
    class: String,
    isNewBrand: Boolean,
    isInactive: Boolean,
    inactiveReason: String,
    inactiveDate: Date,
    inactiveBy: ObjectOptional("User"),
    isPotential: Boolean,
    potentialNotes: String,
  },
  // do not allow to populate unselected fields. This works together with the 'disallowedSelection' option in the advancedQuery middleware so if I pass in a field that you cant select, you should also not be able to populate that field
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

BrandListSchema.virtual("showAsNewBrand").get(function () {
  return (
    this.isNewBrand &&
    differenceInDays(new Date(), new Date(this.createdAt)) <= 60
  );
});

BrandListSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("BrandList", BrandListSchema);
