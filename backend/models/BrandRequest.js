const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const BrandRequest = new mongoose.Schema(
  {
    parentBrandRequest: {
      type: mongoose.Types.ObjectId,
      ref: "BrandRequest",
    },
    brandName: {
      type: String,
      required: true,
    },
    brandNameNoSpaces: String,
    brandEmail: {
      type: [String],
      match: [
        /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    url: {
      type: String,
      match: [
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
        "Please add a valid url",
      ],
    },
    notes: String,
    attachments: [String],
    requestBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
        "WorkedOn"
      ],
      default: "Unworked",
    },
    wantedStatus: {
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
        "WorkedOn"
      ]
    },
    statuses: {
      type: [
        {
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
            "WorkedOn"
          ],
        },
      ],
      default: ["Unworked"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "BrandCategory",
    },
    requestedByCustomer: String,
    isPinned: Boolean,
    isAccepted: {
      type: Boolean,
    },
    followUpDate: {
      type: Date,
      default: null
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

BrandRequest.virtual("vendorRequests", {
  justOne: false,
  localField: "_id",
  foreignField: "brandRequest",
  ref: "VendorRequest",
});

BrandRequest.virtual("childBrandRequests", {
  justOne: false,
  localField: "_id",
  foreignField: "parentBrandRequest",
  ref: "BrandRequest",
});

BrandRequest.virtual("user", {
  justOne: true,
  localField: "requestBy",
  foreignField: "_id",
  ref: "User",
});

BrandRequest.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model("BrandRequest", BrandRequest);
