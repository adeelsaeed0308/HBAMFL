const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const LoanAccountDueDateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
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

LoanAccountDueDateSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

const LoanAccountDueDate = mongoose.model(
  "LoanAccountDueDate",
  LoanAccountDueDateSchema
);
module.exports = LoanAccountDueDate;
