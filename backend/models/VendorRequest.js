const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const VendorRequest = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    requestBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brandRequest: {
      type: mongoose.Types.ObjectId,
      ref: "BrandRequest",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Unworked",
        "Requested",
        "Open",
        "Denied",
        "InProcess",
        "InActive",
        "NoneAvailability",
        "AlreadyOnTheMarket",
        "Ordered",
        "Closed",
        "VendorCreated",
        "FollowUp",
        "WorkedOn",
      ],
      default: "Unworked",
    },
    notes: String,
    url: String,
    emails: [String],
    phone: String,
    linkedIn: Boolean,
    hasOrderForm: Boolean,
    orderForm: [String],
    hasPricesheet: Boolean,
    pricesheet: [String],
    terms: String,
    discount: String,
    isAccepted: {
      type: Boolean,
      default: false,
    },
    fob: String,
    training: Date,
    followUpDate: {
      type: Date,
      default: null,
    },
    orders: {
      type: [
        {
          orderDate: { type: Date, required: true, default: new Date() },
          pickupDate: Date,
          invoice: String,
          total: Number,
        },
      ],
    },
    followUps: {
      type: [
        {
          via: {
            type: String,
            enum: [
              "Email",
              "Order Form",
              "Phone Number",
              "LinkedIn",
              "Online Form",
              "Show",
            ],
            required: true,
          },
          email: String,
          date: { type: Date, default: new Date() },
          notes: String,
        },
      ],
    },
    statusChanges: {
      type: [
        {
          timestamp: { type: Date, default: new Date() },
          previousStatus: String,
          status: String,
          user: String,
          vendorId: mongoose.Types.ObjectId,
          isAdmin: Boolean,
          isReviewed: Boolean,
        },
      ],
    },
    sentEmails: {
      type: [
        {
          timestamp: { type: Date, default: new Date() },
          subject: String,
          body: String,
          contacts: [
            {
              type: mongoose.Types.ObjectId,
              ref: "VendorContact",
            },
          ],
        },
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

VendorRequest.index(
  { brandRequest: 1, vendor: 1 },
  {
    unique: true,
    partialFilterExpression: {
      deleted: false,
    },
  }
);

VendorRequest.virtual("user", {
  justOne: true,
  localField: "requestBy",
  foreignField: "_id",
  ref: "User",
});

VendorRequest.virtual("vendorData", {
  justOne: true,
  localField: "vendor",
  foreignField: "_id",
  ref: "Vendor",
});

VendorRequest.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("VendorRequest", VendorRequest);
