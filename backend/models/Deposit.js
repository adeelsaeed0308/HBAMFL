const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DepositSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    depositTotal: {
      type: Number,
      required: true,
    },
    amountAppliedToLoan: Number,
    depositNumber: Number,
    PO: {
      type: String,
      required: true,
    },
    SO: {
      type: String,
      required: true,
    },
    // a deposit is used together with a loan (sort of to pay off the loan right when you take it out)
    loan: {
      type: mongoose.Types.ObjectId,
      ref: "Loan",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);
DepositSchema.plugin(AutoIncrement, {
  inc_field: "depositNumber",
  start_seq: 1000,
});

DepositSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

const Deposit = mongoose.model("Deposit", DepositSchema);

module.exports = Deposit;
