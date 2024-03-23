const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const BrandItem = require("./BrandItem");

const BrandSchema = new mongoose.Schema(
  {
    brand: {
      ref: "Brand",
      type: mongoose.Types.ObjectId,
    },
    parentBrand: {
      ref: "Brand",
      type: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    nameNoSpaces: String,
    tabName: String,
    image: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "BrandCategory",
      set(v) {
        if (!v) return undefined;
        return v;
      },
    },
    minimumMargin: {
      type: Number,
      default: 0,
      min: 0,
      max: 99.9999999,
    },
    maximumMargin: {
      type: Number,
      default: 0,
      min: 0,
      max: 99.9999999,
    },
    suggestedMargin: {
      type: Number,
      default: 0,
      min: 0,
      max: 99.9999999,
    },
    minimumOrderDollarAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrderItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    maximumOrderDollarAmount: {
      type: Number,
      default: Infinity,
    },
    maximumOrderItems: {
      type: Number,
      default: Infinity,
    },
    soldByCaseOnly: {
      type: Boolean,
      required: true,
    },
    excelBuffer: {
      type: Buffer,
      select: false,
    },
    excelBufferKanda: {
      type: Buffer,
      select: false,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    otherCosts: {
      type: Number,
      default: 0,
      min: 0,
    },
    commissionCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    attachments: [String],
    lastModifiedPricesheet: Date,
    itemsHaveMSRP: Boolean,
    itemsHaveWholesalePrice: Boolean,
    itemsHaveCostPrice: Boolean,
    currency: {
      type: {
        symbol: {
          type: String,
          required: true,
        },
        code: String,
        description: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    lastUploadedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      set(v) {
        if (!v) return undefined;
        return v;
      } 
    },
    notes: {
      type: String
    },
    fobPoint: {
      type: String
    },
    leadTime: {
      type: String
    },
    specialDiscountNotes: {
      type: String
    },
    defaultVendorId: {
      ref: "User",
      type: mongoose.Types.ObjectId,    
    }
  },
  // do not allow to populate unselected fields. This works together with the 'disallowedSelection' option in the advancedQuery middleware so if I pass in a field that you cant select, you should also not be able to populate that field
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

BrandSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

BrandSchema.pre("updateMany", function (next) {
  if (this._update.deleted && this._conditions._id) {
    BrandItem.remove({ brand: this._conditions._id }).exec();
  }
  next();
});

BrandSchema.virtual("items", {
  localField: "_id",
  foreignField: "brand",
  ref: "BrandItem",
  justOne: false,
});

BrandSchema.virtual("pricesheets", {
  localField: "_id",
  foreignField: "brand",
  ref: "Brand",
  justOne: false,
});
BrandSchema.virtual("childBrands", {
  localField: "_id",
  foreignField: "parentBrand",
  ref: "Brand",
  justOne: false,
});
BrandSchema.virtual("brandList", {
  localField: "_id",
  foreignField: "brand",
  ref: "BrandList",
  justOne: false,
});

module.exports = mongoose.model("Brand", BrandSchema);
