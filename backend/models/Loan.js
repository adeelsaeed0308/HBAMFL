const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const LoanSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    PO: {
      type: String,
      required: true,
    },
    amountSecuredBySOs: Number,
    brand: String,
    billTotal: Number,
    //this is the loan amount:
    amountDrawn: {
      type: Number,
      required: true,
    },
    paidInFull: {
      type: Boolean,
      default: false,
    },
    //this is amountDrawn minus all applied payments
    openLoanBalance: {
      type: Number,
    },
    loanNumber: Number,
    increasedLoans: [
      {
        amountDrawn: Number,
        billTotal: Number,
        amountSecuredBySOs: Number,
        timestamp: { type: Date, default: new Date() },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    selectPopulatedPaths: false,
  }
);

LoanSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

LoanSchema.plugin(AutoIncrement, { inc_field: "loanNumber", start_seq: 1000 });

LoanSchema.virtual("payments", {
  justOne: false,
  localField: "_id",
  foreignField: "loan",
  ref: "LoanPayment",
});

LoanSchema.virtual("deposits", {
  justOne: false,
  localField: "_id",
  foreignField: "loan",
  ref: "Deposit",
});

module.exports = mongoose.model("Loan", LoanSchema);
