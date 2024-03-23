const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const LoanAccountTransactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    note: String,
    amount: {
      type: Number,
      required: true,
    },
    loanAccount: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "LoanAccount",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

LoanAccountTransactionSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports = mongoose.model(
  "LoanAccountTransaction",
  LoanAccountTransactionSchema
);
