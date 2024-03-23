const LoanAccount = require("../models/LoanAccount");
const LoanAccountDueDate = require("../models/LoanAccountDueDate");
const LoanAccountTransaction = require("../models/LoanAccountTransaction");
const todayForMongo = require("../utils/todayForMongo");

async function run() {
  require("dotenv").config({
    path: require("path").join(__dirname, "../config/config.env"),
  });
  await Promise.resolve(require("../db"));
  const todaysDueDates = await LoanAccountDueDate.find({
    date: todayForMongo(),
  });
  for (let due of todaysDueDates) {
    await LoanAccountTransaction.create({
      amount: -due.amount,
      loanAccount: due.loanAccount,
      note: "Auto deducted for due date",
    });
    await LoanAccount.findByIdAndUpdate(due.loanAccount, {
      $inc: { amountDrawn: -due.amount },
    });
  }
}

run();
