const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const LoanAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creditLimit: Number,
    amount: {
      type: Number,
      required: true,
    },
    dailyRate: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

LoanAccountSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

LoanAccountSchema.virtual("transactions", {
  justOne: false,
  localField: "_id",
  foreignField: "loanAccount",
  ref: "LoanAccountTransaction",
});

LoanAccountSchema.virtual("dueDates", {
  justOne: false,
  localField: "_id",
  foreignField: "loanAccount",
  ref: "LoanAccountDueDate",
});

module.exports = mongoose.model("LoanAccount", LoanAccountSchema);
