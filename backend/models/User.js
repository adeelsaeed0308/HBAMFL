const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var mongoose_delete = require("mongoose-delete");
const crypto = require("crypto");
const { ObjectOptional } = require("./utils");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      unique: true,
      required: true,
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    zohoEmailAlias: String,
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    admin: {
      type: Boolean,
      default: false,
    },
    exportOriginalWithCost: {
      type: Boolean,
      default: false
    },
    priceSheetsRole: {
      type: String,
      enum: ["Admin", "SalesRep"],
    },
    sourcingRole: {
      type: String,
      enum: ["Admin", "SalesRep"],
    },
    loansRole: {
      type: String,
      enum: ["Admin"],
    },
    brandListRole: {
      type: String,
      enum: ["Admin", "SalesRep"],
    },
    vendorRole: {
      type: String,
      enum: ["Admin"],
    },
    vendor: ObjectOptional("Vendor"),
    isKanda: Boolean,
    lastLogOut: Date,
  },
  // do not allow to populate unselected fields. This works together with the 'disallowedSelection' option in the advancedQuery middleware so if I pass in a field that you cant select, you should also not be able to populate that field
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

UserSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

UserSchema.pre("save", async function (next) {
  if (!this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and send to user
UserSchema.methods.getSignedJwtToken = function () {
  const payload = { user_id: this._id };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP_TIME,
  });
};
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
