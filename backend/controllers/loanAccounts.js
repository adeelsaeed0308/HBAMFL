const mongoose = require("mongoose");
const LoanAccount = require("../models/LoanAccount");
const LoanAccountTransaction = require("../models/LoanAccountTransaction");
const asyncHandler = require("../utils/async");
const { omit } = require("lodash");

const reconfigureLoanAccountAmount = async (loanAccountId) => {
  let amount = await LoanAccountTransaction.aggregate([
    {
      $match: {
        loanAccount: mongoose.Types.ObjectId(loanAccountId),
        deleted: { $ne: true },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);
  amount = amount[0]?.total || 0;
  await LoanAccount.findOneAndUpdate(
    { _id: loanAccountId },
    {
      amount,
    }
  );
};

exports.createLoanAccountTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await LoanAccountTransaction.create(req.body);
  await reconfigureLoanAccountAmount(transaction.loanAccount);
  res.json(transaction);
});

exports.updateLoanAccountTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await LoanAccountTransaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  await reconfigureLoanAccountAmount(transaction.loanAccount);
  res.json(transaction);
});

exports.deleteLoanAccountTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await LoanAccountTransaction.findById(req.params.id);
  await LoanAccountTransaction.deleteById(req.params.id, req.user.id);
  await reconfigureLoanAccountAmount(transaction.loanAccount);
  res.json(transaction);
});

exports.createLoanAccount = asyncHandler(async (req, res, next) => {
  const result = await LoanAccount.create(req.body);
  await LoanAccountTransaction.create({
    loanAccount: result.id,
    amount: req.body.amount,
  });
  res.json(result);
});

exports.updateLoanAccount = asyncHandler(async (req, res, next) => {
  const old = await LoanAccount.findById(req.params.id);
  const amount =
    (typeof req.body.amount === "number" ? req.body.amount : old.amount) -
    old.amount;
  const loanAccount = await LoanAccount.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (amount) {
    await LoanAccountTransaction.create({
      loanAccount: loanAccount,
      amount,
    });
  }
  return res.json(loanAccount);
});
