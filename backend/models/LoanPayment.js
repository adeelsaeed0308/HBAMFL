const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const LoanPaymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    SO: {
      type: String,
      required: true,
    },
    amount: {
      default: 0,
      type: Number,
    },
    paid: { type: Boolean, default: true },
    interestPaid: Number,
    paymentNumber: Number,
    loan: {
      required: true,
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

LoanPaymentSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

// LoanPaymentSchema.index(
//   { loan: 1, SO: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       deleted: false,
//     },
//   }
// );

LoanPaymentSchema.plugin(AutoIncrement, {
  inc_field: "paymentNumber",
  start_seq: 1000,
});

const LoanPayment = mongoose.model("LoanPayment", LoanPaymentSchema);

module.exports = LoanPayment;
